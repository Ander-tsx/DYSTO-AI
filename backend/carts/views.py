from products.models import Product
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartItem
from .serializers import CartSerializer


def _cart_with_prefetch(cart_pk):
    # Retorna el carrito recargado con prefetch_related para evitar N+1
    return Cart.objects.prefetch_related('items__product').get(pk=cart_pk)


class CartView(APIView):
    # GET: Retorna el carrito del usuario autenticado con todos sus items.

    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(_cart_with_prefetch(cart.pk))
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddToCartView(APIView):
    # POST: Añade un producto al carrito o incrementa su cantidad.
    # Body esperado: { "product_id": int, "quantity": int (opcional, default 1) }
    # Valida stock disponible antes de agregar.

    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart, _created = Cart.objects.get_or_create(user=request.user)

        product_id_raw = request.data.get('product_id')
        if not product_id_raw:
            return Response(
                {'detail': 'El campo product_id es requerido.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            product_id = int(product_id_raw)
        except (TypeError, ValueError):
            return Response(
                {'detail': 'El campo product_id debe ser un entero válido.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        quantity_raw = request.data.get('quantity', 1)
        try:
            quantity = int(quantity_raw)
        except (TypeError, ValueError):
            return Response(
                {'detail': 'El campo quantity debe ser un entero positivo.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity < 1:
            return Response(
                {'detail': 'La cantidad debe ser al menos 1.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product = get_object_or_404(Product, pk=product_id)

        # Verificar que el vendedor no intente comprar su propio producto
        if product.seller == request.user:
            return Response(
                {'detail': 'No puedes comprar tu propio producto.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Verificar que el producto está activo (tiene stock)
        if not product.is_active:
            return Response(
                {'detail': 'Este producto no está disponible.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Buscar si ya existe en el carrito
        cart_item = CartItem.objects.filter(cart=cart, product=product).first()
        new_quantity = quantity if cart_item is None else cart_item.quantity + quantity

        # Validar stock disponible
        if new_quantity > product.stock:
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

        serializer = CartSerializer(_cart_with_prefetch(cart.pk))
        return Response(serializer.data, status=status.HTTP_200_OK)


class CartItemDetailView(APIView):
    # PATCH: Actualiza cantidad de un item. DELETE: Elimina un item.
    # Filtra siempre por cart__user=request.user para prevenir IDOR.

    permission_classes = [IsAuthenticated]

    def _get_cart_item(self, request, item_id):
        # Obtiene el cart item verificando que pertenece al usuario
        return get_object_or_404(
            CartItem,
            pk=item_id,
            cart__user=request.user,
        )

    def patch(self, request, item_id):
        # Actualiza la cantidad de un item. Valida stock disponible.
        cart_item = self._get_cart_item(request, item_id)

        quantity = request.data.get('quantity')
        if quantity is None:
            return Response(
                {'detail': 'El campo quantity es requerido.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response(
                {'detail': 'El campo quantity debe ser un entero válido.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity < 1:
            return Response(
                {'detail': 'La cantidad debe ser al menos 1.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validar stock disponible
        if quantity > cart_item.product.stock:
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

        serializer = CartSerializer(_cart_with_prefetch(cart_item.cart_id))
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, item_id):
        # Elimina un item del carrito
        cart_item = self._get_cart_item(request, item_id)
        cart_pk = cart_item.cart_id
        cart_item.delete()

        serializer = CartSerializer(_cart_with_prefetch(cart_pk))
        return Response(serializer.data, status=status.HTTP_200_OK)
