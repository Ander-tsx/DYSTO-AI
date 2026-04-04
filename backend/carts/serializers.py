from decimal import Decimal

from rest_framework import serializers

from products.models import Product
from .models import Cart, CartItem


class CartItemProductSerializer(serializers.ModelSerializer):
    """Datos ligeros del producto dentro de un item del carrito."""

    class Meta:
        model = Product
        fields = ['id', 'title', 'main_image', 'price', 'stock']
        read_only_fields = fields


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer para cada elemento del carrito con datos del producto."""

    product = CartItemProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True,
    )
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'cantidad', 'subtotal']
        read_only_fields = ['id', 'subtotal']

    def get_subtotal(self, obj):
        """Retorna el subtotal como string con 2 decimales."""
        return str(obj.subtotal)


class CartSerializer(serializers.ModelSerializer):
    """Serializer del carrito completo con items anidados y total."""

    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total', 'created_at', 'updated_at']
        read_only_fields = fields

    def get_total(self, obj):
        """Suma todos los subtotales de los items del carrito."""
        total = sum(
            (item.subtotal for item in obj.items.all()),
            Decimal('0.00'),
        )
        return str(total)
