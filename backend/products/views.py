from loguru import logger

from django.db.models import Q, CharField
from django.db.models.functions import Cast
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product
from .db_views import ProductPublicListDBView
from core.permissions import IsVendorOrAdmin, IsOwnerOrAdmin, IsAdmin
from .serializers import (
    ProductCreateSerializer,
    ProductUpdateSerializer,
    ProductListSerializer,
    ProductPublicListViewSerializer,
    ProductDetailSerializer,
)
from rest_framework.exceptions import PermissionDenied


class ProductPublicPagination(PageNumberPagination):
    page_size = 20


class ProductPublicListView(generics.ListAPIView):
    """
    Vista pública para listar productos disponibles en la tienda.
    
    Aplica filtros de búsqueda, categoría, precio mínimo, precio máximo y ordenamiento.
    Solo retorna productos con stock mayor a cero.

    Args:
        request (Request): La solicitud HTTP entrante con parámetros de query.
        *args: Argumentos posicionales adicionales.
        **kwargs: Argumentos de palabras clave adicionales.

    Returns:
        Response: Una respuesta paginada con la lista de productos (JSON).
    """
    # Lista pública de productos con filtros: search, category, min_price, max_price, sort.
    # Usa la vista SQL vw_product_public_list en lugar del modelo Product directamente.
    serializer_class = ProductPublicListViewSerializer
    permission_classes = [AllowAny]
    pagination_class = ProductPublicPagination

    def get_queryset(self):
        """
        Construye el queryset usando la vista SQL vw_product_public_list.

        El filtro base (stock > 0) y el JOIN con el vendedor ya están resueltos
        por la vista SQL. Aquí solo se aplican filtros dinámicos del usuario.

        Args:
            None (usa self.request).

        Returns:
            QuerySet: El conjunto de productos filtrado y ordenado.
        """
        # La vista SQL ya filtra stock > 0 y hace JOIN con el vendedor
        queryset = ProductPublicListDBView.objects.all()

        search = self.request.query_params.get('search')
        category = self.request.query_params.get('category')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        sort = self.request.query_params.get('sort')

        if search:
            logger.debug(f"[ProductPublicListView] Search query: '{search}'")
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(category__icontains=search)
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
    """
    Vista pública para recuperar los detalles de un producto específico.
    
    Solo permite acceder a productos que tengan stock disponible.

    Args:
        request (Request): La solicitud HTTP entrante.
        *args: Argumentos posicionales adicionales.
        **kwargs: Argumentos de palabras clave (debe incluir 'id').

    Returns:
        Response: Los datos detallados del producto solicitado (JSON).
    """
    # Detalle de un producto público (solo muestra productos con stock disponible).
    queryset = Product.objects.filter(stock__gt=0)
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'


class CategoriesView(APIView):
    """
    Vista para listar todas las categorías disponibles que contienen productos.

    Args:
        request (Request): La solicitud HTTP entrante.
        *args: Argumentos posicionales.
        **kwargs: Argumentos de palabras clave.

    Returns:
        Response: Una lista de strings con los nombres de las categorías únicas.
    """
    # Devuelve la lista de categorías únicas con al menos un producto.
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        """
        Maneja la petición GET para obtener las categorías.

        Args:
            request (Request): La solicitud HTTP.

        Returns:
            Response: Lista de strings con los nombres de las categorías.
        """
        categories = (
            Product.objects.exclude(category__isnull=True)
            .exclude(category__exact='')
            .values_list('category', flat=True)
            .distinct()
            .order_by('category')
        )
        return Response(categories)


class ProductCreateView(generics.CreateAPIView):
    """
    Vista para la creación de un nuevo producto.

    Requiere permisos de vendedor o administrador. Asigna automáticamente
    el producto al vendedor autenticado.

    Args:
        request (Request): La solicitud HTTP POST con los datos del producto.
        *args: Argumentos posicionales.
        **kwargs: Argumentos de palabras clave.

    Returns:
        Response: Los datos del producto recién creado y estado HTTP 201.
    """
    # Crea un nuevo producto. Solo accesible para vendedores y admins.
    queryset = Product.objects.all()
    serializer_class = ProductCreateSerializer
    permission_classes = [IsVendorOrAdmin]

    def perform_create(self, serializer):
        """
        Ejecuta la creación del producto.

        El usuario vendedor se asigna automáticamente a través del contexto del serializador.

        Args:
            serializer (ProductCreateSerializer): El serializador con los datos validados.

        Returns:
            None
        """
        # The serializer uses context['request'].user to assign seller internally.
        product = serializer.save()
        logger.info(
            f"[ProductCreateView] Product created: id={product.id}, title='{product.title}', "
            f"seller_id={self.request.user.id}"
        )


