from loguru import logger

from products.models import Product
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartItem
from .serializers import CartSerializer


def _cart_with_prefetch(cart_pk):
    """
    Recupera un carrito optimizado precargando sus items y productos.

    Args:
        cart_pk (int): La llave primaria (ID) del carrito.

    Returns:
        Cart: Instancia del modelo Cart con relaciones optimizadas.
    """
    # Retorna el carrito recargado con prefetch_related para evitar N+1
    return Cart.objects.prefetch_related('items__product').get(pk=cart_pk)


class CartView(APIView):
    """
    Vista para recuperar el carrito de compras del usuario autenticado.

    Si el usuario no tiene un carrito, se crea uno automáticamente.

    Args:
        request (Request): La solicitud HTTP GET.
        *args: Argumentos posicionales.
        **kwargs: Argumentos de palabras clave.

    Returns:
        Response: Datos del carrito y sus items serializados.
    """
    # GET: Retorna el carrito del usuario autenticado con todos sus items.

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Maneja la petición GET para retornar el carrito.

        Args:
            request (Request): Solicitud HTTP.

        Returns:
            Response: El carrito serializado.
        """
        cart, _created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(_cart_with_prefetch(cart.pk))
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddToCartView(APIView):
    """
    Vista para agregar un producto al carrito o incrementar su cantidad.

    Valida que el usuario no intente comprar su propio producto, que el producto
    esté activo, y que haya suficiente stock disponible antes de agregarlo.

    Args:
        request (Request): La solicitud HTTP POST conteniendo 'product_id' y opcionalmente 'quantity'.
        *args: Argumentos posicionales.
        **kwargs: Argumentos de palabras clave.

    Returns:
        Response: El estado actualizado del carrito de compras.
    """
    # POST: Añade un producto al carrito o incrementa su cantidad.
    # Body esperado: { "product_id": int, "quantity": int (opcional, default 1) }
    # Valida stock disponible antes de agregar.

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Maneja la petición POST para agregar productos.

        Args:
            request (Request): Solicitud HTTP con `product_id` y `quantity`.

        Returns:
            Response: Carrito serializado actualizado.
        """
        cart, _created = Cart.objects.get_or_create(user=request.user)

        product_id_raw = request.data.get('product_id')
        if not product_id_raw:
            logger.warning(
                f"[AddToCartView] Missing product_id in request: user_id={request.user.id}"
            )
            return Response(
                {'detail': 'El campo product_id es requerido.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            product_id = int(product_id_raw)
        except (TypeError, ValueError):
            logger.warning(
                f"[AddToCartView] Invalid product_id value '{product_id_raw}': user_id={request.user.id}"
            )
            return Response(
                {'detail': 'El campo product_id debe ser un entero válido.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        quantity_raw = request.data.get('quantity', 1)
        try:
            quantity = int(quantity_raw)
        except (TypeError, ValueError):
            logger.warning(
                f"[AddToCartView] Invalid quantity value '{quantity_raw}': user_id={request.user.id}"
            )
            return Response(
                {'detail': 'El campo quantity debe ser un entero positivo.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity < 1:
            logger.warning(
                f"[AddToCartView] Quantity < 1 ({quantity}): user_id={request.user.id}, product_id={product_id}"
            )
            return Response(
                {'detail': 'La cantidad debe ser al menos 1.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product = get_object_or_404(Product, pk=product_id)

        # Verificar que el vendedor no intente comprar su propio producto
        if product.seller == request.user:
            logger.warning(
                f"[AddToCartView] Vendor attempted to buy own product: "
                f"user_id={request.user.id}, product_id={product.id}"
            )
            return Response(
                {'detail': 'No puedes comprar tu propio producto.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Verificar que el producto está activo (tiene stock)
        if not product.is_active:
            logger.warning(
                f"[AddToCartView] Attempt to add inactive product: "
                f"product_id={product.id}, user_id={request.user.id}"
            )
            return Response(
                {'detail': 'Este producto no está disponible.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Buscar si ya existe en el carrito
        cart_item = CartItem.objects.filter(cart=cart, product=product).first()
        new_quantity = quantity if cart_item is None else cart_item.quantity + quantity

        # Validar stock disponible
        if new_quantity > product.stock:
            logger.warning(
                f"[AddToCartView] Insufficient stock: product_id={product.id}, "
                f"requested={new_quantity}, available={product.stock}, user_id={request.user.id}"
            )
            return Response(
                {
                    'detail': (
                        f'Stock insuficiente. Disponible: {product.stock}, '
                        f'solicitado: {new_quantity}.'
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if cart_item:
            cart_item.quantity = new_quantity
            cart_item.save(update_fields=['quantity'])
        else:
            CartItem.objects.create(cart=cart, product=product, quantity=quantity)

        logger.info(
            f"[AddToCartView] Product added to cart: product_id={product.id}, "
            f"quantity={new_quantity}, user_id={request.user.id}"
        )
        serializer = CartSerializer(_cart_with_prefetch(cart.pk))
        return Response(serializer.data, status=status.HTTP_200_OK)


class CartItemDetailView(APIView):
    """
    Vista para actualizar la cantidad o eliminar un item específico del carrito.

    Previene vulnerabilidades asegurando que solo se manipulen items que pertenezcan
    al carrito del usuario autenticado.

    Args:
        request (Request): La solicitud HTTP PATCH o DELETE.
        item_id (int): ID del CartItem a modificar o eliminar.
        *args: Argumentos posicionales.
        **kwargs: Argumentos de palabras clave.

    Returns:
        Response: El estado actualizado del carrito después de la operación.
    """
    # PATCH: Actualiza cantidad de un item. DELETE: Elimina un item.
    # Filtra siempre por cart__user=request.user para prevenir IDOR.

    permission_classes = [IsAuthenticated]

    def _get_cart_item(self, request, item_id):
        """
        Obtiene el elemento del carrito garantizando que pertenezca al usuario de la petición.

        Args:
            request (Request): La solicitud HTTP actual.
            item_id (int): El ID del CartItem.

        Returns:
            CartItem: El elemento solicitado.
        """
        # Obtiene el cart item verificando que pertenece al usuario
        return get_object_or_404(
            CartItem,
            pk=item_id,
            cart__user=request.user,
        )

    def patch(self, request, item_id):
        """
        Actualiza la cantidad de un artículo existente en el carrito.

        Args:
            request (Request): Petición PATCH con 'quantity'.
            item_id (int): ID del artículo.

        Returns:
            Response: Estado actualizado del carrito.
        """
        # Actualiza la cantidad de un item. Valida stock disponible.
        cart_item = self._get_cart_item(request, item_id)

        quantity = request.data.get('quantity')
        if quantity is None:
            logger.warning(
                f"[CartItemDetailView] Missing quantity in PATCH: "
                f"item_id={item_id}, user_id={request.user.id}"
            )
            return Response(
                {'detail': 'El campo quantity es requerido.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            logger.warning(
                f"[CartItemDetailView] Invalid quantity value: "
                f"item_id={item_id}, user_id={request.user.id}"
            )
            return Response(
                {'detail': 'El campo quantity debe ser un entero válido.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity < 1:
            logger.warning(
                f"[CartItemDetailView] Quantity < 1 ({quantity}): "
                f"item_id={item_id}, user_id={request.user.id}"
            )
            return Response(
                {'detail': 'La cantidad debe ser al menos 1.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validar stock disponible
        if quantity > cart_item.product.stock:
            logger.warning(
                f"[CartItemDetailView] Insufficient stock on update: "
                f"product_id={cart_item.product.id}, requested={quantity}, "
                f"available={cart_item.product.stock}, user_id={request.user.id}"
            )
            return Response(
                {
                    'detail': (
                        f'Stock insuficiente. Disponible: {cart_item.product.stock}, '
                        f'solicitado: {quantity}.'
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_item.quantity = quantity
        cart_item.save(update_fields=['quantity'])

        logger.info(
            f"[CartItemDetailView] Cart item updated: item_id={item_id}, "
            f"new_quantity={quantity}, user_id={request.user.id}"
        )
        serializer = CartSerializer(_cart_with_prefetch(cart_item.cart_id))
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, item_id):
        """
        Elimina el artículo especificado del carrito.

        Args:
            request (Request): Petición DELETE.
            item_id (int): ID del artículo a eliminar.

        Returns:
            Response: Estado actualizado del carrito.
        """
        # Elimina un item del carrito
        cart_item = self._get_cart_item(request, item_id)
        cart_pk = cart_item.cart_id
        product_id = cart_item.product_id
        cart_item.delete()

        logger.info(
            f"[CartItemDetailView] Cart item deleted: item_id={item_id}, "
            f"product_id={product_id}, user_id={request.user.id}"
        )
        serializer = CartSerializer(_cart_with_prefetch(cart_pk))
        return Response(serializer.data, status=status.HTTP_200_OK)
