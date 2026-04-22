from django.conf import settings
from django.db import models

from products.models import Product
from logbook.decorators import audit_log


@audit_log
class Cart(models.Model):
    """
    Modelo que representa el carrito de compras de un usuario.

    Está asociado 1-a-1 con el modelo de usuario, por lo que cada usuario 
    tiene un único carrito activo a la vez.

    Args:
        models.Model: Clase base de Django para modelos de base de datos.
    """
    # Carrito de compras asociado 1-a-1 con el usuario.

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


@audit_log
class CartItem(models.Model):
    """
    Modelo que representa un artículo individual agregado a un carrito de compras.

    Mantiene la relación entre un carrito específico, el producto agregado y la cantidad.

    Args:
        models.Model: Clase base de Django.
    """
    # Elemento individual dentro de un carrito.

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
    quantity = models.PositiveIntegerField(default=1)

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
        """
        Calcula y devuelve el costo subtotal de este elemento del carrito.

        Args:
            None

        Returns:
            Decimal: El resultado de multiplicar el precio del producto por su cantidad.
        """
        # Calcula el subtotal: precio del producto * cantidad
        return self.product.price * self.quantity

    def __str__(self):
        return f'{self.product.title} x{self.quantity} (${self.subtotal})'
