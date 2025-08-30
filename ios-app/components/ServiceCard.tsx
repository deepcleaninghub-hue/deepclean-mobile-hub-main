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

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ id, title, description, image }) => {
  const theme = useTheme();

  const handleViewService = () => {
    Alert.alert('Service Details', `Viewing details for ${title}`);
    // Here you would typically navigate to a service detail screen
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity onPress={handleViewService} activeOpacity={0.9}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <Card.Content style={styles.content}>
          <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            {title}
          </Text>
          <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            {description}
          </Text>
          <Button
            mode="outlined"
            onPress={handleViewService}
            style={styles.button}
            contentStyle={styles.buttonContent}
            icon={({ size, color }) => (
              <Ionicons name="arrow-forward" size={size} color={color} />
            )}
          >
            View Service
          </Button>
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
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 4,
  },
});

export default ServiceCard;
