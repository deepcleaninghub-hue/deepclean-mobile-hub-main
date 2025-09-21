// Simple HTTP client for React Native compatibility
import AsyncStorage from '@react-native-async-storage/async-storage';

// Environment-based configuration
const BASE_URL = __DEV__ 
  ? 'http://192.168.29.65:5001/api'
  : 'https://api.deepcleanhub.com/api';

interface HttpOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

class SimpleHttpClient {
  private retryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
  };

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async requestWithRetry<T>(url: string, config: RequestInit, options: HttpOptions = {}): Promise<T> {
    const maxRetries = options.retries ?? this.retryConfig.maxRetries;
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Add timeout
        const timeout = options.timeout || 10000;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // SECURITY FIX: Only log in development mode
        if (__DEV__) {
          console.log(`Attempt ${attempt + 1}: Response status:`, response.status);
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          if (__DEV__) {
            console.error(`Attempt ${attempt + 1}: HTTP error response:`, errorData);
          }
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        if (response.status === 204) {
          if (__DEV__) {
            console.log('No content response');
          }
          return {} as T;
        }

        const responseData = await response.json();
        if (__DEV__) {
          console.log('Response data:', responseData);
        }
        return responseData;

      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timeout');
        }

        if (attempt < maxRetries) {
          const delay = Math.min(
            this.retryConfig.baseDelay * Math.pow(2, attempt),
            this.retryConfig.maxDelay
          );
          
          if (__DEV__) {
            console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
          }
          
          await this.sleep(delay);
        }
      }
    }

    throw lastError!;
  }

  private async request<T>(endpoint: string, options: HttpOptions = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    // Get auth token from storage
    const token = await AsyncStorage.getItem('auth_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    // SECURITY FIX: Only log in development mode, never log full tokens
    if (__DEV__) {
      console.log('=== HTTP CLIENT DEBUG ===');
      console.log('Making request to:', url);
      console.log('Method:', options.method || 'GET');
      console.log('Token exists:', !!token);
      console.log('Token preview:', token ? `${token.substring(0, 10)}...` : 'No token');
      console.log('Headers (sanitized):', {
        ...headers,
        Authorization: headers.Authorization ? 'Bearer [REDACTED]' : undefined
      });
      console.log('Body:', options.body);
    }

    const config: RequestInit = {
      method: options.method || 'GET',
      headers,
    };

    if (options.body && options.method !== 'GET') {
      config.body = JSON.stringify(options.body);
    }

    try {
      return await this.requestWithRetry<T>(url, config, options);
    } catch (error) {
      if (__DEV__) {
        console.error('HTTP request failed:', error);
      }
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
