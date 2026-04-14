# Tests para la app ai_analysis — permisos, validación de archivo y flujo exitoso.
# Usa mocks para Gemini y Cloudinary: los tests son rápidos y no consumen créditos.

import io
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.core.cache import cache
from django.test import TestCase
from PIL import Image
from rest_framework import status
from rest_framework.test import APIClient

User = get_user_model()


# ─── Helpers ─────────────────────────────────────────────────────────────────

def make_user(email, role, password='Password123!'):
    # Crea un usuario con el rol indicado.
    return User.objects.create(
        email=email,
        password=make_password(password),
        role=role,
    )


def make_jpeg_bytes():
    # Genera un JPEG mínimo en memoria usando Pillow, listo para upload.
    buf = io.BytesIO()
    img = Image.new('RGB', (50, 50), color=(0, 128, 255))
    img.save(buf, format='JPEG')
    buf.seek(0)
    buf.name = 'test.jpg'
    return buf


def make_png_bytes():
    # Genera un PNG mínimo en memoria usando Pillow.
    buf = io.BytesIO()
    img = Image.new('RGB', (50, 50), color=(255, 128, 0))
    img.save(buf, format='PNG')
    buf.seek(0)
    buf.name = 'test.png'
    return buf


# Respuesta simulada de Gemini con claves en inglés (post-refactorización del prompt)
MOCK_ANALYSIS_OK = {
    'title': 'Laptop Gaming',
    'category': 'Electrónica',
    'suggested_price': 12000,
    'description': 'Laptop de alto rendimiento para gaming.',
    'tags': ['laptop', 'gaming', 'electrónica'],
    'is_valid_object': True,
}

# Respuesta simulada de Gemini cuando rechaza la imagen
MOCK_ANALYSIS_REJECTED = {
    'error': True,
    'message': 'La imagen contiene personas, no objetos.',
}


# ─── Permisos y autenticación ─────────────────────────────────────────────────

