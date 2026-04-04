from decimal import Decimal

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from carts.models import Cart, CartItem
from products.models import Category, Product

User = get_user_model()


class CartAPITests(APITestCase):
    """Pruebas de API para los endpoints del carrito de compras."""

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create(
            email='buyer@example.com',
            password=make_password('Password123!'),
        )
        self.other_user = User.objects.create(
            email='other@example.com',
            password=make_password('Password123!'),
        )

        self.category = Category.objects.create(name='Electrónica')
        self.product = Product.objects.create(
            seller=self.user,
            category=self.category,
            title='Laptop',
            price=Decimal('999.99'),
            stock=10,
            main_image='https://example.com/laptop.jpg',
        )
        self.product_no_stock = Product.objects.create(
            seller=self.user,
            category=self.category,
            title='Agotado',
            price=Decimal('50.00'),
            stock=0,
            main_image='https://example.com/agotado.jpg',
        )

    # ------------------------------------------------------------------
    # GET /api/cart/
    # ------------------------------------------------------------------

    def test_obtener_carrito_sin_autenticar_retorna_401(self):
        """GET /api/cart/ sin autenticación retorna 401."""
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_obtener_carrito_autenticado_retorna_200(self):
        """GET /api/cart/ con autenticación retorna el carrito del usuario."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('items', response.data)
        self.assertIn('total', response.data)

    # ------------------------------------------------------------------
    # POST /api/cart/add/
    # ------------------------------------------------------------------

    def test_agregar_item_sin_autenticar_retorna_401(self):
        """POST /api/cart/add/ sin autenticación retorna 401."""
        response = self.client.post('/api/cart/add/', {'product_id': self.product.id, 'cantidad': 1})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_agregar_item_exitoso(self):
        """POST /api/cart/add/ agrega el producto y retorna el carrito actualizado."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/cart/add/', {'product_id': self.product.id, 'cantidad': 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['items']), 1)
        self.assertEqual(response.data['items'][0]['cantidad'], 2)

    def test_agregar_item_sin_product_id_retorna_400(self):
        """POST /api/cart/add/ sin product_id retorna 400."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/cart/add/', {'cantidad': 1})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)

    def test_agregar_item_product_id_no_entero_retorna_400(self):
        """POST /api/cart/add/ con product_id no numérico retorna 400."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/cart/add/', {'product_id': 'abc', 'cantidad': 1})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)

    def test_agregar_item_cantidad_no_entera_retorna_400(self):
        """POST /api/cart/add/ con cantidad no numérica retorna 400."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/cart/add/', {'product_id': self.product.id, 'cantidad': 'mucho'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)

    def test_agregar_item_cantidad_cero_retorna_400(self):
        """POST /api/cart/add/ con cantidad < 1 retorna 400."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/cart/add/', {'product_id': self.product.id, 'cantidad': 0})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_agregar_item_producto_sin_stock_retorna_400(self):
        """POST /api/cart/add/ con producto sin stock retorna 400."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/cart/add/', {'product_id': self.product_no_stock.id, 'cantidad': 1})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_agregar_item_excede_stock_retorna_400(self):
        """POST /api/cart/add/ que excede el stock disponible retorna 400."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/cart/add/', {'product_id': self.product.id, 'cantidad': 99})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ------------------------------------------------------------------
    # PATCH /api/cart/items/<id>/
    # ------------------------------------------------------------------

    def _add_item(self, user, product, cantidad=1):
        """Agrega un item al carrito del usuario y retorna el CartItem."""
        cart, _ = Cart.objects.get_or_create(user=user)
        return CartItem.objects.create(cart=cart, product=product, cantidad=cantidad)

    def test_patch_cantidad_exitoso(self):
        """PATCH /api/cart/items/<id>/ actualiza cantidad correctamente."""
        cart_item = self._add_item(self.user, self.product, cantidad=1)
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f'/api/cart/items/{cart_item.id}/', {'cantidad': 3})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        cart_item.refresh_from_db()
        self.assertEqual(cart_item.cantidad, 3)

    def test_patch_cantidad_no_entera_retorna_400(self):
        """PATCH /api/cart/items/<id>/ con cantidad no numérica retorna 400."""
        cart_item = self._add_item(self.user, self.product)
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f'/api/cart/items/{cart_item.id}/', {'cantidad': 'nope'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_cantidad_cero_retorna_400(self):
        """PATCH /api/cart/items/<id>/ con cantidad 0 retorna 400."""
        cart_item = self._add_item(self.user, self.product)
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f'/api/cart/items/{cart_item.id}/', {'cantidad': 0})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_excede_stock_retorna_400(self):
        """PATCH /api/cart/items/<id>/ que excede el stock retorna 400."""
        cart_item = self._add_item(self.user, self.product)
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f'/api/cart/items/{cart_item.id}/', {'cantidad': 999})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_idor_proteccion(self):
        """PATCH /api/cart/items/<id>/ no permite modificar items de otro usuario (IDOR)."""
        cart_item = self._add_item(self.user, self.product)
        self.client.force_authenticate(user=self.other_user)
        response = self.client.patch(f'/api/cart/items/{cart_item.id}/', {'cantidad': 5})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ------------------------------------------------------------------
    # DELETE /api/cart/items/<id>/
    # ------------------------------------------------------------------

    def test_delete_item_exitoso(self):
        """DELETE /api/cart/items/<id>/ elimina el item y retorna el carrito vacío."""
        cart_item = self._add_item(self.user, self.product)
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(f'/api/cart/items/{cart_item.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['items']), 0)
        self.assertFalse(CartItem.objects.filter(pk=cart_item.id).exists())

    def test_delete_idor_proteccion(self):
        """DELETE /api/cart/items/<id>/ no permite eliminar items de otro usuario (IDOR)."""
        cart_item = self._add_item(self.user, self.product)
        self.client.force_authenticate(user=self.other_user)
        response = self.client.delete(f'/api/cart/items/{cart_item.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(CartItem.objects.filter(pk=cart_item.id).exists())

