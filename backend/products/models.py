from django.db import models
from django.conf import settings

from logbook.decorators import audit_log


@audit_log
class Product(models.Model):
    """
    Modelo que representa un producto en el sistema de marketplace.

    Almacena información sobre el vendedor, el título, descripción, precio, 
    stock y metadatos adicionales del producto.

    Args:
        models.Model: Clase base de Django para modelos de base de datos.
    """
    # Usamos seller como ForeignKey a User para mantener la relación entre productos y vendedores
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='products'
    )
    category = models.CharField(max_length=100, blank=True, default='')

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=1)

    # main_image es la que se mostrará al principio del producto;
    # additional_images son opcionales para mostrar más imágenes del producto
    main_image = models.URLField(max_length=500)
    additional_images = models.JSONField(default=list, blank=True)

    metadata = models.JSONField(default=dict, blank=True)

    # Bloquear edición si ya se vendió al menos uno
    edit_allowed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    tags = models.JSONField(default=list, blank=True)
    units_sold = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'

    def __str__(self):
        return f"{self.title} - Stock: {self.stock}"

    @property
    def is_active(self):
        """
        Determina si el producto está activo basado en su nivel de stock.

        Args:
            None

        Returns:
            bool: True si el stock del producto es mayor a 0, False de lo contrario.
        """
        # Un producto se considera activo si tiene stock disponible
        return self.stock > 0