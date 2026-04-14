# Tests para la app carts — API del carrito, señal de creación y restricción de unicidad.
# Reescrito desde cero: corrige URLs (/api/carts/), campo 'quantity' y lógica de acceso.

from decimal import Decimal

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from carts.models import Cart, CartItem
from products.models import Product

User = get_user_model()


# ─── Helpers ─────────────────────────────────────────────────────────────────

def make_user(email, password='Password123!'):
    # Crea un usuario con rol CLIENT y contraseña hasheada.
    return User.objects.create(
        email=email,
        password=make_password(password),
        role=User.Role.CLIENT,
    )


def make_product(seller, title='Laptop', price='999.99', stock=10):
    # Crea un producto de prueba con stock disponible por defecto.
    return Product.objects.create(
        seller=seller,
        category='Electrónica',
        title=title,
        price=Decimal(price),
        stock=stock,
        main_image='https://example.com/img.jpg',
    )


def add_item_to_cart(user, product, quantity=1):
    # Inserta un CartItem directamente en DB (bypasando la API de carrito).
    cart, _ = Cart.objects.get_or_create(user=user)
    return CartItem.objects.create(cart=cart, product=product, quantity=quantity)


# ─── API del carrito ──────────────────────────────────────────────────────────

class CartAPITests(TestCase):
    # Pruebas de API para los endpoints del carrito de compras.
    # URL base: /api/carts/ (corregida desde /api/cart/ pre-refactor).

    def setUp(self):
        self.client = APIClient()
        self.user = make_user('buyer@carts.com')
        self.other_user = make_user('other@carts.com')
        self.product = make_product(self.user)
        self.product_oos = make_product(self.user, title='Sin Stock', stock=0)

    def test_get_cart_no_auth_returns_401(self):
        # Sin autenticación el carrito retorna 401.
        response = self.client.get('/api/carts/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_cart_authenticated_returns_200_with_items_and_total(self):
        # Usuario autenticado puede ver su carrito con campos 'items' y 'total'.
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/carts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('items', response.data)
        self.assertIn('total', response.data)

    def test_add_item_no_auth_returns_401(self):
        # Sin autenticación no se puede agregar al carrito.
        response = self.client.post('/api/carts/add/', {'product_id': self.product.id, 'quantity': 1})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_add_item_success_returns_updated_cart(self):
        # Agregar un producto retorna el carrito actualizado con quantity correcto.
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            '/api/carts/add/', {'product_id': self.product.id, 'quantity': 2}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['items']), 1)
        # Verifica el campo renombrado: quantity (no cantidad)
        self.assertEqual(response.data['items'][0]['quantity'], 2)

    def test_add_item_missing_product_id_returns_400(self):
        # Body sin product_id retorna 400 con clave 'detail'.
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/carts/add/', {'quantity': 1})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)

    def test_add_item_invalid_product_id_returns_400(self):
        # product_id no numérico retorna 400.
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/carts/add/', {'product_id': 'abc', 'quantity': 1})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)

    def test_add_item_invalid_quantity_string_returns_400(self):
        # quantity no numérico retorna 400.
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            '/api/carts/add/', {'product_id': self.product.id, 'quantity': 'mucho'}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_add_item_quantity_zero_returns_400(self):
        # quantity = 0 retorna 400 (debe ser >= 1).
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            '/api/carts/add/', {'product_id': self.product.id, 'quantity': 0}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_add_item_out_of_stock_returns_400(self):
        # Producto con stock=0 retorna 400.
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            '/api/carts/add/', {'product_id': self.product_oos.id, 'quantity': 1}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_add_item_exceeds_stock_returns_400(self):
        # Quantity que supera el stock disponible (10) retorna 400.
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            '/api/carts/add/', {'product_id': self.product.id, 'quantity': 99}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_add_same_item_twice_accumulates_quantity(self):
        # Agregar el mismo producto dos veces acumula la cantidad en el mismo item.
        self.client.force_authenticate(user=self.user)
        self.client.post('/api/carts/add/', {'product_id': self.product.id, 'quantity': 2})
        response = self.client.post(
            '/api/carts/add/', {'product_id': self.product.id, 'quantity': 3}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Debe ser 1 solo item con quantity acumulada = 5
        self.assertEqual(len(response.data['items']), 1)
        self.assertEqual(response.data['items'][0]['quantity'], 5)

    def test_patch_quantity_success(self):
        # PATCH actualiza la cantidad del item y persiste en DB.
        item = add_item_to_cart(self.user, self.product, quantity=1)
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f'/api/carts/items/{item.id}/', {'quantity': 3})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        item.refresh_from_db()
        # Verifica el campo renombrado: quantity (no cantidad)
        self.assertEqual(item.quantity, 3)

    def test_patch_quantity_invalid_string_returns_400(self):
        # PATCH con quantity no numérico retorna 400.
        item = add_item_to_cart(self.user, self.product)
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f'/api/carts/items/{item.id}/', {'quantity': 'nope'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_quantity_zero_returns_400(self):
        # PATCH con quantity=0 retorna 400.
        item = add_item_to_cart(self.user, self.product)
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f'/api/carts/items/{item.id}/', {'quantity': 0})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_quantity_exceeds_stock_returns_400(self):
        # PATCH con quantity > stock retorna 400.
        item = add_item_to_cart(self.user, self.product)
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f'/api/carts/items/{item.id}/', {'quantity': 9999})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_idor_protection_returns_404(self):
        # IDOR: usuario B no puede modificar el item del carrito de usuario A (404).
        item = add_item_to_cart(self.user, self.product)
        self.client.force_authenticate(user=self.other_user)
        response = self.client.patch(f'/api/carts/items/{item.id}/', {'quantity': 5})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_item_success_returns_empty_cart(self):
        # DELETE elimina el item, retorna el carrito vacío y borra de DB.
        item = add_item_to_cart(self.user, self.product)
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(f'/api/carts/items/{item.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['items']), 0)
        self.assertFalse(CartItem.objects.filter(pk=item.id).exists())

    def test_delete_idor_protection_returns_404(self):
        # IDOR: usuario B no puede eliminar el item del carrito de usuario A (404).
        item = add_item_to_cart(self.user, self.product)
        self.client.force_authenticate(user=self.other_user)
        response = self.client.delete(f'/api/carts/items/{item.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(CartItem.objects.filter(pk=item.id).exists())


# ─── Señal de creación automática de carrito ─────────────────────────────────

class CartSignalTests(TestCase):
    # Pruebas para la señal post_save que crea el carrito automáticamente al registrar usuario.

    def test_cart_created_on_user_register(self):
        # Al crear un usuario se genera automáticamente su carrito asociado.
        user = make_user('cart_signal@carts.com')
        self.assertTrue(Cart.objects.filter(user=user).exists())

    def test_cart_unique_per_user(self):
        # Un usuario ya con carrito no duplica al hacer get_or_create.
        user = make_user('unique_cart@carts.com')
        Cart.objects.get_or_create(user=user)
        self.assertEqual(Cart.objects.filter(user=user).count(), 1)

    def test_each_user_has_separate_cart(self):
        # Usuarios distintos tienen carritos distintos (PKs diferentes).
        user_a = make_user('user_a@carts.com')
        user_b = make_user('user_b@carts.com')
        self.assertNotEqual(user_a.cart.pk, user_b.cart.pk)


# ─── Restricción de unicidad (cart, product) en CartItem ─────────────────────

class CartItemConstraintTests(TestCase):
    # Pruebas para las reglas de integridad de CartItem.

    def setUp(self):
        self.seller = make_user('seller@carts.com')
        self.product = make_product(self.seller)
        self.user = make_user('buyer2@carts.com')
        self.cart = self.user.cart

    def test_unique_product_per_cart_raises_integrity_error(self):
        # Insertar el mismo (cart, product) dos veces viola la restricción y lanza IntegrityError.
        CartItem.objects.create(cart=self.cart, product=self.product, quantity=1)
        with self.assertRaises(IntegrityError):
            CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)

    def test_subtotal_calculated_as_price_times_quantity(self):
        # El subtotal es price * quantity correctamente.
        item = CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)
        expected = self.product.price * 2
        self.assertEqual(item.subtotal, expected)