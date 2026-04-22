'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ImageGallery from '@/components/product/ImageGallery.jsx';
import PropTypes from 'prop-types';

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

ArrowLeftIcon.propTypes = {
  size: PropTypes.number,
};

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

CartIcon.propTypes = {
  size: PropTypes.number,
};

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

TagIcon.propTypes = {
  size: PropTypes.number,
};

function BoxIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  );
}

BoxIcon.propTypes = {
  size: PropTypes.number,
};

function ShieldOffIcon({ size = 22 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}

ShieldOffIcon.propTypes = {
  size: PropTypes.number,
};

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

// ── Extracted Sub-components ──────────────────────────────────────────────────

/** Badge de disponibilidad junto al precio */
function AvailabilityBadge({ isActive, isPaused }) {
  if (isActive) {
    return (
      <span className="text-sm px-3 py-1 rounded-full font-semibold"
        style={{ background: 'rgba(34,197,94,0.08)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
        Disponible
      </span>
    );
  }
  if (isPaused) {
    return (
      <span className="text-sm px-3 py-1 rounded-full font-semibold"
        style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
        No disponible
      </span>
    );
  }
  return null;
}

AvailabilityBadge.propTypes = {
  isActive: PropTypes.bool,
  isPaused: PropTypes.bool,
};

/** Indicador de stock */
function StockIndicator({ isActive, stockAvailable }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <BoxIcon size={15} />
      <span className="text-sm" style={{ color: '#666' }}>
        {isActive
          ? <>Stock disponible: <strong style={{ color: '#f0f0f0' }}>{stockAvailable}</strong> unidades</>
          : <span style={{ color: '#f87171' }}>Sin stock disponible</span>
        }
      </span>
    </div>
  );
}

StockIndicator.propTypes = {
  isActive: PropTypes.bool,
  stockAvailable: PropTypes.number,
};

/** Botón "Añadir al carrito" con sus estados de carga / éxito */
function AddToCartButton({ adding, addSuccess, onClick }) {
  const buttonStyle = {
    background: addSuccess ? 'rgba(34,197,94,0.1)' : '#e0ff4f',
    color: addSuccess ? '#4ade80' : '#0a0a0a',
    border: addSuccess ? '1px solid rgba(34,197,94,0.3)' : 'none',
  };

  const renderContent = () => {
    if (adding) {
      return (
        <>
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Agregando…
        </>
      );
    }
    if (addSuccess) {
      return <>✓ ¡Agregado al carrito!</>;
    }
    return (
      <>
        <CartIcon />
        Añadir al carrito
      </>
    );
  };

  return (
    <button
      id="product-add-to-cart-btn"
      onClick={onClick}
      disabled={adding}
      className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      style={buttonStyle}
    >
      {renderContent()}
    </button>
  );
}

AddToCartButton.propTypes = {
  adding: PropTypes.bool,
  addSuccess: PropTypes.bool,
  onClick: PropTypes.func,
};

/** Sección de acción: selector de cantidad + carrito / mensajes según estado */
function CartActionSection({
  isAuthenticated, isOwnProduct, isActive, quantity, maxQty,
  adding, addSuccess, addError, onQuantityChange, onAddToCart,
}) {
  if (!isAuthenticated) {
    return (
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
    );
  }

  if (isOwnProduct) {
    return (
      <div
        className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold"
        style={{ background: 'rgba(224,255,79,0.06)', border: '1px solid rgba(224,255,79,0.15)', color: '#e0ff4f' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="2" />
        </svg>
        Este es tu producto
      </div>
    );
  }

  if (!isActive) {
    return (
      <div
        className="flex items-center justify-center py-3.5 px-6 rounded-xl text-sm font-semibold"
        style={{ background: 'rgba(239,68,68,0.06)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
      >
        Producto no disponible para compra
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Qty selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm" style={{ color: '#666' }}>Cantidad:</span>
        <div className="flex items-center rounded-lg border overflow-hidden" style={{ borderColor: '#1f1f1f' }}>
          <button
            aria-label="Disminuir cantidad"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
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
            onClick={() => onQuantityChange(Math.min(maxQty, quantity + 1))}
            disabled={quantity >= maxQty}
            className="w-9 h-9 flex items-center justify-center text-lg font-bold transition-colors disabled:opacity-30"
            style={{ background: '#111', color: '#f0f0f0' }}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <AddToCartButton adding={adding} addSuccess={addSuccess} onClick={onAddToCart} />

      {/* Error feedback */}
      {addError && (
        <p className="text-xs text-red-400 text-center">{addError}</p>
      )}
    </div>
  );
}

CartActionSection.propTypes = {
  isAuthenticated: PropTypes.bool,
  isOwnProduct: PropTypes.bool,
  isActive: PropTypes.bool,
  quantity: PropTypes.number,
  maxQty: PropTypes.number,
  adding: PropTypes.bool,
  addSuccess: PropTypes.bool,
  addError: PropTypes.string,
  onQuantityChange: PropTypes.func,
  onAddToCart: PropTypes.func,
};

/** Contenido principal del producto (galería + info) */
function ProductContent({
  product, formattedPrice, isActive, isPaused, stockAvailable,
  isAuthenticated, isOwnProduct, quantity, maxQty,
  adding, addSuccess, addError, onQuantityChange, onAddToCart,
}) {
  return (
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
            <AvailabilityBadge isActive={isActive} isPaused={isPaused} />
          </div>

          {/* Stock indicator */}
          <StockIndicator isActive={isActive} stockAvailable={stockAvailable} />

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
                {product.tags.map((tag) => (
                  <span
                    key={tag}
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


          {/* Units sold */}
          {product.units_sold > 0 && (
            <p className="text-xs mb-4" style={{ color: '#444' }}>
              🔥 {product.units_sold} unidades vendidas
            </p>
          )}

          {/* Divider */}
          <div className="mt-auto border-t pt-6" style={{ borderColor: '#1f1f1f' }}>
            <CartActionSection
              isAuthenticated={isAuthenticated}
              isOwnProduct={isOwnProduct}
              isActive={isActive}
              quantity={quantity}
              maxQty={maxQty}
              adding={adding}
              addSuccess={addSuccess}
              addError={addError}
              onQuantityChange={onQuantityChange}
              onAddToCart={onAddToCart}
            />
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
  );
}

ProductContent.propTypes = {
  product: PropTypes.object,
  formattedPrice: PropTypes.string,
  isActive: PropTypes.bool,
  isPaused: PropTypes.bool,
  stockAvailable: PropTypes.number,
  isAuthenticated: PropTypes.bool,
  isOwnProduct: PropTypes.bool,
  quantity: PropTypes.number,
  maxQty: PropTypes.number,
  adding: PropTypes.bool,
  addSuccess: PropTypes.bool,
  addError: PropTypes.string,
  onQuantityChange: PropTypes.func,
  onAddToCart: PropTypes.func,
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { addItem } = useCart();

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

    // URL corregida: /products/public/{id}/ → /products/{id}/ (post-refactoring)
    api.get(`/products/${id}/`)
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
    const result = await addItem(product.id, quantity);
    if (result.success) {
      setAddSuccess(true);
      // Redirigir al carrito ya actualizado
      setTimeout(() => router.push('/cart'), 400);
    } else {
      setAddError(result.message);
      setTimeout(() => setAddError(null), 4000);
    }
    setAdding(false);
  };

  // Si el usuario autenticado es el vendedor del producto
  const isOwnProduct = isAuthenticated && user?.email === product?.seller_email;

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
        <ProductContent
          product={product}
          formattedPrice={formattedPrice}
          isActive={isActive}
          isPaused={isPaused}
          stockAvailable={stockAvailable}
          isAuthenticated={isAuthenticated}
          isOwnProduct={isOwnProduct}
          quantity={quantity}
          maxQty={maxQty}
          adding={adding}
          addSuccess={addSuccess}
          addError={addError}
          onQuantityChange={setQuantity}
          onAddToCart={handleAddToCart}
        />
      )}
    </main>
  );
}
