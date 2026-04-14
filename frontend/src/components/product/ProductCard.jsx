import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, ShieldOff, Image as ImageIcon } from 'lucide-react';

export default function ProductCard({ product }) {
  const { id, title, price, category, stock, main_image } = product;
  const isAvailable = stock > 0;
  const { addItem } = useCart();

  return (
    <div className="group relative flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1">
      {/* Stock badge */}
      <div className="absolute top-3 right-3 z-10">
        {isAvailable ? (
          <span className="bg-green-500/15 text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-500/25 backdrop-blur-sm">
            Stock: {stock}
          </span>
        ) : (
          <span className="bg-red-500/15 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-500/25 backdrop-blur-sm">
            Agotado
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative h-52 w-full bg-zinc-800 overflow-hidden">
        {main_image ? (
          <img
            src={main_image}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-zinc-700 gap-2">
            <ImageIcon size={28} />
            <span className="text-xs font-mono opacity-60">SIN IMAGEN</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            href={`/products/${id}`}
            className="bg-[#e0ff4f] text-[#0a0a0a] font-bold py-2 px-6 rounded-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75 shadow-lg text-sm"
          >
            Ver Detalles
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-[10px] font-bold uppercase tracking-wider font-mono mb-2" style={{ color: '#e0ff4f' }}>
          {category?.name || category || 'Sin Categoría'}
        </span>

        <h3 className="text-sm font-semibold text-white truncate mb-1" title={title}>
          <Link href={`/products/${id}`} className="hover:text-zinc-300 transition-colors">
            {title}
          </Link>
        </h3>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-zinc-800">
          <span className="text-base font-bold text-white font-mono">
            ${Number(price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
          <button
            onClick={() => addItem(id, 1)}
            disabled={!isAvailable}
            aria-label={isAvailable ? 'Añadir al carrito' : 'Sin stock'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 ${
              isAvailable
                ? 'bg-zinc-800 border border-zinc-700 text-[#e0ff4f] hover:bg-[#e0ff4f] hover:border-[#e0ff4f] hover:text-zinc-900'
                : 'bg-zinc-800/50 border border-zinc-800 opacity-40 cursor-not-allowed'
            }`}
          >
            {isAvailable ? <ShoppingCart size={16} /> : <ShieldOff size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
