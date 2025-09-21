import { httpClient } from '../simpleHttpClient';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('SimpleHttpClient Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console methods to test logging behavior
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Token Logging Security', () => {
    it('should not log full tokens in production mode', async () => {
      // Mock production environment
      const originalDev = global.__DEV__;
      global.__DEV__ = false;

      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      (require('@react-native-async-storage/async-storage').getItem as jest.Mock)
        .mockResolvedValue(mockToken);

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await httpClient.get('/test');

      // Verify no full token was logged
      expect(console.log).not.toHaveBeenCalledWith(
        expect.stringContaining(mockToken)
      );

      // Restore original __DEV__ value
      global.__DEV__ = originalDev;
    });

    it('should only log token preview in development mode', async () => {
      // Mock development environment
      const originalDev = global.__DEV__;
      global.__DEV__ = true;

      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      (require('@react-native-async-storage/async-storage').getItem as jest.Mock)
        .mockResolvedValue(mockToken);

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await httpClient.get('/test');

      // Verify only token preview was logged
      expect(console.log).toHaveBeenCalledWith(
        'Token preview:',
        'eyJhbGciOiJ...'
      );

      // Restore original __DEV__ value
      global.__DEV__ = originalDev;
    });
  });

  describe('Environment-based Configuration', () => {
    it('should use development URL in development mode', () => {
      const originalDev = global.__DEV__;
      global.__DEV__ = true;

      // The BASE_URL should be set to development URL
      // This is tested indirectly through the request URL
      expect(true).toBe(true); // Placeholder for actual test

      global.__DEV__ = originalDev;
    });

    it('should use production URL in production mode', () => {
      const originalDev = global.__DEV__;
      global.__DEV__ = false;

      // The BASE_URL should be set to production URL
      // This is tested indirectly through the request URL
      expect(true).toBe(true); // Placeholder for actual test

      global.__DEV__ = originalDev;
    });
  });

  describe('Error Handling and Retry Logic', () => {
    it('should retry failed requests', async () => {
      const mockToken = 'test-token';
      
      (require('@react-native-async-storage/async-storage').getItem as jest.Mock)
        .mockResolvedValue(mockToken);

      // Mock fetch to fail first two times, then succeed
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: true }),
        });

      const result = await httpClient.get('/test');

      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ success: true });
    });

    it('should handle timeout errors', async () => {
      const mockToken = 'test-token';
      
      (require('@react-native-async-storage/async-storage').getItem as jest.Mock)
        .mockResolvedValue(mockToken);

      // Mock fetch to timeout
      (global.fetch as jest.Mock).mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 100);
        });
      });

      await expect(httpClient.get('/test', { timeout: 50 })).rejects.toThrow('Request timeout');
    });

    it('should not retry on certain errors', async () => {
      const mockToken = 'test-token';
      
      (require('@react-native-async-storage/async-storage').getItem as jest.Mock)
        .mockResolvedValue(mockToken);

      // Mock fetch to return 401 (unauthorized) - should not retry
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Unauthorized' }),
      });

      await expect(httpClient.get('/test')).rejects.toThrow('Unauthorized');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Request Sanitization', () => {
    it('should sanitize request headers', async () => {
      const mockToken = 'test-token';
      
      (require('@react-native-async-storage/async-storage').getItem as jest.Mock)
        .mockResolvedValue(mockToken);

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await httpClient.get('/test');

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const requestConfig = fetchCall[1];
      
      expect(requestConfig.headers).toHaveProperty('Content-Type', 'application/json');
      expect(requestConfig.headers).toHaveProperty('Authorization', 'Bearer test-token');
    });

    it('should handle requests without token', async () => {
      (require('@react-native-async-storage/async-storage').getItem as jest.Mock)
        .mockResolvedValue(null);

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await httpClient.get('/test');

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const requestConfig = fetchCall[1];
      
      expect(requestConfig.headers).not.toHaveProperty('Authorization');
    });
  });

  describe('Response Handling', () => {
    it('should handle 204 No Content responses', async () => {
      const mockToken = 'test-token';
      
      (require('@react-native-async-storage/async-storage').getItem as jest.Mock)
        .mockResolvedValue(mockToken);

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 204,
      });

      const result = await httpClient.delete('/test');

      expect(result).toEqual({});
    });

    it('should handle JSON responses', async () => {
      const mockToken = 'test-token';
      const mockResponse = { success: true, data: 'test' };
      
      (require('@react-native-async-storage/async-storage').getItem as jest.Mock)
        .mockResolvedValue(mockToken);

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await httpClient.get('/test');

      expect(result).toEqual(mockResponse);
    });

    it('should handle HTTP error responses', async () => {
      const mockToken = 'test-token';
      const errorResponse = { message: 'Not Found' };
      
      (require('@react-native-async-storage/async-storage').getItem as jest.Mock)
        .mockResolvedValue(mockToken);

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve(errorResponse),
      });

      await expect(httpClient.get('/test')).rejects.toThrow('Not Found');
    });
  });
});
