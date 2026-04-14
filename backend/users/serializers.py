from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Address, CustomUser


def _validate_password_strength(value):
    # Valida que la contraseña tenga mínimo 8 caracteres y pase las validaciones base de Django
    if len(value) < 8:
        raise serializers.ValidationError(
            "La contraseña debe tener al menos 8 caracteres."
        )
    try:
        validate_password(value)
    except Exception as exc:
        raise serializers.ValidationError(list(exc.messages)) from exc
    return value


class UserRegisterSerializer(serializers.ModelSerializer):
    # Registro público de nuevos usuarios.
    # Valida email único (unicidad reforzada en validate_email).
    # Contraseña mínimo 8 chars; se almacena hasheada con make_password.
    # El rol siempre se fuerza a vendor: todos los usuarios pueden comprar y vender.
    # password es write-only y nunca se devuelve en la respuesta.

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        help_text="Mínimo 8 caracteres.",
    )

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "password",
        ]
        read_only_fields = ["id"]

    def validate_email(self, value):
        # Rechaza emails ya registrados (case-insensitive)
        normalized = value.strip().lower()
        if CustomUser.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError(
                "Este correo electrónico ya está registrado."
            )
        return normalized

    def validate_password(self, value):
        return _validate_password_strength(value)

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        # El rol siempre es vendor: todos los usuarios pueden comprar y vender
        validated_data["role"] = CustomUser.Role.VENDOR
        return super().create(validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    # Edición del perfil por el propio usuario autenticado.
    # Campos editables: first_name, last_name, phone.
    # Campos de solo lectura: id, email, role, avatar_url, created_at.
    # El email no es editable por diseño (es el identificador único).

    role = serializers.CharField(read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "role",
            "avatar_url",
            "created_at",
        ]
        read_only_fields = ["id", "email", "role", "avatar_url", "created_at"]


class UserAdminSerializer(serializers.ModelSerializer):
    # Gestión completa de usuarios por parte del administrador.
    # Todos los campos visibles, incluyendo role editable.
    # password es write-only opcional: si se envía se hashea; si no, se conserva.
    # Solo usar en vistas protegidas con permiso IsAdmin.

    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=False,
        style={"input_type": "password"},
        help_text="Dejar en blanco para conservar la contraseña actual.",
    )

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "role",
            "avatar_url",
            "is_active",
            "created_at",
            "password",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_email(self, value):
        # Rechaza emails duplicados, excluyendo la instancia que se edita
        normalized = value.strip().lower()
        qs = CustomUser.objects.filter(email__iexact=normalized)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                "Este correo electrónico ya está registrado por otro usuario."
            )
        return normalized

    def validate_password(self, value):
        return _validate_password_strength(value)

    def _apply_password(self, validated_data):
        raw_password = validated_data.pop("password", None)
        if raw_password:
            validated_data["password"] = make_password(raw_password)
        return validated_data

    def create(self, validated_data):
        validated_data = self._apply_password(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data = self._apply_password(validated_data)
        return super().update(instance, validated_data)


class UserListSerializer(serializers.ModelSerializer):
    # Versión ligera para tablas/listados en el panel de administración.
    # Solo expone los campos mínimos: id, email, nombre completo, rol y fecha de registro.
    # Read-only total: nunca se usa para escritura.

    full_name = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "full_name",
            "role",
            "is_active",
            "created_at",
        ]
        read_only_fields = fields

    def get_full_name(self, obj):
        # Devuelve el nombre completo; si está vacío, retorna el email
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full if full else obj.email


class AddressSerializer(serializers.ModelSerializer):
    # Serializer para direcciones de envío del usuario.

    class Meta:
        model = Address
        fields = [
            "id",
            "user",
            "street",
            "street_number",
            "city",
            "state",
            "postal_code",
            "is_default",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]
