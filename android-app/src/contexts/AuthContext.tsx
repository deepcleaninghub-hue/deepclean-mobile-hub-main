import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { httpClient } from '../services/simpleHttpClient';
import { MobileUser } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface AuthContextType {
  user: MobileUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<MobileUser>) => Promise<boolean>;
  clearAllAuthData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'auth_user';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<MobileUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from AsyncStorage on app start
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      const storedToken = await AsyncStorage.getItem('auth_token');
      
      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('Loaded user from storage:', userData.email);
        console.log('Token exists:', !!storedToken);
      } else {
        console.log('No stored user or token found');
        // Clear any partial data
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        await AsyncStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
      // Clear corrupted data
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      await AsyncStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      console.log('=== AUTH DEBUG START ===');
      console.log('Attempting to login with email:', email);
      
      const response = await httpClient.post<{success: boolean, data: {user: MobileUser, token: string}}>('/mobile-auth/signin', {
        email: email.toLowerCase(),
        password
      });

      console.log('Backend response:', response);
      console.log('=== AUTH DEBUG END ===');

      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store user and token
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        await AsyncStorage.setItem('auth_token', token);
        
        setUser(user);
        return true;
      } else {
        Alert.alert('Authentication Failed', 'Invalid email or password. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Error', 'Failed to sign in. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await httpClient.post<{success: boolean, data: {user: MobileUser, token: string}}>('/mobile-auth/signup', {
        email: email.toLowerCase(),
        password,
        first_name: firstName,
        last_name: lastName,
        phone: phone || ''
      });

      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store user and token
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        await AsyncStorage.setItem('auth_token', token);
        
        setUser(user);
        return true;
      } else {
        Alert.alert('Sign Up Failed', 'Failed to create account. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setUser(null);
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      await AsyncStorage.removeItem('auth_token');
      console.log('User signed out and storage cleared');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Force clear all auth data - for debugging
  const clearAllAuthData = async (): Promise<void> => {
    try {
      setUser(null);
      await AsyncStorage.multiRemove([AUTH_STORAGE_KEY, 'auth_token']);
      console.log('All authentication data cleared');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const updateProfile = async (updates: Partial<MobileUser>): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);

      // For demo purposes, just update local state
      // In production, this would update the database
      const updatedUser = { ...user, ...updates, updated_at: new Date().toISOString() };
      setUser(updatedUser);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));

      Alert.alert('Success', 'Profile updated successfully!');
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile,
    clearAllAuthData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
