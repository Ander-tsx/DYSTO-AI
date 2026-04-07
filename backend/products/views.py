from django.db.models import Q, CharField
from django.db.models.functions import Cast
from rest_framework import generics, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Product
from core.permissions import IsVendedorOrAdmin, IsOwnerOrAdmin, IsAdmin
from .serializers import (
    ProductCreateSerializer, 
    ProductUpdateSerializer,
    ProductListSerializer,
    ProductDetailSerializer
)
from django_filters.rest_framework import DjangoFilterBackend


class ProductPublicPagination(PageNumberPagination):
    page_size = 20


class ProductPublicListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    pagination_class = ProductPublicPagination

    def get_queryset(self):
        queryset = Product.objects.filter(stock__gt=0).order_by('-created_at')

        search = self.request.query_params.get('search')
        categoria = self.request.query_params.get('categoria')
        precio_min = self.request.query_params.get('precio_min')
        precio_max = self.request.query_params.get('precio_max')
        orden = self.request.query_params.get('orden')

        if search:
            queryset = queryset.annotate(tags_text=Cast('tags', output_field=CharField())).filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(category__icontains=search)
                | Q(tags_text__icontains=search)
            )

        if categoria:
            queryset = queryset.filter(category__iexact=categoria)

        if precio_min:
            try:
                queryset = queryset.filter(price__gte=precio_min)
            except (TypeError, ValueError):
                pass

        if precio_max:
            try:
                queryset = queryset.filter(price__lte=precio_max)
            except (TypeError, ValueError):
                pass

        if orden == 'precio_asc':
            queryset = queryset.order_by('price', '-created_at')
        elif orden == 'precio_desc':
            queryset = queryset.order_by('-price', '-created_at')
        else:
            queryset = queryset.order_by('-created_at')

        return queryset


class ProductPublicDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(stock__gt=0)
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'


class CategoriesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        categories = (
            Product.objects.exclude(category__isnull=True)
            .exclude(category__exact='')
            .values_list('category', flat=True)
            .distinct()
            .order_by('category')
        )
        return Response(categories)

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