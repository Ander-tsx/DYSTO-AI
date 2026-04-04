from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_cart_for_new_user(sender, instance, created, **kwargs):
    """Al crear un nuevo usuario, se crea automáticamente su carrito."""
    if created:
        from carts.models import Cart
        Cart.objects.create(user=instance)
