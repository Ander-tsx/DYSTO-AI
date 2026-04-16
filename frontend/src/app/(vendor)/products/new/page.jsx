'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { notify } from '@/utils/notify';
import CustomSelect from '@/components/ui/CustomSelect.jsx';
import {
  Upload,
  Sparkles,
  X,
  Tag,
  DollarSign,
  FileText,
  Package,
  LayoutGrid,
  Send,
  Loader2,
} from 'lucide-react';
import PropTypes from 'prop-types';

// Custom button class for the form-style select (taller, darker background)
const FORM_SELECT_BTN =
  'flex items-center justify-between gap-2 w-full h-11 px-4 rounded-xl text-sm font-medium bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-zinc-700 focus:border-[#e0ff4f]/40 focus:ring-2 focus:ring-[#e0ff4f]/10 transition-all';

// ── AI Badge ──────────────────────────────────────────────────────────────────

function AIBadge() {
  return (
    <span className="inline-flex items-center gap-1 ml-2 text-[10px] px-2 py-0.5 rounded-full bg-[#e0ff4f]/10 text-[#e0ff4f] border border-[#e0ff4f]/20 font-semibold">
      <Sparkles size={9} />
      IA
    </span>
  );
}

// ── Field Component ───────────────────────────────────────────────────────────

function Field({ label, children, aiSuggested = false, icon: Icon }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {Icon && <Icon size={12} />}
        {label}
        {aiSuggested && <AIBadge />}
      </label>
      {children}
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  aiSuggested: PropTypes.bool,
  icon: PropTypes.func,
};

const inputClass = 'w-full h-11 px-4 rounded-xl text-sm bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e0ff4f]/40 focus:ring-2 focus:ring-[#e0ff4f]/10 transition-all';
const textareaClass = 'w-full px-4 py-3 rounded-xl text-sm bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e0ff4f]/40 focus:ring-2 focus:ring-[#e0ff4f]/10 transition-all resize-none';

