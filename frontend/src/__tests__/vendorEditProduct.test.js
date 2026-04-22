import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditProductPage from '@/app/(vendor)/products/[id]/edit/page';

// ── Mocks ──────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
    useParams: () => ({ id: '99' }),
}));

const mockApiGet = jest.fn();
const mockApiPatch = jest.fn();

jest.mock('@/lib/axios', () => ({
    __esModule: true,
    default: {
        get: (...args) => mockApiGet(...args),
        patch: (...args) => mockApiPatch(...args),
    },
}));

jest.mock('@/utils/notify', () => ({
    notify: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

import { notify } from '@/utils/notify';

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('EditProductPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('muestra loading skeleton inicialmente', () => {
        mockApiGet.mockReturnValue(new Promise(() => {}));
        render(<EditProductPage />);
        const pulseElements = document.querySelectorAll('.animate-pulse');
        expect(pulseElements.length).toBeGreaterThan(0);
    });

    test('carga y muestra producto sin ventas (edición completa)', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                title: 'Mi Producto',
                description: 'Descripción del producto',
                category: 'Herramientas',
                price: '49.99',
                stock: 10,
                main_image: '',
                units_sold: 0,
            },
        });

        render(<EditProductPage />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Mi Producto')).toBeInTheDocument();
        });

        expect(screen.getByDisplayValue('Descripción del producto')).toBeInTheDocument();
        expect(screen.getByDisplayValue('49.99')).toBeInTheDocument();

        // Todos los campos habilitados sin ventas
        const titleInput = document.getElementById('product-title');
        expect(titleInput).not.toBeDisabled();
    });

    test('carga producto con ventas (edición limitada)', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                title: 'Producto Vendido',
                description: 'Desc',
                category: 'APIs',
                price: '99.99',
                stock: 5,
                main_image: '',
                units_sold: 3,
            },
        });

        render(<EditProductPage />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Producto Vendido')).toBeInTheDocument();
        });

        // Campos deshabilitados con ventas
        const titleInput = document.getElementById('product-title');
        expect(titleInput).toBeDisabled();

        const descInput = document.getElementById('product-description');
        expect(descInput).toBeDisabled();

        const priceInput = document.getElementById('product-price');
        expect(priceInput).toBeDisabled();

        // Stock siempre editable
        const stockInput = document.getElementById('product-stock');
        expect(stockInput).not.toBeDisabled();

        // Muestra aviso de edición limitada
        expect(screen.getByText(/Edición limitada/)).toBeInTheDocument();
    });

    test('envía todos los campos cuando no tiene ventas', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                title: 'Editable',
                description: 'Desc',
                category: 'Cat',
                price: '50',
                stock: 10,
                main_image: '',
                units_sold: 0,
            },
        });

        mockApiPatch.mockResolvedValueOnce({ data: {} });

        render(<EditProductPage />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Editable')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

        await waitFor(() => {
            expect(mockApiPatch).toHaveBeenCalledWith('/products/99/edit/', {
                title: 'Editable',
                description: 'Desc',
                category: 'Cat',
                price: '50',
                stock: 10,
            });
            expect(notify.success).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith('/products');
        });
    });

    test('envía solo stock cuando tiene ventas', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                title: 'Vendido',
                description: 'D',
                category: 'C',
                price: '100',
                stock: 5,
                main_image: '',
                units_sold: 2,
            },
        });

        mockApiPatch.mockResolvedValueOnce({ data: {} });

        render(<EditProductPage />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Vendido')).toBeInTheDocument();
        });

        // Cambiar stock
        const stockInput = document.getElementById('product-stock');
        fireEvent.change(stockInput, { target: { value: '20', name: 'stock' } });

        fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

        await waitFor(() => {
            expect(mockApiPatch).toHaveBeenCalledWith('/products/99/edit/', {
                stock: 20,
            });
        });
    });

    test('muestra error al fallar el guardado', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                title: 'T', description: 'D', category: 'C',
                price: '10', stock: 1, main_image: '', units_sold: 0,
            },
        });

        mockApiPatch.mockRejectedValueOnce({
            response: { data: { detail: 'Error de validación' } },
        });

        render(<EditProductPage />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('T')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

        await waitFor(() => {
            expect(notify.error).toHaveBeenCalledWith(
                'Error al guardar',
                'Error de validación'
            );
        });
    });

    test('redirige a /products cuando falla la carga', async () => {
        mockApiGet.mockRejectedValueOnce({
            response: { data: { detail: 'Producto no encontrado' } },
        });

        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<EditProductPage />);

        await waitFor(() => {
            expect(notify.error).toHaveBeenCalledWith(
                'Error',
                'Producto no encontrado'
            );
            expect(mockPush).toHaveBeenCalledWith('/products');
        });

        spy.mockRestore();
    });

    test('handleChange actualiza campos del formulario', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                title: 'Original', description: 'Desc original', category: 'Cat',
                price: '10', stock: 5, main_image: '', units_sold: 0,
            },
        });

        render(<EditProductPage />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Original')).toBeInTheDocument();
        });

        const titleInput = document.getElementById('product-title');
        fireEvent.change(titleInput, { target: { value: 'Modificado', name: 'title' } });

        expect(screen.getByDisplayValue('Modificado')).toBeInTheDocument();
    });

    test('botón Cancelar redirige a /products', async () => {
        mockApiGet.mockResolvedValueOnce({
            data: {
                title: 'T', description: 'D', category: 'C',
                price: '10', stock: 1, main_image: '', units_sold: 0,
            },
        });

        render(<EditProductPage />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('T')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
        expect(mockPush).toHaveBeenCalledWith('/products');
    });
});
