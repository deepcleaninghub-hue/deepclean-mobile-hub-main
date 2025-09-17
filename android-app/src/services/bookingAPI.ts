import { httpClient } from './simpleHttpClient';

export interface TimeSlot {
  time: string;
  available: boolean;
  serviceProvider?: {
    id: string;
    name: string;
    rating: number;
  };
}

export interface ServiceProvider {
  id: string;
  name: string;
  photo?: string;
  rating: number;
  completedJobs: number;
  specialties: string[];
  bio: string;
  phone: string;
  email: string;
  location: {
    city: string;
    country: string;
  };
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
}

export interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  service_provider_id: string;
  service_date: string;
  service_time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  address: {
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
    additional_notes?: string;
  };
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  service_provider: ServiceProvider;
  service: {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: string;
    category: string;
  };
}

export interface CreateBookingData {
  user_id: string;
  service_id: string;
  service_date: string;
  service_time: string;
  service_provider_id: string;
  address: {
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
    additional_notes?: string;
  };
  special_instructions?: string;
  total_amount: number;
}

export interface RescheduleBookingData {
  service_date: string;
  service_time: string;
  reason?: string;
}

class BookingAPI {
  private baseUrl = '/bookings';

  // Get available time slots for a specific date and service
  async getAvailableTimeSlots(date: string, serviceId?: string): Promise<TimeSlot[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: TimeSlot[]}>(`${this.baseUrl}/availability/${date}${serviceId ? `?serviceId=${serviceId}` : ''}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      throw error;
    }
  }

  // Get service providers for a specific service
  async getServiceProviders(serviceId?: string): Promise<ServiceProvider[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: ServiceProvider[]}>(`${this.baseUrl}/providers${serviceId ? `?serviceId=${serviceId}` : ''}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching service providers:', error);
      throw error;
    }
  }

  // Get service provider details
  async getServiceProvider(providerId: string): Promise<ServiceProvider> {
    try {
      const response = await httpClient.get<{success: boolean, data: ServiceProvider}>(`${this.baseUrl}/providers/${providerId}`);
      if (!response.success || !response.data) {
        throw new Error('Service provider not found');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching service provider:', error);
      throw error;
    }
  }

  // Create a new booking
  async createBooking(bookingData: CreateBookingData): Promise<Booking> {
    try {
      const response = await httpClient.post<{success: boolean, data: Booking}>(`${this.baseUrl}`, bookingData);
      if (!response.success || !response.data) {
        throw new Error('Failed to create booking');
      }
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Get user's bookings
  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: Booking[]}>(`${this.baseUrl}/user/${userId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  // Get booking details
  async getBookingDetails(bookingId: string): Promise<Booking> {
    try {
      const response = await httpClient.get<{success: boolean, data: Booking}>(`${this.baseUrl}/${bookingId}`);
      if (!response.success || !response.data) {
        throw new Error('Booking not found');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  }

  // Cancel a booking
  async cancelBooking(bookingId: string, reason?: string): Promise<boolean> {
    try {
      const response = await httpClient.patch<{success: boolean}>(`${this.baseUrl}/${bookingId}/cancel`, { reason });
      return response.success;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  // Reschedule a booking
  async rescheduleBooking(bookingId: string, rescheduleData: RescheduleBookingData): Promise<boolean> {
    try {
      const response = await httpClient.patch<{success: boolean}>(`${this.baseUrl}/${bookingId}/reschedule`, rescheduleData);
      return response.success;
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      throw error;
    }
  }

  // Check if a time slot is available
  async checkTimeSlotAvailability(date: string, time: string, serviceId?: string, providerId?: string): Promise<boolean> {
    try {
      const response = await httpClient.get<{success: boolean, data: boolean}>(`${this.baseUrl}/availability/check`, {
        params: { date, time, serviceId, providerId }
      });
      return response.data || false;
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      throw error;
    }
  }

  // Get booking calendar for a month
  async getBookingCalendar(year: number, month: number, serviceId?: string): Promise<{
    date: string;
    available: boolean;
    slots: TimeSlot[];
  }[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: any[]}>(`${this.baseUrl}/calendar/${year}/${month}${serviceId ? `?serviceId=${serviceId}` : ''}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching booking calendar:', error);
      throw error;
    }
  }

  // Get service provider availability
  async getProviderAvailability(providerId: string, startDate: string, endDate: string): Promise<{
    date: string;
    available: boolean;
    slots: TimeSlot[];
  }[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: any[]}>(`${this.baseUrl}/providers/${providerId}/availability`, {
        params: { startDate, endDate }
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching provider availability:', error);
      throw error;
    }
  }

  // Rate and review a booking
  async rateBooking(bookingId: string, rating: number, review?: string): Promise<boolean> {
    try {
      const response = await httpClient.post<{success: boolean}>(`${this.baseUrl}/${bookingId}/rate`, {
        rating,
        review
      });
      return response.success;
    } catch (error) {
      console.error('Error rating booking:', error);
      throw error;
    }
  }

  // Get booking statistics
  async getBookingStats(userId: string): Promise<{
    totalBookings: number;
    pendingBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalSpent: number;
    averageRating: number;
  }> {
    try {
      const response = await httpClient.get<{success: boolean, data: any}>(`${this.baseUrl}/user/${userId}/stats`);
      return response.data || {
        totalBookings: 0,
        pendingBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalSpent: 0,
        averageRating: 0
      };
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      throw error;
    }
  }

  // Send booking reminder
  async sendBookingReminder(bookingId: string): Promise<boolean> {
    try {
      const response = await httpClient.post<{success: boolean}>(`${this.baseUrl}/${bookingId}/reminder`);
      return response.success;
    } catch (error) {
      console.error('Error sending booking reminder:', error);
      throw error;
    }
  }

  // Get nearby service providers
  async getNearbyProviders(latitude: number, longitude: number, radius: number = 10, serviceId?: string): Promise<ServiceProvider[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: ServiceProvider[]}>(`${this.baseUrl}/providers/nearby`, {
        params: { latitude, longitude, radius, serviceId }
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching nearby providers:', error);
      throw error;
    }
  }

  // Update booking status (admin/provider only)
  async updateBookingStatus(bookingId: string, status: string, notes?: string): Promise<boolean> {
    try {
      const response = await httpClient.patch<{success: boolean}>(`${this.baseUrl}/${bookingId}/status`, {
        status,
        notes
      });
      return response.success;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }
}

export const bookingAPI = new BookingAPI();
