"use client";

import { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import api from "@/lib/axios";
import { Trash2, Power, PowerOff } from "lucide-react";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterState, setFilterState] = useState("Todos");
    const [search, setSearch] = useState("");

    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/products/admin/');
            setProducts(res.data.results || res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'No se pudieron cargar los productos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const toggleProductStatus = async (id, currentStatus) => {
        try {
            await api.patch(`/products/${id}/edit/`, {
                is_active_admin: !currentStatus
            });
            // Update UI locally
            setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active_admin: !currentStatus } : p));
        } catch (err) {
            const msg = err.response?.data?.detail || 'Error al cambiar el estado del producto.';
            setError(msg);
        }
    };



    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchState =
                filterState === "Todos" ||
                (filterState === "Activo" && product.is_active_admin) ||
                (filterState === "Inactivo" && !product.is_active_admin);

            const matchSearch =
                !search ||
                product.title?.toLowerCase().includes(search.toLowerCase()) ||
                product.seller_email?.toLowerCase().includes(search.toLowerCase());

            return matchState && matchSearch;
        });
    }, [filterState, search, products]);

    const tableContent = (() => {
        if (loading) {
            return Array.from({ length: 5 }, (_, rowIdx) => (
                <tr key={`row-${rowIdx}`}>
                    {Array.from({ length: 7 }, (_, colIdx) => (
                        <td key={`col-${rowIdx}-${colIdx}`} className="px-5 py-4">
                            <div className="h-4 animate-pulse rounded bg-zinc-800" />
                        </td>
                    ))}
                </tr>
            ));
        }

        if (filteredProducts.length === 0) {
            return (
                <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-sm text-zinc-400">
                        No hay productos para mostrar.
                    </td>
                </tr>
            );
        }

        return filteredProducts.map((product) => (
            <tr key={product.id} className="transition-colors hover:bg-zinc-900/80">
                <td className="whitespace-nowrap px-5 py-4">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-zinc-800 border border-zinc-700">
                        {product.main_image ? (
                            <img
                                src={product.main_image}
                                alt={product.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] text-zinc-600">
                                N/A
                            </div>
                        )}
                    </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-zinc-100 max-w-[200px] truncate">
                    {product.title}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-400">
                    {product.seller_email || '-'}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm font-mono text-zinc-300">
                    ${Number(product.price || 0).toFixed(2)}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-300">
                    {product.stock}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                    <Badge variant={product.is_active_admin ? "success" : "error"}>
                        {product.is_active_admin ? "Activo" : "Desactivado (Admin)"}
                    </Badge>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`p-1.5 ${product.is_active_admin ? "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10" : "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"}`}
                            onClick={() => toggleProductStatus(product.id, product.is_active_admin)}
                            title={product.is_active_admin ? "Desactivar Producto" : "Activar Producto"}
                        >
                            {product.is_active_admin ? <PowerOff size={16} /> : <Power size={16} />}
                            <span className="ml-2 text-xs">{product.is_active_admin ? "Desactivar" : "Activar"}</span>
                        </Button>
                    </div>
                </td>
            </tr>
        ));
    })();

    return (
        <AdminLayout>
            <section className="space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold text-zinc-100">Gestión de Productos</h1>
                    <p className="text-sm text-zinc-400">
                        Revisa el inventario y estado de todos los productos en el marketplace.
                    </p>
                </div>

                {/* Filtros */}
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                        <label htmlFor="filter-search" className="mb-2 block text-sm font-medium text-zinc-300">
                            Buscar
                        </label>
                        <input
                            id="filter-search"
                            type="text"
                            placeholder="Título o vendedor..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 transition hover:border-zinc-700 focus:border-zinc-600"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="filter-state" className="mb-2 block text-sm font-medium text-zinc-300">
                            Estado
                        </label>
                        <select
                            id="filter-state"
                            value={filterState}
                            onChange={(e) => setFilterState(e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 transition hover:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                        >
                            {["Todos", "Activo", "Inactivo"].map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                        {error}
                    </div>
                )}

                {/* Tabla */}
                <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-800">
                            <thead className="bg-zinc-900/70">
                                <tr>
                                    {["Imagen", "Título", "Vendedor", "Precio", "Stock", "Estado", "Acciones"].map(col => (
                                        <th key={col} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-800">
                                {tableContent}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
