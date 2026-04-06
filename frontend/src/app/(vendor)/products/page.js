'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import VendorProductCard from '@/components/product/VendorProductCard';
import { notify } from '@/utils/notify';
import Link from 'next/link';

export default function VendorProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products/my/');
      setProducts(res.data.results || res.data);
    } catch (err) {
      console.error(err);
      notify.error("Error", "No se pudieron cargar tus productos.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 w-48 bg-surface border border-border animate-pulse rounded-lg"></div>
          <div className="h-10 w-32 bg-surface border border-border animate-pulse rounded-full"></div>
        </div>
        <div className="flex flex-col gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-surface border border-border rounded-xl animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto py-10 px-4 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">Mis Productos</h1>
          <p className="text-text-muted font-mono text-sm mt-1">Gestión de inventario y publicaciones</p>
        </div>
        <Link 
          href="/products/new" 
          className="bg-accent text-white px-6 py-2.5 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] flex items-center gap-2"
        >
          <span className="text-xl leading-none">+</span> Publicar Nuevo
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 bg-surface/50 border border-border border-dashed rounded-2xl">
          <span className="text-4xl block mb-4 opacity-50">📦</span>
          <p className="text-text-muted text-lg mb-4">Aún no has publicado ningún producto.</p>
          <Link href="/products/new" className="text-accent hover:underline font-semibold font-mono">
            Comienza creando tu primera oferta IA →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map(product => (
            <VendorProductCard 
              key={product.id} 
              product={product} 
              onDelete={handleRemoveProduct}
            />
          ))}
        </div>
      )}
    </main>
  );
}
