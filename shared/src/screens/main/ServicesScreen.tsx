import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { Text, Card, Button, Chip, useTheme, ActivityIndicator, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import ServiceCard from '../../components/Service/ServiceCard';
import { servicesAPI } from '../../services/api';
import { serviceOptionsAPI } from '../../services/serviceOptionsAPI';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { ServicesStackScreenProps } from '../../navigation/types';

type Props = ServicesStackScreenProps<'ServicesMain'>;

const ServicesScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const [services, setServices] = useState<any[]>([]);
  const [serviceOptions, setServiceOptions] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showServiceOptions, setShowServiceOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch services and categories from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch main services for categories
      const servicesData = await servicesAPI.getAllServices();
      setServices(servicesData);
      
      // Fetch all service options for "All" tab
      const allServiceOptions = await serviceOptionsAPI.getAllServiceOptions();
      setServiceOptions(allServiceOptions);
      
      // Use service titles as categories instead of separate categories
      const serviceTitles = ['All', ...servicesData.map(service => service.title)];
      setCategories(serviceTitles);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const servicesData = await servicesAPI.getAllServices();
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
      Alert.alert('Error', 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Handle category selection
  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    
    if (category === 'All') {
      // Show all service options when "All" is selected
      setShowServiceOptions(true);
      // Service options are already loaded in fetchData
    } else {
      // Find the selected service to get its ID
      const selectedService = services.find(service => service.title === category);
      if (selectedService) {
        try {
          setLoading(true);
          const options = await serviceOptionsAPI.getServiceOptionsByCategory(selectedService.id);
          setServiceOptions(options);
          setShowServiceOptions(true);
        } catch (error) {
          console.error('Error fetching service options:', error);
          Alert.alert('Error', 'Failed to load service options');
          setShowServiceOptions(false);
          setServiceOptions([]);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(service => service.title === selectedCategory);

  const filteredServiceOptions = serviceOptions.filter(option => {
    // Filter by category
    const categoryMatch = selectedCategory === 'All' || option.services?.title === selectedCategory;
    
    // Filter by search query
    const searchMatch = searchQuery === '' || 
      option.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.services?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.services?.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  const handleBookService = (service: any) => {
    // Navigate to booking screen
    console.log('Book service:', service.title);
  };

  const handleCallNow = () => {
    Alert.alert('Contact Us', 'Calling +49-16097044182...');
  };

  const handleGetInTouch = () => {
    navigation.navigate('Contact');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text variant="headlineMedium" style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
            Our Professional Services
          </Text>
          <Text variant="bodyLarge" style={[styles.headerDescription, { color: theme.colors.onSurfaceVariant }]}>
            Choose from our comprehensive range of cleaning and moving services
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            mode="outlined"
            placeholder="Search services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { backgroundColor: theme.colors.surface }]}
            left={<TextInput.Icon icon="magnify" color={theme.colors.onSurfaceVariant} />}
            right={searchQuery ? <TextInput.Icon icon="close" onPress={() => setSearchQuery('')} color={theme.colors.onSurfaceVariant} /> : null}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
            textColor={theme.colors.onSurface}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {(categories || []).map((category) => (
              <Chip
                key={category}
                mode={selectedCategory === category ? 'flat' : 'outlined'}
                selected={selectedCategory === category}
                onPress={() => handleCategorySelect(category)}
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
          ) : filteredServiceOptions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color={theme.colors.outline} />
              <Text variant="headlineSmall" style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                {searchQuery ? 'No Search Results' : 'No Service Options Found'}
              </Text>
              <Text variant="bodyLarge" style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                {searchQuery 
                  ? `No services found for "${searchQuery}"`
                  : selectedCategory === 'All' 
                    ? 'No service options available' 
                    : `No options available for ${selectedCategory}`
                }
              </Text>
            </View>
          ) : (
            // Show service options (either all or filtered by category)
            filteredServiceOptions.map((option) => (
              <ServiceCard
                key={option.id || Math.random().toString()}
                id={option.id || ''}
                title={option.title || ''}
                description={option.description || ''}
                image={option.image || ''}
                price={option.price}
                duration={option.duration || ''}
                category={option.services?.category || ''}
                pricing_type={option.pricing_type}
                unit_price={option.unit_price}
                unit_measure={option.unit_measure}
                min_measurement={option.min_measurement}
                max_measurement={option.max_measurement}
                measurement_step={option.measurement_step}
                measurement_placeholder={option.measurement_placeholder}
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
            <View style={styles.ctaButtons}>
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
                Call Now
              </Button>
              <Button
                mode="outlined"
                onPress={handleGetInTouch}
                style={[styles.ctaButtonOutlined, { borderColor: theme.colors.onPrimary }]}
                textColor={theme.colors.onPrimary}
                contentStyle={styles.buttonContent}
                icon={({ size, color }) => (
                  <Ionicons name="mail" size={size} color={color} />
                )}
              >
                Get in Touch
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  headerTitle: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
    fontSize: 28,
  },
  headerDescription: {
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    opacity: 0.8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    marginRight: 12,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  servicesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
  ctaCard: {
    margin: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  ctaContent: {
    alignItems: 'center',
    padding: 28,
  },
  ctaTitle: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
    fontSize: 20,
  },
  ctaDescription: {
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
    fontSize: 16,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  ctaButton: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  ctaButtonOutlined: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonContent: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
});

export default ServicesScreen;