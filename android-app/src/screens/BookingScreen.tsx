import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Text, Card, Button, TextInput, useTheme, Divider, Chip, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { orderAPI } from '../services/orderAPI';
import { bookingAPI } from '../services/bookingAPI';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  features: string[];
}

interface TimeSlot {
  time: string;
  available: boolean;
  serviceProvider?: {
    id: string;
    name: string;
    rating: number;
  };
}

interface ServiceProvider {
  id: string;
  name: string;
  photo?: string;
  rating: number;
  completedJobs: number;
  specialties: string[];
  bio: string;
  phone: string;
}

const BookingScreen = ({ navigation, route }: any) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { cartItems, cartSummary } = useCart();
  const { service } = route.params || {};
  
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [address, setAddress] = useState({
    street_address: '',
    city: '',
    postal_code: '',
    country: 'Germany',
    additional_notes: ''
  });

  useEffect(() => {
    if (service) {
      loadTimeSlots();
      loadServiceProviders();
    }
  }, [service, selectedDate]);

  const loadTimeSlots = async () => {
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const slots = await bookingAPI.getAvailableTimeSlots(dateString, service?.id);
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error loading time slots:', error);
    }
  };

  const loadServiceProviders = async () => {
    try {
      const providers = await bookingAPI.getServiceProviders(service?.id);
      setServiceProviders(providers);
    } catch (error) {
      console.error('Error loading service providers:', error);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setSelectedTime('');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
  };

  const validateForm = () => {
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time slot');
      return false;
    }
    if (!selectedProvider) {
      Alert.alert('Error', 'Please select a service provider');
      return false;
    }
    if (!address.street_address.trim()) {
      Alert.alert('Error', 'Please enter your street address');
      return false;
    }
    if (!address.city.trim()) {
      Alert.alert('Error', 'Please enter your city');
      return false;
    }
    if (!address.postal_code.trim()) {
      Alert.alert('Error', 'Please enter your postal code');
      return false;
    }
    return true;
  };

  const handleBookService = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const bookingData = {
        user_id: user?.id,
        service_id: service?.id,
        service_date: selectedDate.toISOString().split('T')[0],
        service_time: selectedTime,
        service_provider_id: selectedProvider,
        address: address,
        special_instructions: specialInstructions,
        total_amount: service?.price || cartSummary.totalPrice
      };

      const booking = await bookingAPI.createBooking(bookingData);
      
      if (booking) {
        Alert.alert(
          'Booking Confirmed!',
          'Your service has been booked successfully. You will receive a confirmation email shortly.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('OrderDetails', { order: booking })
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error booking service:', error);
      Alert.alert('Error', 'Failed to book service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getAvailableTimeSlots = () => {
    return timeSlots.filter(slot => slot.available);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      
      <ScrollView style={styles.scrollView}>
        {/* Service Information */}
        {service && (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Service Details
              </Text>
              <Divider style={styles.divider} />
              
              <View style={styles.serviceInfo}>
                <Text variant="titleMedium" style={[styles.serviceTitle, { color: theme.colors.onSurface }]}>
                  {service.title}
                </Text>
                <Text variant="bodyMedium" style={[styles.serviceDescription, { color: theme.colors.onSurfaceVariant }]}>
                  {service.description}
                </Text>
                <View style={styles.serviceDetails}>
                  <Chip mode="outlined" style={styles.serviceChip}>
                    {service.duration}
                  </Chip>
                  <Chip mode="outlined" style={styles.serviceChip}>
                    €{service.price}
                  </Chip>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Date Selection */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Select Date
            </Text>
            <Divider style={styles.divider} />
            
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
              icon="calendar"
            >
              {formatDate(selectedDate)}
            </Button>
            
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
                maximumDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
              />
            )}
          </Card.Content>
        </Card>

        {/* Time Selection */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Select Time
            </Text>
            <Divider style={styles.divider} />
            
            <View style={styles.timeSlotsContainer}>
              {getAvailableTimeSlots().map((slot, index) => (
                <Button
                  key={index}
                  mode={selectedTime === slot.time ? "contained" : "outlined"}
                  onPress={() => handleTimeSelect(slot.time)}
                  style={[
                    styles.timeSlotButton,
                    selectedTime === slot.time && { backgroundColor: theme.colors.primary }
                  ]}
                  textColor={selectedTime === slot.time ? theme.colors.onPrimary : theme.colors.primary}
                >
                  {formatTime(slot.time)}
                </Button>
              ))}
            </View>
            
            {getAvailableTimeSlots().length === 0 && (
              <Text variant="bodyMedium" style={[styles.noSlotsText, { color: theme.colors.onSurfaceVariant }]}>
                No available time slots for this date. Please select another date.
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Service Provider Selection */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Choose Service Provider
            </Text>
            <Divider style={styles.divider} />
            
            {serviceProviders.map((provider) => (
              <Card
                key={provider.id}
                style={[
                  styles.providerCard,
                  { backgroundColor: theme.colors.surfaceVariant },
                  selectedProvider === provider.id && { borderColor: theme.colors.primary, borderWidth: 2 }
                ]}
                onPress={() => handleProviderSelect(provider.id)}
              >
                <Card.Content>
                  <View style={styles.providerInfo}>
                    <View style={styles.providerDetails}>
                      <Text variant="titleMedium" style={[styles.providerName, { color: theme.colors.onSurface }]}>
                        {provider.name}
                      </Text>
                      <View style={styles.providerStats}>
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={16} color="#FFD700" />
                          <Text variant="bodySmall" style={[styles.rating, { color: theme.colors.onSurfaceVariant }]}>
                            {provider.rating.toFixed(1)}
                          </Text>
                        </View>
                        <Text variant="bodySmall" style={[styles.completedJobs, { color: theme.colors.onSurfaceVariant }]}>
                          {provider.completedJobs} jobs completed
                        </Text>
                      </View>
                      <Text variant="bodySmall" style={[styles.providerBio, { color: theme.colors.onSurfaceVariant }]}>
                        {provider.bio}
                      </Text>
                      <View style={styles.specialties}>
                        {provider.specialties.map((specialty, index) => (
                          <Chip key={index} mode="flat" style={styles.specialtyChip}>
                            {specialty}
                          </Chip>
                        ))}
                      </View>
                    </View>
                    <RadioButton
                      value={provider.id}
                      status={selectedProvider === provider.id ? 'checked' : 'unchecked'}
                      onPress={() => handleProviderSelect(provider.id)}
                    />
                  </View>
                </Card.Content>
              </Card>
            ))}
          </Card.Content>
        </Card>

        {/* Address Form */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Service Address
            </Text>
            <Divider style={styles.divider} />
            
            <TextInput
              label="Street Address"
              value={address.street_address}
              onChangeText={(text) => setAddress({...address, street_address: text})}
              mode="outlined"
              style={styles.input}
            />
            
            <View style={styles.addressRow}>
              <TextInput
                label="City"
                value={address.city}
                onChangeText={(text) => setAddress({...address, city: text})}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
              />
              <TextInput
                label="Postal Code"
                value={address.postal_code}
                onChangeText={(text) => setAddress({...address, postal_code: text})}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
              />
            </View>
            
            <TextInput
              label="Country"
              value={address.country}
              onChangeText={(text) => setAddress({...address, country: text})}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Additional Notes (Optional)"
              value={address.additional_notes}
              onChangeText={(text) => setAddress({...address, additional_notes: text})}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {/* Special Instructions */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Special Instructions
            </Text>
            <Divider style={styles.divider} />
            
            <TextInput
              label="Any special requests or instructions"
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {/* Book Service Button */}
        <Button
          mode="contained"
          onPress={handleBookService}
          loading={loading}
          disabled={loading || !selectedTime || !selectedProvider}
          style={[styles.bookButton, { backgroundColor: theme.colors.primary }]}
          contentStyle={styles.buttonContent}
        >
          {loading ? 'Booking...' : `Book Service - €${service?.price || cartSummary.totalPrice}`}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  serviceInfo: {
    marginBottom: 8,
  },
  serviceTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  serviceDescription: {
    marginBottom: 12,
    lineHeight: 20,
  },
  serviceDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  serviceChip: {
    borderRadius: 16,
  },
  dateButton: {
    borderRadius: 8,
    marginTop: 8,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  timeSlotButton: {
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  noSlotsText: {
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  providerCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  providerDetails: {
    flex: 1,
    marginRight: 12,
  },
  providerName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  providerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  rating: {
    marginLeft: 4,
  },
  completedJobs: {
    fontSize: 12,
  },
  providerBio: {
    marginBottom: 8,
    lineHeight: 16,
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  specialtyChip: {
    borderRadius: 12,
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    marginBottom: 12,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  bookButton: {
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 32,
  },
  buttonContent: {
    paddingVertical: 12,
  },
});

export default BookingScreen;
