import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Text, Card, Button, useTheme, Portal } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price?: number;
  duration?: string;
  category?: string;
  pricing_type?: string;
  unit_price?: number;
  unit_measure?: string;
  min_measurement?: number;
  max_measurement?: number;
  measurement_step?: number;
  measurement_placeholder?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  id, 
  title, 
  description, 
  image, 
  price, 
  duration, 
  category,
  pricing_type,
  unit_price,
  unit_measure,
  min_measurement,
  max_measurement,
  measurement_step,
  measurement_placeholder
}) => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const { addToCart, isServiceInCart, loading } = useCart();
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [measurement, setMeasurement] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const handleViewService = () => {
    Alert.alert('Service Details', `Viewing details for ${title}`);
    // Here you would typically navigate to a service detail screen
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to add items to your cart');
      return;
    }

    // If it's a per-unit pricing service, show measurement modal
    if (pricing_type === 'per_unit' && unit_price) {
      setShowMeasurementModal(true);
      return;
    }

    // For fixed pricing services, add directly to cart
    const service = {
      id,
      title,
      description,
      image,
      price: price || 0,
      duration: duration || '',
      category: category || '',
      pricingType: (pricing_type as 'fixed' | 'per_unit' | 'hourly') || 'fixed',
      features: [],
      displayOrder: 1,
      isActive: true,
      serviceVariants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addToCart(service);
  };

  const handleMeasurementChange = (value: string) => {
    setMeasurement(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && unit_price) {
      setCalculatedPrice(numValue * unit_price);
    } else {
      setCalculatedPrice(0);
    }
  };

  const handleConfirmMeasurement = async () => {
    const numMeasurement = parseFloat(measurement);
    
    if (isNaN(numMeasurement) || numMeasurement <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid measurement');
      return;
    }

    if (min_measurement && numMeasurement < min_measurement) {
      Alert.alert('Invalid Input', `Minimum measurement is ${min_measurement} ${unit_measure}`);
      return;
    }

    if (max_measurement && numMeasurement > max_measurement) {
      Alert.alert('Invalid Input', `Maximum measurement is ${max_measurement} ${unit_measure}`);
      return;
    }

    const service = {
      id,
      title,
      description,
      image,
      price: calculatedPrice,
      duration: duration || '',
      category: category || '',
      pricingType: (pricing_type as 'fixed' | 'per_unit' | 'hourly') || 'fixed',
      features: [],
      displayOrder: 1,
      isActive: true,
      serviceVariants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userInputs = {
      measurement: numMeasurement,
      unit_measure: unit_measure,
      unit_price: unit_price
    };

    await addToCart(service, calculatedPrice, userInputs);
    setShowMeasurementModal(false);
    setMeasurement('');
    setCalculatedPrice(0);
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity onPress={handleViewService} activeOpacity={0.9}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image || 'https://via.placeholder.com/300x200' }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <Card.Content style={styles.content}>
          <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            {title || 'Service Title'}
          </Text>
          <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            {description || 'Service Description'}
          </Text>
          
          {(price !== undefined && price !== null) && (
            <View style={styles.priceContainer}>
              <View style={styles.priceInfo}>
                <Text variant="titleLarge" style={[styles.price, { color: theme.colors.primary }]}>
                  {pricing_type === 'per_unit' && unit_price 
                    ? `€${unit_price.toFixed(2)}/${unit_measure}`
                    : `€${(price || 0).toFixed(2)}`
                  }
                </Text>
                {pricing_type === 'per_unit' && (
                  <Text variant="bodySmall" style={[styles.unitPrice, { color: theme.colors.onSurfaceVariant }]}>
                    Per {unit_measure}
                  </Text>
                )}
              </View>
              {duration && (
                <Text variant="bodySmall" style={[styles.duration, { color: theme.colors.onSurfaceVariant }]}>
                  {duration}
                </Text>
              )}
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={handleViewService}
              style={[styles.button, styles.viewButton]}
              contentStyle={styles.buttonContent}
              icon={({ size, color }) => (
                <Ionicons name="arrow-forward" size={size} color={color} />
              )}
            >
              View
            </Button>
            
            {isAuthenticated && (
              <Button
                mode="contained"
                onPress={handleAddToCart}
                style={[styles.button, styles.cartButton]}
                contentStyle={styles.buttonContent}
                disabled={loading || isServiceInCart(id)}
                icon={({ size, color }) => (
                  <Ionicons 
                    name={isServiceInCart(id) ? "checkmark" : "cart"} 
                    size={size} 
                    color={color} 
                  />
                )}
              >
                {isServiceInCart(id) ? 'In Cart' : 'Add to Cart'}
              </Button>
            )}
          </View>
        </Card.Content>
      </TouchableOpacity>

      {/* Measurement Selection Modal */}
      <Portal>
        <Modal
          visible={showMeasurementModal}
          onDismiss={() => setShowMeasurementModal(false)}
          style={[styles.modal, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
              Enter Measurement
            </Text>
            
            <Text variant="bodyMedium" style={[styles.modalDescription, { color: theme.colors.onSurfaceVariant }]}>
              {title}
            </Text>

            <View style={styles.measurementInput}>
              <TextInput
                style={[styles.textInput, { 
                  borderColor: theme.colors.outline,
                  color: theme.colors.onSurface 
                }]}
                placeholder={measurement_placeholder || `Enter area in ${unit_measure}`}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={measurement}
                onChangeText={handleMeasurementChange}
                keyboardType="numeric"
                autoFocus
              />
              <Text variant="bodySmall" style={[styles.unitLabel, { color: theme.colors.onSurfaceVariant }]}>
                {unit_measure}
              </Text>
            </View>

            {calculatedPrice > 0 && (
              <View style={styles.priceCalculation}>
                <Text variant="bodyMedium" style={[styles.calculationText, { color: theme.colors.onSurface }]}>
                  {measurement} {unit_measure} × €{unit_price?.toFixed(2)} = 
                </Text>
                <Text variant="titleLarge" style={[styles.totalPrice, { color: theme.colors.primary }]}>
                  €{calculatedPrice.toFixed(2)}
                </Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setShowMeasurementModal(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleConfirmMeasurement}
                disabled={!measurement || calculatedPrice <= 0}
                style={styles.modalButton}
              >
                Add to Cart
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  imageContainer: {
    height: 200,
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
  },
  title: {
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    marginBottom: 16,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceInfo: {
    flex: 1,
  },
  price: {
    fontWeight: '700',
  },
  unitPrice: {
    marginTop: 2,
  },
  duration: {
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    borderRadius: 8,
    flex: 1,
  },
  viewButton: {
    flex: 1,
  },
  cartButton: {
    flex: 2,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  // Modal styles
  modal: {
    margin: 20,
    borderRadius: 12,
    padding: 0,
  },
  modalContent: {
    padding: 24,
  },
  modalTitle: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    textAlign: 'center',
    marginBottom: 24,
  },
  measurementInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 8,
  },
  unitLabel: {
    fontWeight: '500',
    minWidth: 40,
  },
  priceCalculation: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  calculationText: {
    marginBottom: 4,
  },
  totalPrice: {
    fontWeight: '700',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
  },
});

export default ServiceCard;