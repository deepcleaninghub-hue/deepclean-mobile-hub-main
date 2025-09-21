import 'react-native-gesture-handler/jestSetup';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const Svg = () => 'Svg';
  const Path = () => 'Path';
  const Circle = () => 'Circle';
  const Rect = () => 'Rect';
  return { Svg, Path, Circle, Rect };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo modules
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    Provider: ({ children }: any) => children,
    PaperProvider: ({ children }: any) => children,
    useTheme: () => ({
      colors: {
        primary: '#007AFF',
        onSurface: '#000000',
        onSurfaceVariant: '#666666',
        surface: '#FFFFFF',
        error: '#FF3B30',
      },
    }),
    Text: Text,
    Button: TouchableOpacity,
    Card: View,
    CardContent: View,
    TextInput: Text,
    ActivityIndicator: View,
  };
});

// Global mocks
global.__DEV__ = true;
