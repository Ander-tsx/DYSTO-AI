import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * aqi el setupInterceptors configura el Axios para inyectar  el token en memoria
 * y manejar el refresco de token. se evita importar directamente el AuthContext para no
 * generar dependencias circulares. En cambio, le pasamos funciones callback.
 * 
 * getAccessToken - Retorna el token de acceso actual en memoria.
 * handleTokenRefresh - Intenta obtener y setear un nuevo accessToken.
 * handleLogout - Cierra la sesión forzosamente si algo falla.
 */
export const setupInterceptors = (getAccessToken, handleTokenRefresh, handleLogout) => {

  // Request Interceptor: Inyectar token en la RAM
  api.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => { throw error; }
  );

  // Response Interceptor: Detección 401 y Auto-Refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Si retorna 401 y no se ha reintentado
      if (error.response?.status === 401 && !originalRequest._retry) {

        // Evita reintentar de forma infinita peticiones al endpoint de login/refresh
        if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/refresh/')) {
          throw error;
        }

        if (isRefreshing) {
          // Ya hay un refresh en curso, ponemos la petición en cola
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => {
              throw err;
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Intentar refrescar el token
          const newToken = await handleTokenRefresh();

          if (!newToken) {
            throw new Error("No se obtuvo un nuevo token de acceso.");
          }

          // Procesar las peticiones encoladas
          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);

        } catch (refreshError) {
          // Si falla el refresh, fallan todas las encoladas y hacemos logout
          processQueue(refreshError, null);
          handleLogout();
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }

      throw error;
    }
  );
};

export default api;
