'use client';
import React from 'react';
import Link from 'next/link';
import { notify } from '@/utils/notify';
import api from '@/lib/axios';

export default function VendorProductCard({ product, onDelete }) {
  const { id, title, price, stock, is_active, main_image, units_sold } = product;

  const handleDelete = async () => {
    if (!window.confirm(`¿Seguro que deseas eliminar "${title}"?`)) return;

    try {
      await api.delete(`/products/${id}/delete/`);
      notify.success("Producto eliminado", "El producto ha sido borrado exitosamente.");
      if (onDelete) onDelete(id);
    } catch (err) {
      console.error(err);
      notify.error("Error", "No se pudo eliminar el producto porque actualmente no es posible o te faltan permisos.");
    }
  };

  const isActive = is_active;
  const pausedByStock = !isActive && stock === 0;

  return (
    <div className="flex flex-col sm:flex-row items-center bg-surface border border-border rounded-xl p-4 gap-6 hover:border-accent transition-colors shadow-sm">
      <div className="w-24 h-24 shrink-0 bg-background rounded-lg overflow-hidden border border-border/50">
        {main_image ? (
          <img src={main_image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-xs text-text-muted bg-border/20">
            <span className="font-mono opacity-60">NO IMG</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-text truncate" title={title}>{title}</h3>
        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-text-muted">
          <span className="font-mono text-accent font-semibold">${Number(price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
          <span>Stock: <span className={stock > 0 ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>{stock}</span></span>
          <span className="bg-border/30 px-2 rounded">Vendidos: <span className="text-text font-bold">{units_sold || 0}</span></span>
          
          <div>
            {isActive ? (
              <span className="px-2 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(34,197,94,0.1)]">Activo</span>
            ) : pausedByStock ? (
              <span className="px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(239,68,68,0.1)]">Pausado (Stock 0)</span>
            ) : (
              <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-xs font-bold">Pausado</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex sm:flex-col gap-3 shrink-0">
        <Link 
          href={`/products/${id}/edit`}
          className="flex items-center justify-center bg-surface border border-accent/40 text-accent hover:bg-accent hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
        >
          Editar
        </Link>
        <button 
          onClick={handleDelete}
          className="flex items-center justify-center bg-surface border border-red-500/40 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
