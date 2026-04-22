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
    """
    Vista para manejar el registro de nuevos usuarios en el sistema.

    Procesa la creación del usuario y retorna los tokens de acceso junto con la información
    básica del usuario recién creado.

    Args:
        request (Request): La solicitud HTTP POST con los datos de registro (email, password, etc.).
        *args: Argumentos posicionales adicionales.
        **kwargs: Argumentos de palabras clave adicionales.

    Returns:
        Response: Un objeto JSON que contiene el access token, refresh token y los datos del usuario.
    """
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        """
        Procesa la creación de un nuevo usuario.

        Args:
            request (Request): Petición POST.
            *args: Argumentos posicionales.
            **kwargs: Argumentos de palabra clave.

        Returns:
            Response: Tokens y datos del usuario.
        """
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
    """
    Vista para manejar la autenticación de usuarios y generación de tokens JWT.

    Extiende la vista TokenObtainPairView de SimpleJWT para incluir en la 
    respuesta los datos del usuario autenticado junto a los tokens generados.

    Args:
        request (Request): La solicitud HTTP POST con credenciales (email y password).
        *args: Argumentos posicionales adicionales.
        **kwargs: Argumentos de palabras clave adicionales.

    Returns:
        Response: Un objeto JSON que contiene el access token, refresh token y los datos del usuario.
    """
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
    """
    Vista para cerrar sesión invalidando el refresh token del usuario.

    Args:
        request (Request): La solicitud HTTP POST que contiene el 'refresh' token en el body.
        *args: Argumentos posicionales adicionales.
        **kwargs: Argumentos de palabras clave adicionales.

    Returns:
        Response: Estado HTTP 200 si el token fue invalidado con éxito, o estado HTTP 400 si hubo un error.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Invalida el token de refresco provisto, cerrando así la sesión.

        Args:
            request (Request): Petición POST con el campo 'refresh'.

        Returns:
            Response: Estado HTTP según éxito o fallo.
        """
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
    """
    Vista para consultar o actualizar el perfil del usuario actualmente autenticado.

    Args:
        request (Request): La solicitud HTTP GET, PUT o PATCH.
        *args: Argumentos posicionales adicionales.
        **kwargs: Argumentos de palabras clave adicionales.

    Returns:
        Response: Los datos serializados del perfil del usuario.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """
        Devuelve el usuario actual que está realizando la petición.

        Args:
            None

        Returns:
            CustomUser: El objeto del usuario autenticado.
        """
        return self.request.user


# ADMIN: LISTA DE USUARIOS
class UserListView(generics.ListAPIView):
    """
    Vista exclusiva de administradores para listar todos los usuarios del sistema.

    Args:
        request (Request): La solicitud HTTP GET.
        *args: Argumentos posicionales adicionales.
        **kwargs: Argumentos de palabras clave adicionales.

    Returns:
        Response: Lista de todos los usuarios registrados en el sistema.
    """
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserListSerializer
    permission_classes = [IsAdmin]


# ADMIN: DETALLE / EDICIÓN / ELIMINACIÓN DE USUARIO
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista exclusiva de administradores para ver, editar o eliminar un usuario específico.

    Evita que un administrador se elimine a sí mismo accidentalmente.

    Args:
        request (Request): La solicitud HTTP entrante (GET, PUT, PATCH, DELETE).
        *args: Argumentos posicionales adicionales.
        **kwargs: Argumentos de palabras clave adicionales (debe incluir 'pk' o 'id' del usuario).

    Returns:
        Response: Datos del usuario (en GET/PUT/PATCH) o estado 204 (en DELETE).
    """
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdmin]

    def perform_destroy(self, instance):
        """
        Elimina el usuario especificado, validando que el administrador no se elimine a sí mismo.

        Args:
            instance (CustomUser): El usuario a eliminar.

        Raises:
            PermissionDenied: Si el admin intenta eliminarse.
        """
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
    """
    Vista exclusiva de administradores para dar de alta a un usuario con rol de Vendedor.

    Crea el usuario con una contraseña inutilizable y genera un token de activación 
    para que el vendedor asigne su contraseña real.

    Args:
        request (Request): La solicitud HTTP POST con los datos del nuevo vendedor.
        *args: Argumentos posicionales adicionales.
        **kwargs: Argumentos de palabras clave adicionales.

    Returns:
        Response: Los datos del usuario creado y el token de activación.
    """
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdmin]

    def create(self, request, *args, **kwargs):
        """
        Crea el registro de un vendedor nuevo.

        Args:
            request (Request): La petición HTTP con los datos iniciales.

        Returns:
            Response: Los datos del usuario y el token de activación.
        """
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
    """
    ViewSet para manejar el CRUD completo de las direcciones de envío del usuario autenticado.
    
    Filtra siempre las direcciones para asegurar que pertenezcan únicamente al usuario que
    hace la petición, previniendo vulnerabilidades IDOR.

    Args:
        request (Request): La solicitud HTTP correspondiente a la acción (list, create, retrieve, update, destroy).
        *args: Argumentos posicionales adicionales.
        **kwargs: Argumentos de palabras clave adicionales.

    Returns:
        Response: Dependiendo de la acción, una lista de direcciones, una dirección, o una confirmación de borrado.
    """
    # CRUD completo de direcciones de envío del usuario autenticado.
    # Filtra siempre por user=request.user para prevenir IDOR.

    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filtra las direcciones para mostrar solo las del usuario actual.

        Returns:
            QuerySet: Direcciones del usuario autenticado.
        """
        return self.request.user.addresses.all()

    def create(self, request, *args, **kwargs):
        """
        Procesa la creación de una nueva dirección, soportando descifrado de payload si aplica.

        Args:
            request (Request): La petición HTTP POST.

        Returns:
            Response: La dirección serializada recién creada.
        """
        data = request.data.copy()

        # SOLO si viene cifrado este endpoint
        if "payload" in data:
            data = decrypt_payload(data["payload"])

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=201)

    def perform_create(self, serializer):
        """
        Asigna la dirección al usuario autenticado antes de guardar.

        Args:
            serializer (AddressSerializer): El serializador con datos validados.
        """
        address = serializer.save(user=self.request.user)
        logger.info(f"[AddressViewSet] Address created: id={address.id}, user_id={self.request.user.id}")

    def perform_destroy(self, instance):
        """
        Elimina la dirección indicada y registra el evento.

        Args:
            instance (Address): La dirección a borrar.
        """
        logger.info(f"[AddressViewSet] Address deleted: id={instance.id}, user_id={self.request.user.id}")
        instance.delete()