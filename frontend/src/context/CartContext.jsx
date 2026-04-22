'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '@/lib/axios';
import { useAuth } from './AuthContext.jsx';
import { notify } from '@/utils/notify';
import PropTypes from 'prop-types';

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

        const count = items.reduce((acc, item) => acc + item.quantity, 0);
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

    const addItem = async (productId, quantity = 1) => {
        try {
            const res = await api.post('/carts/add/', {
                product_id: productId,
                quantity,
            });
            processCart(res.data);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.detail || 'Error al agregar al carrito.';
            return { success: false, message };
        }
    };

    const updateItem = async (itemId, quantity) => {
        try {
            const res = await api.patch(`/carts/items/${itemId}/`, { quantity });
            processCart(res.data);
        } catch (err) {
            notify.error('Error', err.response?.data?.detail || 'No se pudo actualizar el carrito.');
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

    const contextValue = useMemo(() => ({
        cartItems,
        cartTotal,
        cartCount,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
    }), [
        cartItems,
        cartTotal,
        cartCount,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
    ]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useCart = () => {
    return useContext(CartContext);
};