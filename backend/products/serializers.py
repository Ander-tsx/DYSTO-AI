from rest_framework import serializers
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProductPublicSerializer(serializers.ModelSerializer):
    # Campos calculados para facilitarle la vida al frontend
    category_name = serializers.CharField(source='category.name', read_only=True)
    seller_email = serializers.CharField(source='seller.email', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'price', 'stock', 
            'category', 'category_name', 'seller_email', 
            'main_image', 'additional_images', 'metadata', 
            'created_at'
        ]