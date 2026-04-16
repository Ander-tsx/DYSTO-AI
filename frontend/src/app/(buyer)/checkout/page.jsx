'use client';

import { useCart } from '@/context/CartContext';
import api from '@/lib/axios';
import { useState } from 'react';
import AddressSelector from '@/components/orders/AddressSelector.jsx';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, CheckCircle, Loader2, AlertCircle, Store } from 'lucide-react';
import PropTypes from 'prop-types';

function OrderLine({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className={`font-mono text-sm ${highlight ? 'font-bold text-base' : 'text-zinc-300'}`}
        style={highlight ? { color: '#e0ff4f' } : {}}>
        {value}
      </span>
    </div>
  );
}

OrderLine.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  highlight: PropTypes.bool,
};

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [addressId, setAddressId] = useState(null);
  const [error, setError] = useState('');

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 px-12 py-14 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-5">
              <ShoppingCart size={28} className="text-zinc-600" />
            </div>
            <p className="text-zinc-400 mb-5">No tienes productos en el carrito.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-zinc-900 shadow-sm transition hover:shadow-md active:scale-95"
              style={{ background: '#e0ff4f' }}
            >
              <Store size={15} />
              Ir al marketplace
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleCheckout = async () => {
    if (!addressId) {
      setError('Selecciona una dirección de envío para continuar.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/orders/checkout/', { address_id: addressId });
      clearCart();
      const orderNumber = res.data?.order_number;
      if (orderNumber) {
        router.push(`/orders/${orderNumber}?from=checkout`);
        return;
      }
      router.push('/orders');
    } catch (err) {
      setError(err.response?.data?.detail || 'Ha ocurrido un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">
          Confirmar pedido
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-100">Checkout</h1>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Address */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
              Dirección de envío
            </h2>
            <AddressSelector onSelect={setAddressId} />
          </div>

          {/* Products */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
              Productos ({cartCount})
            </h2>
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-zinc-800">
                    {item.product?.main_image ? (
                      <img src={item.product.main_image} alt={item.product.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-zinc-800" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-100">{item.product?.title}</p>
                    <p className="text-xs text-zinc-600 font-mono">× {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-zinc-300 font-mono shrink-0">
                    ${Number(item.subtotal || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
              Resumen del pedido
            </h2>

            <div className="space-y-3">
              <OrderLine label="Subtotal" value={`$${cartTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} />
              <OrderLine label="Envío" value="Gratis" />
            </div>

            <div className="border-t border-dashed border-zinc-800 pt-4">
              <OrderLine
                label="Total"
                value={`$${cartTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
                highlight
              />
            </div>

            {/* Error feedback */}
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              id="confirm-checkout-btn"
              onClick={handleCheckout}
              disabled={loading || !addressId}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-zinc-900 shadow-md transition hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: loading ? '#555' : '#e0ff4f', color: loading ? '#999' : '#0a0a0a' }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Procesando…
                </>
              ) : (
                <>
                  <CheckCircle size={15} />
                  Confirmar pedido
                </>
              )}
            </button>

            <Link
              href="/cart"
              className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-zinc-800 py-2.5 text-center text-xs font-semibold text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300"
            >
              <ArrowLeft size={13} />
              Volver al carrito
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}