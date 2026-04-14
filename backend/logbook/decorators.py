# Conjunto de modelos registrados para auditoría.
# Cualquier modelo decorado con @audit_log se agrega a este set
# y los signals de auditoría solo actuarán sobre estos modelos.
AUDITED_MODELS = set()


def audit_log(cls):
    """Decorador para marcar un modelo Django como auditable.

    Uso:
        @audit_log
        class Product(models.Model):
            ...

    Al decorar un modelo, se registra en AUDITED_MODELS y los signals
    de la bitácora registrarán automáticamente las operaciones CREATE,
    UPDATE y DELETE sobre sus instancias.
    """
    AUDITED_MODELS.add(cls)
    return cls
