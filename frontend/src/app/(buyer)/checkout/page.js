'use client';

import { useCart } from '@/context/CartContext';
import api from '@/lib/axios';
import { useState } from 'react';
import AddressSelector from '@/components/orders/AddressSelector';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [addressId, setAddressId] = useState(null);

    const handleCheckout = async () => {
        if (!addressId) {
            alert('Selecciona una dirección');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/orders/checkout/', {
                address_id: addressId
            });

            clearCart();

            const orderNumber = res.data?.order_number;
            if (orderNumber) {
                router.push(`/orders/${orderNumber}?from=checkout`);
                return;
            }

            router.push('/orders');
        } catch (err) {
            alert(err.response?.data?.detail || 'Error en checkout');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Checkout</h1>

            {cartItems.map(item => (
                <div key={item.id}>
                    {item.product.title} x {item.cantidad}
                </div>
            ))}

            <h2>Total: ${cartTotal.toFixed(2)}</h2>

            <h3>Dirección de envío</h3>
            <AddressSelector onSelect={setAddressId} />

            <button onClick={handleCheckout} disabled={loading}>
                {loading ? 'Procesando...' : 'Confirmar compra'}
            </button>
        </div>
    );
}