'use client';

import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem';
import Link from 'next/link';

export default function CartPage() {
    const { cartItems, cartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <div>
                <h2>Tu carrito está vacío</h2>
                <Link href="/">Ir a comprar</Link>
            </div>
        );
    }

    return (
        <div>
            <h1>Carrito</h1>

            {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
            ))}

            <h2>Total: ${cartTotal.toFixed(2)}</h2>

            <Link href="/checkout">
                Proceder al checkout
            </Link>
        </div>
    );
}