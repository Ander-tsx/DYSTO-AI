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
        // Utilizamos el endpoint de edición (que asumimos retorna detail si se le hace GET) 
        // o el endpoint de public si somos nosotros los dueños
        const res = await api.get(`/products/${id}/edit/`).catch(() => api.get(`/products/${id}/`));
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        notify.error("Error", "No se pudo cargar la información del producto.");
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
      await api.put(`/products/${id}/edit/`, product);
      notify.success("Producto actualizado", "Los cambios han sido guardados correctamente.");
      router.push('/products');
    } catch (err) {
      console.error(err);
      notify.error("Error", "Hubo un problema actualizando el producto. Verifica los datos o tus permisos.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 animate-pulse">
        <div className="h-8 w-64 bg-surface border border-border rounded mb-8"></div>
        <div className="h-96 w-full bg-surface border border-border rounded-xl"></div>
      </div>
    );
  }

  const hasSales = product.units_sold > 0;

  return (
    <main className="max-w-3xl mx-auto py-12 px-4 min-h-screen">
      <div className="mb-8">
        <button 
          onClick={() => router.push('/products')}
          className="text-text-muted hover:text-accent font-mono text-sm underline underline-offset-4 mb-4 inline-block transition-colors"
        >
          ← Volver a Mis Productos
        </button>
        <h1 className="text-3xl font-bold text-text tracking-tight">Editar Producto</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-surface border border-border p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        
        {hasSales && (
          <div className="absolute top-0 left-0 right-0 p-4 bg-yellow-500/10 border-b border-yellow-500/50 flex items-start sm:items-center gap-3">
            <span className="text-yellow-500 text-xl mt-1 sm:mt-0">⚠️</span>
            <p className="text-sm text-yellow-300">
              <strong className="font-semibold text-yellow-500 mr-2">Edición Limitada:</strong> 
              Este producto ya cuenta con historial de ventas ({product.units_sold} ud). Para proteger el historial de los compradores, 
              <strong> solo es posible ajustar la cantidad de Stock disponible</strong>.
            </p>
          </div>
        )}

        <div className={hasSales ? "mt-16 sm:mt-12" : ""}></div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-muted">Título del Producto</label>
          <input 
            type="text" 
            name="title"
            value={product.title || ''} 
            onChange={handleChange}
            disabled={hasSales}
            className={`w-full p-3.5 bg-background border border-border rounded-xl text-text focus:border-accent outline-none transition-colors ${hasSales ? 'opacity-50 cursor-not-allowed bg-surface' : 'hover:border-border/80'}`}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-muted">Descripción</label>
          <textarea 
            name="description"
            value={product.description || ''} 
            onChange={handleChange}
            disabled={hasSales}
            rows="5"
            className={`w-full p-3.5 bg-background border border-border rounded-xl text-text focus:border-accent outline-none transition-colors resize-none ${hasSales ? 'opacity-50 cursor-not-allowed bg-surface' : 'hover:border-border/80'}`}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-muted">Precio ($)</label>
            <input 
              type="number" 
              step="0.01"
              name="price"
              value={product.price || ''} 
              onChange={handleChange}
              disabled={hasSales}
              className={`w-full p-3.5 bg-background border border-border rounded-xl text-text focus:border-accent outline-none transition-colors font-mono tracking-wide ${hasSales ? 'opacity-50 cursor-not-allowed bg-surface' : 'hover:border-border/80'}`}
              required
            />
          </div>
          
          <div className="flex flex-col gap-2 relative group">
            <label className="text-sm font-semibold flex justify-between items-center text-text-muted group-hover:text-accent transition-colors">
              <span>Stock Disponible</span>
              {hasSales && (
                <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                  Totalmente Editable
                </span>
              )}
            </label>
            <input 
              type="number" 
              name="stock"
              min="0"
              value={product.stock !== undefined ? product.stock : 0} 
              onChange={handleChange}
              className={`w-full p-3.5 bg-background border rounded-xl text-text outline-none transition-all font-mono tracking-wide ${
                hasSales 
                  ? 'border-accent/60 focus:border-accent shadow-[0_0_15px_rgba(34,211,238,0.15)] ring-1 ring-accent/30' 
                  : 'border-border focus:border-accent hover:border-border/80'
              }`}
              required
            />
            {hasSales && (
               <p className="text-xs text-text-muted absolute -bottom-6 left-0">Si estableces 0, el producto se pausará automáticamente.</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end pt-6 sm:pt-8 border-t border-border mt-4 gap-4">
          <button 
            type="button" 
            onClick={() => router.push('/products')}
            className="px-6 py-2.5 rounded-xl font-semibold text-text-muted hover:bg-surface hover:text-text transition-all border border-transparent hover:border-border"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={saving}
            className="bg-accent text-white px-8 py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-wait"
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </main>
  );
}
