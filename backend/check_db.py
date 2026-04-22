import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dystoai.settings')
django.setup()

from products.models import Product

p = Product.objects.last()
print("ID:", p.id)
print("Title:", p.title)
print("Main Image:", p.main_image)
print("Additional Images:", p.additional_images)
