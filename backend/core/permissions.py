from rest_framework import permissions
from django.contrib.auth import get_user_model


class IsAdmin(permissions.BasePermission):
    # Permite acceso solo a usuarios con rol 'admin'.
    def has_permission(self, request, view):
        user = get_user_model()
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == user.Role.ADMIN
        )


class IsVendor(permissions.BasePermission):
    # Permite acceso solo a usuarios con rol 'vendedor'.
    def has_permission(self, request, view):
        user = get_user_model()
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == user.Role.VENDOR
        )


class IsVendorOrAdmin(permissions.BasePermission):
    # Permite acceso a usuarios con rol 'vendedor' o 'admin'.
    def has_permission(self, request, view):
        user = get_user_model()
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in [user.Role.VENDOR, user.Role.ADMIN]
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    # Permiso a nivel de objeto: el vendedor puede editar sus propios productos,
    # el admin puede editar cualquiera.
    def has_object_permission(self, request, view, obj):
        if not bool(request.user and request.user.is_authenticated):
            return False
        user = get_user_model()
        if request.user.role == user.Role.ADMIN:
            return True
        owner = getattr(obj, 'seller', getattr(obj, 'vendor', None))
        return owner == request.user


class IsUserOwnerOrAdmin(permissions.BasePermission):
    # Permiso a nivel de objeto para recursos propios del usuario.
    def has_object_permission(self, request, view, obj):
        if not bool(request.user and request.user.is_authenticated):
            return False
        user = get_user_model()
        if request.user.role == user.Role.ADMIN:
            return True
        return obj == request.user
