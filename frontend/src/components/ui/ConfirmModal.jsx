'use client';

import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * ConfirmModal — Modal de confirmación premium para DystoAI.
 *
 * Props:
 *  isOpen       {boolean}  — Controla visibilidad
 *  onClose      {fn}       — Callback al cancelar / cerrar
 *  onConfirm    {fn}       — Callback al confirmar
 *  title        {string}   — Título del modal
 *  message      {string}   — Mensaje descriptivo
 *  confirmText  {string}   — Texto del botón de confirmación (default: "Confirmar")
 *  cancelText   {string}   — Texto del botón cancelar (default: "Cancelar")
 *  variant      {string}   — 'danger' | 'warning' | 'info' (default: 'danger')
 *  loading      {boolean}  — Muestra spinner en el botón confirmar
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false,
}) {
  const cancelRef = useRef(null);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Foco inicial al botón Cancelar (más seguro)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => cancelRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      ),
      iconBg: 'rgba(239,68,68,0.1)',
      iconColor: '#f87171',
      iconBorder: 'rgba(239,68,68,0.2)',
      confirmBg: '#ef4444',
      confirmHover: '#dc2626',
      confirmColor: '#fff',
    },
    warning: {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      iconBg: 'rgba(234,179,8,0.1)',
      iconColor: '#facc15',
      iconBorder: 'rgba(234,179,8,0.2)',
      confirmBg: '#ca8a04',
      confirmHover: '#a16207',
      confirmColor: '#fff',
    },
    info: {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      iconBg: 'rgba(224,255,79,0.1)',
      iconColor: '#e0ff4f',
      iconBorder: 'rgba(224,255,79,0.2)',
      confirmBg: '#e0ff4f',
      confirmHover: '#d4f53c',
      confirmColor: '#0a0a0a',
    },
  };

  const s = variantStyles[variant] || variantStyles.danger;

  return (
    <dialog
      open
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'rgba(18,18,18,0.98)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Top accent line */}
        <div
          className="h-[2px] w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${s.iconColor}60, transparent)`,
          }}
        />

        <div className="p-6">
          {/* Icon + Title */}
          <div className="flex items-start gap-4 mb-4">
            <div
              className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: s.iconBg,
                border: `1px solid ${s.iconBorder}`,
                color: s.iconColor,
              }}
            >
              {s.icon}
            </div>
            <div>
              <h2
                id="confirm-modal-title"
                className="text-base font-bold text-white"
              >
                {title}
              </h2>
              {message && (
                <p className="text-sm mt-1 leading-relaxed" style={{ color: '#888' }}>
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t my-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />

          {/* Actions */}
          <div className="flex gap-3">
            <button
              ref={cancelRef}
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#aaa',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = '#aaa';
              }}
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: s.confirmBg,
                color: s.confirmColor,
              }}
              onMouseEnter={e => {
                if (!loading) e.currentTarget.style.background = s.confirmHover;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = s.confirmBg;
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Procesando…
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(['danger', 'warning', 'info']),
  loading: PropTypes.bool,
};