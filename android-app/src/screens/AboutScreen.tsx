import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { Text, Card, Button, Avatar, useTheme, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AboutScreen = () => {
  const theme = useTheme();

  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      description: '10+ years in professional cleaning services',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Operations Manager',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      description: 'Expert in quality control and customer satisfaction',
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Customer Relations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      description: 'Dedicated to ensuring exceptional service delivery',
    },
  ];

  const stats = [
    { number: '500+', label: 'Happy Customers' },
    { number: '50+', label: 'Team Members' },
    { number: '5+', label: 'Years Experience' },
    { number: '24/7', label: 'Support Available' },
  ];

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={[theme.colors.primaryContainer, theme.colors.surface]}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Text variant="displaySmall" style={[styles.heroTitle, { color: theme.colors.onSurface }]}>
              About Deep Clean Hub
            </Text>
            <Text variant="bodyLarge" style={[styles.heroDescription, { color: theme.colors.onSurfaceVariant }]}>
              We are passionate about creating clean, healthy, and beautiful spaces for our valued customers.
            </Text>
          </View>
        </LinearGradient>

        {/* Company Story */}
        <Card style={[styles.storyCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.storyContent}>
            <Text variant="headlineSmall" style={[styles.storyTitle, { color: theme.colors.onSurface }]}>
              Our Story
            </Text>
            <Text variant="bodyMedium" style={[styles.storyText, { color: theme.colors.onSurfaceVariant }]}>
              Founded in 2019, Deep Clean Hub began with a simple mission: to provide exceptional cleaning services that transform spaces and improve lives. What started as a small local business has grown into a trusted name in professional cleaning across Germany.
            </Text>
            <Text variant="bodyMedium" style={[styles.storyText, { color: theme.colors.onSurfaceVariant }]}>
              Our commitment to quality, reliability, and customer satisfaction has earned us the trust of hundreds of families and businesses. We believe that a clean environment is essential for health, productivity, and overall well-being.
            </Text>
          </Card.Content>
        </Card>

        {/* Mission & Values */}
        <Card style={[styles.missionCard, { backgroundColor: theme.colors.secondaryContainer }]}>
          <Card.Content style={styles.missionContent}>
            <Text variant="headlineSmall" style={[styles.missionTitle, { color: theme.colors.onSurface }]}>
              Our Mission & Values
            </Text>
            
            <View style={styles.valueItem}>
              <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} />
              <View style={styles.valueText}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                  Quality First
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  We never compromise on the quality of our services and products.
                </Text>
              </View>
            </View>

            <View style={styles.valueItem}>
              <Ionicons name="heart" size={24} color={theme.colors.primary} />
              <View style={styles.valueText}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                  Customer Focus
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Your satisfaction is our top priority in everything we do.
                </Text>
              </View>
            </View>

            <View style={styles.valueItem}>
              <Ionicons name="leaf" size={24} color={theme.colors.primary} />
              <View style={styles.valueText}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                  Eco-Friendly
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  We use environmentally safe cleaning products and methods.
                </Text>
              </View>
            </View>

            <View style={styles.valueItem}>
              <Ionicons name="time" size={24} color={theme.colors.primary} />
              <View style={styles.valueText}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                  Reliability
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  We value your time and always arrive when promised.
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Statistics */}
        <View style={styles.statsSection}>
          <Text variant="headlineSmall" style={[styles.statsTitle, { color: theme.colors.onSurface }]}>
            Our Numbers
          </Text>
          <View style={styles.statsGrid}>
            {(stats || []).map((stat, index) => (
              <Card key={index} style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                <Card.Content style={styles.statContent}>
                  <Text variant="displaySmall" style={[styles.statNumber, { color: theme.colors.primary }]}>
                    {stat.number}
                  </Text>
                  <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                    {stat.label}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>

        {/* Team Section */}
        <Card style={[styles.teamCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.teamContent}>
            <Text variant="headlineSmall" style={[styles.teamTitle, { color: theme.colors.onSurface }]}>
              Meet Our Team
            </Text>
            <Text variant="bodyMedium" style={[styles.teamDescription, { color: theme.colors.onSurfaceVariant }]}>
              Our dedicated team of professionals is committed to delivering exceptional service and exceeding your expectations.
            </Text>
            
            {(teamMembers || []).map((member) => (
              <View key={member.id} style={styles.memberItem}>
                <Avatar.Image size={60} source={{ uri: member.image }} />
                <View style={styles.memberInfo}>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                    {member.name}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.primary, marginBottom: 4 }}>
                    {member.role}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {member.description}
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Call to Action */}
        <Card style={[styles.ctaCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content style={styles.ctaContent}>
            <Text variant="titleLarge" style={[styles.ctaTitle, { color: theme.colors.onPrimary }]}>
              Ready to Get Started?
            </Text>
            <Text variant="bodyMedium" style={[styles.ctaDescription, { color: theme.colors.onPrimary }]}>
              Contact us today for a free consultation and quote. Let us help you create a cleaner, healthier environment.
            </Text>
            <View style={styles.ctaButtons}>
              <Button
                mode="contained"
                onPress={handleCallNow}
                style={[styles.ctaButton, { backgroundColor: theme.colors.onPrimary }]}
                textColor={theme.colors.primary}
                contentStyle={styles.buttonContent}
                icon={({ size, color }) => (
                  <Ionicons name="call" size={size} color={color} />
                )}
              >
                Call Now
              </Button>
              <Button
                mode="outlined"
                onPress={handleEmailUs}
                style={[styles.ctaButtonOutlined, { borderColor: theme.colors.onPrimary }]}
                textColor={theme.colors.onPrimary}
                contentStyle={styles.buttonContent}
                icon={({ size, color }) => (
                  <Ionicons name="mail" size={size} color={color} />
                )}
              >
                Email Us
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
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 400,
    alignSelf: 'center',
  },
  heroTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  heroDescription: {
    textAlign: 'center',
    lineHeight: 24,
  },
  storyCard: {
    margin: 20,
    borderRadius: 16,
    elevation: 3,
  },
  storyContent: {
    padding: 24,
  },
  storyTitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  storyText: {
    marginBottom: 16,
    lineHeight: 22,
  },
  missionCard: {
    margin: 20,
    borderRadius: 16,
  },
  missionContent: {
    padding: 24,
  },
  missionTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  valueText: {
    flex: 1,
    marginLeft: 16,
  },
  statsSection: {
    padding: 20,
  },
  statsTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    padding: 20,
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    textAlign: 'center',
    lineHeight: 18,
  },
  teamCard: {
    margin: 20,
    borderRadius: 16,
    elevation: 3,
  },
  teamContent: {
    padding: 24,
  },
  teamTitle: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  teamDescription: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  memberInfo: {
    flex: 1,
    marginLeft: 16,
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
  ctaButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  ctaButton: {
    borderRadius: 8,
  },
  ctaButtonOutlined: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default AboutScreen;
