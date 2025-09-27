import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
<<<<<<< HEAD
=======
  ScrollView,
>>>>>>> refs/remotes/origin/main
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
<<<<<<< HEAD
=======
  service_id?: string;
>>>>>>> refs/remotes/origin/main
  compact?: boolean;
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
  measurement_placeholder,
<<<<<<< HEAD
=======
  service_id,
>>>>>>> refs/remotes/origin/main
  compact = false
}) => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const { addToCart, isServiceInCart, loading } = useCart();
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [measurement, setMeasurement] = useState('');
<<<<<<< HEAD
  const [calculatedPrice, setCalculatedPrice] = useState(0);
=======
  const [distance, setDistance] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  
  // Determine if this is office moving (uses items) or house moving (uses area)
  const isOfficeMoving = service_id === 'office-moving';
  const inputLabel = isOfficeMoving ? 'Number of Items' : 'Area (m²)';
  const inputPlaceholder = isOfficeMoving ? 'Enter number of items' : 'Enter area in m²';
  const modalTitle = isOfficeMoving ? 'Enter Item Details' : 'Enter Measurement';
  
  // Debug logging
  console.log('ServiceCard Debug:', { service_id, isOfficeMoving, inputLabel });
>>>>>>> refs/remotes/origin/main

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
<<<<<<< HEAD
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && unit_price) {
      setCalculatedPrice(numValue * unit_price);
=======
    calculatePrice(value, distance);
  };

  const handleDistanceChange = (value: string) => {
    setDistance(value);
    calculatePrice(measurement, value);
  };

  const calculatePrice = (value: string, dist: string) => {
    const numValue = parseFloat(value);
    const numDistance = parseFloat(dist);
    
    console.log('Calculate Price Debug:', { 
      value, 
      dist, 
      numValue, 
      numDistance, 
      unit_price, 
      isOfficeMoving,
      service_id 
    });
    
    if (!isNaN(numValue) && !isNaN(numDistance) && unit_price) {
      // Both house moving and office moving use same calculation: (value * rate) + (distance * 0.5) + 19% VAT
      const labour = numValue * unit_price;
      const transport = numDistance * 0.5;
      const subtotal = labour + transport;
      const tax = subtotal * 0.19;
      const total = subtotal + tax;
      
      console.log('Price Calculation:', { labour, transport, subtotal, tax, total });
      setCalculatedPrice(total);
>>>>>>> refs/remotes/origin/main
    } else {
      setCalculatedPrice(0);
    }
  };

  const handleConfirmMeasurement = async () => {
    const numMeasurement = parseFloat(measurement);
<<<<<<< HEAD
    
    if (isNaN(numMeasurement) || numMeasurement <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid measurement');
=======
    const numDistance = parseFloat(distance);
    
    if (isNaN(numMeasurement) || numMeasurement <= 0) {
      Alert.alert('Invalid Input', `Please enter a valid ${isOfficeMoving ? 'number of items' : 'area'}`);
      return;
    }

    if (isNaN(numDistance) || numDistance <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid distance');
>>>>>>> refs/remotes/origin/main
      return;
    }

    if (min_measurement && numMeasurement < min_measurement) {
<<<<<<< HEAD
      Alert.alert('Invalid Input', `Minimum measurement is ${min_measurement} ${unit_measure}`);
=======
      Alert.alert('Invalid Input', `Minimum ${isOfficeMoving ? 'items' : 'area'} is ${min_measurement} ${unit_measure}`);
>>>>>>> refs/remotes/origin/main
      return;
    }

    if (max_measurement && numMeasurement > max_measurement) {
<<<<<<< HEAD
      Alert.alert('Invalid Input', `Maximum measurement is ${max_measurement} ${unit_measure}`);
=======
      Alert.alert('Invalid Input', `Maximum ${isOfficeMoving ? 'items' : 'area'} is ${max_measurement} ${unit_measure}`);
>>>>>>> refs/remotes/origin/main
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

<<<<<<< HEAD
    const userInputs = {
      measurement: numMeasurement,
      unit_measure: unit_measure,
      unit_price: unit_price
    };
=======
    const userInputs = isOfficeMoving 
      ? {
          items: numMeasurement,
          distance: numDistance,
          unit_measure: unit_measure,
          unit_price: unit_price
        }
      : {
          area: numMeasurement,
          distance: numDistance,
          unit_measure: unit_measure,
          unit_price: unit_price
        };
>>>>>>> refs/remotes/origin/main

    await addToCart(service, calculatedPrice, userInputs);
    setShowMeasurementModal(false);
    setMeasurement('');
<<<<<<< HEAD
=======
    setDistance('');
>>>>>>> refs/remotes/origin/main
    setCalculatedPrice(0);
  };

  return (
    <Card style={[styles.card, compact ? styles.cardCompact : null, { backgroundColor: theme.colors.surface }]}> 
      <TouchableOpacity onPress={handleViewService} activeOpacity={0.9}>
        <View style={[styles.imageContainer, compact ? styles.imageContainerCompact : null]}>
          <Image
            source={{ uri: image || 'https://via.placeholder.com/300x200' }}
            style={[styles.image, compact ? styles.imageCompact : null]}
            resizeMode="cover"
          />
        </View>
        <Card.Content style={[styles.content, compact ? styles.contentCompact : null]}>
          <Text variant={compact ? 'titleSmall' : 'titleMedium'} style={[styles.title, compact ? styles.titleCompact : null, { color: theme.colors.onSurface }]}>
            {title || 'Service Title'}
          </Text>
          <Text variant={compact ? 'bodySmall' : 'bodyMedium'} style={[styles.description, compact ? styles.descriptionCompact : null, { color: theme.colors.onSurfaceVariant }]}>
            {description || 'Service Description'}
          </Text>
          
          {(price !== undefined && price !== null) && (
            <View style={styles.priceContainer}>
              <View style={styles.priceInfo}>
                <Text variant={compact ? 'titleMedium' : 'titleLarge'} style={[styles.price, compact ? styles.priceCompact : null, { color: theme.colors.primary }]}>
                  {pricing_type === 'per_unit' && unit_price 
                    ? `€${unit_price.toFixed(2)}/${unit_measure}`
                    : `€${(price || 0).toFixed(2)}`
                  }
                </Text>
              </View>
              {duration && (
                <Text variant="bodySmall" style={[styles.duration, { color: theme.colors.onSurfaceVariant }]}>
                  {duration}
                </Text>
              )}
            </View>
          )}

          <View style={styles.buttonContainer}>
            {isAuthenticated && (
              <Button
                mode="contained"
                onPress={handleAddToCart}
                style={[styles.button, styles.cartButton, compact ? styles.buttonCompact : null]}
                contentStyle={compact ? styles.buttonContentCompact : styles.buttonContent}
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
<<<<<<< HEAD
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
              Enter Measurement
=======
          <ScrollView 
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <Text variant="headlineSmall" style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
              {modalTitle}
>>>>>>> refs/remotes/origin/main
            </Text>
            
            <Text variant="bodyMedium" style={[styles.modalDescription, { color: theme.colors.onSurfaceVariant }]}>
              {title}
            </Text>

            <View style={styles.measurementInput}>
<<<<<<< HEAD
              <TextInput
                style={[styles.textInput, { 
                  borderColor: theme.colors.outline,
                  color: theme.colors.onSurface 
                }]}
                placeholder={measurement_placeholder || `Enter area in ${unit_measure}`}
=======
              <Text variant="bodyMedium" style={[styles.inputLabel, { color: theme.colors.onSurface }]}>
                {inputLabel}
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  borderColor: theme.colors.outline,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.onSurface,
                }]}
                placeholder={inputPlaceholder}
>>>>>>> refs/remotes/origin/main
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={measurement}
                onChangeText={handleMeasurementChange}
                keyboardType="numeric"
                autoFocus
<<<<<<< HEAD
              />
              <Text variant="bodySmall" style={[styles.unitLabel, { color: theme.colors.onSurfaceVariant }]}>
                {unit_measure}
              </Text>
=======
                selectionColor={theme.colors.primary}
              />
            </View>

            <View style={styles.measurementInput}>
              <Text variant="bodyMedium" style={[styles.inputLabel, { color: theme.colors.onSurface }]}>
                Distance (km)
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  borderColor: theme.colors.outline,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.onSurface,
                }]}
                placeholder="Enter distance in km"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={distance}
                onChangeText={handleDistanceChange}
                keyboardType="numeric"
                selectionColor={theme.colors.primary}
              />
