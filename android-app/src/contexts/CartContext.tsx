import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { cartAPI, CartItem, CartSummary } from '../services/cartAPI';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  cartSummary: CartSummary;
  loading: boolean;
  addToCart: (service: any, calculatedPrice?: number, userInputs?: any) => Promise<boolean>;
  removeFromCart: (cartItemId: string) => Promise<boolean>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
  isServiceInCart: (serviceId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    totalItems: 0,
    totalPrice: 0
  });
  const [loading, setLoading] = useState(false);

  // Load cart when user changes
  useEffect(() => {
    if (user && isAuthenticated) {
      refreshCart();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
      setCartSummary({
        totalItems: 0,
        totalPrice: 0
      });
    }
  }, [user, isAuthenticated]);

  // Refresh cart data
  const refreshCart = async () => {
    if (!user || !isAuthenticated) {
      console.log('No user or not authenticated, skipping cart refresh');
      return;
    }
    
    try {
      setLoading(true);
      const [items, summary] = await Promise.all([
        cartAPI.getCartItems(),
        cartAPI.getCartSummary()
      ]);
      setCartItems(items);
      setCartSummary(summary);
    } catch (error) {
      console.error('Error refreshing cart:', error);
      // Don't show error to user, just log it
    } finally {
      setLoading(false);
    }
  };

  // Add service to cart
  const addToCart = async (service: any, calculatedPrice?: number, userInputs?: any): Promise<boolean> => {
    if (!user || !isAuthenticated) {
      Alert.alert('Error', 'Please login to add items to cart');
      return false;
    }

    try {
      setLoading(true);

      // Check if service is already in cart
      if (isServiceInCart(service.id)) {
        Alert.alert('Already in Cart', `${service.title} is already in your cart.`);
        return false;
      }

      // Add to cart via API
      const cartItemData = {
        service_id: service.id,
        quantity: 1,
        user_inputs: userInputs || {}
      };

      await cartAPI.addToCart(cartItemData);
      
      // Refresh cart to get updated data
      await refreshCart();
      Alert.alert('Success', `${service.title} added to cart!`);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId: string): Promise<boolean> => {
    if (!user || !isAuthenticated) return false;
    
    try {
      setLoading(true);
      await cartAPI.removeFromCart(cartItemId);
      await refreshCart();
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      Alert.alert('Error', 'Failed to remove item from cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId: string, quantity: number): Promise<boolean> => {
    if (!user || !isAuthenticated) return false;
    
    if (quantity < 1) {
      return removeFromCart(cartItemId);
    }

    try {
      setLoading(true);
      await cartAPI.updateCartItem(cartItemId, { quantity });
      await refreshCart();
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async (): Promise<boolean> => {
    if (!user || !isAuthenticated) return false;

    try {
      setLoading(true);
      await cartAPI.clearCart();
      setCartItems([]);
      setCartSummary({
        totalItems: 0,
        totalPrice: 0
      });
      Alert.alert('Success', 'Cart cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      Alert.alert('Error', 'Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if service is in cart
  const isServiceInCart = (serviceId: string): boolean => {
    return cartItems.some(item => item.service_id === serviceId);
  };

  const value: CartContextType = {
    cartItems,
    cartSummary,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    isServiceInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