class AnalyzeImagePermissionTests(TestCase):
    # Pruebas de autenticación y autorización para POST /api/ai/analyze/.

    def setUp(self):
        self.client = APIClient()
        self.url = '/api/ai/analyze/'
        self.vendor = make_user('vendor@ai.com', User.Role.VENDOR)
        self.client_user = make_user('client@ai.com', User.Role.CLIENT)

    def tearDown(self):
        # Limpiar cache de rate limiting entre tests.
        cache.clear()

    def test_no_auth_returns_401(self):
        # Sin autenticación el endpoint retorna 401.
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_client_role_returns_403(self):
        # Usuario con rol CLIENT no puede analizar imágenes (403).
        self.client.force_authenticate(user=self.client_user)
        image = make_jpeg_bytes()
        response = self.client.post(self.url, {'image': image}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


# ─── Validaciones de archivo ──────────────────────────────────────────────────

class AnalyzeImageValidationTests(TestCase):
    # Pruebas de validación del archivo enviado a POST /api/ai/analyze/.

    def setUp(self):
        self.client = APIClient()
        self.url = '/api/ai/analyze/'
        self.vendor = make_user('vendor2@ai.com', User.Role.VENDOR)
        self.client.force_authenticate(user=self.vendor)

    def tearDown(self):
        # Limpiar cache de rate limiting entre tests.
        cache.clear()

    def test_no_image_field_returns_400_with_detail(self):
        # Body sin campo 'image' retorna 400 con clave 'detail'.
        response = self.client.post(self.url, {}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)

    def test_non_image_file_returns_400_with_detail(self):
        # Archivo de texto (no imagen) retorna 400 con clave 'detail'.
        buf = io.BytesIO(b'esto no es una imagen')
        buf.name = 'document.txt'
        response = self.client.post(self.url, {'image': buf}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)

    def test_gif_format_returns_400_with_detail(self):
        # Imagen GIF (formato no permitido) retorna 400 con clave 'detail'.
        buf = io.BytesIO()
        img = Image.new('RGB', (10, 10))
        img.save(buf, format='GIF')
        buf.seek(0)
        buf.name = 'test.gif'
        response = self.client.post(self.url, {'image': buf}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)

    def test_oversized_image_returns_400_with_detail(self):
        # Archivo mayor a 10MB retorna 400 con clave 'detail'.
        # Creamos datos de más de 10MB (10MB + 1 byte) como buffer binario.
        large_data = b'\x00' * (10 * 1024 * 1024 + 1)
        buf = io.BytesIO(large_data)
        buf.name = 'large_file.bin'
        response = self.client.post(self.url, {'image': buf}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)


# ─── Flujo exitoso (con mocks de servicios externos) ─────────────────────────

class AnalyzeImageSuccessTests(TestCase):
    # Pruebas del flujo exitoso de análisis de imagen con Gemini y Cloudinary mockeados.

    def setUp(self):
        self.client = APIClient()
        self.url = '/api/ai/analyze/'
        self.vendor = make_user('vendor3@ai.com', User.Role.VENDOR)
        self.client.force_authenticate(user=self.vendor)

    def tearDown(self):
        # Limpiar cache de rate limiting entre tests.
        cache.clear()

    @patch('ai_analysis.views.upload_image', return_value='https://cloudinary.com/img.jpg')
    @patch('ai_analysis.views.analyze_product_image', return_value=MOCK_ANALYSIS_OK)
    def test_success_returns_image_url_and_analysis(self, mock_analyze, mock_upload):
        # Flujo exitoso retorna image_url y analysis con claves en inglés.
        image = make_jpeg_bytes()
        response = self.client.post(self.url, {'image': image}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('image_url', response.data)
        self.assertIn('analysis', response.data)
        self.assertEqual(response.data['image_url'], 'https://cloudinary.com/img.jpg')
        # Verificar que el análisis tiene las claves en inglés (post-refactor)
        analysis = response.data['analysis']
        self.assertIn('title', analysis)
        self.assertIn('category', analysis)
        self.assertIn('suggested_price', analysis)

    @patch('ai_analysis.views.upload_image', return_value='https://cloudinary.com/img.jpg')
    @patch('ai_analysis.views.analyze_product_image', return_value=MOCK_ANALYSIS_OK)
    def test_success_with_png_image(self, mock_analyze, mock_upload):
        # El flujo también funciona con imágenes PNG.
        image = make_png_bytes()
        response = self.client.post(self.url, {'image': image}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('ai_analysis.views.analyze_product_image', return_value=MOCK_ANALYSIS_REJECTED)
    def test_gemini_rejection_returns_400_with_detail_not_error(self, mock_analyze):
        # Gemini rechaza la imagen: retorna 400 con 'detail' (no 'error' — post-refactor).
        image = make_jpeg_bytes()
        response = self.client.post(self.url, {'image': image}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Verificar que la clave de error es 'detail' (estándar post-refactor)
        self.assertIn('detail', response.data)
        # Verificar que NO se usa la clave 'error' de la respuesta pre-refactor
        self.assertNotIn('error', response.data)

    @patch('ai_analysis.views.upload_image', return_value='https://cloudinary.com/img.jpg')
    @patch('ai_analysis.views.analyze_product_image', return_value=MOCK_ANALYSIS_OK)
    def test_rate_limit_blocks_after_10_requests(self, mock_analyze, mock_upload):
        # El rate limit bloquea al usuario después de 10 análisis por hora (429).
        image = make_jpeg_bytes()
        # Realizar 10 requests exitosos
        for _ in range(10):
            image.seek(0)
            self.client.post(self.url, {'image': image}, format='multipart')
        # El 11mo request debe ser bloqueado por el rate limiter
        image.seek(0)
        response = self.client.post(self.url, {'image': image}, format='multipart')
        self.assertEqual(response.status_code, 429)
        self.assertIn('detail', response.data)
