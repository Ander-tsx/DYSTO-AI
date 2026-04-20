from loguru import logger

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import Order, OrderItem
from users.models import Address
from products.models import Product
from carts.models import Cart
from .serializers import OrderSerializer, CheckoutSerializer


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
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
    # Lista los pedidos del usuario autenticado.
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    # Detalle de un pedido por número de orden.
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'order_number'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
