import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Button, Chip, Divider, useTheme, IconButton, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CartScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { 
    cartItems, 
    cartSummary, 
    serviceCategories,
    loading, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    refreshCart,
    refreshServiceCategories
  } = useCart();

  const handleCategoryPress = (category: any) => {
    navigation.navigate('ServiceOptions', { 
      serviceId: category.id,
      categoryTitle: category.title,
      categoryDescription: category.description
    });
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    if (cartItems.length === 0) {
      return;
    }
    navigation.navigate('Checkout');
  };

  const handleRefresh = () => {
    refreshCart();
    refreshServiceCategories();
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={theme.colors.outline} />
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            Please Login
          </Text>
          <Text variant="bodyLarge" style={styles.emptyText}>
            You need to be logged in to view your cart
          </Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
          >
            Login
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text variant="headlineMedium" style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Service Categories
        </Text>
        <Text variant="bodyMedium" style={[styles.itemCount, { color: theme.colors.onSurfaceVariant }]}>
          {cartItems.length} items in cart
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        {/* Service Categories */}
        {serviceCategories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => handleCategoryPress(category)}
            style={styles.categoryTouchable}
          >
            <Card style={[styles.categoryCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content style={styles.categoryContent}>
                <View style={styles.categoryImageContainer}>
                  {category.image ? (
                    <Image 
                      source={{ uri: category.image }} 
                      style={styles.categoryImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.categoryImagePlaceholder, { backgroundColor: theme.colors.outline }]}>
                      <Ionicons name="business-outline" size={40} color={theme.colors.onSurface} />
                    </View>
                  )}
                </View>
                <View style={styles.categoryInfo}>
                  <Text variant="titleMedium" style={[styles.categoryTitle, { color: theme.colors.onSurface }]}>
                    {category.title}
                  </Text>
                  <Text variant="bodyMedium" style={[styles.categoryDescription, { color: theme.colors.onSurfaceVariant }]}>
                    {category.description}
                  </Text>
                  <View style={styles.categoryMeta}>
                    <Chip 
                      icon="clock-outline" 
                      compact 
                      style={[styles.categoryChip, { backgroundColor: theme.colors.primaryContainer }]}
                      textStyle={{ color: theme.colors.onPrimaryContainer }}
                    >
                      {category.duration}
                    </Chip>
                    <Chip 
                      icon="euro" 
                      compact 
                      style={[styles.categoryChip, { backgroundColor: theme.colors.secondaryContainer }]}
                      textStyle={{ color: theme.colors.onSecondaryContainer }}
                    >
                      From €{category.price}
                    </Chip>
                  </View>
                </View>
                <View style={styles.categoryArrow}>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Cart Summary - Only show if there are items */}
        {cartItems.length > 0 && (
          <Card style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleLarge" style={[styles.summaryTitle, { color: theme.colors.onSurface }]}>
                Cart Summary
              </Text>
              <View style={styles.summaryRow}>
                <Text variant="bodyLarge" style={[styles.summaryLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Items
                </Text>
                <Text variant="bodyLarge" style={[styles.summaryValue, { color: theme.colors.onSurface }]}>
                  {cartItems.length}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text variant="bodyLarge" style={[styles.summaryLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Subtotal
                </Text>
                <Text variant="bodyLarge" style={[styles.summaryValue, { color: theme.colors.onSurface }]}>
                  €{(cartSummary?.totalPrice || 0).toFixed(2)}
                </Text>
              </View>
              <Divider style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text variant="titleLarge" style={[styles.totalLabel, { color: theme.colors.onSurface }]}>
                  Total
                </Text>
                <Text variant="titleLarge" style={[styles.totalValue, { color: theme.colors.primary }]}>
                  €{((cartSummary?.totalPrice || 0) + 5.99).toFixed(2)}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Action Buttons */}
        {cartItems.length > 0 && (
          <View style={styles.actionButtons}>
            <Button 
              mode="outlined" 
              onPress={clearCart}
              icon="delete-sweep"
              style={styles.clearButton}
              disabled={loading}
            >
              Clear Cart
            </Button>
            <Button 
              mode="contained" 
              onPress={handleCheckout}
              icon="cart-check"
              style={styles.checkoutButton}
              contentStyle={styles.checkoutButtonContent}
              disabled={loading}
            >
              {loading ? <ActivityIndicator size="small" color="white" /> : 'Proceed to Checkout'}
            </Button>
          </View>
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
  categoryTouchable: {
    marginBottom: 12,
  },
  categoryCard: {
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
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  categoryImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryDescription: {
    marginBottom: 8,
    lineHeight: 20,
  },
  categoryMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    height: 28,
  },
  categoryArrow: {
    marginLeft: 8,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  clearButton: {
    flex: 1,
    borderRadius: 12,
  },
  checkoutButton: {
    flex: 2,
    borderRadius: 12,
  },
  checkoutButtonContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  loginButton: {
    borderRadius: 8,
  },
});

export default CartScreen;
