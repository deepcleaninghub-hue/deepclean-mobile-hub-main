import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../src/contexts/CartContext';
import { useAuth } from '../src/contexts/AuthContext';

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price?: number;
  duration?: string;
  category?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  id, 
  title, 
  description, 
  image, 
  price, 
  duration, 
  category 
}) => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const { addToCart, isServiceInCart, loading } = useCart();

  const handleViewService = () => {
    Alert.alert('Service Details', `Viewing details for ${title}`);
    // Here you would typically navigate to a service detail screen
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to add items to your cart');
      return;
    }

    const service = {
      id,
      title,
      description,
      image,
      price,
      duration,
      category
    };

    await addToCart(service);
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
              <Text variant="titleLarge" style={[styles.price, { color: theme.colors.primary }]}>
                €{price.toFixed(2)}
              </Text>
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
  price: {
    fontWeight: '700',
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
});

export default ServiceCard;
