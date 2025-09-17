import { httpClient } from './simpleHttpClient';

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  serviceDate: string;
  serviceTime: string;
  address: {
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
    additional_notes?: string;
  };
  items: Array<{
    service_title: string;
    service_price: number;
    quantity: number;
    calculated_price: number;
  }>;
  createdAt: string;
  updatedAt: string;
  specialInstructions?: string;
  serviceProvider?: {
    id: string;
    name: string;
    phone: string;
    photo?: string;
  };
  trackingInfo?: {
    estimatedArrival: string;
    currentLocation?: string;
    lastUpdate: string;
  };
}

export interface CreateOrderData {
  user_id: string;
  total_amount: number;
  service_date: string;
  service_time: string;
  address: {
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
    additional_notes?: string;
  };
  special_instructions?: string;
  items: Array<{
    service_id: string;
    service_title: string;
    service_price: number;
    quantity: number;
    calculated_price: number;
    user_inputs?: any;
  }>;
}

export interface RescheduleData {
  service_date: string;
  service_time: string;
  reason?: string;
}

class OrderAPI {
  private baseUrl = '/orders';

  // Get all orders for a user
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: Order[]}>(`${this.baseUrl}/user/${userId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  // Get order details by ID
  async getOrderDetails(orderId: string): Promise<Order> {
    try {
      const response = await httpClient.get<{success: boolean, data: Order}>(`${this.baseUrl}/${orderId}`);
      if (!response.success || !response.data) {
        throw new Error('Order not found');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  // Create a new order
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const response = await httpClient.post<{success: boolean, data: Order}>(`${this.baseUrl}`, orderData);
      if (!response.success || !response.data) {
        throw new Error('Failed to create order');
      }
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Cancel an order
  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      const response = await httpClient.patch<{success: boolean}>(`${this.baseUrl}/${orderId}/cancel`);
      return response.success;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  // Reschedule an order
  async rescheduleOrder(orderId: string, rescheduleData: RescheduleData): Promise<boolean> {
    try {
      const response = await httpClient.patch<{success: boolean}>(`${this.baseUrl}/${orderId}/reschedule`, rescheduleData);
      return response.success;
    } catch (error) {
      console.error('Error rescheduling order:', error);
      throw error;
    }
  }

  // Get order tracking information
  async getOrderTracking(orderId: string): Promise<any> {
    try {
      const response = await httpClient.get<{success: boolean, data: any}>(`${this.baseUrl}/${orderId}/tracking`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order tracking:', error);
      throw error;
    }
  }

  // Update order status (admin only)
  async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<boolean> {
    try {
      const response = await httpClient.patch<{success: boolean}>(`${this.baseUrl}/${orderId}/status`, {
        status,
        notes
      });
      return response.success;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Get orders by status
  async getOrdersByStatus(userId: string, status: string): Promise<Order[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: Order[]}>(`${this.baseUrl}/user/${userId}/status/${status}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      throw error;
    }
  }

  // Get order statistics
  async getOrderStats(userId: string): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalSpent: number;
  }> {
    try {
      const response = await httpClient.get<{success: boolean, data: any}>(`${this.baseUrl}/user/${userId}/stats`);
      return response.data || {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalSpent: 0
      };
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }

  // Rate and review an order
  async rateOrder(orderId: string, rating: number, review?: string): Promise<boolean> {
    try {
      const response = await httpClient.post<{success: boolean}>(`${this.baseUrl}/${orderId}/rate`, {
        rating,
        review
      });
      return response.success;
    } catch (error) {
      console.error('Error rating order:', error);
      throw error;
    }
  }

  // Get available time slots for a date
  async getAvailableTimeSlots(date: string, serviceId?: string): Promise<string[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: string[]}>(`${this.baseUrl}/availability/${date}${serviceId ? `?serviceId=${serviceId}` : ''}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      throw error;
    }
  }

  // Check if a time slot is available
  async checkTimeSlotAvailability(date: string, time: string, serviceId?: string): Promise<boolean> {
    try {
      const response = await httpClient.get<{success: boolean, data: boolean}>(`${this.baseUrl}/availability/check`, {
        params: { date, time, serviceId }
      });
      return response.data || false;
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      throw error;
    }
  }
}

export const orderAPI = new OrderAPI();
