import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VendorProductsPage from '@/app/(vendor)/products/page';

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

jest.mock('@/utils/notify', () => ({
    notify: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock('@/components/product/VendorProductCard.jsx', () => {
    const PropTypes = require('prop-types');
    function MockVendorProductCard({ product, onDelete }) {
        return (
            <div data-testid={`product-card-${product.id}`}>
                <span>{product.title}</span>
                <button data-testid={`delete-${product.id}`} onClick={() => onDelete(product.id)}>
                    Eliminar
                </button>
            </div>
        );
    }
    MockVendorProductCard.propTypes = {
        product: PropTypes.object,
        onDelete: PropTypes.func,
    };
    return { __esModule: true, default: MockVendorProductCard };
});

jest.mock('@/components/ui/CustomSelect.jsx', () => {
    const PropTypes = require('prop-types');
    function MockCustomSelect({ value, onChange, options, id }) {
        return (
            <select
                data-testid={id || 'custom-select'}
                value={value}
                onChange={e => onChange(e.target.value)}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        );
    }
    MockCustomSelect.propTypes = {
        value: PropTypes.string,
        onChange: PropTypes.func,
        options: PropTypes.array,
        id: PropTypes.string,
    };
    return { __esModule: true, default: MockCustomSelect };
});

import { notify } from '@/utils/notify';

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('VendorProductsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('muestra skeletons mientras carga', () => {
        mockApiGet.mockReturnValue(new Promise(() => {}));
        render(<VendorProductsPage />);

        expect(screen.getByText('Mis Productos')).toBeInTheDocument();
        const pulseElements = document.querySelectorAll('.animate-pulse');
        expect(pulseElements.length).toBeGreaterThan(0);
    });

    test('muestra productos al cargar exitosamente', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                results: [
                    { id: 1, title: 'Producto 1', price: 100, stock: 5, is_active: true, main_image: null, units_sold: 0 },
                    { id: 2, title: 'Producto 2', price: 200, stock: 3, is_active: false, main_image: null, units_sold: 2 },
                ],
            },
        });

        render(<VendorProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Producto 1')).toBeInTheDocument();
            expect(screen.getByText('Producto 2')).toBeInTheDocument();
        });
    });

    test('muestra datos sin wrapper results', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: [
                { id: 1, title: 'Directo', price: 50, stock: 10, is_active: true, main_image: null, units_sold: 0 },
            ],
        });

        render(<VendorProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Directo')).toBeInTheDocument();
        });
    });

    test('muestra error cuando falla la API', async () => {
        mockApiGet.mockRejectedValueOnce({
            response: { data: { detail: 'No autorizado' } },
        });

        render(<VendorProductsPage />);

        await waitFor(() => {
            expect(notify.error).toHaveBeenCalledWith('Error', 'No autorizado');
        });
    });

    test('muestra mensaje cuando no hay productos', async () => {
        mockApiGet.mockResolvedValueOnce({ data: { results: [] } });

        render(<VendorProductsPage />);

        await waitFor(() => {
            expect(screen.getByText(/no has publicado ningún producto/i)).toBeInTheDocument();
        });
    });

    test('siempre muestra el PublishCard', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: { results: [{ id: 1, title: 'P1', price: 10, stock: 1, is_active: true, main_image: null, units_sold: 0 }] },
        });

        render(<VendorProductsPage />);

        await waitFor(() => {
            expect(screen.getByText(/publicar nuevo producto/i)).toBeInTheDocument();
        });
    });

    test('búsqueda filtra productos', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                results: [
                    { id: 1, title: 'Laptop Especial', price: 100, stock: 5, is_active: true, main_image: null, units_sold: 0 },
                    { id: 2, title: 'Mouse Inalámbrico', price: 20, stock: 3, is_active: true, main_image: null, units_sold: 0 },
                ],
            },
        });

        render(<VendorProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Laptop Especial')).toBeInTheDocument();
            expect(screen.getByText('Mouse Inalámbrico')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText(/buscar entre tus productos/i);
        fireEvent.change(searchInput, { target: { value: 'Laptop' } });

        expect(screen.getByText('Laptop Especial')).toBeInTheDocument();
        expect(screen.queryByText('Mouse Inalámbrico')).not.toBeInTheDocument();
    });

    test('filtro por estado activo', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                results: [
                    { id: 1, title: 'Activo Prod', price: 10, stock: 1, is_active: true, main_image: null, units_sold: 0 },
                    { id: 2, title: 'Pausado Prod', price: 20, stock: 0, is_active: false, main_image: null, units_sold: 0 },
                ],
            },
        });

        render(<VendorProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Activo Prod')).toBeInTheDocument();
        });

        const statusSelect = screen.getByTestId('vendor-filter-status');
        fireEvent.change(statusSelect, { target: { value: 'active' } });

        expect(screen.getByText('Activo Prod')).toBeInTheDocument();
        expect(screen.queryByText('Pausado Prod')).not.toBeInTheDocument();
    });

    test('filtro por estado inactivo', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                results: [
                    { id: 1, title: 'Active', price: 10, stock: 1, is_active: true, main_image: null, units_sold: 0 },
                    { id: 2, title: 'Inactive', price: 20, stock: 0, is_active: false, main_image: null, units_sold: 0 },
                ],
            },
        });

        render(<VendorProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Active')).toBeInTheDocument();
        });

        const statusSelect = screen.getByTestId('vendor-filter-status');
        fireEvent.change(statusSelect, { target: { value: 'inactive' } });

        expect(screen.queryByText('Active')).not.toBeInTheDocument();
        expect(screen.getByText('Inactive')).toBeInTheDocument();
    });

    test('ordenar por precio ascendente', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                results: [
                    { id: 1, title: 'Caro', price: 500, stock: 1, is_active: true, main_image: null, units_sold: 0 },
                    { id: 2, title: 'Barato', price: 10, stock: 1, is_active: true, main_image: null, units_sold: 0 },
                ],
            },
        });

        render(<VendorProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Caro')).toBeInTheDocument();
        });

        const sortSelect = screen.getByTestId('vendor-filter-sort');
        fireEvent.change(sortSelect, { target: { value: 'price_asc' } });

        expect(screen.getByText('Barato')).toBeInTheDocument();
        expect(screen.getByText('Caro')).toBeInTheDocument();
    });

    test('eliminar producto lo quita de la lista', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                results: [
                    { id: 1, title: 'Para eliminar', price: 10, stock: 1, is_active: true, main_image: null, units_sold: 0 },
                    { id: 2, title: 'Queda', price: 20, stock: 2, is_active: true, main_image: null, units_sold: 0 },
                ],
            },
        });

        render(<VendorProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Para eliminar')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('delete-1'));

        expect(screen.queryByText('Para eliminar')).not.toBeInTheDocument();
        expect(screen.getByText('Queda')).toBeInTheDocument();
    });

    test('muestra conteo correcto de productos', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                results: [
                    { id: 1, title: 'P1', price: 10, stock: 1, is_active: true, main_image: null, units_sold: 0 },
                    { id: 2, title: 'P2', price: 20, stock: 2, is_active: true, main_image: null, units_sold: 0 },
                    { id: 3, title: 'P3', price: 30, stock: 3, is_active: true, main_image: null, units_sold: 0 },
                ],
            },
        });

        render(<VendorProductsPage />);

        await waitFor(() => {
            expect(screen.getByText(/3 de 3 producto/)).toBeInTheDocument();
        });
    });

    test('enlace Publicar nuevo está presente', async () => {
        mockApiGet.mockResolvedValueOnce({ data: { results: [] } });

        render(<VendorProductsPage />);

        await waitFor(() => {
            // The link contains an SVG + text "Publicar nuevo"
            const links = screen.getAllByRole('link');
            const publishLink = links.find(l => l.getAttribute('href') === '/products/new' && l.textContent.includes('Publicar nuevo'));
            expect(publishLink).toBeTruthy();
        });
    });
});
