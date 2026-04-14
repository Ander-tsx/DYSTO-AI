'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notify } from '@/utils/notify';
import api from '@/lib/axios';
import { Edit2, Trash2, Package } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function VendorProductCard({ product, onDelete, viewMode = 'row' }) {
  const { id, title, price, stock, is_active, main_image, units_sold } = product;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/products/${id}/delete/`);
      notify.success('Producto eliminado', 'El producto ha sido borrado exitosamente.');
      setShowDeleteModal(false);
      if (onDelete) onDelete(id);
    } catch (err) {
      notify.error('Error', err.response?.data?.detail || 'No se pudo eliminar el producto.');
    } finally {
      setDeleting(false);
    }
  };

  const isActive = is_active;
  const pausedByStock = !isActive && stock === 0;
  // Un producto pausado por stock con ventas puede editarse (solo stock)
  // Si no tiene ventas y stock=0, también puede editarse normalmente
  const canEdit = true; // siempre editable para reponer stock

  const EditButton = ({ className, children }) => (
    <Link
      href={`/products/${id}/edit`}
      className={className}
    >
      {children}
    </Link>
  );

  // ── CARD view ───────────────────────────────────────────────────────────────
  if (viewMode === 'card') {
    return (
      <>
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="¿Eliminar producto?"
          message={`Esta acción es irreversible. El producto "${title}" será eliminado permanentemente del marketplace.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="danger"
          loading={deleting}
        />

        <div className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 hover:shadow-xl transition-all duration-300">
          {/* Image */}
          <div className="relative h-48 bg-zinc-800 overflow-hidden">
            {main_image ? (
              <img src={main_image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-700">
                <Package size={32} />
                <span className="text-xs font-mono">SIN IMAGEN</span>
              </div>
            )}
            {/* Status badge */}
            <div className="absolute top-3 right-3">
              {isActive ? (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-[10px] font-bold">Activo</span>
              ) : pausedByStock ? (
                <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-[10px] font-bold">Sin stock</span>
              ) : (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-[10px] font-bold">Pausado</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-sm font-semibold text-white truncate mb-2" title={title}>{title}</h3>
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
              <span className="font-mono font-bold text-[#e0ff4f]">
                ${Number(price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span>Stock: <span className={stock > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{stock}</span></span>
            </div>

            {pausedByStock && units_sold > 0 && (
              <p className="text-[10px] text-[#e0ff4f]/60 mb-2 font-mono">
                ⚡ Puedes reponer el stock editando
              </p>
            )}

            <div className="mt-auto flex gap-2">
              <EditButton className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border border-zinc-700 text-zinc-300 hover:border-[#e0ff4f]/40 hover:text-[#e0ff4f] transition-all">
                <Edit2 size={13} /> Editar
              </EditButton>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border border-zinc-700 text-zinc-300 hover:border-red-500/40 hover:text-red-400 transition-all"
              >
                <Trash2 size={13} /> Eliminar
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── ROW view (default) ───────────────────────────────────────────────────────
  return (
    <>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="¿Eliminar producto?"
        message={`Esta acción es irreversible. El producto "${title}" será eliminado permanentemente del marketplace.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={deleting}
      />

      <div className="flex flex-col sm:flex-row items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-6 hover:border-zinc-700 transition-colors shadow-sm">
        <div className="w-24 h-24 shrink-0 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700/50">
          {main_image ? (
            <img src={main_image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700">
              <Package size={20} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white truncate" title={title}>{title}</h3>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-zinc-500">
            <span className="font-mono text-[#e0ff4f] font-semibold">
              ${Number(price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
            <span>Stock: <span className={stock > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{stock}</span></span>
            <span>Vendidos: <span className="text-white font-bold">{units_sold || 0}</span></span>
            <div>
              {isActive ? (
                <span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold">Activo</span>
              ) : pausedByStock ? (
                <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-bold">Pausado (Stock 0)</span>
              ) : (
                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-bold">Pausado</span>
              )}
            </div>
          </div>
          {pausedByStock && units_sold > 0 && (
            <p className="text-xs text-[#e0ff4f]/50 mt-1 font-mono">
              ⚡ Producto pausado — puedes reponer stock editándolo
            </p>
          )}
        </div>

        <div className="flex sm:flex-col gap-3 shrink-0">
          <EditButton className="flex items-center justify-center gap-1.5 border border-zinc-700 text-zinc-300 hover:border-[#e0ff4f]/40 hover:text-[#e0ff4f] px-4 py-2 rounded-lg text-sm font-semibold transition-all">
            <Edit2 size={14} /> Editar
          </EditButton>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center gap-1.5 border border-zinc-700 text-zinc-300 hover:border-red-500/40 hover:text-red-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      </div>
    </>
  );
}
