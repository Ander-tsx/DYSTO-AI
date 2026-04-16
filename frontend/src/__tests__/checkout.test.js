import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CheckoutPage from '@/app/(buyer)/checkout/page';

// ── Mocks ──────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

jest.mock('next/link', () => {
    const PropTypes = require('prop-types');
    function MockLink({ children, href, ...rest }) {
        return <a href={href} {...rest}>{children}</a>;
    }
    MockLink.propTypes = { children: PropTypes.node, href: PropTypes.string };
    return { __esModule: true, default: MockLink };
});

const mockClearCart = jest.fn();
let mockCartItems = [];
let mockCartTotal = 0;
let mockCartCount = 0;

jest.mock('@/context/CartContext', () => ({
    useCart: () => ({
        cartItems: mockCartItems,
        cartTotal: mockCartTotal,
        cartCount: mockCartCount,
        clearCart: mockClearCart,
    }),
}));

const mockApiPost = jest.fn();
jest.mock('@/lib/axios', () => ({
    __esModule: true,
    default: { post: (...args) => mockApiPost(...args) },
}));

jest.mock('@/components/orders/AddressSelector.jsx', () => {
    const PropTypes = require('prop-types');
    function MockAddressSelector({ onSelect }) {
        return (
            <div data-testid="address-selector">
                <button data-testid="select-address" onClick={() => onSelect(42)}>
                    Seleccionar dirección
                </button>
            </div>
        );
    }
    MockAddressSelector.propTypes = { onSelect: PropTypes.func };
    return { __esModule: true, default: MockAddressSelector };
});

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('CheckoutPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCartItems = [];
        mockCartTotal = 0;
        mockCartCount = 0;
    });

    test('muestra carrito vacío cuando no hay items', () => {
        render(<CheckoutPage />);
        expect(screen.getByText(/no tienes productos en el carrito/i)).toBeInTheDocument();
    });

    test('muestra los productos del carrito', () => {
        mockCartItems = [
            {
                id: 1,
                quantity: 2,
                subtotal: 100,
                product: { title: 'Producto Test', main_image: 'https://example.com/img.jpg' },
            },
        ];
        mockCartTotal = 100;
        mockCartCount = 2;

        render(<CheckoutPage />);

        expect(screen.getByText('Producto Test')).toBeInTheDocument();
        expect(screen.getByText('× 2')).toBeInTheDocument();
    });

    test('muestra producto sin imagen', () => {
        mockCartItems = [
            {
                id: 2,
                quantity: 1,
                subtotal: 50,
                product: { title: 'Sin Imagen', main_image: null },
            },
        ];
        mockCartTotal = 50;
        mockCartCount = 1;

        render(<CheckoutPage />);
        expect(screen.getByText('Sin Imagen')).toBeInTheDocument();
    });

    test('botón deshabilitado cuando no hay dirección seleccionada', () => {
        mockCartItems = [
            { id: 1, quantity: 1, subtotal: 10, product: { title: 'P1' } },
        ];
        mockCartTotal = 10;
        mockCartCount = 1;

        render(<CheckoutPage />);

        const btn = screen.getByRole('button', { name: /confirmar pedido/i });
        expect(btn).toBeDisabled();
    });

    test('checkout exitoso con order_number redirige a la orden', async () => {
        mockCartItems = [
            { id: 1, quantity: 1, subtotal: 25, product: { title: 'Test' } },
        ];
        mockCartTotal = 25;
        mockCartCount = 1;

        mockApiPost.mockResolvedValueOnce({
            data: { order_number: 'ORD-001' },
        });

        render(<CheckoutPage />);

        // Seleccionar dirección y esperar a que se procese
        await act(async () => {
            fireEvent.click(screen.getByTestId('select-address'));
        });

        // Confirmar pedido
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /confirmar pedido/i }));
        });

        await waitFor(() => {
            expect(mockApiPost).toHaveBeenCalledWith('/orders/checkout/', { address_id: 42 });
            expect(mockClearCart).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith('/orders/ORD-001?from=checkout');
        });
    });

    test('checkout exitoso sin order_number redirige a /orders', async () => {
        mockCartItems = [
            { id: 1, quantity: 1, subtotal: 25, product: { title: 'Test' } },
        ];
        mockCartTotal = 25;
        mockCartCount = 1;

        mockApiPost.mockResolvedValueOnce({ data: {} });

        render(<CheckoutPage />);

        await act(async () => {
            fireEvent.click(screen.getByTestId('select-address'));
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /confirmar pedido/i }));
        });

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/orders');
        });
    });

    test('checkout fallido muestra error del backend', async () => {
        mockCartItems = [
            { id: 1, quantity: 1, subtotal: 25, product: { title: 'Test' } },
        ];
        mockCartTotal = 25;
        mockCartCount = 1;

        mockApiPost.mockRejectedValueOnce({
            response: { data: { detail: 'Stock insuficiente' } },
        });

        render(<CheckoutPage />);

        await act(async () => {
            fireEvent.click(screen.getByTestId('select-address'));
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /confirmar pedido/i }));
        });

        await waitFor(() => {
            expect(screen.getByText('Stock insuficiente')).toBeInTheDocument();
        });
    });

    test('checkout fallido sin detail muestra error genérico', async () => {
        mockCartItems = [
            { id: 1, quantity: 1, subtotal: 25, product: { title: 'Test' } },
        ];
        mockCartTotal = 25;
        mockCartCount = 1;

        mockApiPost.mockRejectedValueOnce({});

        render(<CheckoutPage />);

        await act(async () => {
            fireEvent.click(screen.getByTestId('select-address'));
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /confirmar pedido/i }));
        });

        await waitFor(() => {
            expect(screen.getByText(/ha ocurrido un error inesperado/i)).toBeInTheDocument();
        });
    });
});
