'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { notify } from '@/utils/notify';
import PropTypes from 'prop-types';

// ─── Componente de tarjeta de dirección ───────────────────────────────────────

function AddressCard({ address, onDelete, onSetDefault }) {
    return (
        <div className={`rounded-2xl border p-4 shadow-sm transition hover:shadow-md ${address.is_default ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/50'
            }`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 truncate">
                        {address.street} {address.street_number}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                        {address.city}, {address.state} {address.postal_code}
                    </p>
                    {address.is_default && (
                        <span className="mt-2 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                            Predeterminada
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                    {!address.is_default && (
                        <button
                            onClick={() => onSetDefault(address.id)}
                            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100 hover:shadow-sm"
                        >
                            Predeterminar
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(address.id)}
                        className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 transition hover:border-rose-500/50 hover:bg-rose-500/20 hover:text-rose-300 hover:shadow-sm"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

AddressCard.propTypes = {
    address: PropTypes.shape({
        id: PropTypes.number.isRequired,
        street: PropTypes.string.isRequired,
        street_number: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
        postal_code: PropTypes.string.isRequired,
        is_default: PropTypes.bool.isRequired,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onSetDefault: PropTypes.func.isRequired,
};

// ─── Formulario nueva dirección ───────────────────────────────────────────────

const EMPTY_FORM = {
    street: '',
    street_number: '',
    city: '',
    state: '',
    postal_code: '',
    is_default: false,
};

function AddressForm({ onSave, onCancel }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.street || !form.city || !form.state || !form.postal_code) {
            notify('error', 'Completa todos los campos requeridos.');
            return;
        }
        setSaving(true);
        try {
            const res = await api.post('/users/addresses/', form);
            onSave(res.data);
            notify.success('Dirección guardada.');
        } catch (err) {
            notify.error('Error', err.response?.data?.detail || 'Error al guardar la dirección.');
        } finally {
            setSaving(false);
        }
    };

    const inputClass =
        'w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 transition hover:border-zinc-600 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/40';

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-zinc-700 bg-zinc-900/70 p-6 shadow-sm space-y-4"
        >
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Nueva dirección</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <label htmlFor="street" className="text-xs font-semibold text-zinc-500">Calle *</label>
                    <input id="street" name="street" value={form.street} onChange={handleChange} placeholder="Av. Insurgentes" className={inputClass} required />
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="street_number" className="text-xs font-semibold text-zinc-500">Número *</label>
                    <input id="street_number" name="street_number" value={form.street_number} onChange={handleChange} placeholder="123" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="city" className="text-xs font-semibold text-zinc-500">Ciudad *</label>
                    <input id="city" name="city" value={form.city} onChange={handleChange} placeholder="CDMX" className={inputClass} required />
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="state" className="text-xs font-semibold text-zinc-500">Estado *</label>
                    <input id="state" name="state" value={form.state} onChange={handleChange} placeholder="Ciudad de México" className={inputClass} required />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="postal_code" className="text-xs font-semibold text-zinc-500">Código Postal *</label>
                    <input id="postal_code" name="postal_code" value={form.postal_code} onChange={handleChange} placeholder="06600" className={inputClass} required />
                </div>
            </div>

            <label htmlFor="is_default" className="flex items-center gap-3 cursor-pointer">
                <input
                    id="is_default"
                    type="checkbox"
                    name="is_default"
                    checked={form.is_default}
                    onChange={handleChange}
                    className="accent-emerald-500 h-4 w-4"
                />
                <span className="text-sm text-zinc-300">Establecer como predeterminada</span>
            </label>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: '#e0ff4f', color: '#0a0a0a' }}
                >
                    {saving ? 'Guardando…' : 'Guardar dirección'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}

AddressForm.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ProfilePage() {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        api.get('/users/addresses/')
            .then(res => setAddresses(res.data))
            .catch(err => notify.error('Error', err.response?.data?.detail || 'No se pudieron cargar las direcciones.'))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = (newAddr) => {
        // Si la nueva es default, quitar el flag de las demás
        setAddresses(prev => {
            const updated = newAddr.is_default
                ? prev.map(a => ({ ...a, is_default: false }))
                : [...prev];
            return [...updated, newAddr];
        });
        setShowForm(false);
    };

    const handleDelete = async (id) => {
        if (!globalThis.confirm('¿Eliminar esta dirección?')) return;
        try {
            await api.delete(`/users/addresses/${id}/`);
            setAddresses(prev => prev.filter(a => a.id !== id));
            notify.success('Dirección eliminada.');
        } catch (err) {
            notify.error('Error', err.response?.data?.detail || 'No se pudo eliminar la dirección.');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            setAddresses(prev =>
                prev.map(a => ({ ...a, is_default: a.id === id }))
            );
            notify.success('Dirección predeterminada actualizada.');
        } catch (err) {
            notify.error('Error', err.response?.data?.detail || 'No se pudo actualizar la dirección.');
        }
    };

    const addressContent = (() => {
        if (loading) {
            return (
                <div className="space-y-3">
                    {Array.from({ length: 2 }, (_, idx) => (
                        <div
                            key={`skeleton-${idx}`}
                            className="h-20 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50"
                        />
                    ))}
                </div>
            );
        }

        if (addresses.length === 0) {
            return (
                <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center shadow-sm">
                    <p className="text-sm text-zinc-500">
                        Todavía no tienes direcciones registradas.
                    </p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {addresses.map(addr => (
                    <AddressCard
                        key={addr.id}
                        address={addr}
                        onDelete={handleDelete}
                        onSetDefault={handleSetDefault}
                    />
                ))}
            </div>
        );
    })();

    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
            {/* Header de perfil */}
            <header className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Mi cuenta</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-100">Perfil</h1>
            </header>

            {/* Info del usuario */}
            <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">
                    Información de la cuenta
                </h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-300 shrink-0">
                        {user?.first_name?.[0] || user?.email?.[0] || '?'}
                    </div>
                    <div className="space-y-1">
                        <p className="text-base font-bold text-zinc-100">
                            {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-sm text-zinc-400">{user?.email}</p>
                        <span className="inline-block rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                            {user?.role}
                        </span>
                    </div>
                </div>
            </section>

            {/* Sección direcciones */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                        Mis direcciones
                    </h2>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="rounded-lg border border-zinc-700 px-4 py-2 text-xs font-bold text-zinc-300 shadow-sm transition hover:border-zinc-500 hover:shadow-md hover:text-zinc-100"
                        >
                            + Agregar
                        </button>
                    )}
                </div>

                {/* Formulario nueva dirección */}
                {showForm && (
                    <div className="mb-5">
                        <AddressForm onSave={handleSave} onCancel={() => setShowForm(false)} />
                    </div>
                )}

                {addressContent}
            </section>
        </main>
    );
}
