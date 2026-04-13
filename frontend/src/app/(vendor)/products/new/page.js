'use client';

import React, { useState } from 'react';
import api from '@/lib/axios';
import { notify } from '@/utils/notify';
import AIBadge from '@/components/product/AIBadge';

export default function NewProductPage() {
    const [images, setImages] = useState([]);
    const [loadingAI, setLoadingAI] = useState(false);
    const [aiData, setAiData] = useState(null);

    const [form, setForm] = useState({
        title: '',
        category: '',
        price: '',
        description: '',
        tags: '',
        stock: 0,
    });

    const handleFiles = (files) => {
        const valid = [];

        for (let file of files) {
            if (!['image/png', 'image/jpeg'].includes(file.type)) {
                notify.error("Solo PNG/JPG");
                continue;
            }

            if (file.size > 10 * 1024 * 1024) {
                notify.error("Máx 10MB");
                continue;
            }

            valid.push(file);
        }

        if (images.length + valid.length > 5) {
            notify.error("Máx 5 imágenes");
            return;
        }

        setImages([...images, ...valid]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const handleSelect = (e) => {
        handleFiles(e.target.files);
    };

    const handleAnalyze = async () => {
        if (images.length === 0) {
            notify.error("Sube al menos 1 imagen");
            return;
        }

        const formData = new FormData();
        formData.append('image', images[0]);

        setLoadingAI(true);

        try {
            const res = await api.post('/ai/analyze/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.error) {
                notify.error(res.data.message);
                return;
            }

            setAiData(res.data);

            const ai = res.data.analysis;

            setForm({
                title: ai.titulo || '',
                category: ai.categoria || '',
                price: ai.precio_sugerido || '',
                description: ai.descripcion || '',
                tags: (ai.tags || []).join(', '),
                stock: 0,
            });

            notify.success("IA completó el formulario ✨");

        } catch (err) {
            if (err.response?.status === 429) {
                notify.error("Límite de análisis alcanzado (10 por hora)");
            } else {
                notify.error("Error analizando imagen");
            }
        } finally {
            setLoadingAI(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handlePublish = async () => {
        if (!form.title || !form.price || form.stock === null) {
            notify.error("Completa los campos obligatorios");
            return;
        }

        try {
            const formData = new FormData();

            formData.append('title', form.title);
            formData.append('category', form.category);
            formData.append('price', form.price);
            formData.append('description', form.description);
            formData.append('stock', form.stock);
            formData.append('main_image', aiData.image_url);

            images.slice(1).forEach(img => {
                formData.append('additional_images', img);
            });

            const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
            formData.append('tags', JSON.stringify(tagsArray));

            images.forEach(img => {
                formData.append('images', img);
            });

            await api.post('/products/', formData);

            notify.success("Producto publicado 🚀");

        } catch (err) {
            notify.error("Error al publicar");
        }
    };

    return (
        <div className="p-8 text-white max-w-3xl mx-auto">

            <h1 className="text-2xl font-bold mb-6">Nuevo producto</h1>
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border border-dashed border-zinc-700 p-6 rounded-xl text-center mb-4"
            >
                Arrastra imágenes o selecciona
                <input type="file" multiple onChange={handleSelect} />
            </div>

            <div className="flex gap-2 mb-4">
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={URL.createObjectURL(img)}
                        className="w-20 h-20 object-cover rounded"
                    />
                ))}
            </div>

            <button
                onClick={handleAnalyze}
                disabled={loadingAI}
                className="mb-6 px-4 py-2 bg-cyan-600 rounded"
            >
                {loadingAI ? 'Analizando...' : 'Analizar con IA'}
            </button>

            {aiData && (
                <div className="space-y-4">

                    <div>
                        <label>Título <AIBadge /></label>
                        <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 bg-zinc-800" />
                    </div>

                    <div>
                        <label>Categoría <AIBadge /></label>
                        <input name="category" value={form.category} onChange={handleChange} className="w-full p-2 bg-zinc-800" />
                    </div>

                    <div>
                        <label>Precio <AIBadge /></label>
                        <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full p-2 bg-zinc-800" />
                    </div>

                    <div>
                        <label>Descripción <AIBadge /></label>
                        <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 bg-zinc-800" />
                    </div>

                    <div>
                        <label>Tags <AIBadge /></label>
                        <input name="tags" value={form.tags} onChange={handleChange} className="w-full p-2 bg-zinc-800" />
                    </div>

                    <div>
                        <label>Stock</label>
                        <input name="stock" type="number" value={form.stock} onChange={handleChange} className="w-full p-2 bg-zinc-800" />
                    </div>

                    <button
                        onClick={handlePublish}
                        className="mt-4 px-6 py-3 bg-green-600 rounded"
                    >
                        Publicar
                    </button>

                </div>
            )}

        </div>
    );
}