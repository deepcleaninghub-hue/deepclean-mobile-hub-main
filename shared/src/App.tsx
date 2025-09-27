/**
 * Main App Component
 * 
 * The root component of the DeepClean Mobile Hub app with proper
 * provider setup and error boundary.
 */

<<<<<<< HEAD
import React from 'react';
=======
import React, { useEffect } from 'react';
>>>>>>> refs/remotes/origin/main
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { theme } from './utils/theme';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ErrorBoundary from './components/Base/ErrorBoundary';
import { MainNavigator } from './navigation/MainNavigator';
<<<<<<< HEAD
=======
import { NotificationProvider } from './components/NotificationProvider';
>>>>>>> refs/remotes/origin/main

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <AuthProvider>
              <CartProvider>
<<<<<<< HEAD
                <NavigationContainer>
                  <StatusBar style="auto" />
                  <MainNavigator />
                </NavigationContainer>
=======
                <NotificationProvider>
                  <NavigationContainer>
                    <StatusBar style="auto" />
                    <MainNavigator />
                  </NavigationContainer>
                </NotificationProvider>
>>>>>>> refs/remotes/origin/main
              </CartProvider>
            </AuthProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
