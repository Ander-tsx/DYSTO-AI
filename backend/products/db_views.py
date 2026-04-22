"""
Modelos no administrados (unmanaged) que mapean a las vistas SQL de base de datos.

Estas clases permiten que Django haga consultas ORM directamente sobre las vistas
definidas en database/04_vistas.sql, sin crear ni modificar tablas reales.
"""
from django.db import models


class ProductPublicListDBView(models.Model):
    """
    Modelo no administrado que mapea a la vista SQL `vw_product_public_list`.

    Devuelve productos con stock disponible junto con el email del vendedor.
    Reemplaza la consulta original de ProductPublicListView.
    """
    id = models.BigIntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    category = models.CharField(max_length=100)
    seller_email = models.EmailField()
    main_image = models.URLField(max_length=500)
    units_sold = models.PositiveIntegerField()
    is_active = models.BooleanField()
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'vw_product_public_list'
        ordering = ['-created_at']
        verbose_name = 'Producto Público (Vista)'
        verbose_name_plural = 'Productos Públicos (Vista)'

    def __str__(self):
        return f"{self.title} - ${self.price}"
