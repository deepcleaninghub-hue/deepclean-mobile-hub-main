import React, { Component, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to crash reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // In production, you would send this to a crash reporting service
    // Example: crashlytics().recordError(error);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback onRetry={this.handleRetry} error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  onRetry: () => void;
  error?: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ onRetry, error }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardContent}>
            <Text variant="displaySmall" style={[styles.title, { color: theme.colors.error }]}>
              Oops! Something went wrong
            </Text>
            
            <Text variant="bodyLarge" style={[styles.message, { color: theme.colors.onSurface }]}>
              We're sorry, but something unexpected happened. Please try again.
            </Text>

            {__DEV__ && error && (
              <View style={[styles.errorDetails, { backgroundColor: theme.colors.errorContainer }]}>
                <Text variant="labelMedium" style={[styles.errorTitle, { color: theme.colors.onErrorContainer }]}>
                  Error Details (Development Only):
                </Text>
                <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.onErrorContainer }]}>
                  {error.message}
                </Text>
                {error.stack && (
                  <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.onErrorContainer }]}>
                    {error.stack}
                  </Text>
                )}
              </View>
            )}

            <Button
              mode="contained"
              onPress={onRetry}
              style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={styles.buttonContent}
            >
              Try Again
            </Button>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  cardContent: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorDetails: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  errorTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 16,
  },
  retryButton: {
    marginTop: 16,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
});

export default ErrorBoundary;
