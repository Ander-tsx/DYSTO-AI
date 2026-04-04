from django.urls import path
from .views import ProductListPublicView, ProductDetailPublicView, ProductCreateView

urlpatterns = [
    path('', ProductListPublicView.as_view(), name='product-list-public'),
    path('<int:id>/', ProductDetailPublicView.as_view(), name='product-detail-public'),
    path('create/', ProductCreateView.as_view(), name='product-create'),
]