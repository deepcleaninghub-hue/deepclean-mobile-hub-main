import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import { httpClient } from '../../services/simpleHttpClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock dependencies
jest.mock('../../services/simpleHttpClient', () => ({
  httpClient: {
    post: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  multiRemove: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext Performance Improvements', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should refresh token automatically', async () => {
    const mockToken = 'new-token-123';
    (httpClient.post as jest.Mock).mockResolvedValue({ token: mockToken });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{"id": "user-1"}');
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Fast-forward time to trigger token refresh
    act(() => {
      jest.advanceTimersByTime(25 * 60 * 1000); // 25 minutes
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(httpClient.post).toHaveBeenCalledWith('/auth/refresh', {});
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth_token', mockToken);
  });

  it('should sign out when token refresh fails', async () => {
    (httpClient.post as jest.Mock).mockRejectedValue(new Error('Refresh failed'));
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{"id": "user-1"}');
    (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Fast-forward time to trigger token refresh
    act(() => {
      jest.advanceTimersByTime(25 * 60 * 1000); // 25 minutes
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['auth_user', 'auth_token']);
    expect(result.current.user).toBeNull();
  });

  it('should sign out after session timeout', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{"id": "user-1"}');
    (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Fast-forward time to trigger session timeout
    act(() => {
      jest.advanceTimersByTime(30 * 60 * 1000); // 30 minutes
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['auth_user', 'auth_token']);
    expect(result.current.user).toBeNull();
  });

  it('should update last activity when refreshToken is called', async () => {
    const mockToken = 'new-token-123';
    (httpClient.post as jest.Mock).mockResolvedValue({ token: mockToken });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{"id": "user-1"}');
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Call refreshToken manually
    await act(async () => {
      const success = await result.current.refreshToken();
      expect(success).toBe(true);
    });

    expect(httpClient.post).toHaveBeenCalledWith('/auth/refresh', {});
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth_token', mockToken);
  });

  it('should handle refreshToken failure gracefully', async () => {
    (httpClient.post as jest.Mock).mockRejectedValue(new Error('Network error'));
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{"id": "user-1"}');

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Call refreshToken manually
    await act(async () => {
      const success = await result.current.refreshToken();
      expect(success).toBe(false);
    });

    expect(httpClient.post).toHaveBeenCalledWith('/auth/refresh', {});
  });
});
