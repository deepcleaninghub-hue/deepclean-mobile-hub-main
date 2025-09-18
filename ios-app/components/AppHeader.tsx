import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const AppHeader: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={[styles.customHeader, { backgroundColor: theme.colors.surface }]}>
      {/* Simple clean header - no logo, cart, or back button */}
    </View>
  );
};

const styles = StyleSheet.create({
  customHeader: {
    height: 0, // Minimal height since we're removing all content
    borderBottomWidth: 0,
  },
});

export default AppHeader;
