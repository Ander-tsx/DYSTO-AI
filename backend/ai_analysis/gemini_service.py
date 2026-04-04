import google.generativeai as genai
import json
import re
import requests
from django.conf import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

def analyze_product_image(image_url: str) -> dict:
    try:
        model = genai.GenerativeModel(
            "gemini-2.5-flash",
            generation_config={"response_mime_type": "application/json"},
        )

        # Descargar la imagen desde la URL de Cloudinary
        img_response = requests.get(image_url, timeout=15)
        img_response.raise_for_status()

        # Detectar el mime type
        content_type = img_response.headers.get("Content-Type", "image/jpeg")

        # Crear el objeto imagen para Gemini
        image_part = {
            "mime_type": content_type,
            "data": img_response.content,
        }

        prompt = """
        Analiza esta imagen de producto.

        Responde SOLO en JSON válido con esta estructura:
        {
            "titulo": "",
            "categoria": "",
            "precio_sugerido": 0,
            "descripcion": "",
            "tags": [],
            "es_objeto_valido": true
        }
        """

        response = model.generate_content([prompt, image_part])

        text = response.text.strip()

        # Limpiar posibles bloques de código markdown
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)

        data = json.loads(text)

        return data

    except Exception as e:
        return {
            "error": True,
            "message": str(e),
        }