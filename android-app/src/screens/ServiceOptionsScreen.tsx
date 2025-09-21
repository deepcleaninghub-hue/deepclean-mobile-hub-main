import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Button, Chip, Divider, useTheme, ActivityIndicator, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { servicesAPI, Service, ServiceVariant } from '../services/servicesAPI';
import { ServiceOption } from '../services/serviceOptionsAPI';

const ServiceOptionsScreen = ({ navigation, route }: any) => {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { addToCart, isServiceInCart } = useCart();
  
  const { serviceId, categoryTitle, categoryDescription } = route.params;
  const [serviceVariants, setServiceVariants] = useState<ServiceVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadServiceOptions();
  }, [serviceId]);

  const loadServiceOptions = async () => {
    try {
      setLoading(true);
      const service = await servicesAPI.getServiceById(serviceId);
      console.log('Fetched service by ID:', service);
      if (service) {
        // Ensure service_variants is always an array
        const variants = service.service_variants || [];
        console.log('Service variants:', variants);
        setServiceVariants(variants);
      }
    } catch (error) {
      console.error('Error loading service options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadServiceOptions();
    setRefreshing(false);
  };

  const handleAddToCart = async (variant: ServiceVariant) => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }

    if (isServiceInCart(variant.id)) {
      return; // Already in cart
    }

    // Convert ServiceVariant to ServiceOption format for cart
    const serviceOption: ServiceOption = {
      id: variant.id,
      title: variant.title,
      description: variant.description,
      service_id: variant.service_id,
      price: variant.price,
      duration: variant.duration,
      features: variant.features,
      is_active: variant.is_active,
      created_at: variant.created_at,
      updated_at: variant.updated_at,
      services: {
        id: serviceId,
        title: categoryTitle,
        category: categoryTitle
      }
    };

    const success = await addToCart(serviceOption, variant.price);
    if (success) {
      // Optionally navigate back to cart or show success message
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={[styles.loadingText, { color: theme.colors.onSurface }]}>
          Loading service options...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-back"
            size={24}
            onPress={handleBack}
            iconColor={theme.colors.onSurface}
          />
          <View style={styles.headerText}>
            <Text variant="headlineSmall" style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
              {categoryTitle}
            </Text>
            <Text variant="bodyMedium" style={[styles.headerSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Choose a service option
            </Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Category Description */}
        <Card style={[styles.descriptionCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="bodyLarge" style={[styles.descriptionText, { color: theme.colors.onSurface }]}>
              {categoryDescription}
            </Text>
          </Card.Content>
        </Card>

        {/* Service Options */}
        {serviceVariants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="options-outline" size={80} color={theme.colors.outline} />
            <Text variant="headlineSmall" style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
              No Options Available
            </Text>
            <Text variant="bodyLarge" style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              No service options are currently available for this category.
            </Text>
          </View>
        ) : (
          serviceVariants.map((variant, index) => (
            <Card key={variant.id} style={[styles.optionCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content style={styles.optionContent}>
                <View style={styles.optionInfo}>
                  <Text variant="titleMedium" style={[styles.optionTitle, { color: theme.colors.onSurface }]}>
                    {variant.title}
                  </Text>
                  <Text variant="bodyMedium" style={[styles.optionDescription, { color: theme.colors.onSurfaceVariant }]}>
                    {variant.description}
                  </Text>
                  
                  {/* Features */}
                  <View style={styles.featuresContainer}>
                    {variant.features.map((feature, featureIndex) => (
                      <Chip 
                        key={featureIndex}
                        compact 
                        style={[styles.featureChip, { backgroundColor: theme.colors.primaryContainer }]}
                        textStyle={{ color: theme.colors.onPrimaryContainer }}
                      >
                        {feature}
                      </Chip>
                    ))}
                  </View>

                  {/* Meta Info */}
                  <View style={styles.optionMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={16} color={theme.colors.onSurfaceVariant} />
                      <Text variant="bodyMedium" style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                        {variant.duration}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="cash-outline" size={16} color={theme.colors.primary} />
                      <Text variant="titleMedium" style={[styles.priceText, { color: theme.colors.primary }]}>
                        €{variant.price}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Add to Cart Button */}
                <View style={styles.optionActions}>
                  {isServiceInCart(variant.id) ? (
                    <Button 
                      mode="outlined" 
                      icon="check"
                      disabled
                      style={styles.addedButton}
                    >
                      Added
                    </Button>
                  ) : (
                    <Button 
                      mode="contained" 
                      onPress={() => handleAddToCart(variant)}
                      icon="cart-plus"
                      style={styles.addButton}
                    >
                      Add to Cart
                    </Button>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
  },
  header: {
    paddingHorizontal: 8,
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  descriptionCard: {
    marginBottom: 16,
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
  descriptionText: {
    lineHeight: 24,
  },
  optionCard: {
    marginBottom: 16,
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
  optionContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  optionInfo: {
    marginBottom: 16,
  },
  optionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  optionDescription: {
    marginBottom: 12,
    lineHeight: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  featureChip: {
    height: 28,
  },
  optionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontWeight: '500',
  },
  priceText: {
    fontWeight: '700',
  },
  optionActions: {
    alignItems: 'flex-end',
  },
  addButton: {
    borderRadius: 8,
  },
  addedButton: {
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default ServiceOptionsScreen;

