'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@/lib/axios';
import ProductCard from '@/components/product/ProductCard.jsx';
import CustomSelect from '@/components/ui/CustomSelect.jsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import PropTypes from 'prop-types';

// ── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl h-[360px] animate-pulse overflow-hidden">
      <div className="h-52 bg-zinc-800 w-full" />
      <div className="p-5 flex flex-col flex-grow gap-3">
        <div className="h-3 w-1/4 bg-zinc-800 rounded" />
        <div className="h-5 w-3/4 bg-zinc-800 rounded" />
        <div className="mt-auto h-8 w-1/3 bg-zinc-800 rounded" />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local filter state (auto-applied)
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Load categories
  useEffect(() => {
    api.get('/products/categories/')
      .then(res => setCategories(res.data || []))
      .catch(() => { });
  }, []);

  // Push filters to URL (debounced for text inputs)
  const pushFilters = useCallback(({ s, cat, min, max, srt }) => {
    const params = new URLSearchParams();
    if (s) params.set('search', s);
    if (cat) params.set('category', cat);
    if (min) params.set('min_price', min);
    if (max) params.set('max_price', max);
    if (srt) params.set('sort', srt);
    router.push(`/?${params.toString()}`);
  }, [router]);

  // Debounce for search + price
  useEffect(() => {
    const t = setTimeout(() => {
      pushFilters({ s: search, cat: category, min: minPrice, max: maxPrice, srt: sort });
    }, 350);
    return () => clearTimeout(t);
  }, [search, minPrice, maxPrice]);

  // Immediate apply for selects
  useEffect(() => {
    pushFilters({ s: search, cat: category, min: minPrice, max: maxPrice, srt: sort });
  }, [category, sort]);

  // Fetch products from URL params
  const fetchProducts = async (pageNumber = 1) => {
    try {
      pageNumber === 1 ? setLoading(true) : setIsLoadingMore(true);

      const { products: newProducts, hasMore } = await fetchProductsApi({ pageNumber, searchParams });

      setProducts(prev =>
        pageNumber === 1 ? newProducts : [...prev, ...newProducts]
      );

      setHasMore(hasMore);
    } catch (err) {
      setError(err.response?.data?.detail || 'No se pudieron cargar los productos en este momento.');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setProducts([]);
    fetchProducts(1);
  }, [searchParams.toString()]);

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('');
  };

  const hasActiveFilters = useMemo(() => {
    return [search, category, minPrice, maxPrice, sort].some(Boolean);
  }, [search, category, minPrice, maxPrice, sort]);

  const { categoryOptions, sortOptions } = useMarketplaceOptions(categories);

  const isEmpty = products.length === 0;
  const showError = !!error;
  const isLoadingState = loading && !error;

  const productText = products.length === 1
    ? '1 producto encontrado'
    : `${products.length} productos encontrados`;

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Hero / Search Section */}
      <div className="border-b border-zinc-900 bg-gradient-to-b from-zinc-950 to-[#0a0a0a] pt-12 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-white">
            Marketplace{' '}
            <span className="font-mono" style={{ color: '#e0ff4f' }}>DystoAI</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Explora los mejores modelos, prompts y herramientas de inteligencia artificial.
          </p>
        </div>

        {/* Big Search Bar */}
        <div className="max-w-4xl mx-auto">
          <div className="relative mb-4">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar productos, modelos, prompts…"
              className="w-full h-14 pl-12 pr-4 rounded-2xl text-base bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e0ff4f]/50 focus:ring-2 focus:ring-[#e0ff4f]/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <CustomSelect
              id="filter-category"
              value={category}
              onChange={setCategory}
              options={categoryOptions}
              placeholder="Categoría"
            />
            <CustomSelect
              id="filter-sort"
              value={sort}
              onChange={setSort}
              options={sortOptions}
              placeholder="Ordenar por"
            />
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs font-mono pointer-events-none">$</span>
              <input
                type="number"
                placeholder="Precio mínimo"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                className="w-full h-10 pl-6 pr-3 rounded-lg text-sm bg-zinc-800/60 border border-zinc-700/60 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#e0ff4f]/50 transition-all"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs font-mono pointer-events-none">$</span>
              <input
                type="number"
                placeholder="Precio máximo"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="w-full h-10 pl-6 pr-3 rounded-lg text-sm bg-zinc-800/60 border border-zinc-700/60 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#e0ff4f]/50 transition-all"
              />
            </div>
          </div>

          {/* Active filters chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-3">
              <SlidersHorizontal size={14} className="text-zinc-600" />
              <span className="text-xs text-zinc-600">Filtros activos:</span>
              {search && <Chip label={`"${search}"`} onRemove={() => setSearch('')} />}
              {category && <Chip label={category} onRemove={() => setCategory('')} />}
              {minPrice && <Chip label={`Min $${minPrice}`} onRemove={() => setMinPrice('')} />}
              {maxPrice && <Chip label={`Max $${maxPrice}`} onRemove={() => setMaxPrice('')} />}
              {sort && <Chip label={sort === 'price_asc' ? 'Precio ↑' : 'Precio ↓'} onRemove={() => setSort('')} />}
              <button
                onClick={clearFilters}
                className="ml-1 text-xs text-zinc-600 hover:text-zinc-300 transition-colors underline"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center font-mono mb-8 text-sm">
            {error}
          </div>
        )}

        {isLoadingState ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))}
          </div>
        ) : (
          <>
            {isEmpty && !showError ? (
              <div className="text-center py-24 bg-zinc-900/40 rounded-2xl border border-zinc-800 border-dashed">
                <span className="text-4xl mb-4 block opacity-40">🔍</span>
                <h3 className="text-xl font-semibold text-zinc-300 mb-2">No se encontraron productos</h3>
                <p className="text-zinc-600">
                  {hasActiveFilters ? 'Prueba con diferentes filtros o' : 'El catálogo está vacío.'}{' '}
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-[#e0ff4f] underline hover:no-underline">
                      limpia los filtros
                    </button>
                  )}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-zinc-600">
                    {productText}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}

            {/* Load More */}
            {hasMore && products.length > 0 && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-[#e0ff4f] hover:text-[#e0ff4f] font-semibold py-3 px-10 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-wait text-sm"
                >
                  {isLoadingMore ? 'Cargando...' : 'Cargar más productos'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

const fetchProductsApi = async ({ pageNumber, searchParams }) => {
  const response = await api.get('/products/', {
    params: {
      page: pageNumber,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      min_price: searchParams.get('min_price') || '',
      max_price: searchParams.get('max_price') || '',
      sort: searchParams.get('sort') || '',
    }
  });

  return {
    products: response.data.results || response.data,
    hasMore: !!response.data.next,
  };
};

const useMarketplaceOptions = (categories) => {
  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    ...categories.map(c => ({ value: c, label: c })),
  ];

  const sortOptions = [
    { value: '', label: 'Más recientes' },
    { value: 'price_asc', label: 'Precio: menor a mayor' },
    { value: 'price_desc', label: 'Precio: mayor a menor' },
  ];

  return { categoryOptions, sortOptions };
};

function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e0ff4f]/10 border border-[#e0ff4f]/20 text-[#e0ff4f] text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:opacity-70 transition-opacity">
        <X size={11} />
      </button>
    </span>
  );
}

Chip.propTypes = {
  label: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
};