# Configuración de URLs para el proyecto dystoai.
# Para más información: https://docs.djangoproject.com/en/4.2/topics/http/urls/
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/ai/', include('ai_analysis.urls')),
    path('api/products/', include('products.urls')),
    path('api/carts/', include('carts.urls')),
    path('api/orders/', include('orders.urls')),
]