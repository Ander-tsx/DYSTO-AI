from decimal import Decimal

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from django.test import TestCase

from carts.models import Cart, CartItem
from products.models import Category, Product

User = get_user_model()


class CartSignalTests(TestCase):
    """Pruebas para la señal post_save que crea el carrito automáticamente."""

    def _make_user(self, email):
        return User.objects.create(
            email=email,
            password=make_password('Password123!'),
        )

    def test_se_crea_carrito_al_registrar_usuario(self):
        """Al crear un usuario se genera automáticamente un carrito asociado."""
        user = self._make_user('cart_signal@example.com')
        self.assertTrue(Cart.objects.filter(user=user).exists())

    def test_carrito_es_unico_por_usuario(self):
        """No se crea un segundo carrito si el usuario ya tiene uno (get_or_create)."""
        user = self._make_user('unique_cart@example.com')
        # Intentar crear manualmente un segundo carrito no debe duplicarlo
        Cart.objects.get_or_create(user=user)
        self.assertEqual(Cart.objects.filter(user=user).count(), 1)

    def test_cada_usuario_tiene_su_propio_carrito(self):
        """Usuarios distintos tienen carritos distintos."""
        user_a = self._make_user('user_a@example.com')
        user_b = self._make_user('user_b@example.com')
        self.assertNotEqual(user_a.cart.pk, user_b.cart.pk)


class CartItemUnicidadTests(TestCase):
    """Pruebas para la restricción de unicidad (cart, product) en CartItem."""

    def setUp(self):
        self.seller = User.objects.create(
            email='seller@example.com',
            password=make_password('Password123!'),
        )
        self.category = Category.objects.create(name='Electrónica')
        self.product = Product.objects.create(
            seller=self.seller,
            category=self.category,
            title='Producto Test',
            price=Decimal('99.99'),
            main_image='https://example.com/img.jpg',
        )
        self.user = User.objects.create(
            email='buyer@example.com',
            password=make_password('Password123!'),
        )
        self.cart = self.user.cart

    def test_agregar_producto_al_carrito(self):
        """Se puede agregar un producto al carrito correctamente."""
        item = CartItem.objects.create(cart=self.cart, product=self.product, cantidad=2)
        self.assertEqual(item.cantidad, 2)
        self.assertEqual(item.subtotal, Decimal('199.98'))

    def test_no_se_puede_duplicar_producto_en_carrito(self):
        """No se permite agregar el mismo producto dos veces al mismo carrito."""
        CartItem.objects.create(cart=self.cart, product=self.product)
        with self.assertRaises(IntegrityError):
            CartItem.objects.create(cart=self.cart, product=self.product)
