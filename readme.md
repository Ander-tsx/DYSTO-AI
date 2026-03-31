# DystoAI

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

### `fix/*`

- Corrección de errores en `develop`

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

# Instalación Rápida

## Backend

```bash
cd backend
# Crear entorno virtual (venv)
# Instalar requirements.txt
# Ejecutar servidor
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```
