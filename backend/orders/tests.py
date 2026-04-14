# Tests para la app orders — checkout completo, lista y detalle de pedidos.
# Verifica: flujo de negocio, address_snapshot en inglés, stock, carrito vacío e IDOR.

from decimal import Decimal

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from carts.models import Cart, CartItem
from orders.models import Order
from products.models import Product
from users.models import Address

User = get_user_model()


# ─── Helpers ─────────────────────────────────────────────────────────────────

def make_user(email, role=None, password='Password123!'):
    # Crea un usuario con el rol indicado (default CLIENT).
    role = role or User.Role.CLIENT
    return User.objects.create(
        email=email,
        password=make_password(password),
        role=role,
    )


def make_address(user, **kwargs):
    # Crea una dirección de envío con campos en inglés (post-refactorización).
    defaults = {
        'street': 'Av. Reforma',
        'street_number': '100',
        'city': 'CDMX',
        'state': 'Ciudad de México',
        'postal_code': '06600',
    }
    defaults.update(kwargs)
    return Address.objects.create(user=user, **defaults)


def make_product(seller, title='Producto', price='99.99', stock=10):
    # Crea un producto de prueba con stock suficiente para checkout.
    return Product.objects.create(
        seller=seller,
        title=title,
        price=Decimal(price),
        stock=stock,
        main_image='https://example.com/img.jpg',
    )


def add_to_cart(user, product, quantity=1):
    # Inserta un CartItem directamente en DB (sin pasar por la API de carrito).
    cart, _ = Cart.objects.get_or_create(user=user)
    return CartItem.objects.create(cart=cart, product=product, quantity=quantity)


# ─── Checkout ─────────────────────────────────────────────────────────────────

