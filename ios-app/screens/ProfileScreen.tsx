import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Avatar, Divider, useTheme, IconButton, Badge } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../src/contexts/AuthContext';

const ProfileScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { user, signOut, isAuthenticated } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings functionality coming soon!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => signOut() },
      ]
    );
  };

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleMenuPress = (menuItem: string) => {
    if (menuItem === 'My Orders') {
      navigation.navigate('Orders');
    } else {
      Alert.alert(menuItem, `${menuItem} functionality coming soon!`);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      {/* Enhanced Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryContainer]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text variant="headlineMedium" style={styles.headerTitle}>
              Profile
            </Text>
            <Text variant="bodyMedium" style={styles.headerSubtitle}>
              Manage your account
            </Text>
          </View>
          <View style={styles.headerRight}>
            <IconButton
              icon="bell"
              size={24}
              iconColor={theme.colors.onPrimary}
              onPress={() => handleMenuPress('Notifications')}
              style={styles.headerIcon}
            />
          </View>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Enhanced Profile Section */}
        <View style={styles.profileSection}>
          <Card style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.profileContent}>
              <View style={styles.avatarContainer}>
                <Avatar.Image 
                  size={100} 
                  source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' }} 
                  style={styles.avatar}
                />
                <TouchableOpacity style={styles.editAvatarButton}>
                  <Ionicons name="camera" size={20} color={theme.colors.onPrimary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileInfo}>
                <Text variant="headlineSmall" style={[styles.name, { color: theme.colors.onSurface }]}>
                  {user ? `${user.first_name} ${user.last_name}` : 'Guest User'}
                </Text>
                <Text variant="bodyMedium" style={[styles.email, { color: theme.colors.onSurfaceVariant }]}>
                  {user?.email || 'No email'}
                </Text>
                {user?.phone && (
                  <View style={styles.phoneContainer}>
                    <Ionicons name="call" size={16} color={theme.colors.primary} />
                    <Text variant="bodyMedium" style={[styles.phone, { color: theme.colors.onSurfaceVariant }]}>
                      {user.phone}
                    </Text>
                  </View>
                )}
                <View style={styles.verificationBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                  <Text variant="bodySmall" style={[styles.verificationText, { color: theme.colors.primary }]}>
                    {isAuthenticated ? 'Verified Account' : 'Not Verified'}
                  </Text>
                </View>
              </View>
            </Card.Content>
            
            <Card.Actions style={styles.profileActions}>
              <Button 
                mode="contained" 
                onPress={handleEditProfile}
                icon="pencil"
                style={styles.editButton}
                contentStyle={styles.buttonContent}
              >
                Edit Profile
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => handleMenuPress('Share Profile')}
                icon="share"
                style={styles.shareButton}
                contentStyle={styles.buttonContent}
              >
                Share
              </Button>
            </Card.Actions>
          </Card>
        </View>

        {/* Enhanced Stats Section */}
        <View style={styles.statsSection}>
          <Card style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.statsContent}>
              <View style={styles.statsHeader}>
                <Text variant="titleMedium" style={[styles.statsTitle, { color: theme.colors.onSurface }]}>
                  Your Activity
                </Text>
                <Text variant="bodySmall" style={[styles.statsSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                  Last 30 days
                </Text>
              </View>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                  </View>
                  <Text variant="headlineMedium" style={[styles.statNumber, { color: theme.colors.primary }]}>
                    12
                  </Text>
                  <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Services Used
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: theme.colors.secondaryContainer }]}>
                    <Ionicons name="star" size={24} color={theme.colors.secondary} />
                  </View>
                  <Text variant="headlineMedium" style={[styles.statNumber, { color: theme.colors.secondary }]}>
                    4.9
                  </Text>
                  <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Rating
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: theme.colors.tertiaryContainer }]}>
                    <Ionicons name="chatbubble" size={24} color={theme.colors.tertiary} />
                  </View>
                  <Text variant="headlineMedium" style={[styles.statNumber, { color: theme.colors.tertiary }]}>
                    8
                  </Text>
                  <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Reviews
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: theme.colors.errorContainer }]}>
                    <Ionicons name="heart" size={24} color={theme.colors.error} />
                  </View>
                  <Text variant="headlineMedium" style={[styles.statNumber, { color: theme.colors.error }]}>
                    5
                  </Text>
                  <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Favorites
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Enhanced Menu Section */}
        <View style={styles.menuSection}>
          <Card style={[styles.menuCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.menuContent}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuPress('Settings')}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
                    <Ionicons name="settings" size={20} color={theme.colors.primary} />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text variant="bodyLarge" style={[styles.menuText, { color: theme.colors.onSurface }]}>
                      Settings
                    </Text>
                    <Text variant="bodySmall" style={[styles.menuSubtext, { color: theme.colors.onSurfaceVariant }]}>
                      App preferences & account settings
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
              
              <Divider style={styles.menuDivider} />
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuPress('Service History')}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.secondaryContainer }]}>
                    <Ionicons name="time" size={20} color={theme.colors.secondary} />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text variant="bodyLarge" style={[styles.menuText, { color: theme.colors.onSurface }]}>
                      Service History
                    </Text>
                    <Text variant="bodySmall" style={[styles.menuSubtext, { color: theme.colors.onSurfaceVariant }]}>
                      View past bookings & services
                    </Text>
                  </View>
                </View>
                <View style={styles.menuItemRight}>
                  <Badge size={20} style={styles.badge}>3</Badge>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
                </View>
              </TouchableOpacity>
              
              <Divider style={styles.menuDivider} />
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuPress('Favorites')}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.errorContainer }]}>
                    <Ionicons name="heart" size={20} color={theme.colors.error} />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text variant="bodyLarge" style={[styles.menuText, { color: theme.colors.onSurface }]}>
                      Favorites
                    </Text>
                    <Text variant="bodySmall" style={[styles.menuSubtext, { color: theme.colors.onSurfaceVariant }]}>
                      Your saved services
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
              
              <Divider style={styles.menuDivider} />
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuPress('Help & Support')}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.tertiaryContainer }]}>
                    <Ionicons name="help-circle" size={20} color={theme.colors.tertiary} />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text variant="bodyLarge" style={[styles.menuText, { color: theme.colors.onSurface }]}>
                      Help & Support
                    </Text>
                    <Text variant="bodySmall" style={[styles.menuSubtext, { color: theme.colors.onSurfaceVariant }]}>
                      Get help & contact support
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </View>

        {/* Enhanced Logout Section */}
        <View style={styles.logoutSection}>
          <Card style={[styles.logoutCard, { backgroundColor: theme.colors.errorContainer }]}>
            <Card.Content style={styles.logoutContent}>
              <Button 
                mode="contained" 
                onPress={handleLogout}
                icon="logout"
                style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
                textColor={theme.colors.onError}
                contentStyle={styles.buttonContent}
              >
                Logout
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
    marginTop: -20,
  },
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    borderWidth: 4,
    borderColor: 'white',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  email: {
    marginBottom: 8,
    textAlign: 'center',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  phone: {
    marginLeft: 8,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verificationText: {
    marginLeft: 6,
    fontWeight: '500',
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
    gap: 12,
  },
  editButton: {
    borderRadius: 12,
  },
  shareButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  statsContent: {
    padding: 24,
  },
  statsHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statsTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  statsSubtitle: {
    opacity: 0.7,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    textAlign: 'center',
    fontSize: 12,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  menuContent: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtext: {
    opacity: 0.7,
    fontSize: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#FF3B30',
  },
  menuDivider: {
    marginHorizontal: 20,
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  logoutCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  logoutText: {
    fontWeight: '500',
  },
  logoutActions: {
    justifyContent: 'center',
    paddingBottom: 20,
  },
  logoutButton: {
    borderRadius: 12,
  },
});

export default ProfileScreen;
