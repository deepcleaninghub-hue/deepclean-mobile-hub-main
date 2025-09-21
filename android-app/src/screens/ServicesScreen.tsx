import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { Text, Card, Button, Chip, useTheme, ActivityIndicator, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import ServiceCard from '../components/ServiceCard';
import { servicesAPI, Service, ServiceVariant } from '../services/servicesAPI';
import { serviceOptionsAPI, ServiceOption } from '../services/serviceOptionsAPI';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ServicesScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const { addToCart, isServiceInCart } = useCart();
  
  const [services, setServices] = useState<Service[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
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

  // Memoize filtered service options for better performance
  const filteredServiceOptions = useMemo(() => {
    return serviceOptions.filter(option => {
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
  }, [serviceOptions, selectedCategory, searchQuery]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleBookService = useCallback((service: any) => {
    // Navigate to booking screen
    console.log('Book service:', service.title);
  }, []);

  const handleCallNow = useCallback(() => {
    Alert.alert('Contact Us', 'Calling +49-16097044182...');
  }, []);

  const handleGetInTouch = useCallback(() => {
    navigation.navigate('Contact');
  }, [navigation]);

  // Memoize key extractor for FlatList
  const keyExtractor = useCallback((item: ServiceOption) => item.id || Math.random().toString(), []);

  // Memoize render item for FlatList
  const renderServiceCard = useCallback(({ item }: { item: ServiceOption }) => (
    <ServiceCard
      id={item.id || ''}
      title={item.title || ''}
      description={item.description || ''}
      image={item.image || ''}
      price={item.price}
      duration={item.duration || ''}
      category={item.services?.category || ''}
      pricing_type={item.pricing_type}
      unit_price={item.unit_price}
      unit_measure={item.unit_measure}
      min_measurement={item.min_measurement}
      max_measurement={item.max_measurement}
      measurement_step={item.measurement_step}
      measurement_placeholder={item.measurement_placeholder}
    />
  ), []);

  // Memoize list header component
  const ListHeaderComponent = useMemo(() => (
    <>
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
          testID="search-input"
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
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item: category }) => (
            <Chip
              testID={`category-chip-${category}`}
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
          )}
          contentContainerStyle={styles.categoryScroll}
        />
      </View>
    </>
  ), [theme.colors, searchQuery, categories, selectedCategory, handleCategorySelect]);

  // Memoize list footer component
  const ListFooterComponent = useMemo(() => (
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
  ), [theme.colors, handleCallNow, handleGetInTouch]);

  // Memoize empty component
  const ListEmptyComponent = useMemo(() => (
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
  ), [theme.colors, searchQuery, selectedCategory]);

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, marginTop: 16 }}>
            Loading services...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      
      <FlatList
        testID="service-options-flatlist"
        data={filteredServiceOptions}
        keyExtractor={keyExtractor}
        renderItem={renderServiceCard}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[theme.colors.primary]} 
          />
        }
        showsVerticalScrollIndicator={false}
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        updateCellsBatchingPeriod={50}
        getItemLayout={(data, index) => ({
          length: 200, // Approximate height of ServiceCard
          offset: 200 * index,
          index,
        })}
        // Accessibility
        accessibilityLabel="Service options list"
        accessibilityRole="list"
        contentContainerStyle={styles.servicesContainer}
        style={styles.flatList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  flatList: {
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
