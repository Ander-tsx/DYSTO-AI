from rest_framework import permissions
from django.contrib.auth import get_user_model


class IsAdmin(permissions.BasePermission):
    #Permite acceso solo a usuarios con rol 'admin'.
    def has_permission(self, request, view):
        User = get_user_model()
        return bool(request.user and request.user.is_authenticated and request.user.role == User.Role.ADMIN)

class IsVendedor(permissions.BasePermission):
    #Permite acceso solo a usuarios con rol 'vendedor'.
    def has_permission(self, request, view):
        User = get_user_model()
        return bool(request.user and request.user.is_authenticated and request.user.role == User.Role.VENDEDOR)

class IsVendedorOrAdmin(permissions.BasePermission):
    #Permite acceso a usuarios con rol 'vendedor' o 'admin'.
    def has_permission(self, request, view):
        User = get_user_model()
        return bool(request.user and request.user.is_authenticated and request.user.role in [User.Role.VENDEDOR, User.Role.ADMIN])

class IsOwnerOrAdmin(permissions.BasePermission):
    #Permiso a nivel de objeto para permitir a vendedores editar sus propios productos,
    #o a administradores editar cualquier producto.
    def has_object_permission(self, request, view, obj):
        if not bool(request.user and request.user.is_authenticated):
            return False
        User = get_user_model()
        if request.user.role == User.Role.ADMIN:
            return True
        owner = getattr(obj, 'seller', getattr(obj, 'vendedor', None))
        return owner == request.user

class IsUserOwnerOrAdmin(permissions.BasePermission):
    #Permiso a nivel de objeto para recursos propios del usuario.
    def has_object_permission(self, request, view, obj):
        if not bool(request.user and request.user.is_authenticated):
            return False
        User = get_user_model()
        if request.user.role == User.Role.ADMIN:
            return True
        return obj == request.user
