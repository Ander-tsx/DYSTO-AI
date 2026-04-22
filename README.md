# DystoAI

---
---

# Instalación desde Cero

## 1. Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu sistema:
- **Python 3.x**: (Recomendado 3.10 o superior)
- **Node.js**: (Recomendado versión 18 o superior)
- **MySQL**: Servidor de base de datos relacional.

---

## 2. Configuración del Backend

### Creación y activación de entorno virtual

Navega a la carpeta del backend y crea un entorno virtual:

```bash
cd backend
python -m venv venv
```

Activa el entorno virtual:
- **Windows**:
  ```bash
  .\venv\Scripts\activate
  ```
- **macOS/Linux**:
  ```bash
  source venv/bin/activate
  ```

### Instalación de dependencias

Con el entorno virtual activado, instala las librerías necesarias:

```bash
pip install -r requirements.txt
```

### Configuración de la Base de Datos Local

1. Inicia tu servidor MySQL.
2. Crea una base de datos local para el proyecto. Puedes hacerlo desde la terminal de MySQL o utilizando un cliente visual (ej. DBeaver, MySQL Workbench):
   ```sql
   CREATE DATABASE dystoai;
   ```
3. Configura el archivo `.env`. Crea un archivo `.env` en la carpeta `backend/` basándote en un archivo de ejemplo `.env.example` y asegúrate de configurar las credenciales de tu base de datos local:
   ```env
    ALLOWED_HOSTS=*
    DEBUG=True
    CLOUDINARY_CLOUD_NAME=<tu_clave>
    CLOUDINARY_API_KEY=<tu_clave>
    CLOUDINARY_API_SECRET=<tu_clave>
    GEMINI_API_KEY=<tu_clave>
    CORS_ALLOWED_ORIGINS=http://localhost:3000
    
    
    DB_ENGINE=django.db.backends.mysql
    DB_NAME=dystoai
    DB_USER=root
    DB_PASSWORD=<tu_clave>
    DB_HOST=127.0.0.1
    DB_PORT=3306
    SECRET_KEY="django-insecure-h&=m=ws86q5a#5juz)9t)8k^8=kwg4u61dilzuenu&13#(zd^j"
    FIELD_ENCRYPTION_KEY=7rWjaMhWQAUZnkLV12cHbhHsavR15KKKLQxJf5FtNJM=
   ```

### Migraciones y Ejecución

Ejecuta las migraciones para crear las tablas en tu base de datos:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Población de la Base de Datos (Que incluyen usuarios demo)

Para facilitar las pruebas, puedes poblar la base de datos con información y usuarios preconfigurados ejecutando el script SQL que se encuentra en `backend/01_inserts_poblacion.sql`. 

Puedes importarlo a tu base de datos `dystoai` desde tu cliente MySQL (ej. DBeaver, MySQL Workbench) o vía terminal (estando dentro de la carpeta `backend`):

```bash
mysql -u root -p dystoai < 01_inserts_poblacion.sql
```

**Usuarios de prueba incluidos en el script:**

- **Administrador:**
  - **Email:** `admin@dysto.ai`
  - **Contraseña:** `DystoDemo2026!`

- **Vendedores (10 cuentas):**
  - **Email:** `vendor01@dysto.ai` hasta `vendor10@dysto.ai`
  - **Contraseña:** `DystoDemo2026!`

Finalmente, levanta el servidor de desarrollo:
```bash
python manage.py runserver
```

---

## 3. Configuración del Frontend

1. Navega a la carpeta del frontend e instala las dependencias:
   ```bash
   cd frontend
   npm install
   ```

2. Configura las variables de entorno:
   Crea un archivo `.env.local` en la carpeta `frontend/` basándote en el archivo `.env.local.example` y asegúrate de que apunte a la API de tu backend local:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_FIELD_KEY=7rWjaMhWQAUZnkLV12cHbhHsavR15KKKLQxJf5FtNJM=
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---
---

# Arquitectura de Ramas (Git Flow)

Seguimos un flujo de trabajo profesional para garantizar estabilidad en producción.

## Ramas Principales

### `main`

- Código en producción
- Rama protegida
- No se permite push directo
- Solo recibe cambios desde `develop` mediante Pull Request

> [!WARNING]
> Nunca hagas push directo a `main`. Todo cambio debe pasar por revisión mediante Pull Request.

---

### `develop`

- Rama de integración
- Aquí se combinan todas las nuevas funcionalidades antes de producción

> [!NOTE]
> Esta rama siempre debe estar estable antes de promover cambios a `main`.

---

## Ramas de Trabajo (Temporales)

### `feat/*`

- Nuevas características
- Siempre se crean desde `develop`

> [!NOTE]
> `develop` contiene el código más actualizado. Crear ramas desde `main` puede causar conflictos al integrar.

---

### `hotfix/*`

- Errores críticos en producción (`main`)
- Pueden:
  - Fusionarse directo a `main`
  - Luego integrarse a `develop`

> [!IMPORTANT]
> Los `hotfix` son casos excepcionales y deben usarse únicamente para errores críticos en producción.

---

# Flujo de Trabajo

Sigue estos pasos en cada tarea:

## 1. Sincronizar

```bash
git checkout develop
git pull origin develop
```

## 2. Crear rama

```bash
git checkout -b feat/nombre-de-la-tarea
```

## 3. Desarrollar

Realiza cambios en:

- `/backend`
- `/frontend`

---

## 4. Commit

```bash
git add .
git commit -m "[FEAT]: descripción breve y clara"
```

### Convención de commits

| Tipo     | Uso                         | Ejemplo                              |
|----------|----------------------------|--------------------------------------|
| `[FEAT]` | Nueva funcionalidad        | `[FEAT]: add login endpoint`         |
| `[FIX]`  | Corrección de errores      | `[FIX]: resolve navbar bug`          |
| `[DOCS]` | Documentación              | `[DOCS]: update README`              |
| `[REFACTOR]` | Mejora sin cambiar lógica | `[REFACTOR]: clean services layer`   |

---

## 5. Push

```bash
git push -u origin feat/nombre-de-la-tarea
```

---

# Proceso de Pull Requests (PR)

> [!WARNING]
> Nunca se fusiona código localmente entre ramas. Todo debe pasar por GitHub mediante Pull Requests.

---

## Fase 1: Integración (`feat/*` → `develop`)

1. Abre un PR en GitHub

2. Configuración:

```
Base: develop
Compare: feat/tu-rama
```

3. Describe los cambios realizados

4. Espera aprobación y realiza el merge

---

## Fase 2: Producción (`develop` → `main`)

1. Crear PR:

```
Base: main
Compare: develop
```

2. Tras el merge:
   - Se actualiza producción

> [!IMPORTANT]
> Solo se debe promover a `main` cuando `develop` esté completamente estable.

---