'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import OrderSummaryCard from '@/components/orders/OrderSummaryCard.jsx';


export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/orders/');
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err.response?.data?.detail || 'No se pudo cargar el historial de ordenes.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Compras</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-100">Historial de ordenes</h1>
      </header>

      {loading && <p className="text-zinc-400">Cargando ordenes...</p>}

      {!loading && error && (
        <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300">{error}</p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center">
          <p className="text-zinc-300">Todavia no tienes compras registradas.</p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500"
          >
            Ir al marketplace
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderSummaryCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </main>
  );
}