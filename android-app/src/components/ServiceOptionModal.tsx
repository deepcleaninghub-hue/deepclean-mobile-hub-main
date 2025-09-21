import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  Chip, 
  useTheme, 
  Portal,
  IconButton,
  Divider
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { ServiceOption } from '../services/serviceOptionsAPI';
import { Service, ServiceVariant } from '../services/servicesAPI';

interface ServiceOptionModalProps {
  visible: boolean;
  onDismiss: () => void;
  service: Service | null;
  onSelectVariant: (variant: ServiceVariant) => void;
  isAuthenticated: boolean;
  isServiceInCart: (serviceId: string) => boolean;
}

const ServiceOptionModal: React.FC<ServiceOptionModalProps> = ({
  visible,
  onDismiss,
  service,
  onSelectVariant,
  isAuthenticated,
  isServiceInCart
}) => {
  const theme = useTheme();
  const [selectedVariant, setSelectedVariant] = useState<ServiceVariant | null>(null);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleSelectVariant = useCallback((variant: ServiceVariant) => {
    setSelectedVariant(variant);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (selectedVariant) {
      onSelectVariant(selectedVariant);
      setSelectedVariant(null);
      onDismiss();
    }
  }, [selectedVariant, onSelectVariant, onDismiss]);

  const handleClose = useCallback(() => {
    setSelectedVariant(null);
    onDismiss();
  }, [onDismiss]);

  // Memoize key extractor for FlatList
  const keyExtractor = useCallback((item: ServiceVariant) => item.id, []);

  // Memoize render item for FlatList
  const renderVariantItem = useCallback(({ item: variant }: { item: ServiceVariant }) => {
    const isSelected = selectedVariant?.id === variant.id;
    const isInCart = isServiceInCart(variant.id);
    
    return (
      <TouchableOpacity
        testID={`variant-card-${variant.id}`}
        onPress={() => handleSelectVariant(variant)}
        style={[
          styles.optionCard,
          { backgroundColor: theme.colors.surface },
          isSelected && { borderColor: theme.colors.primary, borderWidth: 2 }
        ]}
        accessibilityLabel={`Service variant: ${variant.title}`}
        accessibilityRole="button"
        accessibilityHint="Tap to select this service variant"
      >
        <Card style={[
          styles.optionCardInner,
          { backgroundColor: isSelected ? theme.colors.primaryContainer : theme.colors.surface }
        ]}>
          <Card.Content style={styles.optionContent}>
            <View style={styles.optionHeader}>
              <View style={styles.optionTitleContainer}>
                <Text variant="titleMedium" style={[
                  styles.optionTitle, 
                  { color: isSelected ? theme.colors.onPrimaryContainer : theme.colors.onSurface }
                ]}>
                  {variant.title}
                </Text>
                {isInCart && (
                  <Chip 
                    compact 
                    style={[styles.inCartChip, { backgroundColor: theme.colors.secondary }]}
                    textStyle={{ color: theme.colors.onSecondary }}
                  >
                    In Cart
                  </Chip>
                )}
              </View>
              <View style={styles.priceContainer}>
                <Text variant="titleLarge" style={[
                  styles.price, 
                  { color: isSelected ? theme.colors.onPrimaryContainer : theme.colors.primary }
                ]}>
                  €{variant.price.toFixed(2)}
                </Text>
                <Text variant="bodySmall" style={[
                  styles.duration, 
                  { color: isSelected ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant }
                ]}>
                  {variant.duration}
                </Text>
              </View>
            </View>

            <Text variant="bodyMedium" style={[
              styles.optionDescription, 
              { color: isSelected ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant }
            ]}>
              {variant.description}
            </Text>

            {/* Features */}
            {variant.features && variant.features.length > 0 && (
              <View style={styles.featuresContainer}>
                {variant.features.slice(0, 3).map((feature, featureIndex) => (
                  <Chip 
                    key={featureIndex}
                    compact 
                    style={[
                      styles.featureChip, 
                      { 
                        backgroundColor: isSelected 
                          ? theme.colors.primary 
                          : theme.colors.outline 
                      }
                    ]}
                    textStyle={{ 
                      color: isSelected 
                        ? theme.colors.onPrimary 
                        : theme.colors.onSurfaceVariant 
                    }}
                  >
                    {feature}
                  </Chip>
                ))}
                {variant.features.length > 3 && (
                  <Text variant="bodySmall" style={[
                    styles.moreFeatures, 
                    { color: isSelected ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant }
                  ]}>
                    +{variant.features.length - 3} more
                  </Text>
                )}
              </View>
            )}

            {/* Selection Indicator */}
            {isSelected && (
              <View style={styles.selectedIndicator}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                <Text variant="bodySmall" style={[styles.selectedText, { color: theme.colors.primary }]}>
                  Selected
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  }, [selectedVariant, isServiceInCart, theme.colors, handleSelectVariant]);

  if (!service) return null;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        style={[styles.modal, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                {service.title}
              </Text>
              <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                Choose your preferred option
              </Text>
            </View>
            <IconButton
              icon="close"
              size={24}
              onPress={handleClose}
              iconColor={theme.colors.onSurface}
            />
          </View>

          <Divider style={styles.divider} />

          {/* Service Description */}
          <Card style={[styles.descriptionCard, { backgroundColor: theme.colors.primaryContainer }]}>
            <Card.Content>
              <Text variant="bodyMedium" style={[styles.descriptionText, { color: theme.colors.onPrimaryContainer }]}>
                {service.description}
              </Text>
            </Card.Content>
          </Card>

          {/* Options List */}
          <FlatList
            testID="service-variants-flatlist"
            data={service.service_variants || []}
            keyExtractor={keyExtractor}
            renderItem={renderVariantItem}
            showsVerticalScrollIndicator={false}
            style={styles.optionsList}
            // Performance optimizations
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={5}
            initialNumToRender={3}
            updateCellsBatchingPeriod={50}
            getItemLayout={(data, index) => ({
              length: 180, // Approximate height of variant card
              offset: 180 * index,
              index,
            })}
            // Accessibility
            accessibilityLabel="Service variants list"
            accessibilityRole="list"
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text variant="bodyLarge" style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  No variants available
                </Text>
              </View>
            )}
          />

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              testID="cancel-button"
              mode="outlined"
              onPress={handleClose}
              style={styles.cancelButton}
              accessibilityLabel="Cancel"
            >
              Cancel
            </Button>
            <Button
              testID="add-to-cart-button"
              mode="contained"
              onPress={handleAddToCart}
              disabled={!selectedVariant || !isAuthenticated}
              style={styles.addButton}
              icon="cart-plus"
              accessibilityLabel="Add to cart"
            >
              Add to Cart
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    borderRadius: 16,
    maxHeight: '90%',
  },
  modalContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontWeight: '500',
  },
  divider: {
    marginHorizontal: 20,
  },
  descriptionCard: {
    margin: 20,
    marginTop: 16,
    borderRadius: 12,
  },
  descriptionText: {
    lineHeight: 20,
  },
  optionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
  },
  optionCard: {
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionCardInner: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  optionContent: {
    padding: 16,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  optionTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  inCartChip: {
    alignSelf: 'flex-start',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontWeight: '700',
  },
  duration: {
    fontWeight: '500',
  },
  optionDescription: {
    marginBottom: 12,
    lineHeight: 18,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  featureChip: {
    height: 24,
  },
  moreFeatures: {
    alignSelf: 'center',
    fontStyle: 'italic',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  selectedText: {
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 16,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 8,
  },
  addButton: {
    flex: 2,
    borderRadius: 8,
  },
});

export default ServiceOptionModal;
