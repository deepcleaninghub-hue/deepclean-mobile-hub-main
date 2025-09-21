import './url-polyfill';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rvsjodkwwfdrqmaflryw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2c2pvZGt3d2ZkcnFtYWZscnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NDcxMTgsImV4cCI6MjA3MjEyMzExOH0.vOPPr12FW_HtopGw6I6UvXFFvj_8zS3cbmkYWMDCkJU';

// React Native compatible Supabase client configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: undefined, // Disable auth storage for React Native
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'deepclean-mobile-app',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database types for better TypeScript support
export interface MobileUser {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  profile_image?: string;
  is_active: boolean;
  email_verified: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  price: number;
  duration: string;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // New fields for price calculation
  pricing_type?: 'fixed' | 'per_sqm' | 'per_cm' | 'per_km';
  base_price?: number;
  unit_price?: number;
  unit_measure?: string;
  min_area?: number;
  max_area?: number;
}

export interface ServiceBooking {
  id: string;
  user_id?: string;
  service_id: string;
  service_variant_id?: string;
  booking_date: string;
  booking_time: string;
  duration_minutes: number;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  service_address: string;
  special_instructions?: string;
  total_amount: number;
  payment_status: string;
  payment_method?: string;
  assigned_staff?: string;
  staff_notes?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  service_id: string;
  service_title: string;
  service_price: number;
  service_duration: string;
  service_category: string;
  quantity: number;
  calculated_price?: number;
  user_inputs?: any;
  added_at: string;
  updated_at: string;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  items: CartItem[];
}

export interface OrderAddress {
  street_address: string;
  city: string;
  postal_code: string;
  country: string;
  additional_notes?: string;
}

export interface ServiceOrder {
  id: string;
  user_id: string;
  order_number: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  service_date: string;
  service_time: string;
  address: OrderAddress;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  service_id: string;
  service_title: string;
  service_price: number;
  quantity: number;
  calculated_price: number;
  user_inputs?: {
    area?: number;
    length?: number;
    distance?: number;
  };
}
