from django.db import models
from django.conf import settings 

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    # Usamos el seller como ForeignKey a User para mantener la relación entre productos y vendedores
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='products'
    )
    category = models.ForeignKey(
        Category, 
        on_delete=models.RESTRICT, 
        related_name='products'
    )
    
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
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Product'
        verbose_name_plural = 'Products'

    def __str__(self):
        return f"{self.title} - Stock: {self.stock}"

    def save(self, *args, **kwargs):
        if self.stock == 0:
            self.is_active = False
        elif self.stock > 0:
            self.is_active = True

        super().save(*args, **kwargs)

class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images'
    )
    url = models.URLField()
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Image for {self.product.title}"