from django.urls import path
from .views import ProductListPublicView, ProductDetailPublicView

urlpatterns = [
    path('', ProductListPublicView.as_view(), name='product-list-public'),
    path('<int:id>/', ProductDetailPublicView.as_view(), name='product-detail-public'),
]