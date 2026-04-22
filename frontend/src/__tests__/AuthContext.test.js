import { render, screen, act, waitFor } from '@testing-library/react';
import React from 'react';

// ── Mocks ──────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

const mockApiPost = jest.fn();

jest.mock('@/lib/axios', () => {
    const instance = {
        post: (...args) => mockApiPost(...args),
        defaults: { headers: {} },
    };
    return {
        __esModule: true,
        default: instance,
        setupInterceptors: jest.fn(),
    };
});

// ── Import after mocks ────────────────────────────────────────────────────────

import { AuthProvider, useAuth } from '@/context/AuthContext';

// Helper consumer to expose context values
function AuthConsumer() {
    const auth = useAuth();
    return (
        <div>
            <span data-testid="authenticated">{String(auth.isAuthenticated)}</span>
            <span data-testid="loading">{String(auth.loading)}</span>
            <span data-testid="isAdmin">{String(auth.isAdmin)}</span>
            <span data-testid="isVendor">{String(auth.isVendor)}</span>
            <button data-testid="login-btn" onClick={() => auth.login('test@test.com', '12345678')}>Login</button>
            <button data-testid="register-btn" onClick={() => auth.register({ email: 'r@r.com' })}>Register</button>
            <button data-testid="logout-btn" onClick={() => auth.logout()}>Logout</button>
        </div>
    );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function renderWithProvider() {
    return render(
        <AuthProvider>
            <AuthConsumer />
        </AuthProvider>
    );
}

describe('AuthContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockPush.mockClear();
        mockApiPost.mockReset();

        // Mock localStorage
        const store = {};
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => store[key] ?? null);
        jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { store[key] = value; });
        jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(key => { delete store[key]; });

        Object.defineProperty(document, 'cookie', { writable: true, value: '' });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renderiza children cuando loading=false', async () => {
        renderWithProvider();
        await waitFor(() => {
            expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
        });
    });

    test('useAuth lanza error fuera de AuthProvider', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<AuthConsumer />)).toThrow(
            'useAuth debe ser usado internamente de un AuthProvider'
        );
        spy.mockRestore();
    });

    test('login exitoso como buyer redirige a /', async () => {
        mockApiPost.mockResolvedValueOnce({
            data: {
                access: 'access123',
                refresh: 'refresh123',
                user: { id: 1, role: 'buyer', email: 'test@test.com' },
            },
        });

        renderWithProvider();

        await waitFor(() => {
            expect(screen.getByTestId('login-btn')).toBeInTheDocument();
        });

        await act(async () => {
            screen.getByTestId('login-btn').click();
        });

        await waitFor(() => {
            expect(mockApiPost).toHaveBeenCalledWith('/auth/login/', {
                email: 'test@test.com',
                password: '12345678',
            });
            expect(mockPush).toHaveBeenCalledWith('/');
        });
    });

    test('login exitoso como admin redirige a /admin', async () => {
        mockApiPost.mockResolvedValueOnce({
            data: {
                access: 'access_admin',
                refresh: 'refresh_admin',
                user: { id: 2, role: 'admin', email: 'admin@test.com' },
            },
        });

        renderWithProvider();

        await waitFor(() => {
            expect(screen.getByTestId('login-btn')).toBeInTheDocument();
        });

        await act(async () => {
            screen.getByTestId('login-btn').click();
        });

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/admin');
        });
    });

    test('login exitoso como vendor redirige a /products', async () => {
        mockApiPost.mockResolvedValueOnce({
            data: {
                access: 'access_vendor',
                refresh: 'refresh_vendor',
                user: { id: 3, role: 'vendor', email: 'vendor@test.com' },
            },
        });

        renderWithProvider();

        await waitFor(() => {
            expect(screen.getByTestId('login-btn')).toBeInTheDocument();
        });

        await act(async () => {
            screen.getByTestId('login-btn').click();
        });

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/products');
        });
    });

    test('login fallido lanza error', async () => {
        const loginError = new Error('Invalid credentials');
        mockApiPost.mockRejectedValueOnce(loginError);
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        renderWithProvider();

        await waitFor(() => {
            expect(screen.getByTestId('login-btn')).toBeInTheDocument();
        });

        await expect(
            act(async () => {
                screen.getByTestId('login-btn').click();
            })
        ).rejects.toThrow('Invalid credentials');

        spy.mockRestore();
    });

    test('register exitoso redirige a /', async () => {
        mockApiPost.mockResolvedValueOnce({
            data: {
                access: 'reg_access',
                refresh: 'reg_refresh',
                user: { id: 5, role: 'buyer', email: 'r@r.com' },
            },
        });

        renderWithProvider();

        await waitFor(() => {
            expect(screen.getByTestId('register-btn')).toBeInTheDocument();
        });

        await act(async () => {
            screen.getByTestId('register-btn').click();
        });

        await waitFor(() => {
            expect(mockApiPost).toHaveBeenCalledWith('/auth/register/', { email: 'r@r.com' });
            expect(mockPush).toHaveBeenCalledWith('/');
        });
    });

    test('register fallido lanza error', async () => {
        const regError = new Error('Registration failed');
        mockApiPost.mockRejectedValueOnce(regError);
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        renderWithProvider();

        await waitFor(() => {
            expect(screen.getByTestId('register-btn')).toBeInTheDocument();
        });

        await expect(
            act(async () => {
                screen.getByTestId('register-btn').click();
            })
        ).rejects.toThrow('Registration failed');

        spy.mockRestore();
    });

    test('logout limpia estado y redirige a /login', async () => {
        renderWithProvider();

        await waitFor(() => {
            expect(screen.getByTestId('logout-btn')).toBeInTheDocument();
        });

        await act(async () => {
            screen.getByTestId('logout-btn').click();
        });

        expect(localStorage.removeItem).toHaveBeenCalledWith('refresh_token');
        expect(localStorage.removeItem).toHaveBeenCalledWith('user_data');
        expect(mockPush).toHaveBeenCalledWith('/login');
    });

    test('isAdmin y isVendor son false por defecto', async () => {
        renderWithProvider();

        await waitFor(() => {
            expect(screen.getByTestId('isAdmin')).toHaveTextContent('false');
            expect(screen.getByTestId('isVendor')).toHaveTextContent('false');
        });
    });
});
