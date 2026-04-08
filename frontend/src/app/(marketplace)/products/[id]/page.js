'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import ImageGallery from '@/components/product/ImageGallery';

// ── Mini Icons ─────────────────────────────────────────────────────────────────

function ArrowLeftIcon({ size = 18 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function CartIcon({ size = 18 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function TagIcon({ size = 14 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function BoxIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  );
}

function ShieldOffIcon({ size = 22 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
      {/* Gallery skeleton */}
      <div>
        <div className="rounded-2xl bg-[#161616] aspect-[4/3] w-full" />
        <div className="flex gap-2 mt-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-16 h-16 rounded-lg bg-[#161616]" />
          ))}
        </div>
      </div>
      {/* Info skeleton */}
      <div className="flex flex-col gap-4">
        <div className="h-4 w-24 rounded bg-[#1f1f1f]" />
        <div className="h-8 w-3/4 rounded bg-[#1f1f1f]" />
        <div className="h-4 w-full rounded bg-[#1f1f1f]" />
        <div className="h-4 w-5/6 rounded bg-[#1f1f1f]" />
        <div className="h-10 w-1/3 rounded bg-[#1f1f1f] mt-4" />
        <div className="h-12 w-full rounded-xl bg-[#1f1f1f] mt-4" />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cart state
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    api.get(`/products/public/${id}/`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        if (err.response?.status === 404) {
          setError('Producto no encontrado.');
        } else {
          setError('No se pudo cargar el producto. Intenta de nuevo.');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setAdding(true);
    setAddError(null);
    setAddSuccess(false);
    try {
      await api.post('/carts/add/', { product_id: product.id, cantidad: quantity });
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al agregar al carrito.';
      setAddError(msg);
      setTimeout(() => setAddError(null), 4000);
    } finally {
      setAdding(false);
    }
  };

  // Stock / availability
  const isActive = product?.is_active;
  const isPaused = product && !isActive;
  const stockAvailable = product?.stock || 0;
  const maxQty = Math.min(stockAvailable, 99);

  const formattedPrice = product
    ? Number(product.price).toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
      })
    : '';

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* Breadcrumb nav */}
      <nav aria-label="Ruta de navegación" className="flex items-center gap-2 mb-8 text-sm">
        <Link
          href="/"
          className="flex items-center gap-1.5 font-medium transition-colors duration-200"
          style={{ color: '#666' }}
          onMouseEnter={e => e.currentTarget.style.color = '#e0ff4f'}
          onMouseLeave={e => e.currentTarget.style.color = '#666'}
        >
          <ArrowLeftIcon size={15} />
          Volver al catálogo
        </Link>
        {product && (
          <>
            <span style={{ color: '#333' }}>/</span>
            <span style={{ color: '#444' }} className="truncate max-w-[200px]">{product.title}</span>
          </>
        )}
      </nav>

      {/* Loading */}
      {loading && <ProductDetailSkeleton />}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div
            className="text-center px-6 py-8 rounded-2xl border max-w-md"
            style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.2)' }}
          >
            <p className="text-red-400 font-semibold text-lg mb-2">Oops…</p>
            <p className="text-[#888] text-sm">{error}</p>
          </div>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{ background: '#e0ff4f', color: '#0a0a0a' }}
          >
            Volver al catálogo
          </Link>
        </div>
      )}

      {/* Product content */}
      {!loading && !error && product && (
        <>
          {/* Paused / unavailable banner */}
          {isPaused && (
            <div
              className="flex items-center gap-3 px-5 py-4 rounded-xl border mb-8"
              style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.25)' }}
              role="alert"
            >
              <ShieldOffIcon size={20} />
              <div>
                <p className="text-red-400 font-semibold text-sm">Producto no disponible</p>
                <p className="text-[#888] text-xs mt-0.5">
                  Este producto está pausado o sin stock y no puede adquirirse en este momento.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
            {/* ── Left: Gallery ───────────────────────────────────── */}
            <div>
              <ImageGallery
                mainImage={product.main_image}
                images={product.additional_images || []}
                title={product.title}
              />
            </div>

            {/* ── Right: Product info ──────────────────────────────── */}
            <div className="flex flex-col">

              {/* Category */}
              {product.category && (
                <span
                  className="text-xs font-bold uppercase tracking-widest mb-3 font-mono"
                  style={{ color: '#e0ff4f' }}
                >
                  {product.category}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: '#f0f0f0' }}>
                {product.title}
              </h1>

              {/* Seller */}
              {product.seller_email && (
                <p className="mt-2 text-sm" style={{ color: '#555' }}>
                  Por <span style={{ color: '#888' }}>{product.seller_email}</span>
                </p>
              )}

              {/* Divider */}
              <div className="my-5 border-t" style={{ borderColor: '#1f1f1f' }} />

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-4xl font-extrabold tracking-tight" style={{ color: '#f0f0f0' }}>
                  {formattedPrice}
                </span>
                {isActive && (
                  <span className="text-sm px-3 py-1 rounded-full font-semibold"
                    style={{ background: 'rgba(34,197,94,0.08)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                    Disponible
                  </span>
                )}
                {isPaused && (
                  <span className="text-sm px-3 py-1 rounded-full font-semibold"
                    style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                    No disponible
                  </span>
                )}
              </div>

              {/* Stock indicator */}
              <div className="flex items-center gap-2 mb-5">
                <BoxIcon size={15} />
                <span className="text-sm" style={{ color: '#666' }}>
                  {isActive
                    ? <>Stock disponible: <strong style={{ color: '#f0f0f0' }}>{stockAvailable}</strong> unidades</>
                    : <span style={{ color: '#f87171' }}>Sin stock disponible</span>
                  }
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-2 font-mono" style={{ color: '#444' }}>
                    Descripción
                  </h2>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#999' }}>
                    {product.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-2 font-mono flex items-center gap-1" style={{ color: '#444' }}>
                    <TagIcon /> Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{
                          background: '#161616',
                          color: '#666',
                          border: '1px solid #1f1f1f',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {product.metadata && Object.keys(product.metadata).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-2 font-mono" style={{ color: '#444' }}>
                    Especificaciones
                  </h2>
                  <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#1f1f1f' }}>
                    {Object.entries(product.metadata).map(([key, value], i) => (
                      <div
                        key={key}
                        className="flex justify-between px-4 py-2.5 text-sm"
                        style={{
                          background: i % 2 === 0 ? '#0d0d0d' : '#111111',
                          borderBottom: i < Object.keys(product.metadata).length - 1 ? '1px solid #1a1a1a' : 'none',
                        }}
                      >
                        <span style={{ color: '#555' }} className="capitalize">{key.replace(/_/g, ' ')}</span>
                        <span style={{ color: '#bbb' }} className="text-right max-w-[60%]">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Units sold */}
              {product.units_sold > 0 && (
                <p className="text-xs mb-4" style={{ color: '#444' }}>
                  🔥 {product.units_sold} unidades vendidas
                </p>
              )}

              {/* Divider */}
              <div className="mt-auto border-t pt-6" style={{ borderColor: '#1f1f1f' }}>

                {/* Quantity selector + Add to Cart */}
                {isAuthenticated ? (
                  isActive ? (
                    <div className="flex flex-col gap-3">
                      {/* Qty selector */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm" style={{ color: '#666' }}>Cantidad:</span>
                        <div className="flex items-center rounded-lg border overflow-hidden" style={{ borderColor: '#1f1f1f' }}>
                          <button
                            aria-label="Disminuir cantidad"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            disabled={quantity <= 1}
                            className="w-9 h-9 flex items-center justify-center text-lg font-bold transition-colors disabled:opacity-30"
                            style={{ background: '#111', color: '#f0f0f0' }}
                          >
                            −
                          </button>
                          <span
                            className="w-10 h-9 flex items-center justify-center text-sm font-semibold"
                            style={{ background: '#0d0d0d', color: '#f0f0f0' }}
                          >
                            {quantity}
                          </span>
                          <button
                            aria-label="Aumentar cantidad"
                            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                            disabled={quantity >= maxQty}
                            className="w-9 h-9 flex items-center justify-center text-lg font-bold transition-colors disabled:opacity-30"
                            style={{ background: '#111', color: '#f0f0f0' }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Add to cart button */}
                      <button
                        id="product-add-to-cart-btn"
                        onClick={handleAddToCart}
                        disabled={adding}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          background: addSuccess ? 'rgba(34,197,94,0.1)' : '#e0ff4f',
                          color: addSuccess ? '#4ade80' : '#0a0a0a',
                          border: addSuccess ? '1px solid rgba(34,197,94,0.3)' : 'none',
                        }}
                      >
                        {adding ? (
                          <>
                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                            Agregando…
                          </>
                        ) : addSuccess ? (
                          <>✓ ¡Agregado al carrito!</>
                        ) : (
                          <>
                            <CartIcon />
                            Añadir al carrito
                          </>
                        )}
                      </button>

                      {/* Error feedback */}
                      {addError && (
                        <p className="text-xs text-red-400 text-center">{addError}</p>
                      )}
                    </div>
                  ) : (
                    /* Paused: authenticated but product paused */
                    <div
                      className="flex items-center justify-center py-3.5 px-6 rounded-xl text-sm font-semibold"
                      style={{ background: 'rgba(239,68,68,0.06)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                      role="status"
                    >
                      Producto no disponible para compra
                    </div>
                  )
                ) : (
                  /* Not authenticated: show login prompt */
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-center" style={{ color: '#666' }}>
                      Inicia sesión para añadir este producto al carrito
                    </p>
                    <Link
                      href="/login"
                      id="product-login-to-buy-btn"
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold transition-all duration-200"
                      style={{ background: '#e0ff4f', color: '#0a0a0a' }}
                    >
                      Iniciar sesión para comprar
                    </Link>
                  </div>
                )}
              </div>

              {/* Timestamps */}
              {product.created_at && (
                <p className="text-xs mt-4" style={{ color: '#333' }}>
                  Publicado: {new Date(product.created_at).toLocaleDateString('es-MX', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
