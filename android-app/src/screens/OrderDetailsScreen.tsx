import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { Text, Card, Button, Chip, useTheme, Divider, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../contexts/AuthContext';
import { orderAPI } from '../services/orderAPI';
import { serviceBookingAPI, ServiceBooking } from '../services/serviceBookingAPI';

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  serviceDate: string;
  serviceTime: string;
  address: {
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
    additional_notes?: string;
  };
  items: Array<{
    service_title: string;
    service_price: number;
    quantity: number;
    calculated_price: number;
  }>;
  createdAt: string;
  updatedAt: string;
  specialInstructions?: string;
  serviceProvider?: {
    id: string;
    name: string;
    phone: string;
    photo?: string;
  };
  trackingInfo?: {
    estimatedArrival: string;
    currentLocation?: string;
    lastUpdate: string;
  };
}

const OrderDetailsScreen = ({ navigation, route }: any) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { order: initialOrder, booking: initialBooking } = route.params;
  const [order, setOrder] = useState<Order | ServiceBooking>(initialOrder || initialBooking);
  const [loading, setLoading] = useState(false);
  const isBooking = !!initialBooking;

  useEffect(() => {
    if (isBooking) {
      loadBookingDetails();
    } else {
      loadOrderDetails();
    }
  }, [isBooking ? initialBooking?.id : initialOrder?.id]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const orderDetails = await orderAPI.getOrderDetails(initialOrder.id);
      setOrder(orderDetails);
    } catch (error) {
      console.error('Error loading order details:', error);
      Alert.alert('Error', 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      const bookingDetails = await serviceBookingAPI.getBookingById(initialBooking.id);
      setOrder(bookingDetails);
    } catch (error) {
      console.error('Error loading booking details:', error);
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return theme.colors.primary;
      case 'pending': return theme.colors.primary;
      case 'confirmed': return '#4CAF50';
      case 'in_progress': return '#FF9800';
      case 'completed': return '#2196F3';
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.onSurfaceVariant;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return 'calendar-outline';
      case 'pending': return 'time-outline';
      case 'confirmed': return 'checkmark-circle-outline';
      case 'in_progress': return 'construct-outline';
      case 'completed': return 'checkmark-done-outline';
      case 'cancelled': return 'close-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'scheduled': return 0.2;
      case 'pending': return 0.2;
      case 'confirmed': return 0.4;
      case 'in_progress': return 0.7;
      case 'completed': return 1.0;
      case 'cancelled': return 0.0;
      default: return 0.0;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleCancelOrder = async () => {
    const itemType = isBooking ? 'booking' : 'order';
    Alert.alert(
      `Cancel ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`,
      `Are you sure you want to cancel this ${itemType}? This action cannot be undone.`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              if (isBooking) {
                await serviceBookingAPI.cancelBooking(order.id);
              } else {
                await orderAPI.cancelOrder(order.id);
              }
              setOrder({ ...order, status: 'cancelled' });
              Alert.alert('Success', `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} cancelled successfully`);
            } catch (error) {
              Alert.alert('Error', `Failed to cancel ${itemType}`);
            }
          }
        }
      ]
    );
  };

  const handleRescheduleOrder = () => {
    navigation.navigate('RescheduleOrder', { order });
  };

  const handleContactProvider = () => {
    if (order.serviceProvider?.phone) {
      Linking.openURL(`tel:${order.serviceProvider.phone}`);
    }
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+4916097044182');
  };

  const canCancel = isBooking ? order.status === 'scheduled' : (order.status === 'pending' || order.status === 'confirmed');
  const canReschedule = isBooking ? order.status === 'scheduled' : (order.status === 'pending' || order.status === 'confirmed');

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      
      <ScrollView style={styles.scrollView}>
        {/* Order Status */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.statusHeader}>
              <Text variant="titleLarge" style={[styles.statusTitle, { color: theme.colors.onSurface }]}>
                Order Status
              </Text>
              <Chip
                mode="outlined"
                textStyle={{ color: getStatusColor(order.status) }}
                style={{ borderColor: getStatusColor(order.status) }}
                icon={getStatusIcon(order.status)}
              >
                {order.status.replace('_', ' ').toUpperCase()}
              </Chip>
            </View>
            
            <ProgressBar
              progress={getProgressValue(order.status)}
              color={getStatusColor(order.status)}
              style={styles.progressBar}
            />
            
            <View style={styles.statusSteps}>
              <View style={[styles.statusStep, order.status !== 'cancelled' && (order.status === 'scheduled' || order.status === 'pending' || order.status === 'confirmed' || order.status === 'in_progress' || order.status === 'completed') ? styles.activeStep : styles.inactiveStep]}>
                <Ionicons name="checkmark-circle" size={20} color={order.status !== 'cancelled' && (order.status === 'scheduled' || order.status === 'pending' || order.status === 'confirmed' || order.status === 'in_progress' || order.status === 'completed') ? '#4CAF50' : '#E0E0E0'} />
                <Text variant="bodySmall" style={styles.stepText}>{isBooking ? 'Booking Placed' : 'Order Placed'}</Text>
              </View>
              
              <View style={[styles.statusStep, order.status !== 'cancelled' && (order.status === 'confirmed' || order.status === 'in_progress' || order.status === 'completed') ? styles.activeStep : styles.inactiveStep]}>
                <Ionicons name="checkmark-circle" size={20} color={order.status !== 'cancelled' && (order.status === 'confirmed' || order.status === 'in_progress' || order.status === 'completed') ? '#4CAF50' : '#E0E0E0'} />
                <Text variant="bodySmall" style={styles.stepText}>Confirmed</Text>
              </View>
              
              <View style={[styles.statusStep, order.status !== 'cancelled' && (order.status === 'in_progress' || order.status === 'completed') ? styles.activeStep : styles.inactiveStep]}>
                <Ionicons name="checkmark-circle" size={20} color={order.status !== 'cancelled' && (order.status === 'in_progress' || order.status === 'completed') ? '#4CAF50' : '#E0E0E0'} />
                <Text variant="bodySmall" style={styles.stepText}>In Progress</Text>
              </View>
              
              <View style={[styles.statusStep, order.status === 'completed' ? styles.activeStep : styles.inactiveStep]}>
                <Ionicons name="checkmark-circle" size={20} color={order.status === 'completed' ? '#4CAF50' : '#E0E0E0'} />
                <Text variant="bodySmall" style={styles.stepText}>Completed</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Service Provider */}
        {order.serviceProvider && (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Service Provider
              </Text>
              <Divider style={styles.divider} />
              
              <View style={styles.providerInfo}>
                <View style={styles.providerDetails}>
                  <Text variant="titleMedium" style={[styles.providerName, { color: theme.colors.onSurface }]}>
                    {order.serviceProvider.name}
                  </Text>
                  <Text variant="bodyMedium" style={[styles.providerPhone, { color: theme.colors.onSurfaceVariant }]}>
                    {order.serviceProvider.phone}
                  </Text>
                </View>
                <Button
                  mode="outlined"
                  onPress={handleContactProvider}
                  icon="phone"
                  compact
                >
                  Call
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Order Information */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Order Information
            </Text>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                {isBooking ? 'Booking Number' : 'Order Number'}
              </Text>
              <Text variant="bodyMedium" style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                #{isBooking ? order.id.slice(-8) : order.orderNumber}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                Service Date
              </Text>
              <Text variant="bodyMedium" style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {formatDate(isBooking ? order.booking_date : order.serviceDate)}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                Service Time
              </Text>
              <Text variant="bodyMedium" style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {formatTime(isBooking ? order.booking_time : order.serviceTime)}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                Total Amount
              </Text>
              <Text variant="titleMedium" style={[styles.infoValue, { color: theme.colors.primary, fontWeight: 'bold' }]}>
                €{(isBooking ? order.total_amount : order.totalAmount || 0).toFixed(2)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Service Address */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Service Address
            </Text>
            <Divider style={styles.divider} />
            
            <View style={styles.addressContainer}>
              <Ionicons name="location-outline" size={20} color={theme.colors.onSurfaceVariant} />
              <View style={styles.addressText}>
                <Text variant="bodyMedium" style={[styles.addressLine, { color: theme.colors.onSurface }]}>
                  {order.address.street_address}
                </Text>
                <Text variant="bodyMedium" style={[styles.addressLine, { color: theme.colors.onSurface }]}>
                  {order.address.city}, {order.address.postal_code}
                </Text>
                <Text variant="bodyMedium" style={[styles.addressLine, { color: theme.colors.onSurface }]}>
                  {order.address.country}
                </Text>
                {order.address.additional_notes && (
                  <Text variant="bodySmall" style={[styles.addressNotes, { color: theme.colors.onSurfaceVariant }]}>
                    Note: {order.address.additional_notes}
                  </Text>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Services */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Services
            </Text>
            <Divider style={styles.divider} />
            
            {(order.items || []).map((item, index) => (
              <View key={index} style={styles.serviceItem}>
                <View style={styles.serviceInfo}>
                  <Text variant="bodyLarge" style={[styles.serviceTitle, { color: theme.colors.onSurface }]}>
                    {item.service_title}
                  </Text>
                  <Text variant="bodyMedium" style={[styles.serviceQuantity, { color: theme.colors.onSurfaceVariant }]}>
                    Quantity: {item.quantity}
                  </Text>
                </View>
                <Text variant="titleMedium" style={[styles.servicePrice, { color: theme.colors.primary }]}>
                  €{(item.calculated_price || 0).toFixed(2)}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Special Instructions
              </Text>
              <Divider style={styles.divider} />
              <Text variant="bodyMedium" style={[styles.instructionsText, { color: theme.colors.onSurface }]}>
                {order.specialInstructions}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {canCancel && (
            <Button
              mode="outlined"
              onPress={handleCancelOrder}
              style={[styles.actionButton, styles.cancelButton]}
              textColor={theme.colors.error}
            >
              Cancel Order
            </Button>
          )}
          
          {canReschedule && (
            <Button
              mode="outlined"
              onPress={handleRescheduleOrder}
              style={styles.actionButton}
            >
              Reschedule
            </Button>
          )}
          
          <Button
            mode="outlined"
            onPress={handleCallSupport}
            style={styles.actionButton}
            icon="phone"
          >
            Contact Support
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
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  statusSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusStep: {
    alignItems: 'center',
    flex: 1,
  },
  activeStep: {
    opacity: 1,
  },
  inactiveStep: {
    opacity: 0.5,
  },
  stepText: {
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  providerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  providerPhone: {
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    flex: 1,
  },
  infoValue: {
    fontWeight: '500',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    flex: 1,
    marginLeft: 12,
  },
  addressLine: {
    marginBottom: 2,
  },
  addressNotes: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 16,
  },
  serviceTitle: {
    fontWeight: '500',
    marginBottom: 4,
  },
  serviceQuantity: {
    fontSize: 14,
  },
  servicePrice: {
    fontWeight: '600',
  },
  instructionsText: {
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    minWidth: 120,
    borderRadius: 8,
  },
  cancelButton: {
    borderColor: '#f44336',
  },
});

export default OrderDetailsScreen;
