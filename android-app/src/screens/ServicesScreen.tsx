import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Text, Card, Button, Chip, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';

const ServicesScreen = () => {
  const theme = useTheme();
  const [cartItems, setCartItems] = useState<any[]>([]);

  const allServices = [
    {
      id: 'kitchen-cleaning',
      title: 'Kitchen Deep Cleaning',
      description: 'Thorough cleaning of your kitchen including appliances, cabinets, and surfaces for a spotless cooking environment.',
      image: 'https://deepcleaninghub.com/wp-content/uploads/2025/08/man-cleaning-cabinet-with-rag-1-2048x1363-1.jpg',
      category: 'Cleaning',
      price: 'From €80',
      duration: '2-4 hours',
      features: ['Appliance cleaning', 'Cabinet cleaning', 'Surface sanitization', 'Grease removal'],
    },
    {
      id: 'house-moving',
      title: 'House Moving',
      description: 'Professional moving services to help you relocate your home with care and efficiency.',
      image: 'https://deepcleaninghub.com/wp-content/uploads/2025/08/puls-furnture-assembly-services-included-1024x684-1-1.webp',
      category: 'Moving',
      price: 'From €150',
      duration: '4-8 hours',
      features: ['Furniture disassembly', 'Safe packing', 'Transportation', 'Reassembly'],
    },
    {
      id: 'deep-cleaning',
      title: 'Deep Cleaning',
      description: 'Comprehensive deep cleaning services for homes, hotels, and commercial spaces.',
      image: 'https://deepcleaninghub.com/wp-content/uploads/2025/08/shutterstock_1628546512-1.jpg',
      category: 'Cleaning',
      price: 'From €120',
      duration: '4-6 hours',
      features: ['Complete home cleaning', 'Sanitization', 'Odor removal', 'Stain treatment'],
    },
    {
      id: 'furniture-assembly',
      title: 'Furniture Assembly',
      description: 'Expert furniture assembly services for all your home and office furniture needs.',
      image: 'https://deepcleaninghub.com/wp-content/uploads/2025/08/puls-furnture-assembly-services-included-1024x684-1.webp',
      category: 'Assembly',
      price: 'From €60',
      duration: '1-3 hours',
      features: ['IKEA furniture', 'Office furniture', 'Bed assembly', 'Warranty included'],
    },
    {
      id: 'carpet-cleaning',
      title: 'Carpet & Upholstery Cleaning',
      description: 'Professional deep cleaning for carpets, rugs, and upholstered furniture.',
      image: 'https://deepcleaninghub.com/wp-content/uploads/2025/08/shutterstock_1628546512-1.jpg',
      category: 'Cleaning',
      price: 'From €40',
      duration: '2-3 hours',
      features: ['Stain removal', 'Deep cleaning', 'Odor elimination', 'Protection treatment'],
    },
    {
      id: 'window-cleaning',
      title: 'Window & Glass Cleaning',
      description: 'Crystal clear windows and glass surfaces for a brighter, cleaner home.',
      image: 'https://deepcleaninghub.com/wp-content/uploads/2025/08/man-cleaning-cabinet-with-rag-1-2048x1363-1.jpg',
      category: 'Cleaning',
      price: 'From €30',
      duration: '1-2 hours',
      features: ['Interior & exterior', 'Frame cleaning', 'Screen cleaning', 'Streak-free finish'],
    },
  ];

  const handleBookService = (service: any) => {
    Alert.alert(
      'Book Service',
      `Would you like to book ${service.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Now', onPress: () => Alert.alert('Success', 'Service booking initiated!') },
      ]
    );
  };

  const handleAddToCart = (service: any) => {
    // Check if service is already in cart
    const existingItem = cartItems.find(item => item.id === service.id);
    
    if (existingItem) {
      Alert.alert('Already in Cart', `${service.title} is already in your cart.`);
      return;
    }

    // Add service to cart
    const cartItem = {
      id: service.id,
      name: service.title,
      price: parseFloat(service.price.replace('From €', '')),
      duration: service.duration,
      quantity: 1,
      category: service.category,
    };

    setCartItems(prevItems => [...prevItems, cartItem]);
    
    Alert.alert(
      'Added to Cart',
      `${service.title} has been added to your cart!`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => console.log('Navigate to cart') },
      ]
    );
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

        {/* Services List */}
        <View style={styles.servicesContainer}>
          {allServices.map((service) => (
            <Card key={service.id} style={[styles.serviceCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Cover source={{ uri: service.image }} style={styles.serviceImage} />
              <Card.Content style={styles.serviceContent}>
                <View style={styles.serviceHeader}>
                  <Text variant="titleLarge" style={[styles.serviceTitle, { color: theme.colors.onSurface }]}>
                    {service.title}
                  </Text>
                  <Chip 
                    mode="outlined" 
                    textStyle={{ color: theme.colors.primary }}
                    style={{ borderColor: theme.colors.primary }}
                  >
                    {service.category}
                  </Chip>
                </View>
                
                <Text variant="bodyMedium" style={[styles.serviceDescription, { color: theme.colors.onSurfaceVariant }]}>
                  {service.description}
                </Text>

                <View style={styles.serviceDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color={theme.colors.onSurfaceVariant} />
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {service.duration}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="pricetag-outline" size={16} color={theme.colors.onSurfaceVariant} />
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {service.price}
                    </Text>
                  </View>
                </View>

                <View style={styles.featuresContainer}>
                  {service.features.slice(0, 2).map((feature, index) => (
                    <Chip key={index} mode="flat" style={styles.featureChip}>
                      {feature}
                    </Chip>
                  ))}
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    onPress={() => handleBookService(service)}
                    style={[styles.bookButton, { flex: 1, marginRight: 8 }]}
                    contentStyle={styles.buttonContent}
                  >
                    Book Now
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleAddToCart(service)}
                    style={[styles.cartButton, { flex: 1, marginLeft: 8 }]}
                    contentStyle={styles.buttonContent}
                    icon="cart-plus"
                  >
                    Add to Cart
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}
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
  servicesContainer: {
    padding: 20,
    gap: 20,
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
