'use client';

// FilterPanel is now embedded directly in the marketplace and vendor pages.
// This file is kept for backward compatibility / future use.

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

function CustomSelect({ value, onChange, options, placeholder, id }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        id={id}
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between gap-2 w-full h-10 px-3 rounded-lg text-sm font-medium bg-zinc-800/60 border border-zinc-700/60 text-zinc-200 hover:border-zinc-600 transition-all"
      >
        <span className={selected ? 'text-white' : 'text-zinc-500'}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-200 text-zinc-500 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50"
          style={{
            background: 'rgba(18,18,18,0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
          }}
        >
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`flex items-center w-full px-4 py-2.5 text-sm text-left transition-colors ${
                value === opt.value
                  ? 'text-[#e0ff4f] bg-[#e0ff4f]/8'
                  : 'text-zinc-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {opt.label}
              {value === opt.value && <span className="ml-auto text-[#e0ff4f]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
      .catch(() => {});
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
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Precio (MXN)</label>
        <div className="flex gap-2">
          <input
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