import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { Text, Card, Button, Chip, useTheme, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import ServiceCard from '../components/ServiceCard';
import { servicesAPI } from '../services/api';

const ServicesScreen = () => {
  const theme = useTheme();
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch services from API
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const servicesData = await servicesAPI.getAllServices();
      setServices(servicesData);
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(servicesData.map(service => service.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching services:', error);
      Alert.alert('Error', 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  };

  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const handleBookService = (service: any) => {
    // Navigate to booking screen
    console.log('Book service:', service.title);
  };

  const handleCallNow = () => {
    Alert.alert('Contact Us', 'Calling +49-16097044182...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text variant="headlineMedium" style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
            Our Professional Services
          </Text>
          <Text variant="bodyLarge" style={[styles.headerDescription, { color: theme.colors.onSurfaceVariant }]}>
            Choose from our comprehensive range of cleaning and moving services
          </Text>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {(categories || []).map((category) => (
              <Chip
                key={category}
                mode={selectedCategory === category ? 'flat' : 'outlined'}
                selected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && { backgroundColor: theme.colors.primary }
                ]}
                textStyle={{
                  color: selectedCategory === category ? theme.colors.onPrimary : theme.colors.primary
                }}
              >
                {category}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Services List */}
        <View style={styles.servicesContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, marginTop: 16 }}>
                Loading services...
              </Text>
            </View>
          ) : filteredServices.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color={theme.colors.outline} />
              <Text variant="headlineSmall" style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                No Services Found
              </Text>
              <Text variant="bodyLarge" style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                No services available in this category
              </Text>
            </View>
          ) : (
            (filteredServices || []).map((service) => (
              <ServiceCard
                key={service.id || Math.random().toString()}
                id={service.id || ''}
                title={service.title || ''}
                description={service.description || ''}
                image={service.image || ''}
                price={service.price}
                duration={service.duration || ''}
                category={service.category || ''}
              />
            ))
          )}
        </View>

        {/* Call to Action */}
        <Card style={[styles.ctaCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content style={styles.ctaContent}>
            <Text variant="titleLarge" style={[styles.ctaTitle, { color: theme.colors.onPrimary }]}>
              Need a Custom Quote?
            </Text>
            <Text variant="bodyMedium" style={[styles.ctaDescription, { color: theme.colors.onPrimary }]}>
              Contact us for personalized cleaning solutions tailored to your specific needs.
            </Text>
            <Button
              mode="contained"
              onPress={handleCallNow}
              style={[styles.ctaButton, { backgroundColor: theme.colors.onPrimary }]}
              contentStyle={styles.buttonContent}
              textColor={theme.colors.primary}
              icon={({ size, color }) => (
                <Ionicons name="call" size={size} color={color} />
              )}
            >
              Call Now: +49-16097044182
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollView: {
    flex: 1,
  },
  headerSection: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  headerDescription: {
    textAlign: 'center',
    lineHeight: 22,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    marginRight: 8,
  },
  servicesContainer: {
    padding: 20,
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
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
  serviceCard: {
    marginBottom: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  serviceImage: {
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  serviceContent: {
    padding: 20,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    flex: 1,
    marginRight: 12,
    fontWeight: '600',
  },
  serviceDescription: {
    marginBottom: 16,
    lineHeight: 22,
  },
  serviceDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  featureChip: {
    backgroundColor: '#f1f5f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  bookButton: {
    borderRadius: 8,
  },
  cartButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  ctaCard: {
    margin: 20,
    borderRadius: 16,
  },
  ctaContent: {
    alignItems: 'center',
    padding: 24,
  },
  ctaTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  ctaDescription: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  ctaButton: {
    borderRadius: 8,
  },
});

export default ServicesScreen;
