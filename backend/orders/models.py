import uuid
from django.db import models
from django.conf import settings
from products.models import Product

class Order(models.Model):
    STATUS_CHOICES = [
        ('completada', 'Completada'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='orders')
    address_snapshot = models.JSONField(help_text="Copia de la dirección al momento de comprar")
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completada')
    order_number = models.CharField(max_length=16, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = uuid.uuid4().hex[:16].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Pedido {self.order_number} - {self.user.email}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, related_name='order_items')
    product_snapshot = models.JSONField(help_text="Copia de título y precio al comprar")
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = 'Item del Pedido'
        verbose_name_plural = 'Items del Pedido'

    def __str__(self):
        title = self.product_snapshot.get('title', 'Producto') if isinstance(self.product_snapshot, dict) else 'Producto'
        return f"{self.cantidad}x {title} (Pedido {self.order.order_number})"
