from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password
from users.models import Address

User = get_user_model()

class UserAuthAndPermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create(
            email='admin@example.com',
            password=make_password('Password123!'),
            role=User.Role.ADMIN,
            is_staff=True,
            is_superuser=True
        )
        self.client_user = User.objects.create(
            email='client@example.com',
            password=make_password('Password123!'),
            role=User.Role.CLIENTE
        )

    def test_registro_exitoso_crea_cliente(self):
        """Registro exitoso crea usuario con rol cliente."""
        data = {
            "email": "nuevo@example.com",
            "password": "Password123!",
            "first_name": "Nuevo",
            "last_name": "Cliente"
        }
        response = self.client.post('/api/auth/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        
        user = User.objects.get(email="nuevo@example.com")
        self.assertEqual(user.role, User.Role.CLIENTE)

    def test_password_hasheada(self):
        """Contraseña se guarda hasheada (nunca en texto plano)."""
        data = {
            "email": "hashed@example.com",
            "password": "Password123!",
            "first_name": "Hashed",
            "last_name": "User"
        }
        self.client.post('/api/auth/register/', data)
        user = User.objects.get(email="hashed@example.com")
        self.assertNotEqual(user.password, "Password123!")
        self.assertTrue(user.password.startswith('pbkdf2_') or user.password.startswith('argon2'))

    def test_email_duplicado_error(self):
        """Email duplicado retorna error."""
        data = {
            "email": "client@example.com",  # Ya existe por setUp
            "password": "Password123!",
            "first_name": "Duplicado",
            "last_name": "Error"
        }
        response = self.client.post('/api/auth/register/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_login_exitoso_retorna_jwt_con_role(self):
        """Login exitoso retorna JWT con campo role."""
        data = {
            "email": "client@example.com",
            "password": "Password123!"
        }
        response = self.client.post('/api/auth/login/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('user', response.data)
        self.assertIn('role', response.data['user'])
        self.assertEqual(response.data['user']['role'], User.Role.CLIENTE)

    def test_login_fallido_retorna_401(self):
        """Login fallido retorna 401 con mensaje genérico."""
        data = {
            "email": "client@example.com",
            "password": "WrongPassword!"
        }
        response = self.client.post('/api/auth/login/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    def test_endpoint_admin_rechaza_no_admin(self):
        """Endpoint de admin rechaza usuario no-admin (403)."""
        self.client.force_authenticate(user=self.client_user)
        # Intentar listar usuarios
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_idor_address_protection(self):
        """Usuario A no puede ver/editar direcciones de usuario B (IDOR)."""
        # Crear usuario B
        user_b = User.objects.create(
            email='userb@example.com',
            password=make_password('Password123!')
        )
        address_b = Address.objects.create(
            user=user_b,
            calle="Calle B",
            numero="123",
            ciudad="Ciudad B",
            estado="Estado B",
            codigo_postal="12345"
        )

        # Autenticar como user_a (client_user)
        self.client.force_authenticate(user=self.client_user)
        
        # Intentar acceder a la dirección del user B
        response = self.client.get(f'/api/users/addresses/{address_b.id}/')
        # Dado que AddressViewSet filtra por request.user, no lo encontrará (404) 
        # en lugar de mostrarla (200) o un 403 explicito.
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Intentar editarla
        patch_response = self.client.patch(f'/api/users/addresses/{address_b.id}/', {"calle": "Intruso"})
        self.assertEqual(patch_response.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_no_puede_eliminarse_a_si_mismo(self):
        """Admin no puede eliminarse a sí mismo."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(f'/api/users/{self.admin_user.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        # Verificar que efectivamente no se borró
        self.assertTrue(User.objects.filter(id=self.admin_user.id).exists())
