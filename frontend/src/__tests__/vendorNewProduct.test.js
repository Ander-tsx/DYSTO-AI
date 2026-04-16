import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewProductPage from '@/app/(vendor)/products/new/page';

// ── Mocks ──────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

const mockApiPost = jest.fn();

jest.mock('@/lib/axios', () => ({
    __esModule: true,
    default: { post: (...args) => mockApiPost(...args) },
}));

jest.mock('@/utils/notify', () => ({
    notify: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

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

// ── Setup ──────────────────────────────────────────────────────────────────────

beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
});

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('NewProductPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renderiza el formulario correctamente', () => {
        render(<NewProductPage />);

        expect(screen.getByText('Publicar Producto')).toBeInTheDocument();
        expect(screen.getByText('Información del Producto')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Ej. GPT-4 Prompt Engineering Toolkit')).toBeInTheDocument();
    });

    test('muestra error si título vacío al publicar', () => {
        render(<NewProductPage />);

        // Click the publish button (it's the last one with the text)
        const buttons = screen.getAllByRole('button');
        const publishBtn = buttons.find(b => b.textContent.includes('Publicar Producto'));
        fireEvent.click(publishBtn);

        expect(notify.error).toHaveBeenCalledWith('Campo requerido', 'El título es obligatorio.');
    });

    test('muestra error si precio vacío al publicar', () => {
        render(<NewProductPage />);

        const titleInput = screen.getByPlaceholderText('Ej. GPT-4 Prompt Engineering Toolkit');
        fireEvent.change(titleInput, { target: { value: 'Test', name: 'title' } });

        const buttons = screen.getAllByRole('button');
        const publishBtn = buttons.find(b => b.textContent.includes('Publicar Producto'));
        fireEvent.click(publishBtn);

        expect(notify.error).toHaveBeenCalledWith('Campo requerido', 'El precio es obligatorio.');
    });

    test('muestra error si stock vacío al publicar', () => {
        render(<NewProductPage />);

        fireEvent.change(screen.getByPlaceholderText('Ej. GPT-4 Prompt Engineering Toolkit'), {
            target: { value: 'Test', name: 'title' },
        });
        fireEvent.change(screen.getByPlaceholderText('0.00'), {
            target: { value: '10', name: 'price' },
        });

        const buttons = screen.getAllByRole('button');
        const publishBtn = buttons.find(b => b.textContent.includes('Publicar Producto'));
        fireEvent.click(publishBtn);

        expect(notify.error).toHaveBeenCalledWith('Campo requerido', 'El stock es obligatorio.');
    });

    test('publicación exitosa con ID redirige al producto', async () => {
        mockApiPost.mockResolvedValueOnce({ data: { id: 42 } });

        render(<NewProductPage />);

        fireEvent.change(screen.getByPlaceholderText('Ej. GPT-4 Prompt Engineering Toolkit'), {
            target: { value: 'Producto Nuevo', name: 'title' },
        });
        fireEvent.change(screen.getByPlaceholderText('0.00'), {
            target: { value: '99.99', name: 'price' },
        });
        fireEvent.change(screen.getByPlaceholderText('0'), {
            target: { value: '10', name: 'stock' },
        });

        const buttons = screen.getAllByRole('button');
        const publishBtn = buttons.find(b => b.textContent.includes('Publicar Producto'));
        fireEvent.click(publishBtn);

        await waitFor(() => {
            expect(mockApiPost).toHaveBeenCalled();
            expect(notify.success).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith('/products/42');
        });
    });

    test('publicación exitosa sin ID resetea formulario', async () => {
        mockApiPost.mockResolvedValueOnce({ data: {} });

        render(<NewProductPage />);

        fireEvent.change(screen.getByPlaceholderText('Ej. GPT-4 Prompt Engineering Toolkit'), {
            target: { value: 'Test', name: 'title' },
        });
        fireEvent.change(screen.getByPlaceholderText('0.00'), {
            target: { value: '10', name: 'price' },
        });
        fireEvent.change(screen.getByPlaceholderText('0'), {
            target: { value: '5', name: 'stock' },
        });

        const buttons = screen.getAllByRole('button');
        const publishBtn = buttons.find(b => b.textContent.includes('Publicar Producto'));
        fireEvent.click(publishBtn);

        await waitFor(() => {
            expect(mockPush).not.toHaveBeenCalled();
            expect(screen.getByPlaceholderText('Ej. GPT-4 Prompt Engineering Toolkit').value).toBe('');
        });
    });

    test('publicación fallida muestra error', async () => {
        mockApiPost.mockRejectedValueOnce({
            response: { data: { detail: 'Imagen requerida' } },
        });

        render(<NewProductPage />);

        fireEvent.change(screen.getByPlaceholderText('Ej. GPT-4 Prompt Engineering Toolkit'), {
            target: { value: 'Test', name: 'title' },
        });
        fireEvent.change(screen.getByPlaceholderText('0.00'), {
            target: { value: '10', name: 'price' },
        });
        fireEvent.change(screen.getByPlaceholderText('0'), {
            target: { value: '5', name: 'stock' },
        });

        const buttons = screen.getAllByRole('button');
        const publishBtn = buttons.find(b => b.textContent.includes('Publicar Producto'));
        fireEvent.click(publishBtn);

        await waitFor(() => {
            expect(notify.error).toHaveBeenCalledWith('Error al publicar', 'Imagen requerida');
        });
    });

    test('analizar sin imagen muestra error', () => {
        render(<NewProductPage />);

        const buttons = screen.getAllByRole('button');
        const analyzeBtn = buttons.find(b => b.textContent.includes('Analizar con IA'));
        fireEvent.click(analyzeBtn);

        expect(notify.error).toHaveBeenCalledWith('Sin imagen', 'Sube al menos 1 imagen para analizar.');
    });

    test('handleFiles rechaza archivos de formato inválido', () => {
        render(<NewProductPage />);

        const fileInput = document.querySelector('input[type="file"]');
        const invalidFile = new File(['data'], 'test.gif', { type: 'image/gif' });

        Object.defineProperty(fileInput, 'files', { value: [invalidFile] });
        fireEvent.change(fileInput);

        expect(notify.error).toHaveBeenCalledWith('Formato inválido', 'Solo se aceptan PNG, JPG o WebP.');
    });

    test('handleFiles rechaza archivos demasiado grandes', () => {
        render(<NewProductPage />);

        const fileInput = document.querySelector('input[type="file"]');
        const bigFile = new File(['data'], 'big.png', { type: 'image/png' });
        Object.defineProperty(bigFile, 'size', { value: 15 * 1024 * 1024 });

        Object.defineProperty(fileInput, 'files', { value: [bigFile] });
        fireEvent.change(fileInput);

        expect(notify.error).toHaveBeenCalledWith('Archivo muy grande', 'El tamaño máximo es 10MB por imagen.');
    });

    test('análisis IA exitoso rellena el formulario', async () => {
        render(<NewProductPage />);

        // Añadir imagen válida
        const fileInput = document.querySelector('input[type="file"]');
        const file = new File(['data'], 'test.png', { type: 'image/png' });
        Object.defineProperty(file, 'size', { value: 1024 });
        Object.defineProperty(fileInput, 'files', { value: [file] });
        fireEvent.change(fileInput);

        mockApiPost.mockResolvedValueOnce({
            data: {
                analysis: {
                    title: 'Producto IA',
                    category: 'Herramientas',
                    suggested_price: '29.99',
                    description: 'Descripción generada por IA',
                    tags: ['ai', 'tool'],
                },
            },
        });

        const buttons = screen.getAllByRole('button');
        const analyzeBtn = buttons.find(b => b.textContent.includes('Analizar con IA'));
        fireEvent.click(analyzeBtn);

        await waitFor(() => {
            expect(notify.success).toHaveBeenCalledWith(
                '¡Análisis completado!',
                'La IA rellenó el formulario con sus sugerencias ✨'
            );
        });
    });

    test('análisis IA error 429 muestra límite', async () => {
        render(<NewProductPage />);

        const fileInput = document.querySelector('input[type="file"]');
        const file = new File(['data'], 'test.png', { type: 'image/png' });
        Object.defineProperty(file, 'size', { value: 1024 });
        Object.defineProperty(fileInput, 'files', { value: [file] });
        fireEvent.change(fileInput);

        mockApiPost.mockRejectedValueOnce({ response: { status: 429 } });

        const buttons = screen.getAllByRole('button');
        const analyzeBtn = buttons.find(b => b.textContent.includes('Analizar con IA'));
        fireEvent.click(analyzeBtn);

        await waitFor(() => {
            expect(notify.error).toHaveBeenCalledWith(
                'Límite alcanzado',
                'Máximo 10 análisis por hora. Intenta más tarde.'
            );
        });
    });

    test('análisis IA con detail en respuesta muestra error', async () => {
        render(<NewProductPage />);

        const fileInput = document.querySelector('input[type="file"]');
        const file = new File(['data'], 'test.png', { type: 'image/png' });
        Object.defineProperty(file, 'size', { value: 1024 });
        Object.defineProperty(fileInput, 'files', { value: [file] });
        fireEvent.change(fileInput);

        mockApiPost.mockResolvedValueOnce({
            data: { detail: 'Servicio no disponible' },
        });

        const buttons = screen.getAllByRole('button');
        const analyzeBtn = buttons.find(b => b.textContent.includes('Analizar con IA'));
        fireEvent.click(analyzeBtn);

        await waitFor(() => {
            expect(notify.error).toHaveBeenCalledWith('Error IA', 'Servicio no disponible');
        });
    });

    test('handleChange actualiza campos del formulario', () => {
        render(<NewProductPage />);

        const titleInput = screen.getByPlaceholderText('Ej. GPT-4 Prompt Engineering Toolkit');
        fireEvent.change(titleInput, { target: { value: 'Nuevo Título', name: 'title' } });

        expect(titleInput.value).toBe('Nuevo Título');
    });
});