class CheckoutTests(TestCase):
    # Pruebas para el endpoint POST /api/orders/checkout/.

    def setUp(self):
        self.client = APIClient()
        self.vendor = make_user('vendor@orders.com', role=User.Role.VENDOR)
        self.buyer = make_user('buyer@orders.com')
        self.address = make_address(self.buyer)
        self.product = make_product(self.vendor, stock=10)

    def test_checkout_no_auth_returns_401(self):
        # Sin autenticación el checkout retorna 401.
        response = self.client.post('/api/orders/checkout/', {'address_id': self.address.id})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_checkout_empty_cart_returns_400(self):
        # Checkout con carrito vacío retorna 400 con 'detail'.
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post('/api/orders/checkout/', {'address_id': self.address.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)

    def test_checkout_address_not_own_returns_400(self):
        # Usar una dirección que no pertenece al usuario retorna 400.
        other = make_user('other@orders.com')
        other_address = make_address(other)
        add_to_cart(self.buyer, self.product)
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post('/api/orders/checkout/', {'address_id': other_address.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_checkout_success_creates_order_and_decrements_stock(self):
        # Checkout exitoso: crea el pedido, descuenta stock y vacía el carrito.
        add_to_cart(self.buyer, self.product, quantity=2)
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post('/api/orders/checkout/', {'address_id': self.address.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('order_number', response.data)
        self.assertEqual(len(response.data['items']), 1)
        # Verificar que el stock bajó de 10 a 8
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 8)
        # Verificar que el carrito quedó vacío
        cart = Cart.objects.get(user=self.buyer)
        self.assertEqual(cart.items.count(), 0)

    def test_checkout_address_snapshot_keys_are_english(self):
        # El snapshot de dirección debe tener claves en inglés (post-refactorización).
        add_to_cart(self.buyer, self.product)
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post('/api/orders/checkout/', {'address_id': self.address.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        snapshot = response.data['address_snapshot']
        # Verificar claves en inglés presentes
        for key in ['street', 'street_number', 'city', 'state', 'postal_code']:
            self.assertIn(key, snapshot)
        # Verificar que no quedan claves en español del pre-refactor
        for old_key in ['calle', 'numero', 'ciudad', 'estado', 'codigo_postal']:
            self.assertNotIn(old_key, snapshot)

    def test_checkout_order_status_is_completed(self):
        # El status del pedido debe ser 'completed' (TextChoices post-refactor).
        add_to_cart(self.buyer, self.product)
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post('/api/orders/checkout/', {'address_id': self.address.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], Order.Status.COMPLETED)
        self.assertEqual(response.data['status'], 'completed')

    def test_checkout_insufficient_stock_returns_400(self):
        # Quantity mayor al stock disponible retorna 400 con 'detail'.
        product_low = make_product(self.vendor, title='Poco Stock', stock=1)
        # Insertamos directamente 5 unidades aunque solo hay 1 en stock
        add_to_cart(self.buyer, product_low, quantity=5)
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post('/api/orders/checkout/', {'address_id': self.address.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)

    def test_checkout_units_sold_incremented(self):
        # Después del checkout, units_sold del producto se incrementa.
        add_to_cart(self.buyer, self.product, quantity=3)
        self.client.force_authenticate(user=self.buyer)
        self.client.post('/api/orders/checkout/', {'address_id': self.address.id})
        self.product.refresh_from_db()
        self.assertEqual(self.product.units_sold, 3)


# ─── Lista y detalle de pedidos ───────────────────────────────────────────────

class OrderListDetailTests(TestCase):
    # Pruebas para GET /api/orders/ y GET /api/orders/<order_number>/.

    def setUp(self):
        self.client = APIClient()
        self.vendor = make_user('vendor2@orders.com', role=User.Role.VENDOR)
        self.buyer = make_user('buyer2@orders.com')
        self.other_buyer = make_user('other2@orders.com')
        self.address = make_address(self.buyer)
        self.product = make_product(self.vendor, stock=10)

    def _do_checkout(self, user, address, product, quantity=1):
        # Ejecuta un checkout completo vía API y devuelve la respuesta.
        add_to_cart(user, product, quantity=quantity)
        self.client.force_authenticate(user=user)
        response = self.client.post('/api/orders/checkout/', {'address_id': address.id})
        self.client.force_authenticate(user=None)
        return response

    def test_order_list_returns_own_orders(self):
        # GET /api/orders/ retorna los pedidos del usuario autenticado.
        self._do_checkout(self.buyer, self.address, self.product)
        self.client.force_authenticate(user=self.buyer)
        response = self.client.get('/api/orders/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_order_list_no_auth_returns_401(self):
        # Sin autenticación la lista de pedidos retorna 401.
        response = self.client.get('/api/orders/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_order_detail_by_order_number(self):
        # GET /api/orders/<order_number>/ retorna el detalle del pedido correcto.
        checkout_res = self._do_checkout(self.buyer, self.address, self.product)
        order_number = checkout_res.data['order_number']
        self.client.force_authenticate(user=self.buyer)
        response = self.client.get(f'/api/orders/{order_number}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['order_number'], order_number)

    def test_order_detail_not_own_returns_404(self):
        # IDOR: otro usuario no puede ver el pedido del comprador (404).
        checkout_res = self._do_checkout(self.buyer, self.address, self.product)
        order_number = checkout_res.data['order_number']
        self.client.force_authenticate(user=self.other_buyer)
        response = self.client.get(f'/api/orders/{order_number}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_order_list_excludes_other_users_orders(self):
        # El listado del comprador no incluye pedidos de otros usuarios.
        other_address = make_address(self.other_buyer)
        # Compra del "otro comprador" — usa producto con stock suficiente
        other_product = make_product(self.vendor, title='Otro Prod', stock=10)
        self._do_checkout(self.other_buyer, other_address, other_product)
        self.client.force_authenticate(user=self.buyer)
        response = self.client.get('/api/orders/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # El comprador no tiene pedidos propios → lista vacía
        self.assertEqual(len(response.data), 0)
