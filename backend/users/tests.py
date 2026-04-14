# Tests para la app users — autenticación, perfil, admin y direcciones.
# Cubre: registro, login, logout, UserMe, CRUD admin, CRUD direcciones e IDOR.

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import Address

User = get_user_model()


# ─── Helpers ─────────────────────────────────────────────────────────────────

def make_user(email, role=None, password='Password123!', **kwargs):
    # Crea un usuario con contraseña hasheada. Rol por defecto: VENDOR.
    role = role or User.Role.VENDOR
    return User.objects.create(
        email=email,
        password=make_password(password),
        role=role,
        **kwargs,
    )


def make_address(user, **kwargs):
    # Crea una dirección de envío con valores por defecto para un usuario.
    defaults = {
        'street': 'Av. Reforma',
        'street_number': '100',
        'city': 'CDMX',
        'state': 'Ciudad de México',
        'postal_code': '06600',
    }
    defaults.update(kwargs)
    return Address.objects.create(user=user, **defaults)


# ─── Registro ────────────────────────────────────────────────────────────────

class UserRegistrationTests(TestCase):
    # Pruebas para el endpoint POST /api/auth/register/.

    def setUp(self):
        self.client = APIClient()
        self.url = '/api/auth/register/'

    def test_register_success_returns_tokens_and_user(self):
        # Registro exitoso retorna access, refresh y datos del usuario.
        data = {
            'email': 'new@example.com',
            'password': 'Password123!',
            'first_name': 'Nuevo',
            'last_name': 'Cliente',
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)

    def test_register_role_always_forced_to_vendor(self):
        # El rol se fuerza a VENDOR sin importar el body enviado.
        data = {'email': 'forced@example.com', 'password': 'Password123!'}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email='forced@example.com')
        self.assertEqual(user.role, User.Role.VENDOR)

    def test_register_duplicate_email_returns_400(self):
        # Email ya registrado debe retornar 400 con clave 'email'.
        make_user('dup@example.com')
        data = {'email': 'dup@example.com', 'password': 'Password123!'}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_register_short_password_returns_400(self):
        # Contraseña con menos de 8 caracteres retorna 400.
        data = {'email': 'short@example.com', 'password': '1234567'}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_password_is_hashed(self):
        # La contraseña se almacena hasheada, nunca en texto plano.
        data = {'email': 'hashed@example.com', 'password': 'Password123!'}
        self.client.post(self.url, data)
        user = User.objects.get(email='hashed@example.com')
        self.assertNotEqual(user.password, 'Password123!')
        self.assertTrue(
            user.password.startswith('pbkdf2_') or user.password.startswith('argon2')
        )


# ─── Login ───────────────────────────────────────────────────────────────────

