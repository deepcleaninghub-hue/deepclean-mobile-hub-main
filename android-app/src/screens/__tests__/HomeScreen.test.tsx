import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import HomeScreen from '../HomeScreen';
import { servicesAPI } from '../../services/servicesAPI';

// Mock the services API
jest.mock('../../services/servicesAPI', () => ({
  servicesAPI: {
    getAllServices: jest.fn(),
  },
}));

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock the theme
const mockTheme = {
  colors: {
    primary: '#007AFF',
    onSurface: '#000000',
    onSurfaceVariant: '#666666',
    error: '#FF3B30',
    surface: '#FFFFFF',
    surfaceVariant: '#F2F2F7',
  },
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <PaperProvider theme={mockTheme}>
      <NavigationContainer>
        {component}
      </NavigationContainer>
    </PaperProvider>
  );
};

describe('HomeScreen Performance Improvements', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state initially', () => {
    (servicesAPI.getAllServices as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep loading state
    );

    const { getByText } = renderWithProviders(
      <HomeScreen navigation={mockNavigation} />
    );

    expect(getByText('Loading services...')).toBeTruthy();
  });

  it('should load featured services from API', async () => {
    const mockServices = [
      {
        id: 'service-1',
        title: 'Test Service 1',
        description: 'Test Description 1',
        category: 'cleaning',
        pricing_type: 'fixed',
        display_order: 1,
        is_active: true,
        service_variants: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'service-2',
        title: 'Test Service 2',
        description: 'Test Description 2',
        category: 'cleaning',
        pricing_type: 'fixed',
        display_order: 2,
        is_active: true,
        service_variants: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    (servicesAPI.getAllServices as jest.Mock).mockResolvedValue(mockServices);

    const { getByText } = renderWithProviders(
      <HomeScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Featured Services')).toBeTruthy();
      expect(getByText('Test Service 1')).toBeTruthy();
      expect(getByText('Test Service 2')).toBeTruthy();
    });

    expect(servicesAPI.getAllServices).toHaveBeenCalledTimes(1);
  });

  it('should show error state when API fails', async () => {
    (servicesAPI.getAllServices as jest.Mock).mockRejectedValue(
      new Error('API Error')
    );

    const { getByText } = renderWithProviders(
      <HomeScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Oops! Something went wrong')).toBeTruthy();
      expect(getByText('Failed to load services. Please try again.')).toBeTruthy();
    });
  });

  it('should retry loading services when retry button is pressed', async () => {
    (servicesAPI.getAllServices as jest.Mock)
      .mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValueOnce([
        {
          id: 'service-1',
          title: 'Test Service 1',
          description: 'Test Description 1',
          category: 'cleaning',
          pricing_type: 'fixed',
          display_order: 1,
          is_active: true,
          service_variants: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

    const { getByText } = renderWithProviders(
      <HomeScreen navigation={mockNavigation} />
    );

    // Wait for error state
    await waitFor(() => {
      expect(getByText('Try Again')).toBeTruthy();
    });

    // Press retry button
    fireEvent.press(getByText('Try Again'));

    // Wait for success state
    await waitFor(() => {
      expect(getByText('Featured Services')).toBeTruthy();
    });

    expect(servicesAPI.getAllServices).toHaveBeenCalledTimes(2);
  });

  it('should navigate to services when service card is pressed', async () => {
    const mockServices = [
      {
        id: 'service-1',
        title: 'Test Service 1',
        description: 'Test Description 1',
        category: 'cleaning',
        pricing_type: 'fixed',
        display_order: 1,
        is_active: true,
        service_variants: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    (servicesAPI.getAllServices as jest.Mock).mockResolvedValue(mockServices);

    const { getByText } = renderWithProviders(
      <HomeScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Test Service 1')).toBeTruthy();
    });

    // Press the service card
    fireEvent.press(getByText('Test Service 1'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Services');
  });

  it('should navigate to services when book service button is pressed', () => {
    const { getByText } = renderWithProviders(
      <HomeScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Book Service'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Services');
  });

  it('should navigate to contact when get in touch button is pressed', () => {
    const { getByText } = renderWithProviders(
      <HomeScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Get in Touch'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Contact');
  });
});
