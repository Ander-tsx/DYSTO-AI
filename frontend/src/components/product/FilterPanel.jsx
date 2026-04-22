'use client';

// FilterPanel is now embedded directly in the marketplace and vendor pages.
// This file is kept for backward compatibility / future use.

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import { SlidersHorizontal } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect.jsx';

export default function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    api.get('/products/categories/')
      .then(res => setCategories(res.data || []))
      .catch(() => { });
  }, []);

  // Auto-apply on change with debounce
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (minPrice) params.set('min_price', minPrice); else params.delete('min_price');
      if (maxPrice) params.set('max_price', maxPrice); else params.delete('max_price');
      if (sort) params.set('sort', sort); else params.delete('sort');
      if (category) params.set('category', category); else params.delete('category');
      router.push(`/?${params.toString()}`);
    }, 350);
    return () => clearTimeout(t);
  }, [minPrice, maxPrice, sort, category]);

  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    ...categories.map(c => ({ value: c, label: c })),
  ];

  const sortOptions = [
    { value: '', label: 'Más recientes' },
    { value: 'price_asc', label: 'Precio ↑' },
    { value: 'price_desc', label: 'Precio ↓' },
  ];

  const clearFilters = () => {
    setMinPrice(''); setMaxPrice(''); setSort(''); setCategory('');
    router.push('/');
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-zinc-500" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Filtros</h3>
        </div>
        <button onClick={clearFilters} className="text-xs text-zinc-600 transition hover:text-zinc-300">
          Limpiar
        </button>
      </div>

      <CustomSelect id="filter-panel-category" value={category} onChange={setCategory} options={categoryOptions} placeholder="Categoría" />
      <CustomSelect id="filter-panel-sort" value={sort} onChange={setSort} options={sortOptions} placeholder="Ordenar por" />

      <div className="space-y-2">
        <label htmlFor="filter-panel-min-price" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Precio (MXN)</label>
        <div className="flex gap-2">
          <input
            id="filter-panel-min-price"
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="w-1/2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-1/2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
          />
        </div>
      </div>
    </div>
  );
}