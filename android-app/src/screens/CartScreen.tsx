import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Chip, Divider, useTheme, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = () => {
  const theme = useTheme();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Deep House Cleaning',
      price: 89.99,
      duration: '3-4 hours',
      quantity: 1,
    },
    {
      id: 2,
      name: 'Carpet Cleaning',
      price: 45.99,
      duration: '1-2 hours',
      quantity: 1,
    },
    {
      id: 3,
      name: 'Window Cleaning',
      price: 29.99,
      duration: '1 hour',
      quantity: 1,
    },
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    // TODO: Implement checkout functionality
    console.log('Checkout pressed');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text variant="headlineMedium" style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Shopping Cart
        </Text>
        <Text variant="bodyMedium" style={[styles.itemCount, { color: theme.colors.onSurfaceVariant }]}>
          {cartItems.length} items
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {cartItems.length === 0 ? (
          <Card style={[styles.emptyCartCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.emptyCartContent}>
              <Ionicons name="cart-outline" size={64} color={theme.colors.onSurfaceVariant} />
              <Text variant="headlineSmall" style={[styles.emptyCartTitle, { color: theme.colors.onSurface }]}>
                Your cart is empty
              </Text>
              <Text variant="bodyMedium" style={[styles.emptyCartSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                Add some cleaning services to get started
              </Text>
              <Button 
                mode="contained" 
                onPress={() => console.log('Browse services')}
                style={styles.browseButton}
              >
                Browse Services
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <>
            {/* Cart Items */}
            {cartItems.map((item, index) => (
              <Card key={item.id} style={[styles.cartItemCard, { backgroundColor: theme.colors.surface }]}>
                <Card.Content style={styles.cartItemContent}>
                  <View style={styles.itemInfo}>
                    <Text variant="titleMedium" style={[styles.itemName, { color: theme.colors.onSurface }]}>
                      {item.name}
                    </Text>
                    <Text variant="bodyMedium" style={[styles.itemDuration, { color: theme.colors.onSurfaceVariant }]}>
                      Duration: {item.duration}
                    </Text>
                    <Text variant="titleLarge" style={[styles.itemPrice, { color: theme.colors.primary }]}>
                      ${item.price}
                    </Text>
                  </View>
                  
                  <View style={styles.itemActions}>
                    <View style={styles.quantityControls}>
                      <IconButton
                        icon="minus"
                        size={20}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        style={styles.quantityButton}
                      />
                      <Text variant="titleMedium" style={[styles.quantity, { color: theme.colors.onSurface }]}>
                        {item.quantity}
                      </Text>
                      <IconButton
                        icon="plus"
                        size={20}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        style={styles.quantityButton}
                      />
                    </View>
                    <IconButton
                      icon="delete"
                      size={20}
                      iconColor={theme.colors.error}
                      onPress={() => removeItem(item.id)}
                      style={styles.deleteButton}
                    />
                  </View>
                </Card.Content>
                {index < cartItems.length - 1 && <Divider />}
              </Card>
            ))}

            {/* Order Summary */}
            <Card style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Text variant="titleLarge" style={[styles.summaryTitle, { color: theme.colors.onSurface }]}>
                  Order Summary
                </Text>
                <View style={styles.summaryRow}>
                  <Text variant="bodyLarge" style={[styles.summaryLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Subtotal
                  </Text>
                  <Text variant="bodyLarge" style={[styles.summaryValue, { color: theme.colors.onSurface }]}>
                    ${getTotalPrice().toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text variant="bodyLarge" style={[styles.summaryLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Service Fee
                  </Text>
                  <Text variant="bodyLarge" style={[styles.summaryValue, { color: theme.colors.onSurface }]}>
                    $5.99
                  </Text>
                </View>
                <Divider style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text variant="titleLarge" style={[styles.totalLabel, { color: theme.colors.onSurface }]}>
                    Total
                  </Text>
                  <Text variant="titleLarge" style={[styles.totalValue, { color: theme.colors.primary }]}>
                    ${(getTotalPrice() + 5.99).toFixed(2)}
                  </Text>
                </View>
              </Card.Content>
            </Card>

            {/* Checkout Button */}
            <Button 
              mode="contained" 
              onPress={handleCheckout}
              icon="cart-check"
              style={styles.checkoutButton}
              contentStyle={styles.checkoutButtonContent}
            >
              Proceed to Checkout
            </Button>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  itemCount: {
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  emptyCartCard: {
    marginTop: 32,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyCartContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyCartTitle: {
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartSubtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    borderRadius: 8,
  },
  cartItemCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cartItemContent: {
    paddingVertical: 16,
  },
  itemInfo: {
    marginBottom: 16,
  },
  itemName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDuration: {
    marginBottom: 8,
  },
  itemPrice: {
    fontWeight: '700',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    margin: 0,
  },
  quantity: {
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  deleteButton: {
    margin: 0,
  },
  summaryCard: {
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontWeight: '700',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontWeight: '500',
  },
  summaryValue: {
    fontWeight: '600',
  },
  summaryDivider: {
    marginVertical: 12,
  },
  totalLabel: {
    fontWeight: '700',
  },
  totalValue: {
    fontWeight: '700',
  },
  checkoutButton: {
    borderRadius: 12,
    marginBottom: 32,
  },
  checkoutButtonContent: {
    paddingVertical: 8,
  },
});

export default CartScreen;
