'use client';

import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem.jsx';
import Link from 'next/link';
import { ShoppingCart, ArrowRight, Store } from 'lucide-react';

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 px-12 py-14 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-5">
          <ShoppingCart size={28} className="text-zinc-600" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100 mb-2">Tu carrito está vacío</h2>
        <p className="text-sm text-zinc-500 mb-6 max-w-xs">
          Explora el marketplace y agrega los productos que te interesen.
        </p>
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
  );
}

export default function CartPage() {
  const { cartItems, cartTotal, cartCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <EmptyCart />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">
          Marketplace DystoAI
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-100">
          Tu carrito{' '}
          <span className="text-lg font-semibold text-zinc-600">
            ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </span>
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-sm">
            <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-zinc-500">
              Resumen
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Subtotal</span>
                <span className="font-mono text-zinc-300 text-sm">
                  ${cartTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Envío</span>
                <span className="text-sm font-semibold text-green-400">Gratis</span>
              </div>
            </div>

            <div className="mt-5 border-t border-dashed border-zinc-800 pt-4 flex items-center justify-between">
              <span className="text-base font-bold text-zinc-100">Total</span>
              <span className="text-xl font-black font-mono" style={{ color: '#e0ff4f' }}>
                ${cartTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex items-center justify-center gap-2 w-full rounded-xl py-3 text-center text-sm font-bold text-zinc-900 shadow-md transition hover:shadow-xl active:scale-95"
              style={{ background: '#e0ff4f' }}
            >
              Proceder al checkout
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/"
              className="mt-3 flex items-center justify-center w-full rounded-xl border border-zinc-800 py-2.5 text-center text-xs font-semibold text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}