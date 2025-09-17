import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, useTheme, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';

const OrderConfirmationScreen = ({ navigation, route }: any) => {
  const theme = useTheme();
  const { orderId, orderData } = route.params;
  const [order, setOrder] = useState<any>(orderData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderData) {
      setOrder(orderData);
    }
  }, [orderData]);

  const handleContinueShopping = () => {
    navigation.navigate('Home');
  };

  const handleViewOrders = () => {
    // In a real app, this would navigate to an orders screen
    Alert.alert('Orders', 'Orders screen would be implemented here');
  };

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader />
        <View style={styles.loadingContainer}>
          <Text variant="bodyLarge">Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      
      <ScrollView style={styles.scrollView}>
        {/* Success Header */}
        <Card style={[styles.successCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content style={styles.successContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color={theme.colors.primary} />
            </View>
            <Text variant="headlineMedium" style={[styles.successTitle, { color: theme.colors.onPrimaryContainer }]}>
              Order Confirmed!
            </Text>
            <Text variant="bodyLarge" style={[styles.successSubtitle, { color: theme.colors.onPrimaryContainer }]}>
              Thank you for choosing Deep Cleaning Hub
            </Text>
            <Text variant="bodyMedium" style={[styles.orderNumber, { color: theme.colors.onPrimaryContainer }]}>
              Order #{orderId}
            </Text>
          </Card.Content>
        </Card>

        {/* Order Details */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Order Details
            </Text>
            <Divider style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Service Date:
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                {new Date(order.service_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Service Time:
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                {order.service_time}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Total Amount:
              </Text>
              <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                €{order.total_amount.toFixed(2)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Service Address */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Service Address
            </Text>
            <Divider style={styles.divider} />
            
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginBottom: 4 }}>
              {order.address.street_address}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginBottom: 4 }}>
              {order.address.city}, {order.address.postal_code}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
              {order.address.country}
            </Text>
            
            {order.address.additional_notes && (
              <View style={styles.notesContainer}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Additional Notes:
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
                  {order.address.additional_notes}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Services Ordered */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Services Ordered
            </Text>
            <Divider style={styles.divider} />
            
            {order.items.map((item: any, index: number) => (
              <View key={index} style={styles.serviceItem}>
                <View style={styles.serviceInfo}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                    {item.service_title}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Quantity: {item.quantity}
                  </Text>
                </View>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                  €{item.calculated_price.toFixed(2)}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Special Instructions */}
        {order.special_instructions && (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleLarge" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                Special Instructions
              </Text>
              <Divider style={styles.divider} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                {order.special_instructions}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Next Steps */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.nextStepsTitle, { color: theme.colors.onSurfaceVariant }]}>
              What's Next?
            </Text>
            <Text variant="bodyMedium" style={[styles.nextStepsText, { color: theme.colors.onSurfaceVariant }]}>
              • You will receive a confirmation email shortly
            </Text>
            <Text variant="bodyMedium" style={[styles.nextStepsText, { color: theme.colors.onSurfaceVariant }]}>
              • Our team will contact you 24 hours before service
            </Text>
            <Text variant="bodyMedium" style={[styles.nextStepsText, { color: theme.colors.onSurfaceVariant }]}>
              • You can track your order status in the app
            </Text>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleContinueShopping}
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            contentStyle={styles.buttonContent}
          >
            Continue Shopping
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleViewOrders}
            style={[styles.actionButton, { borderColor: theme.colors.primary }]}
            contentStyle={styles.buttonContent}
            labelStyle={{ color: theme.colors.primary }}
          >
            View Orders
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    marginBottom: 16,
    borderRadius: 16,
  },
  successContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  orderNumber: {
    textAlign: 'center',
    fontWeight: '500',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notesContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  nextStepsTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  nextStepsText: {
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  actionButton: {
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default OrderConfirmationScreen;
