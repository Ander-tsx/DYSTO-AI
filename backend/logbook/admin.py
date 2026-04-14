from django.contrib import admin
from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    """Panel de administración para visualizar los registros de la bitácora."""

    list_display = ('entity', 'entity_id', 'action', 'user', 'source_ip', 'timestamp')
    list_filter = ('action', 'entity', 'timestamp')
    search_fields = ('entity', 'entity_id', 'source_ip', 'user__email')
    readonly_fields = (
        'entity', 'entity_id', 'action', 'changes',
        'timestamp', 'source_ip', 'user',
    )
    ordering = ('-timestamp',)
    date_hierarchy = 'timestamp'

    def has_add_permission(self, request):
        # Los registros de auditoría no deben crearse manualmente
        return False

    def has_change_permission(self, request, obj=None):
        # Los registros de auditoría no deben modificarse
        return False

    def has_delete_permission(self, request, obj=None):
        # Los registros de auditoría no deben eliminarse
        return False
