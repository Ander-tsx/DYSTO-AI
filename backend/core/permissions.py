from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    #Permite acceso solo a usuarios con rol 'admin'.
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')

class IsVendedor(permissions.BasePermission):
    #Permite acceso solo a usuarios con rol 'vendedor'.
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'vendedor')

class IsVendedorOrAdmin(permissions.BasePermission):
    #Permite acceso a usuarios con rol 'vendedor' o 'admin'.
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['vendedor', 'admin'])

class IsOwnerOrAdmin(permissions.BasePermission):
    #Permiso a nivel de objeto para permitir a vendedores editar sus propios productos,
    #o a administradores editar cualquier producto.
    def has_object_permission(self, request, view, obj):
        if not bool(request.user and request.user.is_authenticated):
            return False
        if request.user.role == 'admin':
            return True
        return hasattr(obj, 'vendedor') and obj.vendedor == request.user

class IsUserOwnerOrAdmin(permissions.BasePermission):
    #Permiso a nivel de objeto para recursos propios del usuario.
    def has_object_permission(self, request, view, obj):
        if not bool(request.user and request.user.is_authenticated):
            return False
        if request.user.role == 'admin':
            return True
        return obj == request.user
