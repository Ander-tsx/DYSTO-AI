'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';

export default function FilterPanel() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [categories, setCategories] = useState([]);

    const [precioMin, setPrecioMin] = useState(searchParams.get('precio_min') || '');
    const [precioMax, setPrecioMax] = useState(searchParams.get('precio_max') || '');
    const [orden, setOrden] = useState(searchParams.get('orden') || '');
    const [categoria, setCategoria] = useState(searchParams.get('categoria') || '');

    // 🔥 Cargar categorías
    useEffect(() => {
        api.get('/products/categories/')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (precioMin) params.set('precio_min', precioMin);
        else params.delete('precio_min');

        if (precioMax) params.set('precio_max', precioMax);
        else params.delete('precio_max');

        if (orden) params.set('orden', orden);
        else params.delete('orden');

        if (categoria) params.set('categoria', categoria);
        else params.delete('categoria');

        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="bg-surface border border-border rounded-xl p-4 space-y-4">

            {/* Categorías */}
            <div>
                <h4 className="font-semibold mb-2">Categoría</h4>
                <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full border p-2 rounded"
                >
                    <option value="">Todas</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Precio */}
            <div>
                <h4 className="font-semibold mb-2">Precio</h4>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={precioMin}
                        onChange={(e) => setPrecioMin(e.target.value)}
                        className="w-1/2 border p-2 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={precioMax}
                        onChange={(e) => setPrecioMax(e.target.value)}
                        className="w-1/2 border p-2 rounded"
                    />
                </div>
            </div>

            {/* Orden */}
            <div>
                <h4 className="font-semibold mb-2">Ordenar por</h4>
                <select
                    value={orden}
                    onChange={(e) => setOrden(e.target.value)}
                    className="w-full border p-2 rounded"
                >
                    <option value="">Recientes</option>
                    <option value="precio_asc">Precio ↑</option>
                    <option value="precio_desc">Precio ↓</option>
                </select>
            </div>

            <button
                onClick={applyFilters}
                className="w-full bg-accent text-white py-2 rounded"
            >
                Aplicar filtros
            </button>
        </div>
    );
}