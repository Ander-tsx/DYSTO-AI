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


class Address(models.Model):
    """Dirección de envío asociada a un usuario."""

    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='addresses',
    )
    calle = models.CharField(max_length=255)
    numero = models.CharField(max_length=20)
    ciudad = models.CharField(max_length=100)
    estado = models.CharField(max_length=100)
    codigo_postal = models.CharField(max_length=10)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Dirección'
        verbose_name_plural = 'Direcciones'
        ordering = ['-is_default', '-created_at']

    def save(self, *args, **kwargs):
        # Si esta dirección se marca como default, desactivar las demás del usuario
        if self.is_default:
            Address.objects.filter(
                user=self.user,
                is_default=True,
            ).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.calle} {self.numero}, {self.ciudad} ({self.user.email})'
