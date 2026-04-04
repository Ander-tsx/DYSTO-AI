from django.conf import settings
from django.db import models

from products.models import Product


class Cart(models.Model):
    """Carrito de compras asociado 1-a-1 con el usuario."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Carrito'
        verbose_name_plural = 'Carritos'

    def __str__(self):
        return f'Carrito de {self.user.email}'


class CartItem(models.Model):
    """Elemento individual dentro de un carrito."""

    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items',
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='cart_items',
    )
    cantidad = models.PositiveIntegerField(default=1)

    class Meta:
        verbose_name = 'Elemento del carrito'
        verbose_name_plural = 'Elementos del carrito'
        constraints = [
            models.UniqueConstraint(
                fields=['cart', 'product'],
                name='unique_cart_product',
            ),
        ]

    @property
    def subtotal(self):
        """Calcula el subtotal: precio del producto * cantidad."""
        return self.product.price * self.cantidad

    def __str__(self):
        return f'{self.product.title} x{self.cantidad} (${self.subtotal})'
