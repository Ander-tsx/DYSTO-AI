from rest_framework import serializers

from .models import Order, OrderItem
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
