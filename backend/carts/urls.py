from django.urls import path

from .views import (
    AddToCartView,
    CartView,
    CartItemDetailView,
)

urlpatterns = [
    path('', CartView.as_view(), name='cart_detail'),
    path('add/', AddToCartView.as_view(), name='cart_add'),
    path('items/<int:item_id>/', CartItemDetailView.as_view(), name='cart_item_detail'),
]
