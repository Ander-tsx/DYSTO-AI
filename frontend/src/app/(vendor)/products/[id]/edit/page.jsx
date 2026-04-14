'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { notify } from '@/utils/notify';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    stock: 0,
    main_image: '',
    units_sold: 0
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Usamos el endpoint autenticado del vendedor, sin filtro de stock.
        // Esto permite cargar productos con stock=0 (pausados).
        const res = await api.get(`/products/${id}/vendor-detail/`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        notify.error("Error", err.response?.data?.detail || "No se pudo cargar la información del producto.");
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Si el producto tiene ventas, solo enviamos el stock.
      // El backend también filtra silenciosamente, pero enviamos solo lo necesario.
      const payload = product.units_sold > 0
        ? { stock: Number(product.stock) }
        : {
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            stock: Number(product.stock),
          };

      await api.patch(`/products/${id}/edit/`, payload);
      notify.success("Producto actualizado", "Los cambios han sido guardados correctamente.");
      router.push('/products');
    } catch (err) {
      notify.error("Error al guardar", err.response?.data?.detail || "Ha ocurrido un error inesperado.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 animate-pulse">
        <div className="h-8 w-64 bg-zinc-900 border border-zinc-800 rounded mb-8"></div>
        <div className="h-96 w-full bg-zinc-900 border border-zinc-800 rounded-xl"></div>
      </div>
    );
  }

  const hasSales = product.units_sold > 0;

  return (
    <main className="max-w-3xl mx-auto py-12 px-4 min-h-screen">
      <div className="mb-8">
        <button
          onClick={() => router.push('/products')}
          className="text-zinc-500 hover:text-[#e0ff4f] font-mono text-sm underline underline-offset-4 mb-4 inline-block transition-colors"
        >
          ← Volver a Mis Productos
        </button>
        <h1 className="text-3xl font-bold text-white tracking-tight">Editar Producto</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col gap-6 relative overflow-hidden">

        {hasSales && (
          <div className="rounded-xl border p-4 flex items-start gap-3"
            style={{ background: 'rgba(234,179,8,0.06)', borderColor: 'rgba(234,179,8,0.2)' }}>
            <span className="text-yellow-400 text-xl mt-0.5 shrink-0">⚠️</span>
            <p className="text-sm text-yellow-300/80 leading-relaxed">
              <strong className="font-semibold text-yellow-400 mr-1">Edición limitada:</strong>
              Este producto ya tiene <strong>{product.units_sold}</strong> unidad{product.units_sold !== 1 ? 'es' : ''} vendida{product.units_sold !== 1 ? 's' : ''}.
              Para proteger el historial de compradores, <strong>solo puedes ajustar el stock disponible</strong>.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Título del Producto</label>
          <input
            type="text"
            name="title"
            value={product.title || ''}
            onChange={handleChange}
            disabled={hasSales}
            className={`w-full p-3.5 rounded-xl text-white outline-none transition-colors text-sm ${
              hasSales
                ? 'bg-zinc-800/40 border border-zinc-800 opacity-40 cursor-not-allowed'
                : 'bg-zinc-800 border border-zinc-700 focus:border-[#e0ff4f]/40 focus:ring-2 focus:ring-[#e0ff4f]/10'
            }`}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Descripción</label>
          <textarea
            name="description"
            value={product.description || ''}
            onChange={handleChange}
            disabled={hasSales}
            rows="5"
            className={`w-full p-3.5 rounded-xl text-white outline-none transition-colors resize-none text-sm ${
              hasSales
                ? 'bg-zinc-800/40 border border-zinc-800 opacity-40 cursor-not-allowed'
                : 'bg-zinc-800 border border-zinc-700 focus:border-[#e0ff4f]/40 focus:ring-2 focus:ring-[#e0ff4f]/10'
            }`}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Precio ($)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={product.price || ''}
              onChange={handleChange}
              disabled={hasSales}
              className={`w-full p-3.5 rounded-xl text-white outline-none transition-colors font-mono tracking-wide text-sm ${
                hasSales
                  ? 'bg-zinc-800/40 border border-zinc-800 opacity-40 cursor-not-allowed'
                  : 'bg-zinc-800 border border-zinc-700 focus:border-[#e0ff4f]/40 focus:ring-2 focus:ring-[#e0ff4f]/10'
              }`}
              required
            />
          </div>

          <div className="flex flex-col gap-2 relative group">
            <label className="text-xs font-semibold uppercase tracking-wider flex justify-between items-center"
              style={{ color: hasSales ? '#e0ff4f' : '#71717a' }}>
              <span>Stock Disponible</span>
              {hasSales && (
                <span className="text-[10px] font-mono text-[#e0ff4f] bg-[#e0ff4f]/10 px-2 py-0.5 rounded border border-[#e0ff4f]/20">
                  Editable
                </span>
              )}
            </label>
            <input
              type="number"
              name="stock"
              min="0"
              value={product.stock !== undefined ? product.stock : 0}
              onChange={handleChange}
              className={`w-full p-3.5 rounded-xl text-white outline-none transition-all font-mono tracking-wide text-sm ${
                hasSales
                  ? 'bg-zinc-800 border border-[#e0ff4f]/40 focus:border-[#e0ff4f] shadow-[0_0_20px_rgba(224,255,79,0.08)] ring-1 ring-[#e0ff4f]/20'
                  : 'bg-zinc-800 border border-zinc-700 focus:border-[#e0ff4f]/40 focus:ring-2 focus:ring-[#e0ff4f]/10'
              }`}
              required
            />
            {hasSales && (
              <p className="text-xs text-zinc-600 mt-1">
                Si estableces 0, el producto se pausará automáticamente.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-800 mt-2 gap-4">
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="px-6 py-2.5 rounded-xl font-semibold text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-all border border-transparent hover:border-zinc-700 text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-wait active:scale-95 text-sm"
            style={{ background: '#e0ff4f', color: '#0a0a0a' }}
          >
            {saving ? "Guardando…" : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </main>
  );
}
