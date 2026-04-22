from rest_framework import serializers
from .models import Product
from .db_views import ProductPublicListDBView
import json


# Serializer ligero para listados
class ProductListSerializer(serializers.ModelSerializer):
    seller_email = serializers.CharField(source='seller.email', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'price', 'stock',
            'category', 'seller_email',
            'main_image', 'units_sold', 'is_active', 'is_active_admin', 'created_at'
        ]


# Serializer que usa la vista SQL vw_product_public_list
class ProductPublicListViewSerializer(serializers.ModelSerializer):
    """
    Serializer que mapea directamente a la vista SQL vw_product_public_list.

    A diferencia de ProductListSerializer, no necesita resolver el email
    del vendedor mediante un JOIN en Django, ya que la vista SQL lo incluye
    como campo directo.
    """

    class Meta:
        model = ProductPublicListDBView
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
            'tags', 'units_sold', 'edit_allowed', 'is_active', 'is_active_admin',
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

        metadata = request.data.get('metadata')
        if metadata:
            try:
                if isinstance(metadata, dict):
                    attrs['metadata'] = metadata
                elif isinstance(metadata, str):
                    attrs['metadata'] = json.loads(metadata)
            except Exception:
                pass

        # Validación de 1 a 5 imágenes en total
        # main_image siempre cuenta como 1 (es required por el modelo)
        additional = attrs.get('additional_images', [])
        if isinstance(additional, str):
            try:
                additional = json.loads(additional)
                attrs['additional_images'] = additional
            except Exception:
                raise serializers.ValidationError({"additional_images": "Formato inválido"})

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
            'metadata', 'tags', 'is_active_admin'
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

        request = self.context.get('request')
        if request:
            metadata = request.data.get('metadata')
            if metadata:
                try:
                    if isinstance(metadata, dict):
                        attrs['metadata'] = metadata
                    elif isinstance(metadata, str):
                        attrs['metadata'] = json.loads(metadata)
                except Exception:
                    pass

        return attrs

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and request.user.role != 'admin':
            validated_data.pop('is_active_admin', None)

        # Si hay unidades vendidas > 0, solo el stock es mutable.
        # Filtramos silenciosamente el resto en lugar de rechazar,
        # para tolerar payloads completos enviados desde el frontend.
        if getattr(instance, 'units_sold', 0) > 0:
            stock_value = validated_data.get('stock')
            is_active_admin_val = validated_data.get('is_active_admin')
            
            # Allow admin to change is_active_admin even if units_sold > 0
            update_data = {}
            if stock_value is not None:
                update_data['stock'] = stock_value
            if is_active_admin_val is not None and request and request.user.role == 'admin':
                update_data['is_active_admin'] = is_active_admin_val

            if not update_data and stock_value is None:
                raise serializers.ValidationError(
                    "El producto ya tiene ventas. Solo puedes actualizar el stock."
                )
            validated_data = update_data

        return super().update(instance, validated_data)