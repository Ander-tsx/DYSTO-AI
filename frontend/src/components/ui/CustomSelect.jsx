'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';

const DEFAULT_BTN_CLASS =
  'flex items-center justify-between gap-2 w-full h-10 px-3 rounded-lg text-sm font-medium bg-zinc-800/60 border border-zinc-700/60 text-zinc-200 hover:border-zinc-600 transition-all';

/**
 * CustomSelect — Dropdown estilizado reutilizable para DystoAI.
 *
 * Props opcionales:
 *   label           – Texto de etiqueta encima del select
 *   icon            – Componente de ícono junto a la etiqueta
 *   buttonClassName – Override de clases para el botón trigger
 */
export default function CustomSelect({
  value, onChange, options, placeholder = 'Seleccionar',
  id, label, icon: Icon, buttonClassName,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const trigger = (
    <button
      id={id}
      type="button"
      onClick={() => setOpen(v => !v)}
      className={buttonClassName || DEFAULT_BTN_CLASS}
    >
      <span className={selected?.value ? 'text-white' : 'text-zinc-500'}>
        {selected?.label || placeholder}
      </span>
      <ChevronDown size={14} className={`transition-transform duration-200 text-zinc-500 ${open ? 'rotate-180' : ''}`} />
    </button>
  );

  const menu = open && (
    <div
      className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50"
      style={{
        background: 'rgba(18,18,18,0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
      }}
    >
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => { onChange(opt.value); setOpen(false); }}
          className={`flex items-center w-full px-4 py-2.5 text-sm text-left transition-colors ${value === opt.value
            ? 'text-[#e0ff4f] bg-[#e0ff4f]/8'
            : 'text-zinc-300 hover:bg-white/5 hover:text-white'
            }`}
        >
          {opt.label}
          {value === opt.value && <span className="ml-auto text-[#e0ff4f]">✓</span>}
        </button>
      ))}
    </div>
  );

  if (!label) {
    return (
      <div className="relative" ref={ref}>
        {trigger}
        {menu}
      </div>
    );
  }

  return (
    <div className="space-y-1.5" ref={ref}>
      <label htmlFor={id} className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {Icon && <Icon size={12} />}
        {label}
      </label>
      <div className="relative">
        {trigger}
        {menu}
      </div>
    </div>
  );
}

CustomSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.elementType,
  buttonClassName: PropTypes.string,
};
