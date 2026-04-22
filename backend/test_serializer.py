import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dystoai.settings')
django.setup()

from django.http import QueryDict
from products.serializers import ProductCreateSerializer

q = QueryDict(mutable=True)
q['title'] = 'Test'
q['price'] = '10'
q['stock'] = '1'
q['category'] = 'Test'
q['main_image'] = 'http://test.com'
q['additional_images'] = '["http://url1.com"]'

class MockContext:
    def __init__(self):
        class MockRequest:
            def __init__(self):
                self.data = q
        self.request = MockRequest()

s = ProductCreateSerializer(data=q, context={'request': MockContext().request})
print("Is valid:", s.is_valid())
if not s.is_valid():
    print("Errors:", s.errors)
else:
    print("Validated data:", s.validated_data)