class VendorProductListView(generics.ListAPIView):
    """
    Vista para listar todos los productos creados por el vendedor autenticado.

    Args:
        request (Request): La solicitud HTTP entrante.
        *args: Argumentos posicionales.
        **kwargs: Argumentos de palabras clave.

    Returns:
        Response: Una lista de productos pertenecientes al vendedor.
    """
    # Lista los productos del vendedor autenticado.
    serializer_class = ProductListSerializer
    permission_classes = [IsVendorOrAdmin]

    def get_queryset(self):
        """
        Obtiene los productos creados por el vendedor autenticado.

        Args:
            None

        Returns:
            QuerySet: Productos del vendedor actual.
        """
        return Product.objects.filter(seller=self.request.user).order_by('-created_at')


class ProductUpdateView(generics.UpdateAPIView):
    """
    Vista para actualizar un producto existente.

    Un vendedor solo puede actualizar sus propios productos. Un administrador
    puede actualizar cualquier producto.

    Args:
        request (Request): La solicitud HTTP PUT/PATCH con los datos a actualizar.
        *args: Argumentos posicionales.
        **kwargs: Argumentos de palabras clave (debe incluir 'id').

    Returns:
        Response: Los datos del producto actualizado.
    """
    # Actualiza un producto. Solo el dueño o un admin pueden hacerlo.
    serializer_class = ProductUpdateSerializer
    permission_classes = [IsOwnerOrAdmin]
    lookup_field = 'id'

    def get_queryset(self):
        user = self.request.user
        if user.role == user.__class__.Role.ADMIN:
            return Product.objects.all()
        return Product.objects.filter(seller=user)

    def perform_update(self, serializer):
        """
        Ejecuta la actualización del producto y registra la acción.

        Args:
            serializer (ProductUpdateSerializer): Serializador con los datos validados.

        Returns:
            None
        """
        product = serializer.save()
        logger.info(
            f"[ProductUpdateView] Product updated: id={product.id}, title='{product.title}', "
            f"updated_by=user_id={self.request.user.id}"
        )


class ProductDeleteView(generics.DestroyAPIView):
    """
    Vista para eliminar un producto existente.

    Un vendedor solo puede eliminar sus propios productos. Un administrador
    puede eliminar cualquier producto.

    Args:
        request (Request): La solicitud HTTP DELETE.
        *args: Argumentos posicionales.
        **kwargs: Argumentos de palabras clave (debe incluir 'id').

    Returns:
        Response: Estado HTTP 204 sin contenido.
    """
    # Elimina un producto. Solo el dueño o un admin pueden hacerlo.
    permission_classes = [IsOwnerOrAdmin]
    lookup_field = 'id'

    def get_queryset(self):
        user = self.request.user
        if user.role == user.__class__.Role.ADMIN:
            return Product.objects.all()
        return Product.objects.filter(seller=user)

    def perform_destroy(self, instance):
        """
        Ejecuta la eliminación física del producto y registra la acción.

        Args:
            instance (Product): La instancia del producto a eliminar.

        Returns:
            None
        """
        logger.info(
            f"[ProductDeleteView] Product deleted: id={instance.id}, title='{instance.title}', "
            f"deleted_by=user_id={self.request.user.id}"
        )
        instance.delete()


class VendorProductDetailView(generics.RetrieveAPIView):
    """
    Vista para recuperar los detalles de un producto propio de un vendedor.
    
    A diferencia de la vista pública, no filtra por stock, permitiendo
    ver y cargar la edición de productos pausados o sin stock.

    Args:
        request (Request): La solicitud HTTP entrante.
        *args: Argumentos posicionales.
        **kwargs: Argumentos de palabras clave (debe incluir 'id').

    Returns:
        Response: Los datos detallados del producto solicitado.
    """
    # Detalle de un producto propio para el vendedor, sin filtro de stock.
    # Permite cargar la página de edición aunque el producto esté pausado.
    serializer_class = ProductDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user)

    def get_object(self):
        """
        Recupera la instancia del producto y verifica doblemente que pertenezca al usuario.

        Args:
            None

        Returns:
            Product: La instancia del producto solicitado.

        Raises:
            PermissionDenied: Si el usuario no es el dueño del producto.
        """
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
    """
    Vista para listar absolutamente todos los productos en la plataforma.
    
    Diseñada exclusivamente para el panel de administración.

    Args:
        request (Request): La solicitud HTTP entrante.
        *args: Argumentos posicionales.
        **kwargs: Argumentos de palabras clave.

    Returns:
        Response: Una lista paginada de todos los productos del sistema.
    """
    # Lista todos los productos para el panel de administración.
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductListSerializer
    permission_classes = [IsAdmin]