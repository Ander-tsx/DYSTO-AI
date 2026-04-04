from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AddressViewSet,
    RegisterView,
    LoginView,
    LogoutView,
    UserMeView,
    UserListView,
    UserDetailView,
    CreateVendorView,
)

router = DefaultRouter()
router.register('users/addresses', AddressViewSet, basename='address')

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Public / Own user
    path('users/me/', UserMeView.as_view(), name='user_me'),

    # Admin - Users CRUD
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/vendor/', CreateVendorView.as_view(), name='create_vendor'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user_detail'),

    # Address CRUD (router)
    path('', include(router.urls)),
]