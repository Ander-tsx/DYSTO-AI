from django.apps import AppConfig


class LogbookConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'logbook'
    verbose_name = 'Bitácora de Auditoría'

    def ready(self):
        # Importar los signals para que se conecten al iniciar la app
        import logbook.signals  # noqa: F401
