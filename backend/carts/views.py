from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartItem
from .serializers import CartSerializer


class CartView(APIView):
    """GET: Retorna el carrito del usuario autenticado con todos sus items."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddToCartView(APIView):
    """POST: Añade un producto al carrito o incrementa su cantidad.

    Body esperado: { "product_id": int, "cantidad": int (opcional, default 1) }
    Valida stock disponible antes de agregar.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart, _created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        cantidad = int(request.data.get('cantidad', 1))

        if not product_id:
            return Response(
                {'detail': 'El campo product_id es requerido.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if cantidad < 1:
            return Response(
                {'detail': 'La cantidad debe ser al menos 1.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        from products.models import Product
        product = get_object_or_404(Product, pk=product_id)

        # Verificar que el producto está activo (tiene stock)
        if not product.is_active:
            return Response(
                {'detail': 'Este producto no está disponible.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Buscar si ya existe en el carrito
        cart_item = CartItem.objects.filter(cart=cart, product=product).first()
        nueva_cantidad = cantidad if cart_item is None else cart_item.cantidad + cantidad

        # Validar stock disponible
        if nueva_cantidad > product.stock:
            return Response(
                {
                    'detail': f'Stock insuficiente. Disponible: {product.stock}, '
                              f'solicitado: {nueva_cantidad}.',
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if cart_item:
            cart_item.cantidad = nueva_cantidad
            cart_item.save(update_fields=['cantidad'])
        else:
            CartItem.objects.create(cart=cart, product=product, cantidad=cantidad)

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CartItemDetailView(APIView):
    """PATCH: Actualiza cantidad de un item. DELETE: Elimina un item.

    Filtra siempre por cart__user=request.user para prevenir IDOR.
    """

    permission_classes = [IsAuthenticated]

    def _get_cart_item(self, request, item_id):
        """Obtiene el cart item verificando que pertenece al usuario."""
        return get_object_or_404(
            CartItem,
            pk=item_id,
            cart__user=request.user,
        )

    def patch(self, request, item_id):
        """Actualiza la cantidad de un item. Valida stock disponible."""
        cart_item = self._get_cart_item(request, item_id)

        cantidad = request.data.get('cantidad')
        if cantidad is None:
            return Response(
                {'detail': 'El campo cantidad es requerido.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cantidad = int(cantidad)
        if cantidad < 1:
            return Response(
                {'detail': 'La cantidad debe ser al menos 1.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validar stock disponible
        if cantidad > cart_item.product.stock:
            return Response(
                {
                    'detail': f'Stock insuficiente. Disponible: {cart_item.product.stock}, '
                              f'solicitado: {cantidad}.',
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_item.cantidad = cantidad
        cart_item.save(update_fields=['cantidad'])

        serializer = CartSerializer(cart_item.cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, item_id):
        """Elimina un item del carrito."""
        cart_item = self._get_cart_item(request, item_id)
        cart = cart_item.cart
        cart_item.delete()

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)
