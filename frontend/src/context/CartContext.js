'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    const processCart = (data) => {
        const items = data.items || [];

        setCartItems(items);
        setCartTotal(Number(data.total || 0));

        const count = items.reduce((acc, item) => acc + item.cantidad, 0);
        setCartCount(count);
    };

    const fetchCart = async () => {
        try {
            const res = await api.get('/carts/');
            processCart(res.data);
        } catch (err) {
            console.error('Error fetching cart', err);
        }
    };

    const addItem = async (productId, cantidad = 1) => {
        try {
            const res = await api.post('/carts/add/', {
                product_id: productId,
                cantidad,
            });
            processCart(res.data);
            return true;
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.detail || 'Error al agregar');
            return false;
        }
    };

    const updateItem = async (itemId, cantidad) => {
        try {
            const res = await api.patch(`/carts/items/${itemId}/`, { cantidad });
            processCart(res.data);
        } catch (err) {
            alert(err.response?.data?.detail);
        }
    };

    const removeItem = async (itemId) => {
        try {
            const res = await api.delete(`/carts/items/${itemId}/`);
            processCart(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const clearCart = () => {
        setCartItems([]);
        setCartTotal(0);
        setCartCount(0);
    };

    useEffect(() => {
        if (!loading && isAuthenticated) {
            fetchCart();
        } else {
            clearCart();
        }
    }, [isAuthenticated, loading]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartTotal,
                cartCount,
                fetchCart,
                addItem,
                updateItem,
                removeItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};