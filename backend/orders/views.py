from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

from .models import Order, OrderItem
from users.models import Address
from products.models import Product
from carts.models import Cart
from .serializers import OrderSerializer, CheckoutSerializer

class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = CheckoutSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        address_id = serializer.validated_data['address_id']

        try:
            cart = request.user.cart
        except Cart.DoesNotExist:
            return Response({"detail": "El usuario no tiene un carrito."}, status=status.HTTP_400_BAD_REQUEST)
        
        cart_items = cart.items.select_related('product').all()
        if not cart_items.exists():
            return Response({"detail": "El carrito está vacío."}, status=status.HTTP_400_BAD_REQUEST)

        errors = {}
        for item in cart_items:
            if item.product.stock < item.cantidad:
                errors[item.product.id] = f"Solo hay {item.product.stock} unidades disponibles de {item.product.title} (requeridas: {item.cantidad})."
        
        if errors:
            return Response({"detail": "Stock insuficiente para algunos productos.", "errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                address = Address.objects.get(id=address_id, user=request.user)
                address_snapshot = {
                    "calle": address.calle,
                    "numero": address.numero,
                    "ciudad": address.ciudad,
                    "estado": address.estado,
                    "codigo_postal": address.codigo_postal
                }

                product_ids = [item.product_id for item in cart_items]
                locked_products = {
                    p.id: p for p in Product.objects.select_for_update().filter(id__in=product_ids)
                }

                total = 0
                for item in cart_items:
                    product = locked_products[item.product_id]
                    if product.stock < item.cantidad:
                        raise ValidationError({"detail": "Stock insuficiente", "errors": {product.id: f"Stock agotado repentinamente para {product.title}"}})
                    total += product.price * item.cantidad
                
                order = Order.objects.create(
                    user=request.user,
                    address_snapshot=address_snapshot,
                    total=total,
                    status='completada'
                )

                for item in cart_items:
                    product = locked_products[item.product_id]
                    product_snapshot = {
                        "title": product.title,
                        "price": str(product.price)
                    }

                    OrderItem.objects.create(
                        order=order,
                        product=product, 
                        product_snapshot=product_snapshot,
                        cantidad=item.cantidad,
                        precio_unitario=product.price
                    )

                    product.stock -= item.cantidad
                    product.units_sold += item.cantidad
                    product.save(update_fields=['stock', 'units_sold'])
                cart.items.all().delete()
                
        except ValidationError as e:
            if hasattr(e, 'detail'):
                return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
            return Response({"detail": "Stock insuficiente"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": "Error inesperado procesando la compra", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'order_number'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
