from django.db import models
from django.conf import settings


class AuditLog(models.Model):
    """Registro de auditoría para rastrear operaciones CREATE, UPDATE y DELETE
    sobre las entidades del sistema."""

    ACTIONS = [
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
    ]

    # Nombre de la entidad/modelo auditado
    entity = models.CharField(max_length=100)

    # ID de la instancia del modelo afectado
    entity_id = models.IntegerField()

    # Tipo de movimiento: CREATE, UPDATE o DELETE
    action = models.CharField(max_length=10, choices=ACTIONS)

    # Valores antes y después del cambio almacenados como JSON
    changes = models.JSONField()

    # Fecha y hora del movimiento
    timestamp = models.DateTimeField(auto_now_add=True)

    # IP de origen de la petición
    source_ip = models.GenericIPAddressField(null=True, blank=True)

    # Usuario que realizó el movimiento
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs',
    )

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Registro de Auditoría'
        verbose_name_plural = 'Registros de Auditoría'

    def __str__(self):
        return f"{self.entity} ({self.entity_id}) - {self.action} - {self.timestamp}"
