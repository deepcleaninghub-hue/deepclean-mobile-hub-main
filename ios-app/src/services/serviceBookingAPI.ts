import { httpClient } from './simpleHttpClient';

export interface ServiceBooking {
  id: string;
  user_id: string;
  service_id: string;
  booking_date: string;
  booking_time: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed';
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  service_address: string;
  special_instructions?: string;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  payment_method?: string;
  assigned_staff?: string;
  staff_notes?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  created_at: string;
  updated_at: string;
  services?: {
    id: string;
    title: string;
    description: string;
    category: string;
    duration: string;
  };
}

export interface CreateServiceBookingData {
  service_id: string;
  booking_date: string;
  booking_time: string;
  duration_minutes: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  service_address: string;
  special_instructions?: string;
  total_amount: number;
  payment_method?: string;
}

export interface UpdateServiceBookingData {
  booking_date?: string;
  booking_time?: string;
  duration_minutes?: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  service_address?: string;
  special_instructions?: string;
  status?: 'scheduled' | 'completed';
}

class ServiceBookingAPI {
  private baseUrl = '/service-bookings';

  // Get all service bookings for the current user
  async getUserBookings(): Promise<ServiceBooking[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: ServiceBooking[]}>(this.baseUrl);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching service bookings:', error);
      throw error;
    }
  }

  // Get single service booking by ID
  async getBookingById(bookingId: string): Promise<ServiceBooking> {
    try {
      const response = await httpClient.get<{success: boolean, data: ServiceBooking}>(`${this.baseUrl}/${bookingId}`);
      if (!response.success || !response.data) {
        throw new Error('Booking not found');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching service booking:', error);
      throw error;
    }
  }

  // Create new service booking
  async createBooking(bookingData: CreateServiceBookingData): Promise<ServiceBooking> {
    try {
      console.log('ServiceBookingAPI: Creating booking with data:', bookingData);
      const response = await httpClient.post<{success: boolean, data: ServiceBooking, message: string}>(this.baseUrl, bookingData);
      console.log('ServiceBookingAPI: Received response:', response);
      
      if (!response.success || !response.data) {
        const errorMsg = response.message || 'Failed to create booking';
        console.error('ServiceBookingAPI: Booking creation failed:', errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log('ServiceBookingAPI: Booking created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('ServiceBookingAPI: Error creating service booking:', error);
      throw error;
    }
  }

  // Update service booking
  async updateBooking(bookingId: string, updateData: UpdateServiceBookingData): Promise<ServiceBooking> {
    try {
      const response = await httpClient.put<{success: boolean, data: ServiceBooking, message: string}>(`${this.baseUrl}/${bookingId}`, updateData);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update booking');
      }
      return response.data;
    } catch (error) {
      console.error('Error updating service booking:', error);
      throw error;
    }
  }

  // Cancel service booking
  async cancelBooking(bookingId: string): Promise<boolean> {
    try {
      const response = await httpClient.delete<{success: boolean, message: string}>(`${this.baseUrl}/${bookingId}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to cancel booking');
      }
      return true;
    } catch (error) {
      console.error('Error cancelling service booking:', error);
      throw error;
    }
  }

  // Get bookings by date range
  async getBookingsByDateRange(startDate: string, endDate: string): Promise<ServiceBooking[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: ServiceBooking[]}>(`${this.baseUrl}?start_date=${startDate}&end_date=${endDate}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching bookings by date range:', error);
      throw error;
    }
  }

  // Get upcoming bookings
  async getUpcomingBookings(): Promise<ServiceBooking[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await httpClient.get<{success: boolean, data: ServiceBooking[]}>(`${this.baseUrl}?upcoming=true&from_date=${today}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      throw error;
    }
  }

  // Get scheduled bookings (pending, confirmed, in_progress)
  async getScheduledBookings(): Promise<ServiceBooking[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: ServiceBooking[]}>(`${this.baseUrl}/scheduled`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching scheduled bookings:', error);
      throw error;
    }
  }

  // Get completed bookings
  async getCompletedBookings(): Promise<ServiceBooking[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: ServiceBooking[]}>(`${this.baseUrl}/completed`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching completed bookings:', error);
      throw error;
    }
  }
}

export const serviceBookingAPI = new ServiceBookingAPI();