class UserLoginTests(TestCase):
    # Pruebas para el endpoint POST /api/auth/login/.

    def setUp(self):
        self.client = APIClient()
        self.url = '/api/auth/login/'
        self.user = make_user('login@example.com')

    def test_login_success_returns_tokens_and_role(self):
        # Login exitoso retorna JWT y datos del usuario con role.
        response = self.client.post(
            self.url, {'email': 'login@example.com', 'password': 'Password123!'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('user', response.data)
        self.assertIn('role', response.data['user'])

    def test_login_wrong_password_returns_401(self):
        # Contraseña incorrecta retorna 401.
        response = self.client.post(
            self.url, {'email': 'login@example.com', 'password': 'WrongPass!'}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_nonexistent_email_returns_401(self):
        # Email sin registro retorna 401.
        response = self.client.post(
            self.url, {'email': 'ghost@example.com', 'password': 'Password123!'}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


# ─── Logout ──────────────────────────────────────────────────────────────────

class UserLogoutTests(TestCase):
    # Pruebas para el endpoint POST /api/auth/logout/.

    def setUp(self):
        self.client = APIClient()
        self.url = '/api/auth/logout/'
        self.user = make_user('logout@example.com')
        self.refresh = RefreshToken.for_user(self.user)

    def test_logout_success_returns_200_with_detail(self):
        # Logout exitoso con refresh token válido retorna 200 y clave 'detail'.
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {'refresh': str(self.refresh)})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('detail', response.data)

    def test_logout_no_token_returns_400(self):
        # Body sin 'refresh' retorna 400 con clave 'detail'.
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)

    def test_logout_invalid_token_returns_400(self):
        # Token de refresco inválido retorna 400.
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {'refresh': 'token.invalido.xyz'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout_no_auth_returns_401(self):
        # Sin autenticación retorna 401.
        response = self.client.post(self.url, {'refresh': str(self.refresh)})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


# ─── Perfil del usuario autenticado ──────────────────────────────────────────

class UserMeTests(TestCase):
    # Pruebas para GET/PATCH /api/users/me/.

    def setUp(self):
        self.client = APIClient()
        self.url = '/api/users/me/'
        self.user = make_user('me@example.com')

    def test_get_me_returns_user_data(self):
        # GET retorna los datos del usuario autenticado.
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'me@example.com')

    def test_update_me_name_returns_200(self):
        # PATCH actualiza first_name y last_name correctamente.
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(self.url, {'first_name': 'Nuevo', 'last_name': 'Nombre'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Nuevo')

    def test_me_no_auth_returns_401(self):
        # Sin autenticación retorna 401.
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


# ─── Admin: gestión de usuarios ──────────────────────────────────────────────

class AdminUserTests(TestCase):
    # Pruebas para los endpoints de gestión de usuarios (solo admin).

    def setUp(self):
        self.client = APIClient()
        self.admin = make_user(
            'admin@example.com',
            role=User.Role.ADMIN,
            is_staff=True,
            is_superuser=True,
        )
        self.client_user = make_user('client@example.com')

    def test_admin_can_list_users(self):
        # Admin puede listar todos los usuarios (200).
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_client_cannot_access_user_list_returns_403(self):
        # Usuario con rol client recibe 403 al intentar listar usuarios.
        self.client.force_authenticate(user=self.client_user)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_no_auth_user_list_returns_401(self):
        # Sin autenticación retorna 401.
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_cannot_delete_self_returns_403(self):
        # El admin no puede eliminarse a sí mismo (403) y sigue existiendo.
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f'/api/users/{self.admin.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(User.objects.filter(pk=self.admin.id).exists())

    def test_admin_can_create_vendor_and_returns_activation_token(self):
        # Admin crea un vendedor; la respuesta incluye uid y token de activación.
        self.client.force_authenticate(user=self.admin)
        data = {'email': 'vendor@example.com', 'first_name': 'Vendedor', 'last_name': 'Nuevo'}
        response = self.client.post('/api/users/vendor/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('activation', response.data)
        user = User.objects.get(email='vendor@example.com')
        self.assertEqual(user.role, User.Role.VENDOR)


# ─── Direcciones de envío ─────────────────────────────────────────────────────

class AddressTests(TestCase):
    # Pruebas para el CRUD de direcciones (AddressViewSet).
    # Verifica campos en inglés post-refactorización y protección IDOR.

    def setUp(self):
        self.client = APIClient()
        self.user = make_user('address@example.com')
        self.other_user = make_user('other@example.com')
        self.url = '/api/users/addresses/'

    def test_create_address_with_english_fields(self):
        # Crear dirección con los campos renombrados al inglés retorna 201.
        self.client.force_authenticate(user=self.user)
        data = {
            'street': 'Av. Insurgentes',
            'street_number': '42',
            'city': 'CDMX',
            'state': 'Ciudad de México',
            'postal_code': '06700',
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['street'], 'Av. Insurgentes')
        self.assertEqual(response.data['street_number'], '42')

    def test_list_returns_only_own_addresses(self):
        # El usuario solo ve sus propias direcciones, no las de otros.
        make_address(self.user, street='Propia')
        make_address(self.other_user, street='Ajena')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        streets = [addr['street'] for addr in response.data]
        self.assertIn('Propia', streets)
        self.assertNotIn('Ajena', streets)

    def test_idor_read_other_user_address_returns_404(self):
        # IDOR: usuario A no puede leer la dirección de usuario B (404).
        addr_b = make_address(self.other_user)
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f'{self.url}{addr_b.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_idor_patch_other_user_address_returns_404(self):
        # IDOR: usuario A no puede editar la dirección de usuario B (404).
        addr_b = make_address(self.other_user)
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f'{self.url}{addr_b.id}/', {'street': 'Intruso'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_only_one_default_address_per_user(self):
        # Al marcar una nueva dirección como default, la anterior pierde el flag.
        addr1 = make_address(self.user, is_default=True)
        addr2 = make_address(self.user, street_number='200', is_default=True)
        addr1.refresh_from_db()
        self.assertFalse(addr1.is_default)
        self.assertTrue(addr2.is_default)
