from rest_framework import generics, filters
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Product
from core.permissions import IsVendedorOrAdmin, IsOwnerOrAdmin, IsAdmin
from .serializers import (
    ProductCreateSerializer, 
    ProductUpdateSerializer,
    ProductListSerializer,
    ProductDetailSerializer
)
from django_filters.rest_framework import DjangoFilterBackend

class ProductListPublicView(generics.ListAPIView):
    queryset = Product.objects.filter(stock__gt=0).order_by('-created_at')
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'created_at']

class ProductDetailPublicView(generics.RetrieveAPIView):
    queryset = Product.objects.all()  # Permite ver sin stock si se entra directo
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductCreateSerializer
    permission_classes = [IsVendedorOrAdmin]

class VendorProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [IsVendedorOrAdmin]

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user).order_by('-created_at')

class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductUpdateSerializer
    permission_classes = [IsOwnerOrAdmin]
    lookup_field = 'id'

class ProductDeleteView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    permission_classes = [IsOwnerOrAdmin]
    lookup_field = 'id'

class AdminProductListView(generics.ListAPIView):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductListSerializer
    permission_classes = [IsAdmin]