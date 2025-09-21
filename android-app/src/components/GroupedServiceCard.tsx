import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { GroupedService } from '../utils/serviceGrouping';
import { getGroupedServiceDisplayTitle, getGroupedServiceDisplayDescription } from '../utils/serviceGrouping';

interface GroupedServiceCardProps {
  groupedService: GroupedService;
  onSelectService: (groupedService: GroupedService) => void;
  onViewService: (groupedService: GroupedService) => void;
}

const GroupedServiceCard: React.FC<GroupedServiceCardProps> = ({ 
  groupedService, 
  onSelectService,
  onViewService 
}) => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  const handleSelectService = () => {
    onSelectService(groupedService);
  };

  const handleViewService = () => {
    onViewService(groupedService);
  };

  const displayTitle = getGroupedServiceDisplayTitle(groupedService);
  const displayDescription = getGroupedServiceDisplayDescription(groupedService);

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity onPress={handleViewService} activeOpacity={0.9}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: groupedService.image || 'https://via.placeholder.com/300x200' }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Options Badge */}
          <View style={[styles.optionsBadge, { backgroundColor: theme.colors.primary }]}>
            <Text variant="bodySmall" style={[styles.optionsText, { color: theme.colors.onPrimary }]}>
              {groupedService.options.length} options
            </Text>
          </View>
        </View>
        
        <Card.Content style={styles.content}>
          <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            {displayTitle}
          </Text>
          <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            {displayDescription}
          </Text>
          
          {/* Price Range */}
          <View style={styles.priceContainer}>
            <View style={styles.priceInfo}>
              <Text variant="titleLarge" style={[styles.price, { color: theme.colors.primary }]}>
                {groupedService.priceRange}
              </Text>
              <Text variant="bodySmall" style={[styles.priceLabel, { color: theme.colors.onSurfaceVariant }]}>
                Starting from
              </Text>
            </View>
            {groupedService.duration && (
              <Text variant="bodySmall" style={[styles.duration, { color: theme.colors.onSurfaceVariant }]}>
                {groupedService.duration}
              </Text>
            )}
          </View>

          {/* Options Preview */}
          <View style={styles.optionsPreview}>
            <Text variant="bodySmall" style={[styles.optionsLabel, { color: theme.colors.onSurfaceVariant }]}>
              Available options:
            </Text>
            <View style={styles.optionsList}>
              {groupedService.options.slice(0, 3).map((option, index) => (
                <View key={option.id} style={styles.optionItem}>
                  <Text variant="bodySmall" style={[styles.optionTitle, { color: theme.colors.onSurface }]}>
                    {option.title}
                  </Text>
                  <Text variant="bodySmall" style={[styles.optionPrice, { color: theme.colors.primary }]}>
                    €{option.price.toFixed(2)}
                  </Text>
                </View>
              ))}
              {groupedService.options.length > 3 && (
                <Text variant="bodySmall" style={[styles.moreOptions, { color: theme.colors.onSurfaceVariant }]}>
                  +{groupedService.options.length - 3} more options
                </Text>
              )}
            </View>
          </View>

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
                onPress={handleSelectService}
                style={[styles.button, styles.selectButton]}
                contentStyle={styles.buttonContent}
                icon={({ size, color }) => (
                  <Ionicons name="options" size={size} color={color} />
                )}
              >
                Choose Option
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
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  optionsBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  optionsText: {
    fontWeight: '600',
    fontSize: 12,
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
  priceLabel: {
    marginTop: 2,
    fontStyle: 'italic',
  },
  duration: {
    fontStyle: 'italic',
  },
  optionsPreview: {
    marginBottom: 16,
  },
  optionsLabel: {
    fontWeight: '500',
    marginBottom: 8,
  },
  optionsList: {
    gap: 4,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  optionTitle: {
    flex: 1,
    fontWeight: '500',
  },
  optionPrice: {
    fontWeight: '600',
  },
  moreOptions: {
    fontStyle: 'italic',
    marginTop: 4,
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
  selectButton: {
    flex: 2,
  },
  buttonContent: {
    paddingVertical: 4,
  },
});

export default GroupedServiceCard;
