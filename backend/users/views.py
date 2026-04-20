from loguru import logger

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
from django.utils.crypto import get_random_string
from rest_framework.exceptions import PermissionDenied
from utils.encryption import decrypt_payload

from .serializers import (
    AddressSerializer,
    UserRegisterSerializer,
    UserProfileSerializer,
    UserListSerializer,
    UserAdminSerializer,
)
from core.permissions import IsAdmin

User = get_user_model()


# REGISTRO
class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        email = request.data.get("email", "N/A")
        logger.debug(f"[RegisterView] Registration attempt: email={email}")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generar tokens JWT para el nuevo usuario
        refresh = RefreshToken.for_user(user)

        logger.info(f"[RegisterView] User registered successfully: id={user.id}, email={user.email}")
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
        email = request.data.get("email", "N/A")
        logger.debug(f"[LoginView] Login attempt: email={email}")

        response = super().post(request, *args, **kwargs)

        # Solo adjuntar datos del usuario si la autenticación fue exitosa
        if response.status_code == status.HTTP_200_OK and "access" in response.data:
            user = User.objects.filter(email__iexact=email).first()

            if user:
                response.data["user"] = {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role,
                }
                logger.info(f"[LoginView] Login successful: id={user.id}, email={user.email}")
        else:
            logger.warning(f"[LoginView] Failed login attempt: email={email}")

        return response


# LOGOUT
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            logger.warning(f"[LogoutView] Logout failed — refresh token not provided: user_id={request.user.id}")
            return Response(
                {"detail": "El token de refresco es requerido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            logger.warning(f"[LogoutView] Invalid refresh token provided: user_id={request.user.id}")
            return Response(
                {"detail": "El token proporcionado es inválido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        logger.info(f"[LogoutView] Session closed: user_id={request.user.id}")
        return Response(
            {"detail": "Sesión cerrada correctamente."},
            status=status.HTTP_200_OK,
        )


# PERFIL DEL USUARIO AUTENTICADO
class UserMeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# ADMIN: LISTA DE USUARIOS
class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserListSerializer
    permission_classes = [IsAdmin]


# ADMIN: DETALLE / EDICIÓN / ELIMINACIÓN DE USUARIO
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdmin]

    def perform_destroy(self, instance):
        if instance == self.request.user:
            logger.warning(
                f"[UserDetailView] Admin attempted self-deletion: admin_id={self.request.user.id}"
            )
            raise PermissionDenied("Un administrador no puede eliminarse a sí mismo.")

        logger.info(
            f"[UserDetailView] User deleted by admin: target_id={instance.id}, "
            f"target_email={instance.email}, admin_id={self.request.user.id}"
        )
        instance.delete()


# ADMIN: CREAR VENDEDOR
class CreateVendorView(generics.CreateAPIView):
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdmin]

    def create(self, request, *args, **kwargs):
        logger.debug(f"[CreateVendorView] Admin creating vendor: admin_id={request.user.id}")

        # Asignar rol vendor y una contraseña aleatoria no utilizable;
        # el vendedor establecerá su propia contraseña via el token de activación.
        data = request.data.copy()
        data["role"] = User.Role.VENDOR
        # Se provee un valor aleatorio para pasar la validación del serializer;
        # inmediatamente después se marca como contraseña no utilizable.
        data["password"] = get_random_string(length=20)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user.set_unusable_password()
        user.save(update_fields=["password"])

        # Generar token de activación de un solo uso para que el vendedor establezca su contraseña
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        logger.info(
            f"[CreateVendorView] Vendor created: id={user.id}, email={user.email}, "
            f"created_by=admin_id={request.user.id}"
        )
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


# CRUD DE DIRECCIONES DEL USUARIO AUTENTICADO
class AddressViewSet(viewsets.ModelViewSet):
    # CRUD completo de direcciones de envío del usuario autenticado.
    # Filtra siempre por user=request.user para prevenir IDOR.

    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.addresses.all()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        # SOLO si viene cifrado este endpoint
        if "payload" in data:
            data = decrypt_payload(data["payload"])

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=201)

    def perform_create(self, serializer):
        address = serializer.save(user=self.request.user)
        logger.info(f"[AddressViewSet] Address created: id={address.id}, user_id={self.request.user.id}")

    def perform_destroy(self, instance):
        logger.info(f"[AddressViewSet] Address deleted: id={instance.id}, user_id={self.request.user.id}")
        instance.delete()