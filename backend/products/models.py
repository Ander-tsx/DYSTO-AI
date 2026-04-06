from django.db import models
from django.conf import settings 

class Product(models.Model):
    # Usamos el seller como ForeignKey a User para mantener la relación entre productos y vendedores
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='products'
    )
    category = models.CharField(max_length=100, blank=True, default='')
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=1)
    
    #main_image es la que se mostrara al principio del producto, 
    # las additional_images son opcionales y pueden ser usadas para mostrar mas imagenes del producto
    main_image = models.URLField(max_length=500)
    additional_images = models.JSONField(default=list, blank=True) 
    
    metadata = models.JSONField(default=dict, blank=True)
    
    #Bloquear edición si ya se vendió al menos uno
    edit_allowed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    tags = models.JSONField(default=list, blank=True)
    units_sold = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Product'
        verbose_name_plural = 'Products'

    def __str__(self):
        return f"{self.title} - Stock: {self.stock}"

    @property
    def is_active(self):
        # Un producto se considera activo si tiene stock disponible
        return self.stock > 0