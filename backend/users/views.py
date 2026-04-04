from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .serializers import (
    AddressSerializer,
    UserRegisterSerializer,
    UserProfileSerializer,
    UserListSerializer,
    UserAdminSerializer,
)
from core.permissions import IsAdmin
from django.utils.crypto import get_random_string
from rest_framework.exceptions import PermissionDenied

User = get_user_model()


# REGISTER
class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role,
                },
            },
            status=status.HTTP_201_CREATED,
        )


# LOGIN
class LoginView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Solo adjuntar datos del usuario si la autenticación fue exitosa
        if response.status_code == status.HTTP_200_OK and "access" in response.data:
            email = request.data.get("email")
            user = User.objects.filter(email__iexact=email).first()

            if user:
                response.data["user"] = {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role,
                }

        return response


# LOGOUT
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {"detail": "Invalid token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"detail": "Logout successful."},
            status=status.HTTP_200_OK,
        )


# USER ME
class UserMeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# ADMIN: USER LIST
class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserListSerializer
    permission_classes = [IsAdmin]


# ADMIN: USER DETAIL
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdmin]

    def perform_destroy(self, instance):
        if instance == self.request.user:
            raise PermissionDenied("Un administrador no puede eliminarse a sí mismo.")
        instance.delete()


# ADMIN: CREATE VENDOR
class CreateVendorView(generics.CreateAPIView):
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdmin]

    def create(self, request, *args, **kwargs):
        # Asignar rol y una contraseña inicial no utilizable; el vendedor establecerá su propia contraseña
        # mediante el token de activación de un solo uso que se devuelve a continuación.
        data = request.data.copy()
        data["role"] = User.Role.VENDEDOR
        # Provide a random value to pass serializer password validation;
        # the account is immediately set to an unusable password below.
        data["password"] = get_random_string(length=20)
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user.set_unusable_password()
        user.save(update_fields=["password"])

        # Generar token de activación de un solo uso para que el vendedor establezca su contraseña
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        return Response(
            {
                "detail": "Vendedor creado exitosamente. Comparta el token de activación con el usuario para que establezca su contraseña.",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role,
                },
                "activation": {
                    "uid": uid,
                    "token": token,
                },
            },
            status=status.HTTP_201_CREATED,
        )


# ADDRESS CRUD
class AddressViewSet(viewsets.ModelViewSet):
    """CRUD completo de direcciones de envío del usuario autenticado.

    Filtra siempre por user=request.user para prevenir IDOR.
    """

    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.addresses.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)