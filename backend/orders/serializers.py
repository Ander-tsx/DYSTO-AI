from rest_framework import serializers

from .models import Order, OrderItem
from .db_views import OrderListDBView
from users.models import Address


class OrderItemSerializer(serializers.ModelSerializer):
    # Serializer para los items del pedido, mostrando detalles históricos.

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_snapshot', 'quantity', 'unit_price']
        read_only_fields = fields


class OrderSerializer(serializers.ModelSerializer):
    # Serializer del pedido completo, anidando sus items.

    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'address_snapshot',
            'total', 'status', 'created_at', 'items'
        ]
        read_only_fields = fields


# Serializer que usa la vista SQL vw_order_list
class OrderListViewSerializer(serializers.ModelSerializer):
    """
    Serializer que mapea directamente a la vista SQL vw_order_list.

    Incluye campos calculados por la vista (user_email, total_items,
    total_quantity) sin necesidad de hacer JOINs ni sub-queries en Django.
    """

    class Meta:
        model = OrderListDBView
        fields = [
            'id', 'order_number', 'user_id', 'user_email',
            'address_snapshot', 'total', 'status', 'created_at',
            'total_items', 'total_quantity'
        ]


class CheckoutSerializer(serializers.Serializer):
    # Serializer usado para validar la petición de checkout antes de crear el pedido.

    address_id = serializers.IntegerField(required=True)

    def validate_address_id(self, value):
        request = self.context.get('request')
        if request is None:
            raise serializers.ValidationError(
                "Se requiere contexto de autenticación para validar la dirección."
            )
        user = request.user
        if not Address.objects.filter(id=value, user=user).exists():
            raise serializers.ValidationError(
                "La dirección no existe o no pertenece al usuario autenticado."
            )
        return value
