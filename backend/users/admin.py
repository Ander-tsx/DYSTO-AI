from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Address, CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    ordering = ('email',)
    search_fields = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información personal', {'fields': ('first_name', 'last_name', 'phone', 'avatar_url')}),
        ('Rol y permisos', {'fields': ('role', 'is_staff', 'is_active', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'role', 'is_staff', 'is_active'),
        }),
    )


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'calle', 'numero', 'ciudad', 'estado', 'codigo_postal', 'is_default')
    list_filter = ('is_default', 'estado', 'ciudad')
    search_fields = ('calle', 'ciudad', 'estado', 'codigo_postal', 'user__email')
    raw_id_fields = ('user',)
