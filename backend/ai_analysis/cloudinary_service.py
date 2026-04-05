import cloudinary
import cloudinary.uploader
from PIL import Image
from django.conf import settings


# Configurar Cloudinary
cloudinary.config(**settings.CLOUDINARY_CONFIG)


ALLOWED_FORMATS = ["JPEG", "PNG"]
MAX_SIZE_MB = 10


def upload_image(file_obj, folder="products") -> str:
    try:
        # Validar tamaño (bytes → MB)
        file_size_mb = file_obj.size / (1024 * 1024)
        if file_size_mb > MAX_SIZE_MB:
            raise ValueError("File exceeds 10MB limit")

        # Validar tipo real con Pillow
        try:
            image = Image.open(file_obj)
            image_format = image.format
        except Exception:
            raise ValueError("Invalid image file")

        if image_format not in ALLOWED_FORMATS:
            raise ValueError("Only JPEG and PNG are allowed")

        # Resetear puntero (importante)
        file_obj.seek(0)

        # Subir a Cloudinary
        result = cloudinary.uploader.upload(
            file_obj,
            folder=folder
        )

        return result.get("secure_url")

    except Exception as e:
        raise ValueError(f"Image upload failed: {str(e)}")


def delete_image(public_id: str):
    try:
        cloudinary.uploader.destroy(public_id)
    except Exception:
        pass