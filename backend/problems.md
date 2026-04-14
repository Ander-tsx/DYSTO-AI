# Problems — Cambios del Backend que Requieren Corrección en el Frontend

> Generado durante la refactorización al Estándar Oficial.
> Estos cambios **ya están aplicados en el backend**. El frontend debe actualizarse manualmente para cada ítem.

---

## 1. Campos de Request/Response renombrados al inglés

### 1.1 Carrito — `POST /api/carts/add/` y `PATCH /api/carts/items/<id>/`

El body y la respuesta cambiaron el campo principal:

| Campo anterior (frontend envía) | Campo nuevo (backend espera) |
|---|---|
| `cantidad` | `quantity` |

**Ejemplo previo:**
```json
{ "product_id": 5, "cantidad": 2 }
```
**Ejemplo corregido:**
```json
{ "product_id": 5, "quantity": 2 }
```

La **respuesta** del carrito también refleja el cambio en cada item:
```json
{ "id": 1, "quantity": 2, "subtotal": "100.00", "product": {...} }
```

---

### 1.2 Órdenes — `GET /api/orders/<order_number>/` y `GET /api/orders/`

Los campos de `OrderItem` en la respuesta cambiaron:

| Campo anterior | Campo nuevo |
|---|---|
| `cantidad` | `quantity` |
| `precio_unitario` | `unit_price` |

**Ejemplo de item anterior:**
```json
{ "id": 1, "cantidad": 2, "precio_unitario": "150.00", "product_snapshot": {...} }
```
**Ejemplo corregido:**
```json
{ "id": 1, "quantity": 2, "unit_price": "150.00", "product_snapshot": {...} }
```

---

### 1.3 Direcciones — `GET/POST/PATCH /api/users/addresses/`

Los campos del modelo `Address` cambiaron completamente:

| Campo anterior | Campo nuevo |
|---|---|
| `calle` | `street` |
| `numero` | `street_number` |
| `ciudad` | `city` |
| `estado` | `state` |
| `codigo_postal` | `postal_code` |

**Ejemplo de request/response anterior:**
```json
{
  "calle": "Av. Insurgentes",
  "numero": "123",
  "ciudad": "Cuernavaca",
  "estado": "Morelos",
  "codigo_postal": "62000"
}
```
**Ejemplo corregido:**
```json
{
  "street": "Av. Insurgentes",
  "street_number": "123",
  "city": "Cuernavaca",
  "state": "Morelos",
  "postal_code": "62000"
}
```

---

### 1.4 Checkout — `address_snapshot` en `POST /api/orders/checkout/` y `GET /api/orders/`

El snapshot de dirección dentro de cada pedido ahora usa claves en inglés:

| Clave anterior | Clave nueva |
|---|---|
| `snapshot.calle` | `snapshot.street` |
| `snapshot.numero` | `snapshot.street_number` |
| `snapshot.ciudad` | `snapshot.city` |
| `snapshot.estado` | `snapshot.state` |
| `snapshot.codigo_postal` | `snapshot.postal_code` |

---

## 2. Respuestas de Error — clave `"error"` eliminada

Todos los errores de la API ahora usan la clave `"detail"` (estándar DRF).

### 2.1 `POST /api/ai/analyze/`

Antes, los errores devolvían:
```json
{ "error": "Rate limit excedido (10 análisis por hora)" }
```
Ahora devuelven:
```json
{ "detail": "Límite de análisis excedido (10 análisis por hora)." }
```

**El frontend debe actualizar cualquier condición que acceda a `response.data.error`** en este endpoint para leer `response.data.detail`.

---

## 3. Análisis de IA — claves del objeto `analysis`

### 3.1 `POST /api/ai/analyze/` — campo `analysis` en la respuesta

El prompt de Gemini fue actualizado para devolver claves en inglés dentro del objeto `analysis`:

| Clave anterior | Clave nueva |
|---|---|
| `titulo` | `title` |
| `categoria` | `category` |
| `precio_sugerido` | `suggested_price` |
| `descripcion` | `description` |
| `es_objeto_valido` | `is_valid_object` |

**Ejemplo de respuesta anterior:**
```json
{
  "image_url": "https://...",
  "analysis": {
    "titulo": "Camiseta Azul",
    "categoria": "Ropa",
    "precio_sugerido": 250,
    "descripcion": "Camiseta de algodón...",
    "tags": ["ropa", "camiseta"],
    "es_objeto_valido": true
  }
}
```
**Ejemplo de respuesta corregida:**
```json
{
  "image_url": "https://...",
  "analysis": {
    "title": "Camiseta Azul",
    "category": "Ropa",
    "suggested_price": 250,
    "description": "Camiseta de algodón...",
    "tags": ["ropa", "camiseta"],
    "is_valid_object": true
  }
}
```

---

## 4. Productos — Query Parameters renombrados al inglés

### 4.1 `GET /api/products/` — parámetros de filtro y orden

Los parámetros de búsqueda/filtro del marketplace cambiaron:

| Parámetro anterior | Parámetro nuevo |
|---|---|
| `categoria` | `category` |
| `precio_min` | `min_price` |
| `precio_max` | `max_price` |
| `orden` | `sort` |
| `orden=precio_asc` | `sort=price_asc` |
| `orden=precio_desc` | `sort=price_desc` |

El parámetro `search` no cambió.

**Ejemplo de URL anterior:**
```
GET /api/products/?categoria=Ropa&precio_min=100&precio_max=500&orden=precio_asc
```
**Ejemplo de URL corregida:**
```
GET /api/products/?category=Ropa&min_price=100&max_price=500&sort=price_asc
```

---

## 5. Productos — URL de creación separada

La lógica de enrutamiento del endpoint raíz de productos cambió:

| Acción | URL anterior | URL nueva |
|---|---|---|
| Listar productos (GET) | `GET /api/products/` | `GET /api/products/` ✅ sin cambio |
| Crear producto (POST) | `POST /api/products/` | `POST /api/products/create/` |

El endpoint `POST /api/products/` ya no acepta creaciones. El frontend de vendedores debe actualizar su llamada a `POST /api/products/create/`.

---

## 6. User Role — valores del campo `role`

El campo `role` del usuario cambió sus valores internos en la BD:

| Valor anterior (BD/API) | Valor nuevo (BD/API) |
|---|---|
| `"cliente"` | `"client"` |
| `"vendedor"` | `"vendor"` |
| `"admin"` | `"admin"` ✅ sin cambio |

Cualquier validación en el frontend basada en `user.role === "cliente"` o `user.role === "vendedor"` debe actualizarse a `"client"` / `"vendor"`.

---

## 7. URL Names (solo afecta si el frontend usa `reverse()` o helpers equivalentes)

> Solo relevante si el frontend es un template Django. Si usa fetch/axios con rutas hardcoded no aplica.

| Name anterior | Name nuevo |
|---|---|
| `user_me` | `user-me` |
| `user_list` | `user-list` |
| `create_vendor` | `create-vendor` |
| `user_detail` | `user-detail` |
| `token_refresh` | `token-refresh` |
| `cart_detail` | `cart-detail` |
| `cart_add` | `cart-add` |
| `cart_item_detail` | `cart-item-detail` |
| `order_list` | `order-list` |
| `order_detail` | `order-detail` |
| `analyze_image` | `analyze-image` |
| `product-list-admin` | `product-admin-list` |
| `product-detail-public` | `product-detail` |
| `product-root` | `product-list` (GET) / `product-create` (POST) |
