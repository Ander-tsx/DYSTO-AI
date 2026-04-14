# Tests para la app products — marketplace público, operaciones de vendedor y panel admin.
# Cubre: listado, filtros, detalle, creación, edición, eliminación y validaciones.

from decimal import Decimal

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from products.models import Product

User = get_user_model()


# ─── Helpers ─────────────────────────────────────────────────────────────────

def make_user(email, role=None, password='Password123!'):
    # Crea un usuario de prueba con el rol indicado (default CLIENT).
    role = role or User.Role.CLIENT
    return User.objects.create(
        email=email,
        password=make_password(password),
        role=role,
    )


def make_product(seller, title='Producto Test', price='99.99', stock=5, category='Electrónica'):
    # Crea un producto de prueba con valores mínimos requeridos.
    return Product.objects.create(
        seller=seller,
        title=title,
        price=Decimal(price),
        stock=stock,
        category=category,
        main_image='https://example.com/img.jpg',
    )


# ─── Marketplace público (lista) ─────────────────────────────────────────────

class ProductPublicListTests(TestCase):
    # Pruebas para GET /api/products/ — acceso público sin autenticación.

    def setUp(self):
        self.client = APIClient()
        self.vendor = make_user('vendor@products.com', role=User.Role.VENDOR)
        self.product = make_product(self.vendor, title='Laptop Gaming', category='Electrónica')
        # Producto sin stock: NO debe aparecer en listado público
        self.oos = make_product(self.vendor, title='Sin Stock', stock=0)

    def test_list_no_auth_returns_200(self):
        # El marketplace es público: sin autenticación retorna 200.
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_excludes_out_of_stock_products(self):
        # Productos con stock=0 no aparecen en el listado público.
        response = self.client.get('/api/products/')
        titles = [p['title'] for p in response.data['results']]
        self.assertIn('Laptop Gaming', titles)
        self.assertNotIn('Sin Stock', titles)

    def test_search_filter_by_title(self):
        # ?search= filtra por título (icontains).
        response = self.client.get('/api/products/?search=Gaming')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [p['title'] for p in response.data['results']]
        self.assertIn('Laptop Gaming', titles)

    def test_category_filter(self):
        # ?category= filtra por categoría (case-insensitive exacto).
        make_product(self.vendor, title='Camiseta', category='Ropa')
        response = self.client.get('/api/products/?category=Electrónica')
        results = response.data['results']
        for p in results:
            self.assertEqual(p['category'].lower(), 'electrónica')

    def test_price_filter_min_max(self):
        # ?min_price y ?max_price filtran por rango de precio.
        make_product(self.vendor, title='Caro', price='999.99', category='Lujo')
        response = self.client.get('/api/products/?min_price=50&max_price=200')
        for p in response.data['results']:
            self.assertGreaterEqual(float(p['price']), 50)
            self.assertLessEqual(float(p['price']), 200)

    def test_sort_price_asc(self):
        # ?sort=price_asc retorna productos ordenados de menor a mayor precio.
        make_product(self.vendor, title='Barato', price='10.00')
        response = self.client.get('/api/products/?sort=price_asc')
        prices = [float(p['price']) for p in response.data['results']]
        self.assertEqual(prices, sorted(prices))

    def test_sort_price_desc(self):
        # ?sort=price_desc retorna productos ordenados de mayor a menor precio.
        make_product(self.vendor, title='Barato', price='10.00')
        response = self.client.get('/api/products/?sort=price_desc')
        prices = [float(p['price']) for p in response.data['results']]
        self.assertEqual(prices, sorted(prices, reverse=True))

    def test_categories_endpoint_returns_unique_list(self):
        # GET /api/products/categories/ retorna lista de categorías únicas con stock > 0.
        response = self.client.get('/api/products/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Electrónica', response.data)


# ─── Marketplace público (detalle) ───────────────────────────────────────────

