from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from PIL import Image

from .cloudinary_service import upload_image
from .gemini_service import analyze_product_image

ALLOWED_FORMATS = ["JPEG", "PNG"]
MAX_SIZE_MB = 10

class ImageUploadTestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file_obj = request.FILES.get("file")

        if not file_obj:
            return Response(
                {"error": "No file provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validar tamaño (max 10MB)
        file_size_mb = file_obj.size / (1024 * 1024)
        if file_size_mb > MAX_SIZE_MB:
            return Response(
                {"error": f"El archivo excede el límite de {MAX_SIZE_MB}MB."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validar formato real con Pillow (JPG/PNG)
        try:
            img = Image.open(file_obj)
            image_format = img.format
        except Exception:
            return Response(
                {"error": "El archivo no es una imagen válida."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if image_format not in ALLOWED_FORMATS:
            return Response(
                {"error": "Solo se permiten imágenes JPG y PNG."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Leer bytes para Gemini
        file_obj.seek(0)
        image_bytes = file_obj.read()
        mime_type = f"image/{image_format.lower()}"

        # Analizar con Gemini (valida contenido + analiza producto en 1 sola llamada)
        analysis = analyze_product_image(image_bytes, mime_type)

        # Si Gemini rechazó la imagen (personas/animales)
        if analysis.get("error"):
            return Response(
                {"error": analysis.get("message", "Imagen no permitida.")},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Subir a Cloudinary solo si pasó la validación
            file_obj.seek(0)
            image_url = upload_image(file_obj)

            return Response(
                {
                    "image_url": image_url,
                    "analysis": analysis
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )