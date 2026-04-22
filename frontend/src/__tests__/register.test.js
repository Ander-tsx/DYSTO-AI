import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@/app/(auth)/register/page';

// 🔥 mocks
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

jest.mock('next/link', () => {
    const PropTypes = require('prop-types');
    function MockLink({ children, href, ...rest }) {
        return <a href={href} {...rest}>{children}</a>;
    }
    MockLink.propTypes = { children: PropTypes.node, href: PropTypes.string };
    return { __esModule: true, default: MockLink };
});

const mockRegister = jest.fn();

jest.mock('@/context/AuthContext', () => ({
    useAuth: () => ({
        register: mockRegister,
        isAuthenticated: false,
    }),
}));

jest.mock('@/utils/notify', () => ({
    notify: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

import { notify } from '@/utils/notify';

describe('RegisterPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('muestra error si campos vacíos', async () => {
        render(<RegisterPage />);

        fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

        expect(notify.error).toHaveBeenCalledWith(
            'Campos incompletos',
            expect.any(String)
        );
    });

    test('muestra error si contraseñas no coinciden', async () => {
        render(<RegisterPage />);

        fireEvent.change(screen.getByPlaceholderText('Neo'), {
            target: { value: 'Erick' },
        });
        fireEvent.change(screen.getByPlaceholderText('Anderson'), {
            target: { value: 'Test' },
        });
        fireEvent.change(screen.getByPlaceholderText('neo@matrix.com'), {
            target: { value: 'test@test.com' },
        });

        // Get password fields by id
        fireEvent.change(document.getElementById('register-password'), {
            target: { value: '12345678' },
        });
        fireEvent.change(document.getElementById('register-confirm-password'), {
            target: { value: '12345679' },
        });

        fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

        expect(notify.error).toHaveBeenCalledWith(
            'Error de validación',
            expect.any(String)
        );
    });

    test('muestra error si contraseña es débil', async () => {
        render(<RegisterPage />);

        fireEvent.change(screen.getByPlaceholderText('Neo'), {
            target: { value: 'Erick' },
        });
        fireEvent.change(screen.getByPlaceholderText('Anderson'), {
            target: { value: 'Test' },
        });
        fireEvent.change(screen.getByPlaceholderText('neo@matrix.com'), {
            target: { value: 'test@test.com' },
        });
        fireEvent.change(document.getElementById('register-password'), {
            target: { value: '123' },
        });
        fireEvent.change(document.getElementById('register-confirm-password'), {
            target: { value: '123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

        expect(notify.error).toHaveBeenCalledWith(
            'Contraseña débil',
            expect.any(String)
        );
    });

    test('registro exitoso', async () => {
        mockRegister.mockResolvedValueOnce({});

        render(<RegisterPage />);

        fireEvent.change(screen.getByPlaceholderText('Neo'), {
            target: { value: 'Erick' },
        });
        fireEvent.change(screen.getByPlaceholderText('Anderson'), {
            target: { value: 'Test' },
        });
        fireEvent.change(screen.getByPlaceholderText('neo@matrix.com'), {
            target: { value: 'test@test.com' },
        });
        fireEvent.change(document.getElementById('register-password'), {
            target: { value: '12345678' },
        });
        fireEvent.change(document.getElementById('register-confirm-password'), {
            target: { value: '12345678' },
        });

        fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalled();
            expect(notify.success).toHaveBeenCalled();
        });
    });

    test('maneja error del backend', async () => {
        mockRegister.mockRejectedValueOnce({
            response: { data: { detail: 'Error backend' } },
        });

        render(<RegisterPage />);

        fireEvent.change(screen.getByPlaceholderText('Neo'), {
            target: { value: 'Erick' },
        });
        fireEvent.change(screen.getByPlaceholderText('Anderson'), {
            target: { value: 'Test' },
        });
        fireEvent.change(screen.getByPlaceholderText('neo@matrix.com'), {
            target: { value: 'test@test.com' },
        });
        fireEvent.change(document.getElementById('register-password'), {
            target: { value: '12345678' },
        });
        fireEvent.change(document.getElementById('register-confirm-password'), {
            target: { value: '12345678' },
        });

        fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

        await waitFor(() => {
            expect(notify.error).toHaveBeenCalledWith(
                'Error al registrar',
                'Error backend'
            );
        });
    });
});