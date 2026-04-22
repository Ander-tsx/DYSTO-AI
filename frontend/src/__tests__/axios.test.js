import api, { setupInterceptors } from '@/lib/axios';

describe('lib/axios', () => {
    test('api es una instancia de axios con baseURL configurada', () => {
        expect(api).toBeDefined();
        expect(api.defaults).toBeDefined();
        expect(api.defaults.baseURL).toBe('http://localhost:8000/api');
        expect(api.defaults.headers['Content-Type']).toBe('application/json');
    });

    test('setupInterceptors es una función exportada', () => {
        expect(typeof setupInterceptors).toBe('function');
    });

    test('setupInterceptors registra interceptores sin errores', () => {
        const getAccessToken = jest.fn(() => 'test-token');
        const handleTokenRefresh = jest.fn();
        const handleLogout = jest.fn();

        // No debe lanzar error
        expect(() => {
            setupInterceptors(getAccessToken, handleTokenRefresh, handleLogout);
        }).not.toThrow();
    });

    test('request interceptor agrega Authorization header cuando hay token', async () => {
        const getAccessToken = jest.fn(() => 'my-access-token');
        const handleTokenRefresh = jest.fn();
        const handleLogout = jest.fn();

        setupInterceptors(getAccessToken, handleTokenRefresh, handleLogout);

        // Verificar que los interceptores de solicitud están registrados
        const requestInterceptors = api.interceptors.request.handlers;
        expect(requestInterceptors.length).toBeGreaterThan(0);

        // Simular una configuración de request
        const lastInterceptor = requestInterceptors[requestInterceptors.length - 1];
        const config = { headers: {} };
        const result = lastInterceptor.fulfilled(config);
        expect(result.headers.Authorization).toBe('Bearer my-access-token');
    });

    test('request interceptor no agrega header cuando no hay token', async () => {
        const getAccessToken = jest.fn(() => null);
        const handleTokenRefresh = jest.fn();
        const handleLogout = jest.fn();

        setupInterceptors(getAccessToken, handleTokenRefresh, handleLogout);

        const requestInterceptors = api.interceptors.request.handlers;
        const lastInterceptor = requestInterceptors[requestInterceptors.length - 1];
        const config = { headers: {} };
        const result = lastInterceptor.fulfilled(config);
        expect(result.headers.Authorization).toBeUndefined();
    });

    test('response interceptor pasa respuestas exitosas', async () => {
        const getAccessToken = jest.fn(() => 'token');
        const handleTokenRefresh = jest.fn();
        const handleLogout = jest.fn();

        setupInterceptors(getAccessToken, handleTokenRefresh, handleLogout);

        const responseInterceptors = api.interceptors.response.handlers;
        const lastInterceptor = responseInterceptors[responseInterceptors.length - 1];
        const response = { data: 'ok', status: 200 };
        const result = lastInterceptor.fulfilled(response);
        expect(result).toEqual(response);
    });

    test('response interceptor rechaza errores no-401', async () => {
        const getAccessToken = jest.fn(() => 'token');
        const handleTokenRefresh = jest.fn();
        const handleLogout = jest.fn();

        setupInterceptors(getAccessToken, handleTokenRefresh, handleLogout);

        const responseInterceptors = api.interceptors.response.handlers;
        const lastInterceptor = responseInterceptors[responseInterceptors.length - 1];

        const error = {
            config: { url: '/products/' },
            response: { status: 500 },
        };

        await expect(lastInterceptor.rejected(error)).rejects.toEqual(error);
    });

    test('response interceptor no reintenta en endpoints de auth', async () => {
        const getAccessToken = jest.fn(() => 'token');
        const handleTokenRefresh = jest.fn();
        const handleLogout = jest.fn();

        setupInterceptors(getAccessToken, handleTokenRefresh, handleLogout);

        const responseInterceptors = api.interceptors.response.handlers;
        const lastInterceptor = responseInterceptors[responseInterceptors.length - 1];

        const loginError = {
            config: { url: '/auth/login' },
            response: { status: 401 },
        };

        await expect(lastInterceptor.rejected(loginError)).rejects.toEqual(loginError);

        const refreshError = {
            config: { url: '/auth/refresh/' },
            response: { status: 401 },
        };

        await expect(lastInterceptor.rejected(refreshError)).rejects.toEqual(refreshError);
    });

    test('response interceptor intenta refresh en 401', async () => {
        const getAccessToken = jest.fn(() => 'expired-token');
        const handleTokenRefresh = jest.fn().mockResolvedValue('new-token');
        const handleLogout = jest.fn();

        setupInterceptors(getAccessToken, handleTokenRefresh, handleLogout);

        const responseInterceptors = api.interceptors.response.handlers;
        const lastInterceptor = responseInterceptors[responseInterceptors.length - 1];

        const error401 = {
            config: { url: '/products/', headers: {}, _retry: false },
            response: { status: 401 },
        };

        // El interceptor intentará hacer refresh y luego reintentar.
        // Como api() se mockeará implícitamente, solo verificamos que se llame a handleTokenRefresh.
        try {
            await lastInterceptor.rejected(error401);
        } catch {
            // puede fallar porque api(originalRequest) no es una solicitud real
        }

        expect(handleTokenRefresh).toHaveBeenCalled();
    });

    test('response interceptor hace logout cuando refresh falla', async () => {
        const getAccessToken = jest.fn(() => 'expired-token');
        const handleTokenRefresh = jest.fn().mockRejectedValue(new Error('Refresh failed'));
        const handleLogout = jest.fn();

        setupInterceptors(getAccessToken, handleTokenRefresh, handleLogout);

        const responseInterceptors = api.interceptors.response.handlers;
        const lastInterceptor = responseInterceptors[responseInterceptors.length - 1];

        const error401 = {
            config: { url: '/products/', headers: {}, _retry: false },
            response: { status: 401 },
        };

        await expect(lastInterceptor.rejected(error401)).rejects.toThrow('Refresh failed');
        expect(handleLogout).toHaveBeenCalled();
    });
});
