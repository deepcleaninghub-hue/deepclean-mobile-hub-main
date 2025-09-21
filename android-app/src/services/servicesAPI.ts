import { httpClient } from './simpleHttpClient';

export interface ServiceVariant {
  id: string;
  service_id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  pricing_type: 'fixed' | 'per_unit';
  unit_price?: number;
  unit_measure?: string;
  min_measurement?: number;
  max_measurement?: number;
  measurement_step?: number;
  measurement_placeholder?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url?: string;
  pricing_type: 'fixed' | 'per_unit';
  unit_measure?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  service_variants: ServiceVariant[];
}

class ServicesAPI {
  private baseUrl = '/services';

  // Get all services with their variants
  async getAllServices(): Promise<Service[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: Service[]}>(this.baseUrl);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  }

  // Get services by category
  async getServicesByCategory(category: string): Promise<Service[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: Service[]}>(`${this.baseUrl}?category=${category}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching services by category:', error);
      return [];
    }
  }

  // Get service by ID with variants
  async getServiceById(id: string): Promise<Service | null> {
    try {
      const response = await httpClient.get<{success: boolean, data: Service}>(`${this.baseUrl}/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching service by ID:', error);
      return null;
    }
  }

  // Get service variants by service ID
  async getServiceVariants(serviceId: string): Promise<ServiceVariant[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: ServiceVariant[]}>(`${this.baseUrl}/${serviceId}/variants`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching service variants:', error);
      return [];
    }
  }

  // Get service variant by ID
  async getServiceVariantById(variantId: string): Promise<ServiceVariant | null> {
    try {
      const response = await httpClient.get<{success: boolean, data: ServiceVariant}>(`/service-variants/${variantId}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching service variant by ID:', error);
      return null;
    }
  }

  // Get all service variants
  async getAllServiceVariants(): Promise<ServiceVariant[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: ServiceVariant[]}>('/service-variants');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching all service variants:', error);
      return [];
    }
  }

  // Get service variants by category
  async getServiceVariantsByCategory(category: string): Promise<ServiceVariant[]> {
    try {
      const response = await httpClient.get<{success: boolean, data: ServiceVariant[]}>(`/service-variants?category=${category}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching service variants by category:', error);
      return [];
    }
  }
}

export const servicesAPI = new ServicesAPI();