>>>>>>> refs/remotes/origin/main
            </View>

            {calculatedPrice > 0 && (
              <View style={styles.priceCalculation}>
<<<<<<< HEAD
                <Text variant="bodyMedium" style={[styles.calculationText, { color: theme.colors.onSurface }]}>
                  {measurement} {unit_measure} × €{unit_price?.toFixed(2)} = 
                </Text>
                <Text variant="titleLarge" style={[styles.totalPrice, { color: theme.colors.primary }]}>
                  €{calculatedPrice.toFixed(2)}
=======
                <Text variant="bodySmall" style={[styles.calculationText, { color: theme.colors.onSurface }]}>
                  {isOfficeMoving ? 'Items' : 'Area'}: {measurement} {isOfficeMoving ? 'items' : 'm²'} × €{unit_price?.toFixed(2)} = €{(parseFloat(measurement) * (unit_price || 0)).toFixed(2)}
                </Text>
                <Text variant="bodySmall" style={[styles.calculationText, { color: theme.colors.onSurface }]}>
                  Transport: {distance} km × €0.50 = €{(parseFloat(distance) * 0.5).toFixed(2)}
                </Text>
                <Text variant="bodySmall" style={[styles.calculationText, { color: theme.colors.onSurface }]}>
                  Subtotal: €{((parseFloat(measurement) * (unit_price || 0)) + (parseFloat(distance) * 0.5)).toFixed(2)}
                </Text>
                <Text variant="bodySmall" style={[styles.calculationText, { color: theme.colors.onSurface }]}>
                  VAT (19%): €{(((parseFloat(measurement) * (unit_price || 0)) + (parseFloat(distance) * 0.5)) * 0.19).toFixed(2)}
                </Text>
                <Text variant="titleLarge" style={[styles.totalPrice, { color: theme.colors.primary }]}>
                  Total: €{calculatedPrice.toFixed(2)}
>>>>>>> refs/remotes/origin/main
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
<<<<<<< HEAD
                disabled={!measurement || calculatedPrice <= 0}
=======
                disabled={!measurement || !distance || calculatedPrice <= 0}
>>>>>>> refs/remotes/origin/main
                style={styles.modalButton}
              >
                Add to Cart
              </Button>
            </View>
<<<<<<< HEAD
          </View>
=======
          </ScrollView>
>>>>>>> refs/remotes/origin/main
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
  cardCompact: {
    marginBottom: 12,
    borderRadius: 12,
  },
  imageContainer: {
    height: 200,
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  imageContainerCompact: {
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageCompact: {
    height: '100%',
  },
  content: {
    padding: 16,
  },
  contentCompact: {
    padding: 12,
  },
  title: {
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 24,
  },
  titleCompact: {
    marginBottom: 6,
    lineHeight: 20,
  },
  description: {
    marginBottom: 16,
    lineHeight: 20,
  },
  descriptionCompact: {
    marginBottom: 10,
    lineHeight: 18,
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
  priceCompact: {
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
  cartButton: {
    flex: 1,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  buttonCompact: {
    borderRadius: 8,
  },
  buttonContentCompact: {
    paddingVertical: 6,
  },
  // Modal styles
  modal: {
    margin: 20,
    borderRadius: 12,
    padding: 0,
<<<<<<< HEAD
  },
  modalContent: {
    padding: 24,
=======
    maxHeight: '80%',
  },
  modalScrollView: {
    flex: 1,
  },
  modalContent: {
    padding: 24,
    flexGrow: 1,
>>>>>>> refs/remotes/origin/main
  },
  modalTitle: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
<<<<<<< HEAD
=======
    marginTop: 8,
>>>>>>> refs/remotes/origin/main
  },
  modalDescription: {
    textAlign: 'center',
    marginBottom: 24,
  },
  measurementInput: {
<<<<<<< HEAD
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
=======
    marginBottom: 20,
  },
  inputLabel: {
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
>>>>>>> refs/remotes/origin/main
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
<<<<<<< HEAD
    marginRight: 8,
=======
    minHeight: 48,
    width: '100%',
>>>>>>> refs/remotes/origin/main
  },
  unitLabel: {
    fontWeight: '500',
    minWidth: 40,
  },
  priceCalculation: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 16,
<<<<<<< HEAD
=======
    marginTop: 8,
>>>>>>> refs/remotes/origin/main
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