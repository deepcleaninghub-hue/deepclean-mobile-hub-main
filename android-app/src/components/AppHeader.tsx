import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

interface AppHeaderProps {
  onCartPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onCartPress }) => {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const handleCartPress = () => {
    if (onCartPress) {
      onCartPress();
    } else {
      navigation.navigate('Cart');
    }
  };

  return (
    <View style={[styles.customHeader, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.logoContainer}>
        <View style={[styles.logoIcon, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.logoText}>🧹</Text>
        </View>
      </View>
      <View style={styles.cartContainer}>
        <IconButton
          icon="cart"
          size={24}
          iconColor={theme.colors.primary}
          onPress={handleCartPress}
          style={styles.cartButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
  },
  cartContainer: {
    alignItems: 'flex-end',
  },
  cartButton: {
    margin: 0,
  },
});

export default AppHeader;
