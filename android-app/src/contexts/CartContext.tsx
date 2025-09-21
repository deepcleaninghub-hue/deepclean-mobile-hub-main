import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cartAPI, CartItem, CartSummary } from '../services/cartAPI';
import { servicesAPI, Service } from '../services/servicesAPI';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  cartSummary: CartSummary;
  serviceCategories: Service[];
  loading: boolean;
  addToCart: (service: any, calculatedPrice?: number, userInputs?: any) => Promise<boolean>;
  removeFromCart: (cartItemId: string) => Promise<boolean>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
  refreshServiceCategories: () => Promise<void>;
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

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CART_CACHE_KEY = 'cart_items_cache';
const CART_CACHE_TIME_KEY = 'cart_items_cache_time';
const SERVICES_CACHE_KEY = 'services_cache';
const SERVICES_CACHE_TIME_KEY = 'services_cache_time';

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    totalItems: 0,
    totalPrice: 0
  });
  const [serviceCategories, setServiceCategories] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Optimized useEffect with proper dependencies and caching
  useEffect(() => {
    const initializeCart = async () => {
      if (user && isAuthenticated && !initialized) {
        setInitialized(true);
        await Promise.all([
          refreshCart(),
          refreshServiceCategories()
        ]);
      } else if (!isAuthenticated) {
        // Clear cart when user logs out
        setCartItems([]);
        setCartSummary({
          totalItems: 0,
          totalPrice: 0
        });
        setServiceCategories([]);
        setInitialized(false);
        // Clear cache when user logs out
        await AsyncStorage.multiRemove([
          CART_CACHE_KEY,
          CART_CACHE_TIME_KEY,
          SERVICES_CACHE_KEY,
          SERVICES_CACHE_TIME_KEY
        ]);
      }
    };

    initializeCart();
  }, [user?.id, isAuthenticated, initialized]); // Only depend on user ID, not entire user object

  // Optimized refresh cart with caching
  const refreshCart = useCallback(async (forceRefresh = false) => {
    if (!user || !isAuthenticated) {
      console.log('No user or not authenticated, skipping cart refresh');
      return;
    }
    
    try {
      // Check cache first
      if (!forceRefresh) {
        const cachedData = await AsyncStorage.getItem(CART_CACHE_KEY);
        const cacheTime = await AsyncStorage.getItem(CART_CACHE_TIME_KEY);
        
        if (cachedData && cacheTime) {
          const timeDiff = Date.now() - parseInt(cacheTime);
          if (timeDiff < CACHE_DURATION) {
            const { items, summary } = JSON.parse(cachedData);
            setCartItems(items || []);
            setCartSummary(summary || { totalItems: 0, totalPrice: 0 });
            return;
          }
        }
      }
      
      setLoading(true);
      const [items, summary] = await Promise.all([
        cartAPI.getCartItems(),
        cartAPI.getCartSummary()
      ]);
      
      const cartData = {
        items: items || [],
        summary: summary || { totalItems: 0, totalPrice: 0 }
      };
      
      setCartItems(cartData.items);
      setCartSummary(cartData.summary);
      
      // Cache the data
      await AsyncStorage.setItem(CART_CACHE_KEY, JSON.stringify(cartData));
      await AsyncStorage.setItem(CART_CACHE_TIME_KEY, Date.now().toString());
      
    } catch (error) {
      console.error('Error refreshing cart:', error);
      // Set fallback values to prevent undefined errors
      setCartItems([]);
      setCartSummary({ totalItems: 0, totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  }, [user?.id, isAuthenticated]);

  // Optimized refresh service categories with caching
  const refreshServiceCategories = useCallback(async (forceRefresh = false) => {
    try {
      // Check cache first
      if (!forceRefresh) {
        const cachedServices = await AsyncStorage.getItem(SERVICES_CACHE_KEY);
        const cacheTime = await AsyncStorage.getItem(SERVICES_CACHE_TIME_KEY);
        
        if (cachedServices && cacheTime) {
          const timeDiff = Date.now() - parseInt(cacheTime);
          if (timeDiff < CACHE_DURATION) {
            const services = JSON.parse(cachedServices);
            setServiceCategories(services);
            return;
          }
        }
      }
      
      console.log('Refreshing service categories...');
      const services = await servicesAPI.getAllServices();
      console.log('Services response:', services);
      setServiceCategories(services);
      
      // Cache the services
      await AsyncStorage.setItem(SERVICES_CACHE_KEY, JSON.stringify(services));
      await AsyncStorage.setItem(SERVICES_CACHE_TIME_KEY, Date.now().toString());
      
    } catch (error) {
      console.error('Error refreshing service categories:', error);
    }
  }, []);

  // Optimized check if service is in cart with memoization
  const isServiceInCart = useCallback((serviceId: string): boolean => {
    return cartItems.some(item => item.service_id === serviceId);
  }, [cartItems]);

  // Optimized add to cart with optimistic updates
  const addToCart = useCallback(async (service: any, calculatedPrice?: number, userInputs?: any): Promise<boolean> => {
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
        user_inputs: userInputs || {},
        calculated_price: calculatedPrice || service.price
      };

      await cartAPI.addToCart(cartItemData);
      
      // Force refresh cart to get updated data and clear cache
      await refreshCart(true);
      Alert.alert('Success', `${service.title} added to cart!`);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.id, isAuthenticated, isServiceInCart, refreshCart]);

  // Optimized remove item from cart
  const removeFromCart = useCallback(async (cartItemId: string): Promise<boolean> => {
    if (!user || !isAuthenticated) return false;
    
    try {
      setLoading(true);
      await cartAPI.removeFromCart(cartItemId);
      await refreshCart(true); // Force refresh to clear cache
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      Alert.alert('Error', 'Failed to remove item from cart');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.id, isAuthenticated, refreshCart]);

  // Optimized update item quantity
  const updateQuantity = useCallback(async (cartItemId: string, quantity: number): Promise<boolean> => {
    if (!user || !isAuthenticated) return false;
    
    if (quantity < 1) {
      return removeFromCart(cartItemId);
    }

    try {
      setLoading(true);
      await cartAPI.updateCartItem(cartItemId, { quantity });
      await refreshCart(true); // Force refresh to clear cache
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.id, isAuthenticated, removeFromCart, refreshCart]);

  // Optimized clear entire cart
  const clearCart = useCallback(async (): Promise<boolean> => {
    if (!user || !isAuthenticated) return false;

    try {
      setLoading(true);
      await cartAPI.clearCart();
      setCartItems([]);
      setCartSummary({
        totalItems: 0,
        totalPrice: 0
      });
      
      // Clear cache
      await AsyncStorage.multiRemove([CART_CACHE_KEY, CART_CACHE_TIME_KEY]);
      
      Alert.alert('Success', 'Cart cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      Alert.alert('Error', 'Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.id, isAuthenticated]);

  // Memoize context value to prevent unnecessary re-renders
  const value: CartContextType = useMemo(() => ({
    cartItems,
    cartSummary,
    serviceCategories,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    refreshServiceCategories,
    isServiceInCart
  }), [
    cartItems,
    cartSummary,
    serviceCategories,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    refreshServiceCategories,
    isServiceInCart
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
