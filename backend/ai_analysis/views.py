from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .cloudinary_service import upload_image
from .gemini_service import analyze_product_image


class ImageUploadTestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file_obj = request.FILES.get("file")

        if not file_obj:
            return Response(
                {"error": "No file provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            image_url = upload_image(file_obj)
            analysis = analyze_product_image(image_url)

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