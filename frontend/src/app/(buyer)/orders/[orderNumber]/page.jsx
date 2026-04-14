'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import OrderTicket from '@/components/orders/OrderTicket.jsx';


export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError('');

      try {
        const orderNumber = decodeURIComponent(params?.orderNumber || '');
        const res = await api.get(`/orders/${orderNumber}/`);
        setOrder(res.data || null);
      } catch (err) {
        setError(err.response?.data?.detail || 'No se pudo cargar el detalle de la orden.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params?.orderNumber]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {searchParams.get('from') === 'checkout' && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-300">
          Compra confirmada. Aqui tienes tu comprobante.
        </div>
      )}

      {loading && <p className="text-zinc-400">Cargando comprobante...</p>}

      {!loading && error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300">
          <p>{error}</p>
          <Link
            href="/orders"
            className="mt-3 inline-flex rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500"
          >
            Volver al historial
          </Link>
        </div>
      )}

      {!loading && !error && order && <OrderTicket order={order} showHistoryLink />}
    </main>
  );
}