'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';

// Formatea dirección con los campos en inglés (post-refactoring)
function formatAddress(addr) {
    if (!addr) return '';
    const parts = [
        addr.street,
        addr.street_number,
        addr.city,
        addr.state,
        addr.postal_code,
    ].filter(Boolean);
    return parts.join(', ');
}

export default function AddressSelector({ onSelect }) {
    const [addresses, setAddresses] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await api.get('/users/addresses/');
                setAddresses(res.data);

                const defaultAddr = res.data.find(a => a.is_default);
                if (defaultAddr) {
                    setSelected(defaultAddr.id);
                    onSelect(defaultAddr.id);
                }
            } catch (err) {
                console.error('Error cargando direcciones:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, []);

    const handleChange = (id) => {
        setSelected(id);
        onSelect(id);
    };

    if (loading) {
        return (
            <div className="space-y-2">
                {[1, 2].map(i => (
                    <div key={i} className="h-16 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50" />
                ))}
            </div>
        );
    }

    if (addresses.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-6 text-center">
                <p className="text-sm text-zinc-400 mb-3">No tienes direcciones registradas.</p>
                <Link
                    href="/profile"
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:shadow-md"
                >
                    + Agregar dirección
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {addresses.map(addr => {
                const isSelected = selected === addr.id;
                return (
                    <label
                        key={addr.id}
                        htmlFor={`address-${addr.id}`}
                        className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition shadow-sm hover:shadow-md ${
                            isSelected
                                ? 'border-emerald-500/50 bg-emerald-500/5'
                                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                        }`}
                    >
                        <input
                            id={`address-${addr.id}`}
                            type="radio"
                            name="address"
                            value={addr.id}
                            checked={isSelected}
                            onChange={() => handleChange(addr.id)}
                            className="mt-0.5 accent-emerald-500"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-zinc-100 truncate">
                                {formatAddress(addr)}
                            </p>
                            {addr.is_default && (
                                <span className="mt-1 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                                    Predeterminada
                                </span>
                            )}
                        </div>
                    </label>
                );
            })}

            <Link
                href="/profile"
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 transition hover:text-zinc-300"
            >
                + Gestionar direcciones
            </Link>
        </div>
    );
}