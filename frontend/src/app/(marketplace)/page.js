'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import ProductCard from '@/components/product/ProductCard';

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Paginación
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Carga inicial y por página
  const fetchProducts = async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setIsLoadingMore(true);

      const response = await api.get('/products/public/', {
        params: { page: pageNumber }
      });
      
      const newProducts = response.data.results || response.data;
      const nextURL = response.data.next;

      if (pageNumber === 1) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }
      
      setHasMore(!!nextURL);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("No se pudieron cargar los productos en este momento.");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  // Skeletons para la carga
  const SkeletonCard = () => (
    <div className="flex flex-col bg-surface border border-border rounded-xl h-[380px] animate-pulse overflow-hidden">
      <div className="h-56 bg-border/40 w-full" />
      <div className="p-5 flex flex-col flex-grow">
        <div className="h-3 w-1/4 bg-border/40 rounded mb-4" />
        <div className="h-5 w-3/4 bg-border/40 rounded mb-2" />
        <div className="mt-auto h-8 w-1/3 bg-border/40 rounded" />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header Area */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Marketplace <span className="text-accent font-mono">DystoAI</span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl">
          Explora los mejores modelos, prompts y herramientas de inteligencia artificial listos para integrar.
        </p>
      </div>

      {/* Manejo de estados de Error y Carga Inicial */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-center font-mono mb-8">
          {error}
        </div>
      )}

      {loading && !error ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          {/* Grid de Productos */}
          {products.length === 0 && !error ? (
            <div className="text-center py-20 bg-surface rounded-2xl border border-border">
              <h3 className="text-2xl font-semibold mb-2">No se encontraron productos</h3>
              <p className="text-text-muted">El catálogo está vacío o no hay productos activos momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Botón Cargar Más */}
          {hasMore && products.length > 0 && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="bg-surface border border-border text-text hover:border-accent hover:text-accent font-semibold py-3 px-8 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
              >
                {isLoadingMore ? "Cargando..." : "Cargar más productos"}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
