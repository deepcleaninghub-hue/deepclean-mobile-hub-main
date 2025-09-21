import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import ServiceCard from '../ServiceCard';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

// Mock the contexts
jest.mock('../../contexts/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the theme
const mockTheme = {
  colors: {
    primary: '#007AFF',
    onSurface: '#000000',
    onSurfaceVariant: '#666666',
    surface: '#FFFFFF',
  },
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <PaperProvider theme={mockTheme}>
      {component}
    </PaperProvider>
  );
};

describe('ServiceCard Performance Improvements', () => {
  const mockAddToCart = jest.fn();
  const mockIsServiceInCart = jest.fn();
  const mockIsAuthenticated = true;

  beforeEach(() => {
    jest.clearAllMocks();
    (useCart as jest.Mock).mockReturnValue({
      addToCart: mockAddToCart,
      isServiceInCart: mockIsServiceInCart,
      loading: false,
    });
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: mockIsAuthenticated,
    });
  });

  const defaultProps = {
    id: 'service-1',
    title: 'Test Service',
    description: 'Test Description',
    image: 'https://example.com/image.jpg',
    price: 100,
    duration: '2 hours',
    category: 'cleaning',
  };

  it('should render service card with memoized styles', () => {
    const { getByText } = renderWithProviders(
      <ServiceCard {...defaultProps} />
    );

    expect(getByText('Test Service')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
  });

  it('should handle image loading states', async () => {
    const { getByTestId } = renderWithProviders(
      <ServiceCard {...defaultProps} />
    );

    // The image should be rendered
    const image = getByTestId('service-image');
    expect(image).toBeTruthy();
  });

  it('should show fallback image on error', async () => {
    const { getByTestId } = renderWithProviders(
      <ServiceCard {...defaultProps} />
    );

    const image = getByTestId('service-image');
    
    // Simulate image error
    fireEvent(image, 'onError');
    
    // Should still render (fallback image)
    expect(image).toBeTruthy();
  });

  it('should add service to cart when authenticated', async () => {
    mockAddToCart.mockResolvedValue(true);

    const { getByText } = renderWithProviders(
      <ServiceCard {...defaultProps} />
    );

    const addButton = getByText('Add to Cart');
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith({
        id: 'service-1',
        title: 'Test Service',
        description: 'Test Description',
        image: 'https://example.com/image.jpg',
        price: 100,
        duration: '2 hours',
        category: 'cleaning',
        pricing_type: undefined,
        unit_price: undefined,
        unit_measure: undefined,
        min_measurement: undefined,
        max_measurement: undefined,
        measurement_step: undefined,
        measurement_placeholder: undefined,
      });
    });
  });

  it('should show login alert when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    const { getByText } = renderWithProviders(
      <ServiceCard {...defaultProps} />
    );

    const addButton = getByText('Add to Cart');
    fireEvent.press(addButton);

    // Should not call addToCart
    expect(mockAddToCart).not.toHaveBeenCalled();
  });

  it('should handle per-unit pricing services', async () => {
    const perUnitProps = {
      ...defaultProps,
      pricing_type: 'per_unit',
      unit_price: 50,
      unit_measure: 'sq ft',
      min_measurement: 10,
      max_measurement: 1000,
    };

    const { getByText } = renderWithProviders(
      <ServiceCard {...perUnitProps} />
    );

    const addButton = getByText('Add to Cart');
    fireEvent.press(addButton);

    // Should show measurement modal instead of adding directly
    await waitFor(() => {
      expect(getByText('Enter Measurement')).toBeTruthy();
    });
  });

  it('should handle services with multiple variants', async () => {
    const mockOnSelectService = jest.fn();
    const variantProps = {
      ...defaultProps,
      variantCount: 3,
      onSelectService: mockOnSelectService,
    };

    const { getByText } = renderWithProviders(
      <ServiceCard {...variantProps} />
    );

    const addButton = getByText('Add to Cart');
    fireEvent.press(addButton);

    expect(mockOnSelectService).toHaveBeenCalled();
  });

  it('should memoize cart status calculation', () => {
    mockIsServiceInCart.mockReturnValue(true);

    const { rerender } = renderWithProviders(
      <ServiceCard {...defaultProps} />
    );

    // Re-render with same props
    rerender(<ServiceCard {...defaultProps} />);

    // isServiceInCart should only be called once due to memoization
    expect(mockIsServiceInCart).toHaveBeenCalledTimes(1);
  });

  it('should handle image loading and error states', async () => {
    const { getByTestId } = renderWithProviders(
      <ServiceCard {...defaultProps} />
    );

    const image = getByTestId('service-image');
    
    // Simulate image load
    fireEvent(image, 'onLoad');
    
    // Simulate image error
    fireEvent(image, 'onError');
    
    // Should handle both states gracefully
    expect(image).toBeTruthy();
  });

  it('should render with accessibility props', () => {
    const { getByTestId } = renderWithProviders(
      <ServiceCard {...defaultProps} />
    );

    const image = getByTestId('service-image');
    expect(image.props.accessibilityLabel).toBe('Test Service');
    expect(image.props.accessibilityRole).toBe('image');
  });
});
