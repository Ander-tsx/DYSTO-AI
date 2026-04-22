import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminProductsPage from '@/app/admin/productos/page';

// ── Mocks ──────────────────────────────────────────────────────────────────────

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('next/link', () => {
    const PropTypes = require('prop-types');
    function MockLink({ children, href, ...rest }) {
        return <a href={href} {...rest}>{children}</a>;
    }
    MockLink.propTypes = { children: PropTypes.node, href: PropTypes.string };
    return { __esModule: true, default: MockLink };
});

const mockApiGet = jest.fn();
jest.mock('@/lib/axios', () => ({
    __esModule: true,
    default: { get: (...args) => mockApiGet(...args) },
}));

jest.mock('@/components/layout/AdminLayout', () => {
    const PropTypes = require('prop-types');
    function MockAdminLayout({ children }) {
        return <div data-testid="admin-layout">{children}</div>;
    }
    MockAdminLayout.propTypes = { children: PropTypes.node };
    return { __esModule: true, default: MockAdminLayout };
});

jest.mock('@/components/ui/Badge', () => {
    const PropTypes = require('prop-types');
    function MockBadge({ children, variant }) {
        return <span data-testid={`badge-${variant}`}>{children}</span>;
    }
    MockBadge.propTypes = { children: PropTypes.node, variant: PropTypes.string };
    return { __esModule: true, default: MockBadge };
});

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('AdminProductsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('muestra skeletons mientras carga', () => {
        mockApiGet.mockReturnValue(new Promise(() => {}));

        render(<AdminProductsPage />);

        expect(screen.getByText('Gestión de Productos')).toBeInTheDocument();
        const pulseElements = document.querySelectorAll('.animate-pulse');
        expect(pulseElements.length).toBeGreaterThan(0);
    });

    test('muestra productos al cargar exitosamente', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                results: [
                    {
                        id: 1,
                        title: 'Producto A',
                        seller_email: 'seller@test.com',
                        price: 100,
                        stock: 5,
                        is_active: true,
                        main_image: 'https://example.com/img.jpg',
                    },
                    {
                        id: 2,
                        title: 'Producto B',
                        seller_email: 'seller2@test.com',
                        price: 200,
                        stock: 0,
                        is_active: false,
                        main_image: null,
                    },
                ],
            },
        });

        render(<AdminProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Producto A')).toBeInTheDocument();
            expect(screen.getByText('Producto B')).toBeInTheDocument();
        });

        expect(screen.getByText('seller@test.com')).toBeInTheDocument();
        expect(screen.getByText('seller2@test.com')).toBeInTheDocument();
    });

    test('muestra datos sin wrapper results', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: [
                {
                    id: 1,
                    title: 'Producto Directo',
                    seller_email: 'v@v.com',
                    price: 50,
                    stock: 10,
                    is_active: true,
                    main_image: null,
                },
            ],
        });

        render(<AdminProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Producto Directo')).toBeInTheDocument();
        });
    });

    test('muestra error cuando falla la API', async () => {
        mockApiGet.mockRejectedValueOnce({
            response: { data: { detail: 'Error de permisos' } },
        });

        render(<AdminProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Error de permisos')).toBeInTheDocument();
        });
    });

    test('muestra error genérico cuando falla sin detail', async () => {
        mockApiGet.mockRejectedValueOnce({ response: { data: {} } });

        render(<AdminProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('No se pudieron cargar los productos.')).toBeInTheDocument();
        });
    });

    test('filtro de búsqueda filtra productos', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                results: [
                    { id: 1, title: 'Laptop', seller_email: 's@s.com', price: 100, stock: 5, is_active: true, main_image: null },
                    { id: 2, title: 'Mouse', seller_email: 's@s.com', price: 20, stock: 3, is_active: true, main_image: null },
                ],
            },
        });

        render(<AdminProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Laptop')).toBeInTheDocument();
            expect(screen.getByText('Mouse')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Título o vendedor...');
        fireEvent.change(searchInput, { target: { value: 'Laptop' } });

        expect(screen.getByText('Laptop')).toBeInTheDocument();
        expect(screen.queryByText('Mouse')).not.toBeInTheDocument();
    });

    test('filtro de estado Activo filtra productos', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                results: [
                    { id: 1, title: 'Activo Prod', seller_email: 's@s.com', price: 100, stock: 5, is_active: true, main_image: null },
                    { id: 2, title: 'Inactivo Prod', seller_email: 's@s.com', price: 20, stock: 0, is_active: false, main_image: null },
                ],
            },
        });

        render(<AdminProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Activo Prod')).toBeInTheDocument();
        });

        const selectState = screen.getByLabelText('Estado');
        fireEvent.change(selectState, { target: { value: 'Activo' } });

        expect(screen.getByText('Activo Prod')).toBeInTheDocument();
        expect(screen.queryByText('Inactivo Prod')).not.toBeInTheDocument();
    });

    test('filtro de estado Inactivo filtra productos', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                results: [
                    { id: 1, title: 'Active Product', seller_email: 's@s.com', price: 100, stock: 5, is_active: true, main_image: null },
                    { id: 2, title: 'Inactive Product', seller_email: 's@s.com', price: 20, stock: 0, is_active: false, main_image: null },
                ],
            },
        });

        render(<AdminProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Active Product')).toBeInTheDocument();
        });

        const selectState = screen.getByLabelText('Estado');
        fireEvent.change(selectState, { target: { value: 'Inactivo' } });

        expect(screen.queryByText('Active Product')).not.toBeInTheDocument();
        expect(screen.getByText('Inactive Product')).toBeInTheDocument();
    });

    test('muestra mensaje cuando no hay productos filtrados', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: { results: [{ id: 1, title: 'Solo', seller_email: 's@s.com', price: 10, stock: 1, is_active: true, main_image: null }] },
        });

        render(<AdminProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Solo')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Título o vendedor...');
        fireEvent.change(searchInput, { target: { value: 'inexistente' } });

        expect(screen.getByText('No hay productos para mostrar.')).toBeInTheDocument();
    });

    test('búsqueda por email del vendedor', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                results: [
                    { id: 1, title: 'Prod Juan', seller_email: 'juan@test.com', price: 10, stock: 1, is_active: true, main_image: null },
                    { id: 2, title: 'Prod Maria', seller_email: 'maria@test.com', price: 20, stock: 2, is_active: true, main_image: null },
                ],
            },
        });

        render(<AdminProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Prod Juan')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Título o vendedor...');
        fireEvent.change(searchInput, { target: { value: 'maria' } });

        expect(screen.queryByText('Prod Juan')).not.toBeInTheDocument();
        expect(screen.getByText('Prod Maria')).toBeInTheDocument();
    });
});
