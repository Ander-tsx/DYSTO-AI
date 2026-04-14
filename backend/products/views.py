from loguru import logger

from django.db.models import Q, CharField
from django.db.models.functions import Cast
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product
from core.permissions import IsVendorOrAdmin, IsOwnerOrAdmin, IsAdmin
from .serializers import (
    ProductCreateSerializer,
    ProductUpdateSerializer,
    ProductListSerializer,
    ProductDetailSerializer,
)
from rest_framework.exceptions import PermissionDenied


class ProductPublicPagination(PageNumberPagination):
    page_size = 20


class ProductPublicListView(generics.ListAPIView):
    # Lista pública de productos con filtros: search, category, min_price, max_price, sort.
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    pagination_class = ProductPublicPagination

    def get_queryset(self):
        queryset = Product.objects.filter(stock__gt=0).order_by('-created_at')

        search = self.request.query_params.get('search')
        category = self.request.query_params.get('category')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        sort = self.request.query_params.get('sort')

        if search:
            logger.debug(f"[ProductPublicListView] Search query: '{search}'")
            queryset = queryset.annotate(
                tags_text=Cast('tags', output_field=CharField())
            ).filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(category__icontains=search)
                | Q(tags_text__icontains=search)
            )

        if category:
            logger.debug(f"[ProductPublicListView] Filter by category: '{category}'")
            queryset = queryset.filter(category__iexact=category)

        if min_price:
            try:
                queryset = queryset.filter(price__gte=min_price)
            except (TypeError, ValueError):
                logger.warning(f"[ProductPublicListView] Invalid min_price value: '{min_price}'")

        if max_price:
            try:
                queryset = queryset.filter(price__lte=max_price)
            except (TypeError, ValueError):
                logger.warning(f"[ProductPublicListView] Invalid max_price value: '{max_price}'")

        if sort == 'price_asc':
            queryset = queryset.order_by('price', '-created_at')
        elif sort == 'price_desc':
            queryset = queryset.order_by('-price', '-created_at')
        else:
            queryset = queryset.order_by('-created_at')

        return queryset


class ProductPublicDetailView(generics.RetrieveAPIView):
    # Detalle de un producto público (solo muestra productos con stock disponible).
    queryset = Product.objects.filter(stock__gt=0)
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'


class CategoriesView(APIView):
    # Devuelve la lista de categorías únicas con al menos un producto.
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


class ProductCreateView(generics.CreateAPIView):
    # Crea un nuevo producto. Solo accesible para vendedores y admins.
    queryset = Product.objects.all()
    serializer_class = ProductCreateSerializer
    permission_classes = [IsVendorOrAdmin]

    def perform_create(self, serializer):
        # The serializer uses context['request'].user to assign seller internally.
        product = serializer.save()
        logger.info(
            f"[ProductCreateView] Product created: id={product.id}, title='{product.title}', "
            f"seller_id={self.request.user.id}"
        )


class VendorProductListView(generics.ListAPIView):
    # Lista los productos del vendedor autenticado.
    serializer_class = ProductListSerializer
    permission_classes = [IsVendorOrAdmin]

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user).order_by('-created_at')


class ProductUpdateView(generics.UpdateAPIView):
    # Actualiza un producto. Solo el dueño o un admin pueden hacerlo.
    queryset = Product.objects.all()
    serializer_class = ProductUpdateSerializer
    permission_classes = [IsOwnerOrAdmin]
    lookup_field = 'id'

    def perform_update(self, serializer):
        product = serializer.save()
        logger.info(
            f"[ProductUpdateView] Product updated: id={product.id}, title='{product.title}', "
            f"updated_by=user_id={self.request.user.id}"
        )


class ProductDeleteView(generics.DestroyAPIView):
    # Elimina un producto. Solo el dueño o un admin pueden hacerlo.
    queryset = Product.objects.all()
    permission_classes = [IsOwnerOrAdmin]
    lookup_field = 'id'

    def perform_destroy(self, instance):
        logger.info(
            f"[ProductDeleteView] Product deleted: id={instance.id}, title='{instance.title}', "
            f"deleted_by=user_id={self.request.user.id}"
        )
        instance.delete()


class VendorProductDetailView(generics.RetrieveAPIView):
    # Detalle de un producto propio para el vendedor, sin filtro de stock.
    # Permite cargar la página de edición aunque el producto esté pausado.
    serializer_class = ProductDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user)

    def get_object(self):
        obj = super().get_object()
        # Doble check: el usuario debe ser el dueño
        if obj.seller != self.request.user:
            logger.warning(
                f"[VendorProductDetailView] Unauthorized access attempt: "
                f"user_id={self.request.user.id}, product_id={obj.id}"
            )
            raise PermissionDenied("No tienes permiso para ver este producto.")
        return obj


class AdminProductListView(generics.ListAPIView):
    # Lista todos los productos para el panel de administración.
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductListSerializer
    permission_classes = [IsAdmin]