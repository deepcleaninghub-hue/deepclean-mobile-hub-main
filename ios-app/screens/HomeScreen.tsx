import React, { useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { Text, Button, Card, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import ServiceCard from '../components/ServiceCard';
import ImageCarousel from '../components/ImageCarousel';

const HomeScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const carouselImages = [
    {
      id: 'kitchen-cleaning-hero',
      uri: require('../assets/images/kitchen-cleaning.png'),
      title: 'Professional Kitchen Cleaning',
      description: 'Expert deep cleaning for your kitchen surfaces and appliances',
    },
    {
      id: 'living-room-cleaning',
      uri: require('../assets/images/living-room-cleaning.png'),
      title: 'Living Space Excellence',
      description: 'Transform your living areas with our thorough cleaning services',
    },
    {
      id: 'bathroom-cleaning',
      uri: require('../assets/images/bathroom-cleaning.png'),
      title: 'Bathroom Sanitization',
      description: 'Complete bathroom cleaning and sanitization for hygiene',
    },
    {
      id: 'office-cleaning',
      uri: require('../assets/images/office-cleaning.png'),
      title: 'Commercial Cleaning',
      description: 'Professional cleaning solutions for offices and commercial spaces',
    },
    {
      id: 'hands-cleaning',
      uri: require('../assets/images/hands-cleaning.png'),
      title: 'Professional Hand Cleaning',
      description: 'Thorough cleaning with professional equipment and techniques',
    },
  ];

  const featuredServices = [
    {
      id: 'kitchen-cleaning',
      title: 'Kitchen Deep Cleaning',
      description: 'Thorough cleaning of your kitchen including appliances, cabinets, and surfaces for a spotless cooking environment.',
      image: 'https://deepcleaninghub.com/wp-content/uploads/2025/08/man-cleaning-cabinet-with-rag-1-2048x1363-1.jpg',
    },
    {
      id: 'house-moving',
      title: 'House Moving',
      description: 'Professional moving services to help you relocate your home with care and efficiency.',
      image: 'https://deepcleaninghub.com/wp-content/uploads/2025/08/puls-furnture-assembly-services-included-1024x684-1-1.webp',
    },
    {
      id: 'deep-cleaning',
      title: 'Deep Cleaning',
      description: 'Comprehensive deep cleaning services for homes, hotels, and commercial spaces.',
      image: 'https://deepcleaninghub.com/wp-content/uploads/2025/08/shutterstock_1628546512-1.jpg',
    },
    {
      id: 'furniture-assembly',
      title: 'Furniture Assembly',
      description: 'Expert furniture assembly services for all your home and office furniture needs.',
      image: 'https://deepcleaninghub.com/wp-content/uploads/2025/08/puls-furnture-assembly-services-included-1024x684-1.webp',
    },
  ];

  const handleCallNow = () => {
    Linking.openURL('tel:+4916097044182').catch(() => {
      Alert.alert('Error', 'Could not open phone app');
    });
  };

  const handleGetInTouch = () => {
    navigation.navigate('Contact');
  };

  const handleBookService = () => {
    // Navigate to contact screen or booking form
    Alert.alert('Book Service', 'Redirecting to contact form...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollViewRef} style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Carousel */}
        <View style={styles.heroSection}>
          <ImageCarousel 
            images={carouselImages} 
            height={350} 
          />
          <View style={styles.heroContent}>
            <Text variant="displaySmall" style={[styles.heroTitle, { color: theme.colors.onSurface }]}>
              Deep Cleaning Excellence for Homes, Hotels, and More
            </Text>
            <Text variant="bodyLarge" style={[styles.heroDescription, { color: theme.colors.onSurfaceVariant }]}>
              Providing top-tier cleaning solutions tailored for every space, ensuring a spotless and hygienic environment
            </Text>
            <View style={styles.heroButtons}>
              <Button
                mode="contained"
                onPress={handleBookService}
                style={styles.primaryButton}
                contentStyle={styles.buttonContent}
              >
                Book Service
              </Button>
              <Button
                mode="outlined"
                onPress={handleCallNow}
                style={styles.secondaryButton}
                contentStyle={styles.buttonContent}
                icon={({ size, color }) => (
                  <Ionicons name="call" size={size} color={color} />
                )}
              >
                +49-16097044182
              </Button>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text variant="headlineMedium" style={styles.featuresHeader}>
            Why Choose Us?
          </Text>
          <Text variant="bodyLarge" style={styles.featuresSubheader}>
            Experience the difference with our professional cleaning services
          </Text>
                      <View style={styles.featuresContainer}>
              <View style={styles.featureBlock}>
                <View style={styles.featureIcon}>
                  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <Path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="black"/>
                  </Svg>
                </View>
                <View style={styles.featureContent}>
                  <Text variant="titleMedium" style={[styles.featureTitle, { color: theme.colors.primary }]}>
                    Professional Excellence
                  </Text>
                  <Text variant="bodyMedium" style={[styles.featureDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Reliable, skilled, and detail-oriented experts.
                  </Text>
                </View>
              </View>

              <View style={styles.featureBlock}>
                <View style={styles.featureIcon}>
                  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <Path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM19 19H5V5H19V19ZM12 6C9.24 6 7 8.24 7 11C7 13.76 9.24 16 12 16C14.76 16 17 13.76 17 11C17 8.24 14.76 6 12 6ZM12 14C10.34 14 9 12.66 9 11C9 9.34 10.34 8 12 8C13.66 8 15 9.34 15 11C15 12.66 13.66 14 12 14Z" fill="black"/>
                  </Svg>
                </View>
                <View style={styles.featureContent}>
                  <Text variant="titleMedium" style={[styles.featureTitle, { color: theme.colors.primary }]}>
                    Time Efficiency
                  </Text>
                  <Text variant="bodyMedium" style={[styles.featureDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Efficient cleaning that fits your schedule.
                  </Text>
                </View>
              </View>

              <View style={styles.featureBlock}>
                <View style={styles.featureIcon}>
                  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <Path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 2.19V11.99Z" fill="black"/>
                  </Svg>
                </View>
                <View style={styles.featureContent}>
                  <Text variant="titleMedium" style={[styles.featureTitle, { color: theme.colors.primary }]}>
                    Secure Transactions
                  </Text>
                  <Text variant="bodyMedium" style={[styles.featureDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Fast, safe, and easy transactions.
                  </Text>
                </View>
              </View>
            </View>
        </View>

        {/* Why Choose Us Section */}
        <View style={styles.whyChooseUsSection}>
          <View style={styles.whyChooseUsHeader}>
            <View style={styles.whyChooseUsTagContainer}>
              <Text variant="labelSmall" style={styles.whyChooseUsTag}>
                WHY CHOOSE US
              </Text>
            </View>
            <Text variant="headlineLarge" style={styles.whyChooseUsTitle}>
              Why Deep Cleaning Services
            </Text>
            <Text variant="bodyLarge" style={styles.whyChooseUsSubtitle}>
              Experience the difference with our premium cleaning solutions
            </Text>
          </View>
          
          <View style={styles.whyChooseUsGrid}>
            <View style={styles.whyChooseUsCard}>
              <View style={styles.whyChooseUsCardHeader}>
                <View style={styles.whyChooseUsIconContainer}>
                  <View style={styles.whyChooseUsIcon}>
                                      <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <Path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#ffffff"/>
                  </Svg>
                  </View>
                  <View style={styles.whyChooseUsIconGlow} />
                </View>
                <View style={styles.whyChooseUsCardBadge}>
                  <Text style={styles.whyChooseUsCardBadgeText}>Premium</Text>
                </View>
              </View>
              <View style={styles.whyChooseUsCardContent}>
                <Text variant="titleMedium" style={styles.whyChooseUsCardTitle}>
                  Expert Cleaning Team
                </Text>
                <Text variant="bodyMedium" style={styles.whyChooseUsCardDescription}>
                  Trained professionals ensuring top-notch service with attention to every detail.
                </Text>
              </View>
            </View>

            <View style={styles.whyChooseUsCard}>
              <View style={styles.whyChooseUsIconContainer}>
                <View style={styles.whyChooseUsIcon}>
                  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <Path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#FF6B35"/>
                  </Svg>
                </View>
                <View style={styles.whyChooseUsIconGlow} />
              </View>
              <Text variant="titleMedium" style={styles.whyChooseUsCardTitle}>
                Comprehensive Services
              </Text>
              <Text variant="bodyMedium" style={styles.whyChooseUsCardDescription}>
                Tailored solutions for homes, hotels, glass, and roads with flexible scheduling.
              </Text>
              <View style={styles.whyChooseUsCardBadge}>
                <Text style={styles.whyChooseUsCardBadgeText}>Flexible</Text>
              </View>
            </View>

            <View style={styles.whyChooseUsCard}>
              <View style={styles.whyChooseUsIconContainer}>
                <View style={styles.whyChooseUsIcon}>
                  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <Path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM19 19H5V5H19V19ZM12 6C9.24 6 7 8.24 7 11C7 13.76 9.24 16 12 16C14.76 16 17 13.76 17 11C17 8.24 14.76 6 12 6ZM12 14C10.34 14 9 12.66 9 11C9 9.34 10.34 8 12 8C13.66 8 15 9.34 15 11C15 12.66 13.66 14 12 14Z" fill="#FF6B35"/>
                  </Svg>
                </View>
                <View style={styles.whyChooseUsIconGlow} />
              </View>
              <Text variant="titleMedium" style={styles.whyChooseUsCardTitle}>
                Eco-Friendly Products
              </Text>
              <Text variant="bodyMedium" style={styles.whyChooseUsCardDescription}>
                Safe for your environment and effective on all surfaces with green certification.
              </Text>
              <View style={styles.whyChooseUsCardBadge}>
                <Text style={styles.whyChooseUsCardBadgeText}>Eco</Text>
              </View>
            </View>

            <View style={styles.whyChooseUsCard}>
              <View style={styles.whyChooseUsIconContainer}>
                <View style={styles.whyChooseUsIcon}>
                  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <Path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 2.19V11.99Z" fill="#FF6B35"/>
                  </Svg>
                </View>
                <View style={styles.whyChooseUsIconGlow} />
              </View>
              <Text variant="titleMedium" style={styles.whyChooseUsCardTitle}>
                Customer Satisfaction
              </Text>
              <Text variant="bodyMedium" style={styles.whyChooseUsCardDescription}>
                Dedicated to delivering exceptional results every time with 100% satisfaction guarantee.
              </Text>
              <View style={styles.whyChooseUsCardBadge}>
                <Text style={styles.whyChooseUsCardBadgeText}>100%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Call to Action */}
        <Card style={[styles.ctaCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content style={styles.ctaContent}>
            <Text variant="titleLarge" style={[styles.ctaTitle, { color: theme.colors.onSurface }]}>
              Need a Custom Quote?
            </Text>
            <Text variant="bodyMedium" style={[styles.ctaDescription, { color: theme.colors.onSurfaceVariant }]}>
              Contact us for personalized cleaning solutions tailored to your specific needs.
            </Text>
            <View style={styles.ctaButtons}>
              <Button
                mode="contained"
                onPress={handleCallNow}
                style={[styles.ctaButton, { backgroundColor: theme.colors.primary }]}
                contentStyle={styles.buttonContent}
                icon={({ size, color }) => (
                  <Ionicons name="call" size={size} color={color} />
                )}
              >
                Call Now
              </Button>
              <Button
                mode="outlined"
                onPress={handleGetInTouch}
                style={[styles.ctaButtonOutlined, { borderColor: theme.colors.primary }]}
                textColor={theme.colors.primary}
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
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingBottom: 40,
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heroTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  heroDescription: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  heroButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  primaryButton: {
    borderRadius: 8,
  },
  secondaryButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  // Features Section Styles
  featuresSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  featuresHeader: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
    color: '#2c3e50',
    fontSize: 28,
  },
  featuresSubheader: {
    textAlign: 'center',
    marginBottom: 40,
    color: '#7f8c8d',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 20,
    width: '100%',
  },
  featureBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    gap: 20,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexShrink: 0,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  iconText: {
    fontSize: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    textAlign: 'left',
    marginBottom: 8,
    fontWeight: '700',
    fontSize: 18,
    color: '#2c3e50',
  },
  featureDescription: {
    textAlign: 'left',
    lineHeight: 22,
    fontSize: 14,
    color: '#7f8c8d',
  },

  // Why Choose Us Section Styles
  whyChooseUsSection: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  whyChooseUsHeader: {
    alignItems: 'center',
    marginBottom: 50,
  },
  whyChooseUsTagContainer: {
    backgroundColor: '#2c3e50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  whyChooseUsTag: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  whyChooseUsTitle: {
    textAlign: 'center',
    fontWeight: '800',
    color: '#2c3e50',
    fontSize: 36,
    lineHeight: 44,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  whyChooseUsSubtitle: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 18,
    lineHeight: 26,
    maxWidth: 400,
    opacity: 0.9,
  },
  whyChooseUsGrid: {
    flexDirection: 'column',
    gap: 24,
  },
  whyChooseUsCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 0,
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    position: 'relative',
    overflow: 'hidden',
  },
  whyChooseUsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24,
    paddingBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  whyChooseUsIconContainer: {
    position: 'relative',
  },
  whyChooseUsIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  whyChooseUsIconGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 40,
    backgroundColor: 'rgba(44, 62, 80, 0.1)',
    zIndex: -1,
  },
  whyChooseUsCardContent: {
    padding: 24,
    paddingTop: 0,
    alignItems: 'center',
  },
  whyChooseUsCardTitle: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#2c3e50',
    fontSize: 20,
    marginBottom: 16,
    lineHeight: 26,
  },
  whyChooseUsCardDescription: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 22,
    marginBottom: 0,
  },
  whyChooseUsCardBadge: {
    backgroundColor: 'rgba(44, 62, 80, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.2)',
  },
  whyChooseUsCardBadgeText: {
    color: '#2c3e50',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  ctaCard: {
    margin: 20,
    borderRadius: 12,
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
    lineHeight: 20,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  ctaButton: {
    flex: 1,
    borderRadius: 8,
  },
  ctaButtonOutlined: {
    flex: 1,
    borderRadius: 8,
  },
});

export default HomeScreen;
