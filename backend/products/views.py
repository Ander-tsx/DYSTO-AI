from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product
from .serializers import ProductPublicSerializer

class ProductListPublicView(generics.ListAPIView):

    # Solo mostramos productos activos (con stock > 0) y ordenados por fecha de creación
    queryset = Product.objects.filter(stock__gt=0).order_by('-created_at')
    serializer_class = ProductPublicSerializer
    
    # Importante: Permitir acceso público
    permission_classes = [AllowAny]
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Filtro exacto (ej. ?category=2)
    filterset_fields = ['category']
    
    # Búsqueda de texto libre (ej. ?search=termo)
    search_fields = ['title', 'description']
    
    # Ordenamiento (ej. ?ordering=price o ?ordering=-price)
    ordering_fields = ['price', 'created_at']

class ProductDetailPublicView(generics.RetrieveAPIView):
    # Solo permitimos ver productos activos (con stock > 0)
    # El detalle de un producto también debe ser accesible públicamente, pero solo si el producto tiene stock
    queryset = Product.objects.filter(stock__gt=0)
    serializer_class = ProductPublicSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'