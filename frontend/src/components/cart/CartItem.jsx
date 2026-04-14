'use client';

import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export default function CartItem({ item }) {
  const { updateItem, removeItem } = useCart();
  const { id, quantity, product, subtotal } = item;

  return (
    <div className="flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-sm transition hover:border-zinc-700 hover:shadow-md">
      {/* Product image */}
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-800">
        {product?.main_image ? (
          <img
            src={product.main_image}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-zinc-700">
            <ImageIcon size={20} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <h3 className="truncate text-sm font-semibold text-zinc-100" title={product?.title}>
          {product?.title || 'Producto'}
        </h3>
        <p className="text-xs text-zinc-500 font-mono">
          ${Number(product?.price || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} c/u
        </p>

        {/* Quantity selector */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-zinc-600">Cant.:</span>
          <div className="flex items-center overflow-hidden rounded-lg border border-zinc-800">
            <button
              aria-label="Disminuir"
              onClick={() => updateItem(id, Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="h-7 w-7 flex items-center justify-center bg-zinc-800 text-zinc-400 transition hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus size={12} />
            </button>
            <span className="h-7 w-9 flex items-center justify-center bg-zinc-900 text-xs font-bold text-zinc-100">
              {quantity}
            </span>
            <button
              aria-label="Aumentar"
              onClick={() => updateItem(id, quantity + 1)}
              className="h-7 w-7 flex items-center justify-center bg-zinc-800 text-zinc-400 transition hover:bg-zinc-700 hover:text-white disabled:opacity-30"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Subtotal + remove */}
      <div className="flex flex-col items-end justify-between shrink-0">
        <span className="text-sm font-bold text-[#e0ff4f] font-mono">
          ${Number(subtotal || 0).toFixed(2)}
        </span>
        <button
          onClick={() => removeItem(id)}
          className="mt-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-400 transition hover:border-rose-500/50 hover:bg-rose-500/20 hover:text-rose-300"
          aria-label="Eliminar producto"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}