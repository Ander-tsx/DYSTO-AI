'use client';

import { useCart } from '@/context/CartContext';

export default function CartItem({ item }) {
    const { updateItem, removeItem } = useCart();
    const { id, cantidad, product, subtotal } = item;

    return (
        <div className="flex gap-4 border-b py-4">
            <img src={product.main_image} className="w-20 h-20 object-cover rounded" />

            <div className="flex-1">
                <h3>{product.title}</h3>
                <p>${product.price}</p>

                <input
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => updateItem(id, Number(e.target.value))}
                    className="w-16 border"
                />

                <button onClick={() => removeItem(id)}>
                    Eliminar
                </button>
            </div>

            <div>
                ${Number(subtotal).toFixed(2)}
            </div>
        </div>
    );
}