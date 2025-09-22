import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface Props { title?: string }

const AppHeader: React.FC<Props> = ({ title }) => {
  const theme = useTheme();

  return (
    <View style={[styles.customHeader, { backgroundColor: theme.colors.surface }]}>
      {title ? (
        <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
          {title}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  customHeader: {
    height: 56,
    borderBottomWidth: 0,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default AppHeader;
