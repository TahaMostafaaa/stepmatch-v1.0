/**
 * Error Boundary Component
 * 
 * Catches React component errors and displays a fallback UI
 * Prevents white screen crashes by gracefully handling errors
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    // Reset error state to allow retry
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              We're sorry, but something unexpected happened. Please try reloading the app.
            </Text>
            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>Error Details (Dev Mode):</Text>
                <Text style={styles.errorText}>{this.state.error.toString()}</Text>
                {this.state.errorInfo && (
                  <Text style={styles.errorStack}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}
            <TouchableOpacity
              style={styles.reloadButton}
              onPress={this.handleReload}
            >
              <Text style={styles.reloadButtonText}>Reload App</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    ...FONTS.h3,
    color: COLORS.title,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    ...FONTS.font,
    color: COLORS.text,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorDetails: {
    width: '100%',
    backgroundColor: COLORS.light,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    maxHeight: 200,
  },
  errorTitle: {
    ...FONTS.fontSm,
    ...FONTS.fontBold,
    color: COLORS.danger,
    marginBottom: 8,
  },
  errorText: {
    ...FONTS.fontXs,
    color: COLORS.danger,
    marginBottom: 8,
  },
  errorStack: {
    ...FONTS.fontXs,
    color: COLORS.text,
    fontFamily: 'monospace',
  },
  reloadButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 150,
  },
  reloadButtonText: {
    ...FONTS.fontBold,
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default ErrorBoundary;

