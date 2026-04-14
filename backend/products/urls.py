from django.urls import path
from .views import (
    ProductPublicListView,
    ProductPublicDetailView,
    CategoriesView,
    ProductCreateView,
    VendorProductListView,
    VendorProductDetailView,
    ProductUpdateView,
    ProductDeleteView,
    AdminProductListView,
)

urlpatterns = [
    # Marketplace público: lista con filtros (GET) y creación (POST)
    path('', ProductPublicListView.as_view(), name='product-list'),
    path('create/', ProductCreateView.as_view(), name='product-create'),

    # Categorías únicas
    path('categories/', CategoriesView.as_view(), name='product-categories'),

    # Vendedor: productos propios
    path('my/', VendorProductListView.as_view(), name='product-vendor-list'),

    # Admin: todos los productos
    path('admin/', AdminProductListView.as_view(), name='product-admin-list'),

    # Operaciones por ID
    path('<int:id>/', ProductPublicDetailView.as_view(), name='product-detail'),
    path('<int:id>/edit/', ProductUpdateView.as_view(), name='product-edit'),
    path('<int:id>/delete/', ProductDeleteView.as_view(), name='product-delete'),
    path('<int:id>/vendor-detail/', VendorProductDetailView.as_view(), name='product-vendor-detail'),
]