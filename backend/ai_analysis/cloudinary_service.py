import cloudinary
import cloudinary.uploader
from PIL import Image
from django.conf import settings

# Configurar Cloudinary con las credenciales del settings
cloudinary.config(**settings.CLOUDINARY_CONFIG)

ALLOWED_FORMATS = ["JPEG", "PNG"]
MAX_SIZE_MB = 10


def upload_image(file_obj, folder="products"):
    # Valida y sube una imagen a Cloudinary. Retorna la URL segura del archivo subido.
    try:
        # Validar tamaño (bytes → MB)
        file_size_mb = file_obj.size / (1024 * 1024)
        if file_size_mb > MAX_SIZE_MB:
            raise ValueError("El archivo excede el límite de 10MB.")

        # Validar tipo real con Pillow
        try:
            image = Image.open(file_obj)
            image_format = image.format
        except Exception:
            raise ValueError("El archivo no es una imagen válida.")

        if image_format not in ALLOWED_FORMATS:
            raise ValueError("Solo se permiten imágenes JPG y PNG.")

        # Resetear puntero antes de subir (importante)
        file_obj.seek(0)

        # Subir a Cloudinary
        result = cloudinary.uploader.upload(
            file_obj,
            folder=folder,
        )

        return result.get("secure_url")

    except Exception as e:
        raise ValueError(f"Error al subir la imagen: {str(e)}")


def delete_image(public_id):
    # Elimina una imagen de Cloudinary por su public_id.
    try:
        cloudinary.uploader.destroy(public_id)
    except Exception:
        pass