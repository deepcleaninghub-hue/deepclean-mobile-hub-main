import { httpClient } from './simpleHttpClient';
import { Service } from '../config/supabase';

// Services API
export const servicesAPI = {
  // Get all active services
  async getAllServices(): Promise<Service[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: Service[]}>('/services');
      
      console.log('Fetched services from backend:', response);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      // Return fallback data if no data or unsuccessful response
      return [
        {
          id: 'fallback-1',
          title: 'Deep House Cleaning',
          description: 'Comprehensive house cleaning service',
          image: '',
          category: 'House Cleaning',
          price: 150,
          duration: '4-6 hours',
          features: ['Kitchen', 'Bathrooms', 'Living Areas', 'Bedrooms'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'fallback-2',
          title: 'Kitchen Deep Clean',
          description: 'Thorough kitchen cleaning service',
          image: '',
          category: 'Kitchen Cleaning',
          price: 80,
          duration: '2-3 hours',
          features: ['Appliance cleaning', 'Cabinet cleaning', 'Surface sanitization', 'Grease removal'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    } catch (error) {
      console.error('Error in getAllServices:', error);
      // Return fallback data if database fails
      return [
        {
          id: 'fallback-1',
          title: 'Deep House Cleaning',
          description: 'Comprehensive house cleaning service',
          image: '',
          category: 'House Cleaning',
          price: 150,
          duration: '4-6 hours',
          features: ['Kitchen', 'Bathrooms', 'Living Areas', 'Bedrooms'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'fallback-2',
          title: 'Kitchen Deep Clean',
          description: 'Thorough kitchen cleaning service',
          image: '',
          category: 'Kitchen Cleaning',
          price: 80,
          duration: '2-3 hours',
          features: ['Appliance cleaning', 'Cabinet cleaning', 'Surface sanitization', 'Grease removal'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }
  },

  // Get service by ID
  async getServiceById(id: string): Promise<Service | null> {
    try {
      const response = await httpClient.get<{success: boolean, data: Service}>(`/services/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error in getServiceById:', error);
      return null;
    }
  },

  // Get services by category
  async getServicesByCategory(category: string): Promise<Service[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: Service[]}>(`/services?category=eq.${category}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error in getServicesByCategory:', error);
      return [];
    }
  },
};
