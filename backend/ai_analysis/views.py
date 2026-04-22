from loguru import logger

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from PIL import Image
from django.core.cache import cache

from core.permissions import IsVendorOrAdmin
from .cloudinary_service import upload_image
from .gemini_service import analyze_product_image

ALLOWED_FORMATS = ["JPEG", "PNG"]
MAX_SIZE_MB = 10


class AnalyzeImageView(APIView):
    """
    Vista para procesar y analizar imágenes de productos utilizando inteligencia artificial.

    Recibe una imagen, valida que sea apta mediante la API de Gemini (que no contenga
    personas/animales y corresponda a un producto), y si es válida, la sube a Cloudinary.
    Aplica un límite de tasa (rate limit) de 5 análisis por hora por usuario.

    Args:
        request (Request): La solicitud HTTP POST conteniendo la imagen en 'image'.
        *args: Argumentos posicionales.
        **kwargs: Argumentos de palabras clave.

    Returns:
        Response: La URL de la imagen en Cloudinary y el análisis extraído por Gemini.
    """
    # Recibe una imagen, la valida con Gemini y la sube a Cloudinary si es apta.
    # Rate limit: 10 análisis por hora por usuario.
    permission_classes = [IsVendorOrAdmin]

    def post(self, request):
        """
        Procesa la petición POST con la imagen a analizar.

        Valida formato, tamaño y límite de peticiones antes de enviarla a la API de Gemini.

        Args:
            request (Request): La petición HTTP.

        Returns:
            Response: Resultado del análisis o error de validación.
        """
        user = request.user
        cache_key = f"ai_analysis_{user.id}"

        request_count = cache.get(cache_key, 0)

        if request_count >= 5:
            logger.warning(
                f"[AnalyzeImageView] Rate limit exceeded: user_id={user.id}, "
                f"count={request_count}"
            )
            return Response(
                {"detail": "Límite de análisis excedido (5 análisis por hora)."},
                status=429,
            )

        cache.set(cache_key, request_count + 1, timeout=3600)

        file_obj = request.FILES.get("image")

        if not file_obj:
            logger.warning(f"[AnalyzeImageView] No image provided: user_id={user.id}")
            return Response(
                {"detail": "No se proporcionó ninguna imagen."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validar tamaño (max 10MB)
        file_size_mb = file_obj.size / (1024 * 1024)
        if file_size_mb > MAX_SIZE_MB:
            logger.warning(
                f"[AnalyzeImageView] File too large: {file_size_mb:.2f}MB, "
                f"user_id={user.id}"
            )
            return Response(
                {"detail": f"El archivo excede el límite de {MAX_SIZE_MB}MB."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validar formato real con Pillow (JPG/PNG)
        try:
            img = Image.open(file_obj)
            image_format = img.format
        except Exception as exc:
            logger.warning(
                f"[AnalyzeImageView] Invalid image file: user_id={user.id}, error={exc}"
            )
            return Response(
                {"detail": "El archivo no es una imagen válida."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if image_format not in ALLOWED_FORMATS:
            logger.warning(
                f"[AnalyzeImageView] Unsupported format '{image_format}': user_id={user.id}"
            )
            return Response(
                {"detail": "Solo se permiten imágenes JPG y PNG."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        logger.debug(
            f"[AnalyzeImageView] Sending image to Gemini: format={image_format}, "
            f"size={file_size_mb:.2f}MB, user_id={user.id}"
        )

        # Leer bytes para Gemini
        file_obj.seek(0)
        image_bytes = file_obj.read()
        mime_type = f"image/{image_format.lower()}"

        # Analizar con Gemini (valida contenido + analiza producto en 1 sola llamada)
        analysis = analyze_product_image(image_bytes, mime_type)

        # Si Gemini rechazó la imagen (personas/animales)
        if analysis.get("error"):
            logger.warning(
                f"[AnalyzeImageView] Gemini rejected image: user_id={user.id}, "
                f"reason='{analysis.get('message')}'"
            )
            return Response(
                {"detail": analysis.get("message", "Imagen no permitida.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Subir a Cloudinary solo si pasó la validación
            file_obj.seek(0)
            image_url = upload_image(file_obj)

            logger.info(
                f"[AnalyzeImageView] Image analyzed and uploaded successfully: "
                f"user_id={user.id}, url={image_url}"
            )
            return Response(
                {
                    "image_url": image_url,
                    "analysis": analysis,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as exc:
            logger.error(
                f"[AnalyzeImageView] Cloudinary upload failed: user_id={user.id}, "
                f"error={type(exc).__name__}: {exc}"
            )
            logger.exception(exc)
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )