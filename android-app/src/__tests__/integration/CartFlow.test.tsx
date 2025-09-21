import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import App from '../../App';
import { cartAPI } from '../../services/cartAPI';
import { servicesAPI } from '../../services/servicesAPI';

// Mock the APIs
jest.mock('../../services/cartAPI', () => ({
  cartAPI: {
    getCartItems: jest.fn(),
    getCartSummary: jest.fn(),
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
  },
}));

jest.mock('../../services/servicesAPI', () => ({
  servicesAPI: {
    getAllServices: jest.fn(),
  },
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
      <NavigationContainer>
        {component}
      </NavigationContainer>
    </PaperProvider>
  );
};

describe('Cart Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock initial cart state
    (cartAPI.getCartItems as jest.Mock).mockResolvedValue([]);
    (cartAPI.getCartSummary as jest.Mock).mockResolvedValue({
      totalItems: 0,
      totalPrice: 0,
    });
    
    // Mock services
    (servicesAPI.getAllServices as jest.Mock).mockResolvedValue([
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
  });

  it('should add item to cart and update total', async () => {
    (cartAPI.addToCart as jest.Mock).mockResolvedValue(true);
    (cartAPI.getCartItems as jest.Mock).mockResolvedValue([
      {
        id: 'cart-item-1',
        service_id: 'service-1',
        title: 'Test Service 1',
        price: 100,
        quantity: 1,
      },
    ]);
    (cartAPI.getCartSummary as jest.Mock).mockResolvedValue({
      totalItems: 1,
      totalPrice: 100,
    });

    const { getByText, getByTestId } = renderWithProviders(<App />);

    // Wait for app to load
    await waitFor(() => {
      expect(getByText('Test Service 1')).toBeTruthy();
    });

    // Add item to cart
    const addButton = getByText('Add to Cart');
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(cartAPI.addToCart).toHaveBeenCalled();
    });

    // Navigate to cart
    const cartButton = getByTestId('cart-button');
    fireEvent.press(cartButton);

    await waitFor(() => {
      expect(getByText('1 items')).toBeTruthy();
      expect(getByText('$100.00')).toBeTruthy();
    });
  });

  it('should remove item from cart', async () => {
    // Start with item in cart
    (cartAPI.getCartItems as jest.Mock).mockResolvedValue([
      {
        id: 'cart-item-1',
        service_id: 'service-1',
        title: 'Test Service 1',
        price: 100,
        quantity: 1,
      },
    ]);
    (cartAPI.getCartSummary as jest.Mock).mockResolvedValue({
      totalItems: 1,
      totalPrice: 100,
    });
    (cartAPI.removeFromCart as jest.Mock).mockResolvedValue(true);

    const { getByText, getByTestId } = renderWithProviders(<App />);

    // Navigate to cart
    const cartButton = getByTestId('cart-button');
    fireEvent.press(cartButton);

    await waitFor(() => {
      expect(getByText('Test Service 1')).toBeTruthy();
    });

    // Remove item from cart
    const removeButton = getByText('Remove');
    fireEvent.press(removeButton);

    await waitFor(() => {
      expect(cartAPI.removeFromCart).toHaveBeenCalledWith('cart-item-1');
    });
  });

  it('should update item quantity in cart', async () => {
    // Start with item in cart
    (cartAPI.getCartItems as jest.Mock).mockResolvedValue([
      {
        id: 'cart-item-1',
        service_id: 'service-1',
        title: 'Test Service 1',
        price: 100,
        quantity: 1,
      },
    ]);
    (cartAPI.getCartSummary as jest.Mock).mockResolvedValue({
      totalItems: 1,
      totalPrice: 100,
    });
    (cartAPI.updateQuantity as jest.Mock).mockResolvedValue(true);

    const { getByText, getByTestId } = renderWithProviders(<App />);

    // Navigate to cart
    const cartButton = getByTestId('cart-button');
    fireEvent.press(cartButton);

    await waitFor(() => {
      expect(getByText('Test Service 1')).toBeTruthy();
    });

    // Update quantity
    const quantityInput = getByTestId('quantity-input');
    fireEvent.changeText(quantityInput, '2');

    const updateButton = getByText('Update');
    fireEvent.press(updateButton);

    await waitFor(() => {
      expect(cartAPI.updateQuantity).toHaveBeenCalledWith('cart-item-1', 2);
    });
  });

  it('should clear entire cart', async () => {
    // Start with items in cart
    (cartAPI.getCartItems as jest.Mock).mockResolvedValue([
      {
        id: 'cart-item-1',
        service_id: 'service-1',
        title: 'Test Service 1',
        price: 100,
        quantity: 1,
      },
    ]);
    (cartAPI.getCartSummary as jest.Mock).mockResolvedValue({
      totalItems: 1,
      totalPrice: 100,
    });
    (cartAPI.clearCart as jest.Mock).mockResolvedValue(true);

    const { getByText, getByTestId } = renderWithProviders(<App />);

    // Navigate to cart
    const cartButton = getByTestId('cart-button');
    fireEvent.press(cartButton);

    await waitFor(() => {
      expect(getByText('Test Service 1')).toBeTruthy();
    });

    // Clear cart
    const clearButton = getByText('Clear Cart');
    fireEvent.press(clearButton);

    await waitFor(() => {
      expect(cartAPI.clearCart).toHaveBeenCalled();
    });
  });

  it('should handle cart loading errors gracefully', async () => {
    (cartAPI.getCartItems as jest.Mock).mockRejectedValue(new Error('Cart loading failed'));

    const { getByText, getByTestId } = renderWithProviders(<App />);

    // Navigate to cart
    const cartButton = getByTestId('cart-button');
    fireEvent.press(cartButton);

    await waitFor(() => {
      expect(getByText('Error loading cart')).toBeTruthy();
    });
  });
});
