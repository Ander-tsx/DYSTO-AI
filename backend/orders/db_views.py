"""
Modelos no administrados (unmanaged) que mapean a las vistas SQL de base de datos.

Estas clases permiten que Django haga consultas ORM directamente sobre las vistas
definidas en database/04_vistas.sql, sin crear ni modificar tablas reales.
"""
from django.db import models


class OrderListDBView(models.Model):
    """
    Modelo no administrado que mapea a la vista SQL `vw_order_list`.

    Devuelve pedidos con información agregada (email del comprador,
    cantidad de items, cantidad total de unidades).
    Reemplaza la consulta original de OrderListView.
    """
    id = models.BigIntegerField(primary_key=True)
    order_number = models.CharField(max_length=16)
    user_id = models.BigIntegerField()
    user_email = models.EmailField()
    address_snapshot = models.JSONField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField()
    total_items = models.IntegerField()
    total_quantity = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'vw_order_list'
        ordering = ['-created_at']
        verbose_name = 'Pedido (Vista)'
        verbose_name_plural = 'Pedidos (Vista)'

    def __str__(self):
        return f"Pedido {self.order_number} - {self.user_email}"
