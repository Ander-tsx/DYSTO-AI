# Tests unitarios para la app core — clases de permiso post-refactorización.
# Verifica: IsAdmin, IsVendor, IsVendorOrAdmin e IsOwnerOrAdmin con mocks directos.

from unittest.mock import MagicMock

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.test import TestCase

from core.permissions import IsAdmin, IsOwnerOrAdmin, IsVendor, IsVendorOrAdmin

User = get_user_model()


# ─── Helpers ─────────────────────────────────────────────────────────────────

def make_user(email, role, password='Password123!'):
    # Crea un usuario en DB con el rol especificado.
    return User.objects.create(
        email=email,
        password=make_password(password),
        role=role,
    )


def mock_request(user):
    # Crea un mock de DRF Request con el usuario indicado como atributo.
    request = MagicMock()
    request.user = user
    return request


# ─── IsAdmin ─────────────────────────────────────────────────────────────────

class IsAdminPermissionTests(TestCase):
    # Pruebas unitarias para el permiso IsAdmin.

    def setUp(self):
        self.perm = IsAdmin()
        self.view = MagicMock()

    def test_allows_admin_role(self):
        # Usuario con rol ADMIN obtiene acceso.
        user = make_user('admin@core.com', User.Role.ADMIN)
        self.assertTrue(self.perm.has_permission(mock_request(user), self.view))

    def test_rejects_vendor_role(self):
        # Usuario con rol VENDOR no obtiene acceso.
        user = make_user('vendor@core.com', User.Role.VENDOR)
        self.assertFalse(self.perm.has_permission(mock_request(user), self.view))

    def test_rejects_client_role(self):
        # Usuario con rol CLIENT no obtiene acceso.
        user = make_user('client@core.com', User.Role.CLIENT)
        self.assertFalse(self.perm.has_permission(mock_request(user), self.view))


# ─── IsVendor ────────────────────────────────────────────────────────────────

class IsVendorPermissionTests(TestCase):
    # Pruebas unitarias para el permiso IsVendor.

    def setUp(self):
        self.perm = IsVendor()
        self.view = MagicMock()

    def test_allows_vendor_role(self):
        # Usuario con rol VENDOR obtiene acceso.
        user = make_user('v@core.com', User.Role.VENDOR)
        self.assertTrue(self.perm.has_permission(mock_request(user), self.view))

    def test_rejects_admin_role(self):
        # Usuario con rol ADMIN no obtiene acceso con IsVendor.
        user = make_user('a@core.com', User.Role.ADMIN)
        self.assertFalse(self.perm.has_permission(mock_request(user), self.view))

    def test_rejects_client_role(self):
        # Usuario con rol CLIENT no obtiene acceso.
        user = make_user('c@core.com', User.Role.CLIENT)
        self.assertFalse(self.perm.has_permission(mock_request(user), self.view))


# ─── IsVendorOrAdmin ──────────────────────────────────────────────────────────

class IsVendorOrAdminPermissionTests(TestCase):
    # Pruebas unitarias para el permiso IsVendorOrAdmin.

    def setUp(self):
        self.perm = IsVendorOrAdmin()
        self.view = MagicMock()

    def test_allows_vendor_role(self):
        # VENDOR obtiene acceso.
        user = make_user('v2@core.com', User.Role.VENDOR)
        self.assertTrue(self.perm.has_permission(mock_request(user), self.view))

    def test_allows_admin_role(self):
        # ADMIN obtiene acceso.
        user = make_user('a2@core.com', User.Role.ADMIN)
        self.assertTrue(self.perm.has_permission(mock_request(user), self.view))

    def test_rejects_client_role(self):
        # CLIENT no obtiene acceso.
        user = make_user('c2@core.com', User.Role.CLIENT)
        self.assertFalse(self.perm.has_permission(mock_request(user), self.view))


# ─── IsOwnerOrAdmin ───────────────────────────────────────────────────────────

class IsOwnerOrAdminPermissionTests(TestCase):
    # Pruebas unitarias para el permiso IsOwnerOrAdmin a nivel de objeto.

    def setUp(self):
        self.perm = IsOwnerOrAdmin()
        self.view = MagicMock()

    def test_admin_can_access_any_object(self):
        # ADMIN tiene acceso a cualquier objeto independientemente del dueño.
        admin = make_user('admin2@core.com', User.Role.ADMIN)
        obj = MagicMock()
        obj.seller = MagicMock()
        self.assertTrue(self.perm.has_object_permission(mock_request(admin), self.view, obj))

    def test_owner_can_access_own_object(self):
        # El vendedor dueño del objeto (seller) obtiene acceso.
        vendor = make_user('owner@core.com', User.Role.VENDOR)
        obj = MagicMock()
        obj.seller = vendor
        self.assertTrue(self.perm.has_object_permission(mock_request(vendor), self.view, obj))

    def test_non_owner_cannot_access_object(self):
        # Un vendedor que NO es el dueño del objeto no obtiene acceso.
        vendor = make_user('v3@core.com', User.Role.VENDOR)
        other_vendor = make_user('v4@core.com', User.Role.VENDOR)
        obj = MagicMock()
        obj.seller = other_vendor
        self.assertFalse(self.perm.has_object_permission(mock_request(vendor), self.view, obj))

    def test_unauthenticated_user_cannot_access_object(self):
        # Usuario no autenticado (AnonymousUser) no obtiene acceso.
        anon = MagicMock()
        anon.is_authenticated = False
        req = MagicMock()
        req.user = anon
        obj = MagicMock()
        self.assertFalse(self.perm.has_object_permission(req, self.view, obj))