const CATEGORY_OPTIONS = [
  { value: '', label: 'Selecciona una categoría' },
  { value: 'Modelos de IA', label: 'Modelos de IA' },
  { value: 'Prompts', label: 'Prompts' },
  { value: 'Herramientas', label: 'Herramientas' },
  { value: 'Datasets', label: 'Datasets' },
  { value: 'APIs', label: 'APIs' },
  { value: 'Cursos', label: 'Cursos' },
  { value: 'Otro', label: 'Otro' },
];

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [aiData, setAiData] = useState(null);

  const [form, setForm] = useState({
    title: '',
    category: '',
    price: '',
    description: '',
    tags: '',
    stock: '',
  });

  const handleFiles = (files) => {
    const valid = [];
    for (let file of files) {
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        notify.error('Formato inválido', 'Solo se aceptan PNG, JPG o WebP.');
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        notify.error('Archivo muy grande', 'El tamaño máximo es 10MB por imagen.');
        continue;
      }
      valid.push(file);
    }
    if (images.length + valid.length > 5) {
      notify.error('Límite excedido', 'Puedes subir máximo 5 imágenes.');
      return;
    }
    setImages(prev => [...prev, ...valid]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (index === 0) {
      setAiSuggested(false);
      setAiData(null);
    }
  };

  const handleAnalyze = async () => {
    if (images.length === 0) {
      notify.error('Sin imagen', 'Sube al menos 1 imagen para analizar.');
      return;
    }
    const formData = new FormData();
    formData.append('image', images[0]);
    setLoadingAI(true);
    try {
      const res = await api.post('/ai/analyze/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.detail) {
        notify.error('Error IA', res.data.detail);
        return;
      }

      setAiData(res.data);
      const ai = res.data.analysis;

      setForm({
        title: ai.title || '',
        category: ai.category || '',
        price: ai.suggested_price || '',
        description: ai.description || '',
        tags: (ai.tags || []).join(', '),
        stock: form.stock || '',
      });
      setAiSuggested(true);
      notify.success('¡Análisis completado!', 'La IA rellenó el formulario con sus sugerencias ✨');
    } catch (err) {
      if (err.response?.status === 429) {
        notify.error('Límite alcanzado', 'Máximo 10 análisis por hora. Intenta más tarde.');
      } else {
        notify.error('Error al analizar', err.response?.data?.detail || 'Ha ocurrido un error inesperado.');
      }
    } finally {
      setLoadingAI(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePublish = async () => {
    if (!form.title.trim()) { notify.error('Campo requerido', 'El título es obligatorio.'); return; }
    if (!form.price) { notify.error('Campo requerido', 'El precio es obligatorio.'); return; }
    if (!form.stock && form.stock !== 0) { notify.error('Campo requerido', 'El stock es obligatorio.'); return; }

    setPublishing(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('stock', form.stock);

      if (aiData?.image_url) {
        formData.append('main_image', aiData.image_url);
      }

      images.forEach(img => formData.append('images', img));
      images.slice(1).forEach(img => formData.append('additional_images', img));

      const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      formData.append('tags', JSON.stringify(tagsArray));

      const res = await api.post('/products/create/', formData);
      const newProductId = res.data?.id;

      notify.success('¡Producto publicado! 🚀', 'Tu producto ya está visible en el marketplace.');

      if (newProductId) {
        // Redirigir al producto recién publicado
        router.push(`/products/${newProductId}`);
      } else {
        // Fallback: resetear form
        setForm({ title: '', category: '', price: '', description: '', tags: '', stock: '' });
        setImages([]);
        setAiData(null);
        setAiSuggested(false);
      }
    } catch (err) {
      notify.error('Error al publicar', err.response?.data?.detail || 'Ha ocurrido un error inesperado.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Hero */}
      <div className="border-b border-zinc-900 bg-gradient-to-b from-zinc-950 to-[#0a0a0a] pt-10 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#e0ff4f]/10 border border-[#e0ff4f]/20 flex items-center justify-center">
              <Package size={16} className="text-[#e0ff4f]" />
            </div>
            <h1 className="text-2xl font-bold text-white">Publicar Producto</h1>
          </div>
          <p className="text-zinc-500 text-sm ml-12">
            Completa el formulario y opcionalmente usa la IA para autorellenar los campos.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT: Images + AI Analysis */}
          <div className="lg:col-span-2 space-y-5">

            {/* Drop Zone */}
            <button
              type="button"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/30 hover:border-[#e0ff4f]/40 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col items-center justify-center gap-3 py-10 px-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 group-hover:bg-[#e0ff4f]/10 border border-zinc-700 group-hover:border-[#e0ff4f]/30 flex items-center justify-center transition-all duration-300">
                <Upload size={22} className="text-zinc-600 group-hover:text-[#e0ff4f] transition-colors duration-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
                  Arrastra imágenes aquí
                </p>
                <p className="text-xs text-zinc-600 mt-0.5">o haz clic para seleccionar</p>
              </div>
              <p className="text-[10px] text-zinc-700 mt-1">PNG, JPG, WebP · Máx 10MB · Hasta 5 imágenes</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp"
                onChange={e => handleFiles(e.target.files)}
                className="hidden"
              />
            </button>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <div key={img} className="relative group rounded-xl overflow-hidden border border-zinc-800 aspect-square">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${img}`}
                      className="w-full h-full object-cover"
                    />
                    {i === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center py-0.5">
                        <span className="text-[9px] font-bold text-[#e0ff4f] uppercase tracking-wider">Principal</span>
                      </div>
                    )}
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X size={11} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* AI Analysis Button */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#e0ff4f]/10 border border-[#e0ff4f]/20 flex items-center justify-center shrink-0">
                  <Sparkles size={16} className="text-[#e0ff4f]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Análisis con IA</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Sube una imagen y la IA llenará automáticamente el formulario con sugerencias inteligentes.
                  </p>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loadingAI || images.length === 0}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#e0ff4f', color: '#0a0a0a' }}
              >
                {loadingAI ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Analizando imagen…
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Analizar con IA
                  </>
                )}
              </button>

              {aiSuggested && (
                <p className="mt-3 text-center text-xs text-[#e0ff4f]/70">
                  ✓ Campos rellenados por IA — puedes editarlos libremente
                </p>
              )}
            </div>
          </div>

          {/* RIGHT: Product Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-5">
              <h2 className="text-base font-bold text-white border-b border-zinc-800 pb-4">
                Información del Producto
              </h2>

              {/* Title */}
              <Field label="Título del producto" aiSuggested={aiSuggested} icon={FileText}>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Ej. GPT-4 Prompt Engineering Toolkit"
                  className={inputClass}
                />
              </Field>

              {/* Category */}
              <CustomSelect
                id="new-product-category"
                value={form.category}
                onChange={val => setForm(f => ({ ...f, category: val }))}
                options={CATEGORY_OPTIONS}
                placeholder="Selecciona una categoría"
                label={`Categoría${aiSuggested ? ' ✨' : ''}`}
                icon={LayoutGrid}
                buttonClassName={FORM_SELECT_BTN}
              />

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Precio (MXN)" aiSuggested={aiSuggested} icon={DollarSign}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-sm font-mono pointer-events-none">$</span>
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className={`${inputClass} pl-7`}
                    />
                  </div>
                </Field>

                <Field label="Stock disponible" icon={Package}>
                  <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className={inputClass}
                  />
                </Field>
              </div>

              {/* Description */}
              <Field label="Descripción" aiSuggested={aiSuggested} icon={FileText}>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe tu producto, sus características, casos de uso…"
                  rows={5}
                  className={textareaClass}
                />
              </Field>

              {/* Tags */}
              <Field label="Etiquetas (separadas por coma)" aiSuggested={aiSuggested} icon={Tag}>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="gpt4, prompts, chatbot, nlp…"
                  className={inputClass}
                />
                <p className="text-xs text-zinc-700 mt-1">Separa las etiquetas con comas para mejorar la búsqueda.</p>
              </Field>

              {/* Publish Button */}
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-2"
                style={{ background: publishing ? '#555' : '#e0ff4f', color: '#0a0a0a' }}
              >
                {publishing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Publicando…
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Publicar Producto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}