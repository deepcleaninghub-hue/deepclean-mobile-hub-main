import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { Text, Card, Button, Chip, useTheme, Divider, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../contexts/AuthContext';
import { orderAPI } from '../services/orderAPI';

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
}

const OrderHistoryScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const userOrders = await orderAPI.getUserOrders(user.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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
      case 'pending': return 'time-outline';
      case 'confirmed': return 'checkmark-circle-outline';
      case 'in_progress': return 'construct-outline';
      case 'completed': return 'checkmark-done-outline';
      case 'cancelled': return 'close-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
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

  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetails', { order });
  };

  const handleCancelOrder = async (orderId: string) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await orderAPI.cancelOrder(orderId);
              await loadOrders();
              Alert.alert('Success', 'Order cancelled successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel order');
            }
          }
        }
      ]
    );
  };

  const filteredOrders = orders.filter(order => 
    selectedFilter === 'all' || order.status === selectedFilter
  );

  const filterOptions = [
    { key: 'all', label: 'All Orders', count: orders.length },
    { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { key: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length },
    { key: 'in_progress', label: 'In Progress', count: orders.filter(o => o.status === 'in_progress').length },
    { key: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
    { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(filterOptions || []).map((filter) => (
              <Chip
                key={filter.key}
                selected={selectedFilter === filter.key}
                onPress={() => setSelectedFilter(filter.key as any)}
                style={[
                  styles.filterChip,
                  selectedFilter === filter.key && { backgroundColor: theme.colors.primary }
                ]}
                textStyle={{
                  color: selectedFilter === filter.key ? theme.colors.onPrimary : theme.colors.onSurface
                }}
              >
                {filter.label} ({filter.count})
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Orders List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading orders...</Text>
          </View>
        ) : filteredOrders.length === 0 ? (
          <Card style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.emptyContent}>
              <Ionicons name="receipt-outline" size={64} color={theme.colors.onSurfaceVariant} />
              <Text variant="headlineSmall" style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                No orders found
              </Text>
              <Text variant="bodyMedium" style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
                {selectedFilter === 'all' 
                  ? "You haven't placed any orders yet"
                  : `No ${selectedFilter} orders found`
                }
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Services')}
                style={styles.browseButton}
              >
                Browse Services
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <View style={styles.ordersContainer}>
            {(filteredOrders || []).map((order, index) => (
              <Card 
                key={order.id} 
                style={[styles.orderCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => handleOrderPress(order)}
              >
                <Card.Content>
                  <View style={styles.orderHeader}>
                    <View style={styles.orderInfo}>
                      <Text variant="titleMedium" style={[styles.orderNumber, { color: theme.colors.onSurface }]}>
                        Order #{order.orderNumber}
                      </Text>
                      <Text variant="bodySmall" style={[styles.orderDate, { color: theme.colors.onSurfaceVariant }]}>
                        {formatDate(order.createdAt)}
                      </Text>
                    </View>
                    <Chip
                      mode="outlined"
                      textStyle={{ color: getStatusColor(order.status) }}
                      style={{ borderColor: getStatusColor(order.status) }}
                      icon={getStatusIcon(order.status)}
                    >
                      {order.status.replace('_', ' ').toUpperCase()}
                    </Chip>
                  </View>

                  <Divider style={styles.divider} />

                  <View style={styles.orderDetails}>
                    <View style={styles.serviceInfo}>
                      <Text variant="bodyMedium" style={[styles.serviceTitle, { color: theme.colors.onSurface }]}>
                        {order.items.length} service{order.items.length > 1 ? 's' : ''}
                      </Text>
                      <Text variant="bodySmall" style={[styles.serviceDate, { color: theme.colors.onSurfaceVariant }]}>
                        {formatDate(order.serviceDate)} at {formatTime(order.serviceTime)}
                      </Text>
                      <Text variant="bodySmall" style={[styles.serviceAddress, { color: theme.colors.onSurfaceVariant }]}>
                        {order.address.street_address}, {order.address.city}
                      </Text>
                    </View>
                    <Text variant="titleLarge" style={[styles.orderTotal, { color: theme.colors.primary }]}>
                      €{(order.totalAmount || 0).toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.orderActions}>
                    <Button
                      mode="outlined"
                      onPress={() => handleOrderPress(order)}
                      style={styles.actionButton}
                      compact
                    >
                      View Details
                    </Button>
                    {order.status === 'pending' && (
                      <Button
                        mode="outlined"
                        onPress={() => handleCancelOrder(order.id)}
                        style={[styles.actionButton, styles.cancelButton]}
                        textColor={theme.colors.error}
                        compact
                      >
                        Cancel
                      </Button>
                    )}
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('Services')}
      />
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
  },
  filterContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyCard: {
    margin: 16,
    borderRadius: 16,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    borderRadius: 8,
  },
  ordersContainer: {
    padding: 16,
    paddingTop: 8,
  },
  orderCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontWeight: '600',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
  },
  divider: {
    marginVertical: 12,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 16,
  },
  serviceTitle: {
    fontWeight: '500',
    marginBottom: 4,
  },
  serviceDate: {
    marginBottom: 2,
  },
  serviceAddress: {
    fontSize: 11,
  },
  orderTotal: {
    fontWeight: '700',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  cancelButton: {
    borderColor: '#f44336',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default OrderHistoryScreen;
