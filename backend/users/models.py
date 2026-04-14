from django.contrib.auth.models import AbstractUser
from django.db import models, transaction


class CustomUser(AbstractUser):

    class Role(models.TextChoices):
        CLIENT = 'client', 'Cliente'
        VENDOR = 'vendor', 'Vendedor'
        ADMIN = 'admin', 'Admin'

    # Eliminamos username: usamos email como identificador único
    username = None

    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.CLIENT,
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
    # Dirección de envío asociada a un usuario.

    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='addresses',
    )
    street = models.CharField(max_length=255)
    street_number = models.CharField(max_length=20)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Dirección'
        verbose_name_plural = 'Direcciones'
        ordering = ['-is_default', '-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['user'],
                condition=models.Q(is_default=True),
                name='unique_default_address_per_user',
            )
        ]

    def save(self, *args, **kwargs):
        # Si esta dirección se marca como default, desactivar las demás del usuario
        if self.is_default:
            with transaction.atomic():
                Address.objects.filter(
                    user=self.user,
                    is_default=True,
                ).exclude(pk=self.pk).update(is_default=False)
                super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.street} {self.street_number}, {self.city} ({self.user.email})'
