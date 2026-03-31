from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):

    class Role(models.TextChoices):
        CLIENTE = 'cliente', 'Cliente'
        VENDEDOR = 'vendedor', 'Vendedor'
        ADMIN = 'admin', 'Admin'

    # Eliminar username - por defecto el user de django usa username como identificador pero 
    # nosotros usaremos el email como identificador único asi que por eso lo quite
    username = None

    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.CLIENTE,
    )
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f'{self.email} ({self.get_role_display()})'
