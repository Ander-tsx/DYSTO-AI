from django.urls import path
from rest_framework.views import APIView
from .views import (
    ProductPublicListView,
    ProductPublicDetailView,
    CategoriesView,
    ProductListPublicView, 
    ProductDetailPublicView, 
    ProductCreateView,
    VendorProductListView,
    ProductUpdateView,
    ProductDeleteView,
    AdminProductListView
)

class ProductRootView(APIView):
    def get(self, request, *args, **kwargs):
        return ProductListPublicView.as_view()(request._request, *args, **kwargs)
    def post(self, request, *args, **kwargs):
        return ProductCreateView.as_view()(request._request, *args, **kwargs)

urlpatterns = [
    # Marketplace público (MKT-01)
    path('public/', ProductPublicListView.as_view(), name='product-public-list'),
    path('public/<int:id>/', ProductPublicDetailView.as_view(), name='product-public-detail'),
    path('categories/', CategoriesView.as_view(), name='product-categories'),

    # Públicas (GET) y Crear (POST)
    path('', ProductRootView.as_view(), name='product-root'),
    
    # Vendedores y Admin
    path('my/', VendorProductListView.as_view(), name='product-list-vendor'),
    path('admin/', AdminProductListView.as_view(), name='product-list-admin'),
    
    # Operaciones por ID
    path('<int:id>/', ProductDetailPublicView.as_view(), name='product-detail-public'),
    path('<int:id>/edit/', ProductUpdateView.as_view(), name='product-edit'),
    path('<int:id>/delete/', ProductDeleteView.as_view(), name='product-delete'),
]