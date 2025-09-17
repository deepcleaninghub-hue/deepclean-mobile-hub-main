import { httpClient } from './simpleHttpClient';

export interface CartItem {
  id: string;
  user_id: string;
  service_id: string;
  service_title: string;
  service_price: number;
  service_duration: string;
  service_category: string;
  quantity: number;
  added_at: string;
  updated_at: string;
  calculated_price: number;
  user_inputs: Record<string, any>;
  services?: {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number;
    duration: string;
    features: string[];
  };
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
}

export interface AddToCartRequest {
  service_id: string;
  quantity?: number;
  user_inputs?: Record<string, any>;
}

export interface UpdateCartItemRequest {
  quantity?: number;
  user_inputs?: Record<string, any>;
}

class CartAPI {
  private baseUrl = '/cart';

  // Get all cart items
  async getCartItems(): Promise<CartItem[]> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/items`) as { data: CartItem[] };
      return response.data || [];
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  }

  // Add item to cart
  async addToCart(data: AddToCartRequest): Promise<CartItem> {
    try {
      const response = await httpClient.post(`${this.baseUrl}/items`, data) as { data: CartItem };
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  // Update cart item
  async updateCartItem(itemId: string, data: UpdateCartItemRequest): Promise<CartItem> {
    try {
      const response = await httpClient.put(`${this.baseUrl}/items/${itemId}`, data) as { data: CartItem };
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  // Remove item from cart
  async removeFromCart(itemId: string): Promise<void> {
    try {
      await httpClient.delete(`${this.baseUrl}/items/${itemId}`);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  // Clear entire cart
  async clearCart(): Promise<void> {
    try {
      await httpClient.delete(`${this.baseUrl}/clear`);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Get cart summary
  async getCartSummary(): Promise<CartSummary> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/summary`) as { data: CartSummary };
      return response.data;
    } catch (error) {
      console.error('Error fetching cart summary:', error);
      throw error;
    }
  }
}

export const cartAPI = new CartAPI();