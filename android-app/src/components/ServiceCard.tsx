import React, { useState, useMemo, useCallback } from 'react';
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
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ServiceOption } from '../services/serviceOptionsAPI';

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
  onSelectService?: () => void;
  onViewService?: () => void;
  variantCount?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = React.memo(({ 
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
  onSelectService,
  onViewService,
  variantCount = 0
}) => {
  // PERFORMANCE FIX: State for image loading
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const { addToCart, isServiceInCart, loading } = useCart();
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [measurement, setMeasurement] = useState('');

  // PERFORMANCE FIX: Memoized calculations
  const isInCart = useMemo(() => isServiceInCart(id), [id, isServiceInCart]);
  
  const fallbackImage = useMemo(() => {
    return require('../assets/images/kitchen-cleaning.png');
  }, []);

  // PERFORMANCE FIX: Memoized callbacks
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  
  const isPerUnitPricing = useMemo(() => 
    pricing_type === 'per_unit' && unit_price, 
    [pricing_type, unit_price]
  );

  const hasMultipleVariants = useMemo(() => 
    variantCount > 1, 
    [variantCount]
  );

  const displayPrice = useMemo(() => {
    if (isPerUnitPricing) {
      return `€${unit_price?.toFixed(2)}/${unit_measure}`;
    }
    if (hasMultipleVariants) {
      return `From €${(price || 0).toFixed(2)}`;
    }
    return `€${(price || 0).toFixed(2)}`;
  }, [isPerUnitPricing, unit_price, unit_measure, hasMultipleVariants, price]);

  const buttonText = useMemo(() => {
    if (isInCart) return 'In Cart';
    if (hasMultipleVariants) return 'Choose Option';
    return 'Add to Cart';
  }, [isInCart, hasMultipleVariants]);

  const buttonIcon = useMemo(() => {
    if (isInCart) return 'checkmark';
    if (hasMultipleVariants) return 'options';
    return 'cart';
  }, [isInCart, hasMultipleVariants]);


  // Memoize event handlers to prevent unnecessary re-renders
  const handleViewService = useCallback(() => {
    if (onViewService) {
      onViewService();
    } else {
      Alert.alert('Service Details', `Viewing details for ${title}`);
    }
  }, [onViewService, title]);

  const handleAddToCart = useCallback(async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to add items to your cart');
      return;
    }

    // If service has multiple variants, show selection modal
    if (hasMultipleVariants && onSelectService) {
      onSelectService();
      return;
    }

    // If it's a per-unit pricing service, show measurement modal
    if (isPerUnitPricing) {
      setShowMeasurementModal(true);
      return;
    }

    // For fixed pricing services, add directly to cart
    const service: ServiceOption = {
      id,
      title,
      description,
      service_id: id,
      price: price || 0,
      duration: duration || '',
      features: [],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      services: {
        id: id,
        title: title,
        category: category || ''
      }
    };

    await addToCart(service, price);
  }, [
    isAuthenticated, 
    hasMultipleVariants, 
    onSelectService, 
    isPerUnitPricing, 
    id, 
    title, 
    description, 
    price, 
    duration, 
    category, 
    addToCart
  ]);

  const handleMeasurementChange = useCallback((value: string) => {
    setMeasurement(value);
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue) && unit_price) {
      const calculated = numValue * unit_price;
      setCalculatedPrice(calculated);
    } else {
      setCalculatedPrice(0);
    }
  }, [unit_price]);

  const handleConfirmMeasurement = useCallback(async () => {
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

    const service: ServiceOption = {
      id,
      title,
      description,
      service_id: id,
      price: calculatedPrice,
      duration: duration || '',
      features: [],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      services: {
        id: id,
        title: title,
        category: category || ''
      }
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
  }, [
    measurement, 
    min_measurement, 
    max_measurement, 
    unit_measure, 
    unit_price, 
    calculatedPrice, 
    id, 
    title, 
    description, 
    duration, 
    category, 
    addToCart
  ]);

  const handleCloseModal = useCallback(() => {
    setShowMeasurementModal(false);
    setMeasurement('');
    setCalculatedPrice(0);
  }, []);


  // Memoize styles to prevent recalculation on every render
  const cardStyles = useMemo(() => [
    styles.card, 
    { backgroundColor: theme.colors.surface }
  ], [theme.colors.surface]);

  const titleStyles = useMemo(() => [
    styles.title, 
    { color: theme.colors.onSurface }
  ], [theme.colors.onSurface]);

  const descriptionStyles = useMemo(() => [
    styles.description, 
    { color: theme.colors.onSurfaceVariant }
  ], [theme.colors.onSurfaceVariant]);

  const priceStyles = useMemo(() => [
    styles.price, 
    { color: theme.colors.primary }
  ], [theme.colors.primary]);

  const unitPriceStyles = useMemo(() => [
    styles.unitPrice, 
    { color: theme.colors.onSurfaceVariant }
  ], [theme.colors.onSurfaceVariant]);

  const variantCountStyles = useMemo(() => [
    styles.variantCount, 
    { color: theme.colors.onSurfaceVariant }
  ], [theme.colors.onSurfaceVariant]);

  const durationStyles = useMemo(() => [
    styles.duration, 
    { color: theme.colors.onSurfaceVariant }
  ], [theme.colors.onSurfaceVariant]);

  // Fallback image source
  const imageSource = useMemo(() => {
    if (imageError || !image) {
      return { uri: 'https://via.placeholder.com/300x200?text=No+Image' };
    }
    return { uri: image };
  }, [image, imageError]);

  return (
    <Card style={cardStyles}>
      <TouchableOpacity onPress={handleViewService} activeOpacity={0.9}>
        <View style={styles.imageContainer}>
          <Image
            source={imageError ? fallbackImage : imageSource}
            style={styles.image}
            resizeMode="cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            accessibilityLabel={title}
            accessibilityRole="image"
          />
        </View>
        <Card.Content style={styles.content}>
          <Text variant="titleMedium" style={titleStyles}>
            {title || 'Service Title'}
          </Text>
          <Text variant="bodyMedium" style={descriptionStyles}>
            {description || 'Service Description'}
          </Text>
          
          {(price !== undefined && price !== null) && (
            <View style={styles.priceContainer}>
              <View style={styles.priceInfo}>
                <Text variant="titleLarge" style={priceStyles}>
                  {displayPrice}
                </Text>
                {isPerUnitPricing && (
                  <Text variant="bodySmall" style={unitPriceStyles}>
                    Per {unit_measure}
                  </Text>
                )}
                {hasMultipleVariants && (
                  <Text variant="bodySmall" style={variantCountStyles}>
                    {variantCount} options available
                  </Text>
                )}
              </View>
              {duration && (
                <Text variant="bodySmall" style={durationStyles}>
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
                disabled={loading || isInCart}
                icon={({ size, color }) => (
                  <Ionicons 
                    name={buttonIcon} 
                    size={size} 
                    color={color} 
                  />
                )}
              >
                {buttonText}
              </Button>
            )}
          </View>
        </Card.Content>
      </TouchableOpacity>

      {/* Measurement Selection Modal */}
      <Portal>
        <Modal
          visible={showMeasurementModal}
          onDismiss={handleCloseModal}
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
                accessibilityLabel="Measurement input"
                accessibilityHint="Enter the measurement for this service"
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
                onPress={handleCloseModal}
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
});

// Add display name for debugging
ServiceCard.displayName = 'ServiceCard';

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
  variantCount: {
    marginTop: 2,
    fontStyle: 'italic',
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
  // Modal styles - optimized for better performance
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
