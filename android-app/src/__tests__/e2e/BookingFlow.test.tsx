import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import App from '../../App';
import { servicesAPI } from '../../services/servicesAPI';
import { cartAPI } from '../../services/cartAPI';
import { bookingAPI } from '../../services/bookingAPI';

// Mock all APIs
jest.mock('../../services/servicesAPI', () => ({
  servicesAPI: {
    getAllServices: jest.fn(),
  },
}));

jest.mock('../../services/cartAPI', () => ({
  cartAPI: {
    getCartItems: jest.fn(),
    getCartSummary: jest.fn(),
    addToCart: jest.fn(),
    clearCart: jest.fn(),
  },
}));

jest.mock('../../services/bookingAPI', () => ({
  bookingAPI: {
    createBooking: jest.fn(),
    getBookings: jest.fn(),
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

describe('Complete Booking Flow E2E Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock initial state
    (servicesAPI.getAllServices as jest.Mock).mockResolvedValue([
      {
        id: 'service-1',
        title: 'Kitchen Cleaning',
        description: 'Professional kitchen cleaning service',
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
        title: 'Bathroom Cleaning',
        description: 'Deep bathroom cleaning and sanitization',
        category: 'cleaning',
        pricing_type: 'fixed',
        display_order: 2,
        is_active: true,
        service_variants: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
    
    (cartAPI.getCartItems as jest.Mock).mockResolvedValue([]);
    (cartAPI.getCartSummary as jest.Mock).mockResolvedValue({
      totalItems: 0,
      totalPrice: 0,
    });
  });

  it('should complete booking from service selection to confirmation', async () => {
    // Mock successful cart operations
    (cartAPI.addToCart as jest.Mock).mockResolvedValue(true);
    (cartAPI.getCartItems as jest.Mock).mockResolvedValue([
      {
        id: 'cart-item-1',
        service_id: 'service-1',
        title: 'Kitchen Cleaning',
        price: 150,
        quantity: 1,
      },
    ]);
    (cartAPI.getCartSummary as jest.Mock).mockResolvedValue({
      totalItems: 1,
      totalPrice: 150,
    });
    
    // Mock successful booking creation
    (bookingAPI.createBooking as jest.Mock).mockResolvedValue({
      id: 'booking-123',
      status: 'confirmed',
      total: 150,
    });
    (cartAPI.clearCart as jest.Mock).mockResolvedValue(true);

    const { getByText, getByTestId } = renderWithProviders(<App />);

    // Step 1: Navigate to services
    await waitFor(() => {
      expect(getByText('Kitchen Cleaning')).toBeTruthy();
    });

    // Step 2: Add service to cart
    const addToCartButton = getByText('Add to Cart');
    fireEvent.press(addToCartButton);

    await waitFor(() => {
      expect(cartAPI.addToCart).toHaveBeenCalled();
    });

    // Step 3: Navigate to cart
    const cartButton = getByTestId('cart-button');
    fireEvent.press(cartButton);

    await waitFor(() => {
      expect(getByText('Kitchen Cleaning')).toBeTruthy();
      expect(getByText('$150.00')).toBeTruthy();
    });

    // Step 4: Proceed to checkout
    const checkoutButton = getByText('Proceed to Checkout');
    fireEvent.press(checkoutButton);

    await waitFor(() => {
      expect(getByText('Checkout')).toBeTruthy();
    });

    // Step 5: Fill in booking details
    const nameInput = getByTestId('customer-name-input');
    const emailInput = getByTestId('customer-email-input');
    const phoneInput = getByTestId('customer-phone-input');
    const addressInput = getByTestId('service-address-input');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'john@example.com');
    fireEvent.changeText(phoneInput, '+1234567890');
    fireEvent.changeText(addressInput, '123 Main St, City, State');

    // Step 6: Select service date and time
    const dateInput = getByTestId('service-date-input');
    const timeInput = getByTestId('service-time-input');

    fireEvent.changeText(dateInput, '2024-12-25');
    fireEvent.changeText(timeInput, '10:00 AM');

    // Step 7: Submit booking
    const submitButton = getByText('Confirm Booking');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(bookingAPI.createBooking).toHaveBeenCalledWith({
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        customer_phone: '+1234567890',
        service_address: '123 Main St, City, State',
        service_date: '2024-12-25',
        service_time: '10:00 AM',
        services: [
          {
            id: 'cart-item-1',
            service_id: 'service-1',
            title: 'Kitchen Cleaning',
            price: 150,
            quantity: 1,
          },
        ],
        total: 150,
      });
    });

    // Step 8: Verify booking confirmation
    await waitFor(() => {
      expect(getByText('Booking Confirmed!')).toBeTruthy();
      expect(getByText('Booking ID: booking-123')).toBeTruthy();
      expect(getByText('Total: $150.00')).toBeTruthy();
    });

    // Step 9: Verify cart is cleared
    expect(cartAPI.clearCart).toHaveBeenCalled();
  });

  it('should handle booking creation failure', async () => {
    // Mock cart operations
    (cartAPI.addToCart as jest.Mock).mockResolvedValue(true);
    (cartAPI.getCartItems as jest.Mock).mockResolvedValue([
      {
        id: 'cart-item-1',
        service_id: 'service-1',
        title: 'Kitchen Cleaning',
        price: 150,
        quantity: 1,
      },
    ]);
    (cartAPI.getCartSummary as jest.Mock).mockResolvedValue({
      totalItems: 1,
      totalPrice: 150,
    });
    
    // Mock booking creation failure
    (bookingAPI.createBooking as jest.Mock).mockRejectedValue(new Error('Booking failed'));

    const { getByText, getByTestId } = renderWithProviders(<App />);

    // Navigate through the flow
    await waitFor(() => {
      expect(getByText('Kitchen Cleaning')).toBeTruthy();
    });

    const addToCartButton = getByText('Add to Cart');
    fireEvent.press(addToCartButton);

    const cartButton = getByTestId('cart-button');
    fireEvent.press(cartButton);

    const checkoutButton = getByText('Proceed to Checkout');
    fireEvent.press(checkoutButton);

    // Fill in details
    const nameInput = getByTestId('customer-name-input');
    fireEvent.changeText(nameInput, 'John Doe');

    // Submit booking
    const submitButton = getByText('Confirm Booking');
    fireEvent.press(submitButton);

    // Verify error handling
    await waitFor(() => {
      expect(getByText('Booking failed. Please try again.')).toBeTruthy();
    });
  });

  it('should validate required fields before booking', async () => {
    // Mock cart operations
    (cartAPI.addToCart as jest.Mock).mockResolvedValue(true);
    (cartAPI.getCartItems as jest.Mock).mockResolvedValue([
      {
        id: 'cart-item-1',
        service_id: 'service-1',
        title: 'Kitchen Cleaning',
        price: 150,
        quantity: 1,
      },
    ]);
    (cartAPI.getCartSummary as jest.Mock).mockResolvedValue({
      totalItems: 1,
      totalPrice: 150,
    });

    const { getByText, getByTestId } = renderWithProviders(<App />);

    // Navigate to checkout
    await waitFor(() => {
      expect(getByText('Kitchen Cleaning')).toBeTruthy();
    });

    const addToCartButton = getByText('Add to Cart');
    fireEvent.press(addToCartButton);

    const cartButton = getByTestId('cart-button');
    fireEvent.press(cartButton);

    const checkoutButton = getByText('Proceed to Checkout');
    fireEvent.press(checkoutButton);

    // Try to submit without filling required fields
    const submitButton = getByText('Confirm Booking');
    fireEvent.press(submitButton);

    // Verify validation errors
    await waitFor(() => {
      expect(getByText('Please fill in all required fields')).toBeTruthy();
    });
  });
});
