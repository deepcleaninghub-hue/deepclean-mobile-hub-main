// Supabase Authentication Service
// This handles RLS policies correctly by using Supabase's auth system

const SUPABASE_URL = 'https://rvsjodkwwfdrqmaflryw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2c2pvZGt3d2ZkcnFtYWZscnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NDcxMTgsImV4cCI6MjA3MjEyMzExOH0.vOPPr12FW_HtopGw6I6UvXFFvj_8zS3cbmkYWMDCkJU';

interface AuthResponse {
  user: any;
  session: any;
  error?: any;
}

interface SignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

interface SignInData {
  email: string;
  password: string;
}

class SupabaseAuthService {
  private async makeRequest<T>(
    endpoint: string, 
    method: string, 
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    const url = `${SUPABASE_URL}${endpoint}`;
    const requestHeaders = {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      ...headers,
    };

    const config: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error('Supabase request failed:', error);
      throw error;
    }
  }

  // Sign up with Supabase auth
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      // First, create the user in Supabase auth
      const authResponse = await this.makeRequest('/auth/v1/signup', 'POST', {
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone || '',
          }
        }
      });

      if (authResponse.user) {
        // Then create the profile in mobile_users table
        const profileData = {
          id: authResponse.user.id,
          email: data.email,
          password: data.password, // In production, this should be hashed
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone || '',
          is_active: true,
          email_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        await this.makeRequest('/rest/v1/mobile_users', 'POST', profileData, {
          'Prefer': 'return=representation'
        });

        return {
          user: authResponse.user,
          session: authResponse.session
        };
      }

      throw new Error('Failed to create user');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Sign in with Supabase auth
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('/auth/v1/token?grant_type=password', 'POST', {
        email: data.email,
        password: data.password,
      });

      if (response.access_token) {
        // Get user profile from mobile_users table
        const profile = await this.makeRequest(`/rest/v1/mobile_users?id=eq.${response.user.id}&select=*`, 'GET');
        
        return {
          user: { ...response.user, ...profile[0] },
          session: response
        };
      }

      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<any> {
    try {
      const profiles = await this.makeRequest(`/rest/v1/mobile_users?id=eq.${userId}&select=*`, 'GET');
      return profiles && profiles.length > 0 ? profiles[0] : null;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(userId: string, updates: any): Promise<boolean> {
    try {
      await this.makeRequest(`/rest/v1/mobile_users?id=eq.${userId}`, 'PATCH', updates);
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  }
}

export const supabaseAuth = new SupabaseAuthService();
