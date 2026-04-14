from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver

from .models import AuditLog
from .decorators import AUDITED_MODELS
from .middleware import get_current_user, get_current_ip

# Campos que se excluyen de los registros de auditoría.
# 'password' por seguridad; 'updated_at'/'created_at' por ser ruido.
IGNORED_FIELDS = [
    'password',
    'updated_at',
    'created_at',
]

def _instance_to_dict(instance):
    """Convierte una instancia de modelo a diccionario serializable,
    excluyendo los campos definidos en IGNORED_FIELDS."""
    data = {}
    for field in instance._meta.fields:
        name = field.name
        if name in IGNORED_FIELDS:
            continue
        value = getattr(instance, name, None)
        data[name] = str(value) if value is not None else None
    return data


def _get_changes(old_instance, new_instance):
    """Compara dos instancias del mismo modelo y retorna un diccionario
    con los campos que cambiaron, incluyendo valores 'before' y 'after'."""
    changes = {}
    for field in old_instance._meta.fields:
        name = field.name
        if name in IGNORED_FIELDS:
            continue
        old_val = getattr(old_instance, name, None)
        new_val = getattr(new_instance, name, None)
        if old_val != new_val:
            changes[name] = {
                'before': str(old_val) if old_val is not None else None,
                'after': str(new_val) if new_val is not None else None,
            }
    return changes


def _get_safe_user():
    """Obtiene el usuario actual de forma segura, retornando None
    si el usuario no está autenticado o no existe."""
    user = get_current_user()
    if user and hasattr(user, 'is_authenticated') and user.is_authenticated:
        return user
    return None


@receiver(pre_save)
def audit_pre_save(sender, instance, **kwargs):
    """Signal pre_save: guarda una copia de la instancia original antes de
    que se aplique el UPDATE, para poder calcular el diff después."""
    if sender not in AUDITED_MODELS:
        return

    if instance.pk:
        try:
            instance._audit_old_instance = sender.objects.get(pk=instance.pk)
        except sender.DoesNotExist:
            instance._audit_old_instance = None


@receiver(post_save)
def audit_post_save(sender, instance, created, **kwargs):
    """Signal post_save: registra operaciones CREATE y UPDATE en la bitácora."""
    if sender not in AUDITED_MODELS:
        return

    user = _get_safe_user()
    ip = get_current_ip()

    if created:
        # Registro de CREATE: guarda todos los valores de la nueva instancia
        AuditLog.objects.create(
            entity=sender.__name__,
            entity_id=instance.pk,
            action='CREATE',
            changes={'after': _instance_to_dict(instance)},
            user=user,
            source_ip=ip,
        )
    else:
        # Registro de UPDATE: guarda solo los campos que cambiaron
        old = getattr(instance, '_audit_old_instance', None)
        if old:
            diff = _get_changes(old, instance)
            if diff:
                AuditLog.objects.create(
                    entity=sender.__name__,
                    entity_id=instance.pk,
                    action='UPDATE',
                    changes=diff,
                    user=user,
                    source_ip=ip,
                )


@receiver(post_delete)
def audit_post_delete(sender, instance, **kwargs):
    """Signal post_delete: registra la operación DELETE con todos los
    valores que tenía la instancia eliminada."""
    if sender not in AUDITED_MODELS:
        return

    AuditLog.objects.create(
        entity=sender.__name__,
        entity_id=instance.pk,
        action='DELETE',
        changes={'before': _instance_to_dict(instance)},
        user=_get_safe_user(),
        source_ip=get_current_ip(),
    )