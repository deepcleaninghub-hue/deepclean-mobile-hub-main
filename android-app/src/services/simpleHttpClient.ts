// Simple HTTP client for React Native compatibility
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.29.65:5000/api';

interface HttpOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

class SimpleHttpClient {
  private async request<T>(endpoint: string, options: HttpOptions = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    // Get auth token from storage
    const token = await AsyncStorage.getItem('auth_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    console.log('=== HTTP CLIENT DEBUG ===');
    console.log('Making request to:', url);
    console.log('Method:', options.method || 'GET');
    console.log('Token from storage:', token ? `Token found: ${token.substring(0, 20)}...` : 'No token found');
    console.log('Full token:', token);
    console.log('Headers:', headers);
    console.log('Body:', options.body);

    const config: RequestInit = {
      method: options.method || 'GET',
      headers,
    };

    if (options.body && options.method !== 'GET') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('HTTP error response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      if (response.status === 204) {
        console.log('No content response');
        return {} as T; // No content
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);
      return responseData;
    } catch (error) {
      console.error('HTTP request failed:', error);
      throw error;
    }
  }

  // Generic methods
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let url = endpoint;
    if (params) {
      // Convert Supabase-style filters to proper query parameters
      const queryParams: string[] = [];
      Object.entries(params).forEach(([key, value]) => {
        if (value.startsWith('eq.')) {
          // Properly encode the value after 'eq.'
          const filterValue = value.substring(3);
          queryParams.push(`${key}=eq.${encodeURIComponent(filterValue)}`);
        } else if (value.startsWith('order.')) {
          queryParams.push(`order=${encodeURIComponent(value.substring(6))}`);
        } else {
          queryParams.push(`${key}=${encodeURIComponent(value)}`);
        }
      });
      url += `?${queryParams.join('&')}`;
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: data });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: data });
  }

  async patch<T>(endpoint: string, data: any, id?: string): Promise<T> {
    const url = id ? `${endpoint}?id=eq.${id}` : endpoint;
    return this.request<T>(url, { method: 'PATCH', body: data });
  }

  async update<T>(endpoint: string, data: any, id: string): Promise<T> {
    const url = `${endpoint}?id=eq.${id}`;
    return this.request<T>(url, { method: 'PATCH', body: data });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const httpClient = new SimpleHttpClient();
