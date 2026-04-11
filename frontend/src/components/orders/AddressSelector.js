'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';

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
                console.error(err);
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

    if (loading) return <p>Cargando direcciones...</p>;

    if (addresses.length === 0) {
        return (
            <div>
                <p>No tienes direcciones registradas.</p>
                <Link href="/profile">
                    <button>Agregar dirección</button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            {addresses.map(addr => (
                <div key={addr.id}>
                    <input
                        type="radio"
                        name="address"
                        checked={selected === addr.id}
                        onChange={() => handleChange(addr.id)}
                    />
                    {addr.calle} {addr.numero}, {addr.ciudad}
                    {addr.is_default && " (Default)"}
                </div>
            ))}
        </div>
    );
}