from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=get_user_model())
def create_cart_for_new_user(sender, instance, created, **kwargs):
    # Al crear un nuevo usuario, se crea automáticamente su carrito asociado.
    if created:
        from carts.models import Cart
        Cart.objects.get_or_create(user=instance)