class ProductPublicDetailTests(TestCase):
    # Pruebas para GET /api/products/<id>/ — acceso público individual.

    def setUp(self):
        self.client = APIClient()
        self.vendor = make_user('vendor2@products.com', role=User.Role.VENDOR)
        self.product = make_product(self.vendor)
        self.oos = make_product(self.vendor, title='Agotado', stock=0)

    def test_detail_no_auth_returns_200(self):
        # Detalle de producto con stock accesible sin autenticación.
        response = self.client.get(f'/api/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Producto Test')

    def test_detail_out_of_stock_returns_404(self):
        # Producto con stock=0 retorna 404 en el endpoint público.
        response = self.client.get(f'/api/products/{self.oos.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


# ─── Operaciones de vendedor ──────────────────────────────────────────────────

class ProductVendorTests(TestCase):
    # Pruebas para crear, editar y eliminar productos (solo vendedor/admin).

    def setUp(self):
        self.client = APIClient()
        self.vendor = make_user('v@products.com', role=User.Role.VENDOR)
        self.vendor2 = make_user('v2@products.com', role=User.Role.VENDOR)
        self.client_user = make_user('c@products.com')
        self.product = make_product(self.vendor)

    def test_vendor_can_create_product(self):
        # Vendedor autenticado puede crear un producto (201).
        self.client.force_authenticate(user=self.vendor)
        data = {
            'title': 'Nuevo Producto',
            'price': '150.00',
            'stock': 10,
            'main_image': 'https://example.com/new.jpg',
        }
        response = self.client.post('/api/products/create/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_client_cannot_create_product_returns_403(self):
        # Usuario con rol client no puede crear productos (403).
        self.client.force_authenticate(user=self.client_user)
        data = {'title': 'Hack', 'price': '1.00', 'stock': 1, 'main_image': 'https://x.com/img.jpg'}
        response = self.client.post('/api/products/create/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_no_auth_cannot_create_product_returns_401(self):
        # Sin autenticación no se puede crear producto (401).
        data = {'title': 'Hack', 'price': '1.00', 'stock': 1, 'main_image': 'https://x.com/img.jpg'}
        response = self.client.post('/api/products/create/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_vendor_list_only_own_products(self):
        # GET /api/products/my/ retorna solo productos del vendedor autenticado.
        make_product(self.vendor2, title='Del Otro')
        self.client.force_authenticate(user=self.vendor)
        response = self.client.get('/api/products/my/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [p['title'] for p in response.data]
        self.assertIn('Producto Test', titles)
        self.assertNotIn('Del Otro', titles)

    def test_vendor_can_edit_own_product(self):
        # Vendedor puede editar su propio producto (200).
        self.client.force_authenticate(user=self.vendor)
        response = self.client.patch(f'/api/products/{self.product.id}/edit/', {'stock': 20})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_vendor_cannot_edit_others_product_returns_403(self):
        # Vendedor no puede editar el producto de otro vendedor (403).
        self.client.force_authenticate(user=self.vendor2)
        response = self.client.patch(f'/api/products/{self.product.id}/edit/', {'stock': 99})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_vendor_can_delete_own_product(self):
        # Vendedor puede eliminar su propio producto (204).
        self.client.force_authenticate(user=self.vendor)
        response = self.client.delete(f'/api/products/{self.product.id}/delete/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Product.objects.filter(pk=self.product.id).exists())

    def test_vendor_cannot_delete_others_product_returns_403(self):
        # Vendedor no puede eliminar el producto de otro vendedor (403).
        self.client.force_authenticate(user=self.vendor2)
        response = self.client.delete(f'/api/products/{self.product.id}/delete/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_product_price_zero_returns_400(self):
        # Precio <= 0 retorna 400: violación de la regla de negocio.
        self.client.force_authenticate(user=self.vendor)
        data = {'title': 'Gratis', 'price': '0.00', 'stock': 1, 'main_image': 'https://x.com/img.jpg'}
        response = self.client.post('/api/products/create/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_product_more_than_5_images_returns_400(self):
        # 1 imagen principal + 5 adicionales = 6 imágenes → supera el límite (400).
        self.client.force_authenticate(user=self.vendor)
        data = {
            'title': 'Muchas Fotos',
            'price': '100.00',
            'stock': 1,
            'main_image': 'https://x.com/1.jpg',
            'additional_images': [
                'https://x.com/2.jpg',
                'https://x.com/3.jpg',
                'https://x.com/4.jpg',
                'https://x.com/5.jpg',
                'https://x.com/6.jpg',
            ],
        }
        response = self.client.post('/api/products/create/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# ─── Panel de administración ──────────────────────────────────────────────────

class AdminProductTests(TestCase):
    # Pruebas para GET /api/products/admin/ — solo accesible para admin.

    def setUp(self):
        self.client = APIClient()
        self.admin = make_user('admin@products.com', role=User.Role.ADMIN)
        self.vendor = make_user('vendor@admin-prods.com', role=User.Role.VENDOR)
        self.client_user = make_user('client@admin-prods.com')
        make_product(self.vendor, title='En Stock', stock=5)
        make_product(self.vendor, title='Sin Stock', stock=0)

    def test_admin_list_includes_out_of_stock_products(self):
        # El panel admin muestra TODOS los productos, incluyendo los sin stock.
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/products/admin/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [p['title'] for p in response.data]
        self.assertIn('Sin Stock', titles)
        self.assertIn('En Stock', titles)

    def test_client_cannot_access_admin_list_returns_403(self):
        # Usuario con rol client no puede acceder al panel admin (403).
        self.client.force_authenticate(user=self.client_user)
        response = self.client.get('/api/products/admin/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
