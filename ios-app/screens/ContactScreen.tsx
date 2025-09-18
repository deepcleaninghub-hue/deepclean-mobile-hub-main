import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, TextInput, Button, Card, useTheme, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactScreen = () => {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: '',
      message: '',
    },
  });

  const services = [
    'Kitchen Deep Cleaning',
    'House Moving',
    'Deep Cleaning',
    'Furniture Assembly',
    'Carpet & Upholstery Cleaning',
    'Window & Glass Cleaning',
    'Custom Service',
  ];

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Success!',
        'Thank you for your message. We will get back to you within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => reset(),
          },
        ]
      );
    }, 2000);
  };

  const handleCallNow = () => {
    Linking.openURL('tel:+4916097044182').catch(() => {
      Alert.alert('Error', 'Could not open phone app');
    });
  };

  const handleEmailUs = () => {
    Linking.openURL('mailto:info@deepcleaninghub.com').catch(() => {
      Alert.alert('Error', 'Could not open email app');
    });
  };

  const handleWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=4916097044182&text=Hi, I would like to know more about your cleaning services.').catch(() => {
      Alert.alert('Error', 'Could not open WhatsApp');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text variant="headlineMedium" style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
              Get in Touch
            </Text>
            <Text variant="bodyLarge" style={[styles.headerDescription, { color: theme.colors.onSurfaceVariant }]}>
              Ready to transform your space? Contact us for a free consultation and quote.
            </Text>
          </View>

          {/* Contact Form */}
          <Card style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.formContent}>
              <Text variant="titleLarge" style={[styles.formTitle, { color: theme.colors.onSurface }]}>
                Send us a Message
              </Text>
              
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Full Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    style={styles.input}
                    error={!!errors.name}
                    left={<TextInput.Icon icon="account" />}
                  />
                )}
              />
              {errors.name && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.name.message}
                </Text>
              )}

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Email Address"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    style={styles.input}
                    error={!!errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="email" />}
                  />
                )}
              />
              {errors.email && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.email.message}
                </Text>
              )}

              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Phone Number"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    style={styles.input}
                    error={!!errors.phone}
                    keyboardType="phone-pad"
                    left={<TextInput.Icon icon="phone" />}
                  />
                )}
              />
              {errors.phone && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.phone.message}
                </Text>
              )}

              <Controller
                control={control}
                name="service"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Service Required"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    style={styles.input}
                    error={!!errors.service}
                    left={<TextInput.Icon icon="briefcase" />}
                    right={
                      <TextInput.Icon 
                        icon="chevron-down" 
                        onPress={() => {
                          // Show service picker
                          Alert.alert(
                            'Select Service',
                            'Choose a service:',
                            (services || []).map(service => ({
                              text: service,
                              onPress: () => onChange(service),
                            }))
                          );
                        }}
                      />
                    }
                  />
                )}
              />
              {errors.service && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.service.message}
                </Text>
              )}

              <Controller
                control={control}
                name="message"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Message"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    style={styles.input}
                    error={!!errors.message}
                    multiline
                    numberOfLines={4}
                    left={<TextInput.Icon icon="message" />}
                  />
                )}
              />
              {errors.message && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.message.message}
                </Text>
              )}

              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
                contentStyle={styles.buttonContent}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Send Message
              </Button>
            </Card.Content>
          </Card>

          {/* Contact Information */}
          <Card style={[styles.infoCard, { backgroundColor: theme.colors.primaryContainer }]}>
            <Card.Content style={styles.infoContent}>
              <Text variant="titleLarge" style={[styles.infoTitle, { color: theme.colors.onPrimary }]}>
                Contact Information
              </Text>
              
              <View style={styles.contactItem}>
                <Ionicons name="call" size={24} color={theme.colors.onPrimary} />
                <View style={styles.contactText}>
                  <Text variant="titleMedium" style={{ color: theme.colors.onPrimary, fontWeight: '600' }}>
                    Phone
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onPrimary }}>
                    +49-16097044182
                  </Text>
                </View>
                <Button
                  mode="contained"
                  onPress={handleCallNow}
                  style={[styles.actionButton, { backgroundColor: theme.colors.onPrimary }]}
                  contentStyle={styles.buttonContent}
                  textColor={theme.colors.primary}
                  compact
                >
                  Call Now
                </Button>
              </View>

              <Divider style={[styles.divider, { backgroundColor: theme.colors.onPrimary }]} />

              <View style={styles.contactItem}>
                <Ionicons name="mail" size={24} color={theme.colors.onPrimary} />
                <View style={styles.contactText}>
                  <Text variant="titleMedium" style={{ color: theme.colors.onPrimary, fontWeight: '600' }}>
                    Email
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onPrimary }}>
                    info@deepcleaninghub.com
                  </Text>
                </View>
                <Button
                  mode="contained"
                  onPress={handleEmailUs}
                  style={[styles.actionButton, { backgroundColor: theme.colors.onPrimary }]}
                  contentStyle={styles.buttonContent}
                  textColor={theme.colors.primary}
                  compact
                >
                  Email
                </Button>
              </View>

              <Divider style={[styles.divider, { backgroundColor: theme.colors.onPrimary }]} />

              <View style={styles.contactItem}>
                <Ionicons name="logo-whatsapp" size={24} color={theme.colors.onPrimary} />
                <View style={styles.contactText}>
                  <Text variant="titleMedium" style={{ color: theme.colors.onPrimary, fontWeight: '600' }}>
                    WhatsApp
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onPrimary }}>
                    Quick messaging
                  </Text>
                </View>
                <Button
                  mode="contained"
                  onPress={handleWhatsApp}
                  style={[styles.actionButton, { backgroundColor: theme.colors.onPrimary }]}
                  contentStyle={styles.buttonContent}
                  textColor={theme.colors.primary}
                  compact
                >
                  WhatsApp
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoidingView: {
    flex: 1,
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
  formCard: {
    margin: 20,
    borderRadius: 16,
    elevation: 3,
  },
  formContent: {
    padding: 24,
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 12,
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  infoCard: {
    margin: 20,
    borderRadius: 16,
  },
  infoContent: {
    padding: 24,
  },
  infoTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactText: {
    flex: 1,
    marginLeft: 16,
  },
  actionButton: {
    borderRadius: 6,
  },
  divider: {
    marginVertical: 16,
    opacity: 0.3,
  },
});

export default ContactScreen;
