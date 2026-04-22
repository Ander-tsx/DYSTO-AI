from loguru import logger

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import Order, OrderItem
from .db_views import OrderListDBView
from users.models import Address
from products.models import Product
from carts.models import Cart
from .serializers import OrderSerializer, OrderListViewSerializer, CheckoutSerializer


class CheckoutView(APIView):
    """
    Vista encargada de procesar la compra de los productos en el carrito.

    Realiza validaciones de stock, bloqueos en la base de datos para evitar condiciones
    de carrera y vacía el carrito una vez que la orden se crea exitosamente.

    Args:
        request (Request): La solicitud HTTP POST que contiene el ID de la dirección de envío.
        *args: Argumentos posicionales adicionales.
        **kwargs: Argumentos de palabras clave adicionales.

    Returns:
        Response: Detalles de la orden creada si fue exitosa, o mensajes de error detallados si falla.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Realiza el proceso de compra.

        Valida el stock, reserva los productos, crea la orden de compra,
        y vacía el carrito. Emplea un bloque transaccional.

        Args:
            request (Request): Petición POST.

        Returns:
            Response: Los detalles del pedido o un error 400/500 si falla.
        """
        logger.debug(f"[CheckoutView] Checkout initiated: user_id={request.user.id}")

        serializer = CheckoutSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        address_id = serializer.validated_data['address_id']

        try:
            cart = request.user.cart
        except Cart.DoesNotExist:
            logger.warning(f"[CheckoutView] No cart found: user_id={request.user.id}")
            return Response(
                {"detail": "El usuario no tiene un carrito."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_items = cart.items.select_related('product').all()
        if not cart_items.exists():
            logger.warning(f"[CheckoutView] Checkout with empty cart: user_id={request.user.id}")
            return Response(
                {"detail": "El carrito está vacío."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validación previa de stock antes de iniciar la transacción
        errors = {}
        for item in cart_items:
            if item.product.stock < item.quantity:
                errors[item.product.id] = (
                    f"Solo hay {item.product.stock} unidades disponibles de "
                    f"{item.product.title} (requeridas: {item.quantity})."
                )

        if errors:
            logger.warning(
                f"[CheckoutView] Pre-validation stock error: user_id={request.user.id}, "
                f"products_with_errors={list(errors.keys())}"
            )
            return Response(
                {"detail": "Stock insuficiente para algunos productos.", "errors": errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                address = Address.objects.get(id=address_id, user=request.user)

                # Snapshot de la dirección al momento de la compra (claves en inglés)
                address_snapshot = {
                    "street": address.street,
                    "street_number": address.street_number,
                    "city": address.city,
                    "state": address.state,
                    "postal_code": address.postal_code,
                }

                # Bloquear productos con SELECT FOR UPDATE para evitar condiciones de carrera
                product_ids = [item.product_id for item in cart_items]
                locked_products = {
                    p.id: p for p in Product.objects.select_for_update().filter(id__in=product_ids)
                }

                total = 0
                for item in cart_items:
                    product = locked_products[item.product_id]
                    if product.stock < item.quantity:
                        logger.warning(
                            f"[CheckoutView] Stock race condition detected: "
                            f"product_id={product.id}, available={product.stock}, "
                            f"requested={item.quantity}, user_id={request.user.id}"
                        )
                        raise ValidationError({
                            "detail": "Stock insuficiente",
                            "errors": {
                                product.id: f"Stock agotado repentinamente para {product.title}"
                            },
                        })
                    total += product.price * item.quantity

                order = Order.objects.create(
                    user=request.user,
                    address_snapshot=address_snapshot,
                    total=total,
                    status=Order.Status.COMPLETED,
                )

                for item in cart_items:
                    product = locked_products[item.product_id]
                    product_snapshot = {
                        "title": product.title,
                        "price": str(product.price),
                    }

                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        product_snapshot=product_snapshot,
                        quantity=item.quantity,
                        unit_price=product.price,
                    )

                    product.stock -= item.quantity
                    product.units_sold += item.quantity
                    product.save(update_fields=['stock', 'units_sold'])

                cart.items.all().delete()

        except ValidationError as e:
            if hasattr(e, 'detail'):
                return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
            return Response(
                {"detail": "Stock insuficiente."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as exc:
            logger.error(
                f"[CheckoutView] Unexpected error during checkout: user_id={request.user.id}, "
                f"error={type(exc).__name__}: {exc}"
            )
            logger.exception(exc)
            return Response(
                {"detail": "Error inesperado procesando la compra."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        logger.info(
            f"[CheckoutView] Order completed: order_id={order.id}, "
            f"order_number={order.order_number}, total={order.total}, "
            f"user_id={request.user.id}"
        )
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
    """
    Vista para listar los pedidos (órdenes) realizados por el usuario autenticado.

    Utiliza la vista SQL vw_order_list que pre-calcula el email del comprador
    y la cantidad de items/unidades por orden.

    Args:
        request (Request): La solicitud HTTP entrante.
        *args: Argumentos posicionales.
        **kwargs: Argumentos de palabras clave.

    Returns:
        Response: Una lista paginada de las órdenes del usuario.
    """
    # Usa la vista SQL vw_order_list en lugar del modelo Order directamente.
    serializer_class = OrderListViewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filtra las órdenes desde la vista SQL para que el usuario solo vea las suyas.

        Returns:
            QuerySet: Órdenes pertenecientes al usuario autenticado.
        """
        return OrderListDBView.objects.filter(user_id=self.request.user.id)


class OrderDetailView(generics.RetrieveAPIView):
    """
    Vista para recuperar los detalles completos de una orden específica.

    Args:
        request (Request): La solicitud HTTP entrante.
        *args: Argumentos posicionales.
        **kwargs: Argumentos de palabras clave, debe incluir 'order_number'.

    Returns:
        Response: Los datos detallados de la orden solicitada.
    """
    # Detalle de un pedido por número de orden.
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'order_number'

    def get_queryset(self):
        """
        Filtra las órdenes asegurando que el usuario solo pueda recuperar los detalles de sus propios pedidos.

        Returns:
            QuerySet: Órdenes pertenecientes al usuario autenticado.
        """
        return Order.objects.filter(user=self.request.user)
