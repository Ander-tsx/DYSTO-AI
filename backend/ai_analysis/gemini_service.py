import google.generativeai as genai
import json
import re
from django.conf import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

def analyze_product_image(image_bytes: bytes, mime_type: str) -> dict:
    try:
        model = genai.GenerativeModel(
            "gemini-2.5-flash",
            generation_config={"response_mime_type": "application/json"},
        )

        image_part = {
            "mime_type": mime_type,
            "data": image_bytes,
        }

        prompt = """
        Analiza esta imagen y realiza dos tareas:

        1. Determina si la imagen contiene personas o animales.
        2. Si NO contiene personas ni animales, analiza el producto.

        Responde SOLO en JSON válido con esta estructura:
        {
            "contains_people": false,
            "contains_animals": false,
            "titulo": "",
            "categoria": "",
            "precio_sugerido": 0,
            "descripcion": "",
            "tags": [],
            "es_objeto_valido": true
        }

        Si la imagen contiene personas o animales, deja los campos de producto vacíos
        y marca es_objeto_valido como false.
        """

        response = model.generate_content([prompt, image_part])

        text = response.text.strip()
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)

        data = json.loads(text)

        if data.get("contains_people"):
            return {
                "error": True,
                "message": "La imagen contiene personas, lo cual no está permitido.",
            }
        if data.get("contains_animals"):
            return {
                "error": True,
                "message": "La imagen contiene animales, lo cual no está permitido.",
            }

        data.pop("contains_people", None)
        data.pop("contains_animals", None)

        return data

    except Exception as e:
        return {
            "error": True,
            "message": str(e),
        }