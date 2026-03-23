import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const CartContext = createContext();

function getSessionId() {
  let id = localStorage.getItem('sessionId');
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substr(2, 12);
    localStorage.setItem('sessionId', id);
  }
  return id;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const sessionId = getSessionId();
      const { data } = await api.get(`/cart?session_id=${sessionId}`);
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const addToCart = async (productId, variantId, quantity = 1) => {
    try {
      setLoading(true);
      const sessionId = getSessionId();
      const { data } = await api.post('/cart', { productId, variantId, quantity, sessionId });
      setCart(data);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.put(`/cart/${itemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      await fetchCart();
      toast.success('Item removed');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, fetchCart, itemCount, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
