from rest_framework import serializers
from .models import Product
import json


# Serializer ligero para listados
class ProductListSerializer(serializers.ModelSerializer):
    seller_email = serializers.CharField(source='seller.email', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'price', 'stock',
            'category', 'seller_email',
            'main_image', 'units_sold', 'is_active', 'created_at'
        ]


# Serializer completo con todo el JSON anidado y metadata
class ProductDetailSerializer(serializers.ModelSerializer):
    seller_email = serializers.CharField(source='seller.email', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'price', 'stock',
            'category', 'seller_email',
            'main_image', 'additional_images', 'metadata',
            'tags', 'units_sold', 'edit_allowed', 'is_active',
            'created_at', 'updated_at'
        ]


# Serializer para creación de producto por vendedor/admin
class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'price', 'stock',
            'category', 'main_image', 'additional_images',
            'metadata', 'tags', 'units_sold'
        ]
        read_only_fields = ['id', 'units_sold']

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a 0.")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("El stock no puede ser negativo.")
        return value

    def validate(self, attrs):
        request = self.context['request']
        tags = request.data.get('tags')
        if tags:
            try:
                if isinstance(tags, list):
                    attrs['tags'] = tags
                elif isinstance(tags, str):
                    attrs['tags'] = json.loads(tags)
                else:
                    attrs['tags'] = []
            except Exception:
                raise serializers.ValidationError({"tags": "Formato inválido"})

        # Validación de 1 a 5 imágenes en total
        # main_image siempre cuenta como 1 (es required por el modelo)
        additional = attrs.get('additional_images', [])
        if not isinstance(additional, list):
            raise serializers.ValidationError({"additional_images": "Debe ser una lista de URLs."})

        # main_image (1) + additional_images (n) <= 5
        if 1 + len(additional) > 5:
            raise serializers.ValidationError("Un producto no puede tener más de 5 imágenes en total.")

        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        return Product.objects.create(
            seller=user,
            **validated_data
        )


# Serializer para actualización de producto
class ProductUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'title', 'description', 'price', 'stock',
            'category', 'main_image', 'additional_images',
            'metadata', 'tags'
        ]

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a 0.")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("El stock no puede ser negativo.")
        return value

    def validate(self, attrs):
        # Solo verificamos límite si viene additional_images o main_image en la actualización
        if 'additional_images' in attrs or 'main_image' in attrs:
            current_add = attrs.get('additional_images', self.instance.additional_images)
            if not isinstance(current_add, list):
                raise serializers.ValidationError({"additional_images": "Debe ser una lista."})
            if 1 + len(current_add) > 5:
                raise serializers.ValidationError("No puede exceder las 5 imágenes en total.")

        return attrs

    def update(self, instance, validated_data):
        # Si hay unidades vendidas > 0, solo el stock es mutable.
        # Filtramos silenciosamente el resto en lugar de rechazar,
        # para tolerar payloads completos enviados desde el frontend.
        if getattr(instance, 'units_sold', 0) > 0:
            stock_value = validated_data.get('stock')
            if stock_value is None:
                raise serializers.ValidationError(
                    "El producto ya tiene ventas. Solo puedes actualizar el stock."
                )
            validated_data = {'stock': stock_value}

        return super().update(instance, validated_data)