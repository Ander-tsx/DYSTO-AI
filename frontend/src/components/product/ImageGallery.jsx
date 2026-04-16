'use client';

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

function ChevronLeft({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

ChevronLeft.propTypes = {
  size: PropTypes.number,
};

function ChevronRight({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

ChevronRight.propTypes = {
  size: PropTypes.number,
};

function ZoomIcon({ size = 18 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

ZoomIcon.propTypes = {
  size: PropTypes.number,
};

function XIcon({ size = 22 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

XIcon.propTypes = {
  size: PropTypes.number,
};

/**
 * ImageGallery
 * Props:
 *   mainImage   {string}   - URL de la imagen principal
 *   images      {string[]} - URLs de imágenes adicionales (puede estar vacío)
 *   title       {string}   - Texto alt para accesibilidad
 */
export default function ImageGallery({ mainImage, images = [], title = 'Producto' }) {
  // Construimos la lista completa: primera imagen es siempre el mainImage
  const allImages = mainImage
    ? [mainImage, ...images.filter((img) => img && img !== mainImage)]
    : images.filter(Boolean);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgError, setImgError] = useState({});

  const goTo = useCallback((index) => {
    if (index < 0) index = allImages.length - 1;
    if (index >= allImages.length) index = 0;
    setActiveIndex(index);
  }, [allImages.length]);

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    globalThis.addEventListener('keydown', handler);
    return () => globalThis.removeEventListener('keydown', handler);
  }, [lightboxOpen, prev, next]);

  // Bloquear scroll body cuando lightbox está abierto
  useEffect(() => {
    if (lightboxOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  if (allImages.length === 0) {
    return (
      <div className="flex items-center justify-center w-full aspect-square rounded-2xl border bg-[#111]" style={{ borderColor: '#1f1f1f' }}>
        <span className="text-3xl font-mono opacity-20 text-[#666]">NO IMG</span>
      </div>
    );
  }

  const activeImage = allImages[activeIndex];
  const hasMultiple = allImages.length > 1;
  const hasError = imgError[activeImage];

  return (
    <>
      {/* Gallery Container */}
      <div className="flex flex-col gap-3">

        {/* Main image viewer */}
        <div className="relative overflow-hidden rounded-2xl border group" style={{ borderColor: '#1f1f1f', background: '#0d0d0d' }}>
          {/* Aspect ratio wrapper */}
          <div className="relative w-full" style={{ paddingBottom: '75%' }}>
            {hasError ? (
              <div className="absolute inset-0 flex items-center justify-center text-[#444] font-mono text-sm">
                Error al cargar imagen
              </div>
            ) : (
              <img
                src={activeImage}
                alt={`${title} — imagen ${activeIndex + 1}`}
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
                onError={() => setImgError((prev) => ({ ...prev, [activeImage]: true }))}
              />
            )}
          </div>

          {/* Zoom button */}
          <button
            aria-label="Ampliar imagen"
            onClick={() => setLightboxOpen(true)}
            className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
            style={{ background: 'rgba(10,10,10,0.7)', color: '#e0ff4f', border: '1px solid rgba(224,255,79,0.2)' }}
          >
            <ZoomIcon />
          </button>

          {/* Prev/Next arrows (only if multiple) */}
          {hasMultiple && (
            <>
              <button
                aria-label="Imagen anterior"
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                style={{ background: 'rgba(10,10,10,0.7)', color: '#f0f0f0', border: '1px solid #222' }}
              >
                <ChevronLeft />
              </button>
              <button
                aria-label="Imagen siguiente"
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                style={{ background: 'rgba(10,10,10,0.7)', color: '#f0f0f0', border: '1px solid #222' }}
              >
                <ChevronRight />
              </button>
            </>
          )}

          {/* Image counter badge */}
          {hasMultiple && (
            <span
              className="absolute bottom-3 right-3 text-xs font-mono px-2 py-1 rounded-md backdrop-blur-sm"
              style={{ background: 'rgba(10,10,10,0.7)', color: '#666', border: '1px solid #222' }}
            >
              {activeIndex + 1}/{allImages.length}
            </span>
          )}
        </div>

        {/* Thumbnails row */}
        {hasMultiple && (
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
            {allImages.map((img, idx) => (
              <button
                key={img}
                aria-label={`Ver imagen ${idx + 1}`}
                aria-current={idx === activeIndex}
                onClick={() => goTo(idx)}
                className="shrink-0 rounded-lg overflow-hidden transition-all duration-200"
                style={{
                  width: 64,
                  height: 64,
                  border: idx === activeIndex
                    ? '2px solid #e0ff4f'
                    : '2px solid #1f1f1f',
                  background: '#0d0d0d',
                  opacity: idx === activeIndex ? 1 : 0.6,
                }}
              >
                {hasError ? (
                  <div className="w-full h-full flex items-center justify-center text-[#444] text-[10px] font-mono">
                    ERR
                  </div>
                ) : (
                  <img
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => setImgError((prev) => ({ ...prev, [img]: true }))}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <dialog
          open
          aria-label="Visor de imagen ampliada"
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
        >
          {/* Invisible backdrop button — closes lightbox when clicking outside the image */}
          <button
            type="button"
            aria-label="Cerrar visor"
            className="absolute inset-0 w-full h-full cursor-default"
            style={{ background: 'transparent', border: 'none' }}
            onClick={() => setLightboxOpen(false)}
          />

          {/* Image wrapper */}
          <div
            className="relative max-w-4xl max-h-[90vh] w-full mx-4 flex items-center justify-center"
          >
            <img
              src={activeImage}
              alt={`${title} — imagen ${activeIndex + 1} ampliada`}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onError={() => setImgError((prev) => ({ ...prev, [activeImage]: true }))}
            />

            {/* Close */}
            <button
              aria-label="Cerrar visor"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-3 right-3 flex items-center justify-center w-10 h-10 rounded-full transition-colors"
              style={{ background: 'rgba(10,10,10,0.8)', color: '#f0f0f0', border: '1px solid #333' }}
            >
              <XIcon />
            </button>

            {/* Lightbox Prev/Next */}
            {hasMultiple && (
              <>
                <button
                  aria-label="Imagen anterior"
                  onClick={prev}
                  className="absolute left-0 top-1/2 -translate-x-full md:-translate-x-12 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full transition-colors"
                  style={{ background: 'rgba(10,10,10,0.8)', color: '#f0f0f0', border: '1px solid #333' }}
                >
                  <ChevronLeft />
                </button>
                <button
                  aria-label="Imagen siguiente"
                  onClick={next}
                  className="absolute right-0 top-1/2 translate-x-full md:translate-x-12 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full transition-colors"
                  style={{ background: 'rgba(10,10,10,0.8)', color: '#f0f0f0', border: '1px solid #333' }}
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>

          {/* Lightbox thumbnail strip */}
          {hasMultiple && (
            <div
              className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid #222' }}
              role="toolbar"
              aria-label="Miniaturas de imagen"
              onMouseDown={(e) => e.stopPropagation()}
            >
              {allImages.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => goTo(idx)}
                  className="rounded-md overflow-hidden transition-all duration-200"
                  style={{
                    width: 44,
                    height: 44,
                    border: idx === activeIndex ? '2px solid #e0ff4f' : '2px solid #333',
                    opacity: idx === activeIndex ? 1 : 0.5,
                  }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </dialog>
      )}
    </>
  );
}

ImageGallery.propTypes = {
  mainImage: PropTypes.string.isRequired,
  images: PropTypes.array,
  title: PropTypes.string,
};