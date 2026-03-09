import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartApi, CartResponseDTO } from '../api/cart';
import { useKeycloak } from './KeycloakContext';
import { setupAxiosInterceptors } from '../api/axios';

interface CartContextType {
  cart: CartResponseDTO | null;
  loading: boolean;
  addToCart: (productCode: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { authenticated, token } = useKeycloak();

  useEffect(() => {
    if (token) {
      setupAxiosInterceptors(token);
    }
  }, [token]);

  useEffect(() => {
    if (authenticated && token) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [authenticated, token]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartApi.getCart();
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productCode: string, quantity: number) => {
    if (!authenticated) {
      alert('Please log in to add items to your cart.');
      return;
    }
    try {
      setLoading(true);
      const data = await cartApi.addItemToCart(productCode, quantity);
      setCart(data);
      setIsCartOpen(true);
    } catch (error) {
      console.error('Failed to add to cart', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setLoading(true);
      const data = await cartApi.updateCartItemQuantity(itemId, quantity);
      setCart(data);
    } catch (error) {
      console.error('Failed to update quantity', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      setLoading(true);
      await cartApi.deleteCartItem(itemId);
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove item', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartApi.clearCart();
      setCart(null);
    } catch (error) {
      console.error('Failed to clear cart', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
