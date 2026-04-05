import React from 'react';
import Link from 'next/link';

export default function ProductCard({ product }) {
  // Manejo de variables considerando el serializers del backend
  const { id, title, price, category, stock, main_image } = product;
  const isAvailable = stock > 0;

  return (
    <div className="group relative flex flex-col bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-accent transition-all duration-300 transform hover:-translate-y-1">
      {/* Badge de stock */}
      <div className="absolute top-3 right-3 z-10">
        {isAvailable ? (
          <span className="bg-green-500/10 text-green-500 text-xs font-bold px-3 py-1 rounded-full border border-green-500/20 backdrop-blur-sm">
            Stock: {stock}
          </span>
        ) : (
          <span className="bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1 rounded-full border border-red-500/20 backdrop-blur-sm">
            Agotado
          </span>
        )}
      </div>

      {/* Imagen Principal */}
      <div className="relative h-56 w-full bg-background overflow-hidden">
        {main_image ? (
          <img
            src={main_image}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-text-muted">
            <span className="text-xl opacity-50 font-mono">NO IMG</span>
          </div>
        )}
        
        {/* Overlay en hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            href={`/products/${id}`}
            className="bg-accent text-white font-semibold py-2 px-6 rounded-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100 shadow-lg"
          >
            Ver Detalles
          </Link>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-mono text-accent mb-2 uppercase tracking-wider">
          {category?.name || category || 'Sin Categoría'}
        </span>
        
        <h3 className="text-lg font-semibold text-text truncate mb-1" title={title}>
          <Link href={`/products/${id}`} className="hover:text-accent transition-colors">
            {title}
          </Link>
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
          <span className="text-xl font-bold text-text">
            ${Number(price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
          <button 
            disabled={!isAvailable}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isAvailable 
                ? 'bg-surface border border-border text-accent hover:bg-accent hover:text-white' 
                : 'bg-surface border border-border opacity-50 cursor-not-allowed'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
