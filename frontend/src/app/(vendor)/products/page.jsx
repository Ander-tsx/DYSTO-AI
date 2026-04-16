'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import VendorProductCard from '@/components/product/VendorProductCard.jsx';
import CustomSelect from '@/components/ui/CustomSelect.jsx';
import { notify } from '@/utils/notify';
import Link from 'next/link';
import { Search, Plus, Package, X } from 'lucide-react';

// ── Empty / Publish Card ──────────────────────────────────────────────────────

function PublishCard() {
  return (
    <Link
      href="/products/new"
      className="group flex flex-col items-center justify-center bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-2xl h-[360px] hover:border-[#e0ff4f]/50 hover:bg-zinc-900/50 transition-all duration-300"
    >
      <div className="w-14 h-14 rounded-2xl bg-zinc-800 group-hover:bg-[#e0ff4f]/10 border border-zinc-700 group-hover:border-[#e0ff4f]/30 flex items-center justify-center mb-4 transition-all duration-300">
        <Plus size={24} className="text-zinc-600 group-hover:text-[#e0ff4f] transition-colors duration-300" />
      </div>
      <p className="text-sm font-semibold text-zinc-500 group-hover:text-zinc-300 transition-colors mb-1">Publicar nuevo producto</p>
      <p className="text-xs text-zinc-700 group-hover:text-zinc-500 transition-colors">Haz clic para comenzar</p>
    </Link>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="h-28 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse" />
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function VendorProductsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortFilter, setSortFilter] = useState('');

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
      notify.error('Error', err.response?.data?.detail || 'No se pudieron cargar tus productos.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Filtered + sorted products
  const filtered = products
    .filter(p => {
      const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        !statusFilter ||
        (statusFilter === 'active' && p.is_active) ||
        (statusFilter === 'inactive' && !p.is_active);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortFilter === 'price_asc') return a.price - b.price;
      if (sortFilter === 'price_desc') return b.price - a.price;
      if (sortFilter === 'stock_asc') return a.stock - b.stock;
      return 0;
    });

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Pausados' },
  ];

  const sortOptions = [
    { value: '', label: 'Más recientes' },
    { value: 'price_asc', label: 'Precio: menor a mayor' },
    { value: 'price_desc', label: 'Precio: mayor a menor' },
    { value: 'stock_asc', label: 'Stock: menor primero' },
  ];

  const productCountText = (() => {
    if (loading) return 'Cargando...';

    const total = products.length;
    const visible = filtered.length;
    const suffix = total === 1 ? '' : 's';

    return `${visible} de ${total} producto${suffix}`;
  })();

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header + Search */}
      <div className="border-b border-zinc-900 bg-gradient-to-b from-zinc-950 to-[#0a0a0a] pt-12 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#e0ff4f]/10 border border-[#e0ff4f]/20 flex items-center justify-center">
              <Package size={18} className="text-[#e0ff4f]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Mis Productos
            </h1>
          </div>
          <p className="text-zinc-400 text-lg">
            Gestiona tu inventario y publicaciones en DystoAI.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Search */}
          <div className="relative mb-4">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar entre tus productos…"
              className="w-full h-14 pl-12 pr-4 rounded-2xl text-base bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e0ff4f]/50 focus:ring-2 focus:ring-[#e0ff4f]/20 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-3">
            <CustomSelect id="vendor-filter-status" value={statusFilter} onChange={setStatusFilter} options={statusOptions} placeholder="Estado" />
            <CustomSelect id="vendor-filter-sort" value={sortFilter} onChange={setSortFilter} options={sortOptions} placeholder="Ordenar por" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-zinc-600">
            {productCountText}
          </p>
          <Link
            href="/products/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
            style={{ background: '#e0ff4f', color: '#0a0a0a' }}
          >
            <Plus size={16} />
            Publicar nuevo
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => <SkeletonRow key={i} />)}
          </div>
        ) : (
          <>
            {/* 2-column grid: publish card first + products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {/* Always show publish card first */}
              <PublishCard />

              {filtered.map(product => (
                <VendorProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleRemoveProduct}
                  viewMode="card"
                />
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-16">
                <p className="text-zinc-500 text-base">Aún no has publicado ningún producto.</p>
                <p className="text-zinc-700 text-sm mt-1">Haz clic en la tarjeta de arriba para comenzar.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
