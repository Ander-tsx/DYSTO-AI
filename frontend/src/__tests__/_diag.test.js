// Diagnostic: test AdminProductsPage rendering with mock
const mockApiGet = jest.fn();

jest.mock('@/lib/axios', () => ({
    __esModule: true,
    default: { get: (...args) => mockApiGet(...args) },
}));

jest.mock('@/components/layout/AdminLayout', () => {
    function MockAdminLayout({ children }) {
        return <div data-testid="admin-layout">{children}</div>;
    }
    return { __esModule: true, default: MockAdminLayout };
});

jest.mock('@/components/ui/Badge', () => {
    function MockBadge({ children }) {
        return <span>{children}</span>;
    }
    return { __esModule: true, default: MockBadge };
});

import { render, screen, waitFor } from '@testing-library/react';
import AdminProductsPage from '@/app/admin/productos/page';

test('admin page renders with data', async () => {
    mockApiGet.mockResolvedValueOnce({
        data: { results: [{ id: 1, title: 'TestProd', seller_email: 'a@a.com', price: 10, stock: 1, is_active: true, main_image: null }] }
    });

    render(<AdminProductsPage />);
    
    expect(screen.getByText('Gestión de Productos')).toBeInTheDocument();
    
    await waitFor(() => {
        expect(screen.getByText('TestProd')).toBeInTheDocument();
    }, { timeout: 3000 });
});

test('admin page shows skeleton while loading', () => {
    mockApiGet.mockReturnValue(new Promise(() => {}));
    render(<AdminProductsPage />);

    expect(screen.getByText('Gestión de Productos')).toBeInTheDocument();
    const pulseElements = document.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
});
