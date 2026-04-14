import threading

# Thread-local storage para almacenar el request actual
# de forma segura entre hilos concurrentes.
_thread_locals = threading.local()


def get_current_user():
    """Obtiene el usuario del request actual de forma lazy.

    Con JWT (SimpleJWT), request.user NO está disponible durante el middleware
    porque DRF lo autentica después, durante el dispatch de la vista.
    Por eso almacenamos el request completo y resolvemos el usuario aquí,
    cuando el signal realmente lo necesita (ya autenticado por DRF).
    """
    request = getattr(_thread_locals, 'request', None)
    if request is not None:
        return getattr(request, 'user', None)
    return None


def get_current_ip():
    """Obtiene la IP del request actual desde el almacenamiento thread-local."""
    return getattr(_thread_locals, 'ip', None)


class AuditMiddleware:
    """Middleware que almacena la referencia al request y la dirección IP
    de cada petición HTTP en thread-local storage para que los signals
    de auditoría puedan acceder a ellos."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Almacenar la referencia al request para resolver el usuario lazy
        _thread_locals.request = request

        # Capturar la IP real del cliente, considerando proxies
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            _thread_locals.ip = x_forwarded_for.split(',')[0].strip()
        else:
            _thread_locals.ip = request.META.get('REMOTE_ADDR')

        response = self.get_response(request)

        # Limpiar thread-locals después de procesada la petición
        _thread_locals.request = None
        _thread_locals.ip = None

        return response
