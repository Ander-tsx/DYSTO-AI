import os
from datetime import timedelta
from pathlib import Path
from dotenv import load_dotenv
from loguru import logger

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env file
load_dotenv(os.path.join(BASE_DIR, '.env'))

SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'django_filters',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'users',
    'products',
    'carts',
    'orders',
    'ai_analysis',
    'core',
    'logbook',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'logbook.middleware.AuditMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'dystoai.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'dystoai.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': os.environ.get('DB_ENGINE'),
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'users.CustomUser'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'UPDATE_LAST_LOGIN': True,
}

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
]

SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
SECURE_CONTENT_TYPE_NOSNIFF = True

CLOUDINARY_CONFIG = {
    "cloud_name": os.environ.get('CLOUDINARY_CLOUD_NAME'),
    "api_key": os.environ.get('CLOUDINARY_API_KEY'),
    "api_secret": os.environ.get('CLOUDINARY_API_SECRET'),
}

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "ai-analysis-cache",
    }
}

# Disable Django's default logging configuration so Loguru takes full control
LOGGING_CONFIG = None

# Loguru configuration: two separate sinks — debug events and errors
LOGURU_LOGGING = {
    "handlers": [
        {
            # Captures DEBUG-level messages only
            "sink": BASE_DIR / "logs/debug.log",
            "level": "DEBUG",
            "filter": lambda record: record["level"].no <= logger.level("DEBUG").no,
            "format": (
                "{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | "
                "{name}: {function}:{line} - {message}"
            ),
            "rotation": "10 MB",
            "retention": "7 days",
            "compression": "zip",
        },
        {
            # Captures ERROR and CRITICAL messages with full backtrace
            "sink": BASE_DIR / "logs/error.log",
            "level": "ERROR",
            "filter": lambda record: record["level"].no >= logger.level("ERROR").no,
            "format": (
                "{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | "
                "{name}: {function}:{line} - {message}"
            ),
            "rotation": "10 MB",
            "retention": "7 days",
            "compression": "zip",
            "backtrace": True,
            "diagnose": True,
        },
    ]
}

logger.configure(**LOGURU_LOGGING)

# Bridge Python's standard logging (Django, DRF, simplejwt, etc.) into Loguru
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "loguru": {"class": "dystoai.interceptor.InterceptorHandler"}
    },
    "root": {"handlers": ["loguru"], "level": "DEBUG"},
}