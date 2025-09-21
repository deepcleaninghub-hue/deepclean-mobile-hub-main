/**
 * Environment Configuration
 * 
 * This file manages environment-specific configuration for the DeepClean Mobile Hub app.
 * It provides a centralized way to handle different settings for development, staging, and production.
 */

export interface EnvironmentConfig {
  API_BASE_URL: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
  SENTRY_DSN?: string;
  CRASHLYTICS_ENABLED: boolean;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  ENABLE_ANALYTICS: boolean;
  ENABLE_CRASH_REPORTING: boolean;
  CACHE_DURATION: number;
  SESSION_TIMEOUT: number;
  TOKEN_REFRESH_INTERVAL: number;
}

// Get environment variables with fallbacks
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return process.env[`EXPO_PUBLIC_${key}`] || defaultValue;
};

const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = getEnvVar(key);
  return value === 'true' || value === '1' || defaultValue;
};

const getNumberEnvVar = (key: string, defaultValue: number): number => {
  const value = getEnvVar(key);
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Environment-specific configurations
const developmentConfig: EnvironmentConfig = {
  API_BASE_URL: getEnvVar('API_BASE_URL', 'http://192.168.29.65:5001/api'),
  ENVIRONMENT: 'development',
  SENTRY_DSN: getEnvVar('SENTRY_DSN'),
  CRASHLYTICS_ENABLED: getBooleanEnvVar('CRASHLYTICS_ENABLED', false),
  LOG_LEVEL: 'debug',
  ENABLE_ANALYTICS: getBooleanEnvVar('ENABLE_ANALYTICS', false),
  ENABLE_CRASH_REPORTING: getBooleanEnvVar('ENABLE_CRASH_REPORTING', false),
  CACHE_DURATION: getNumberEnvVar('CACHE_DURATION', 5 * 60 * 1000), // 5 minutes
  SESSION_TIMEOUT: getNumberEnvVar('SESSION_TIMEOUT', 30 * 60 * 1000), // 30 minutes
  TOKEN_REFRESH_INTERVAL: getNumberEnvVar('TOKEN_REFRESH_INTERVAL', 25 * 60 * 1000), // 25 minutes
};

const stagingConfig: EnvironmentConfig = {
  API_BASE_URL: getEnvVar('API_BASE_URL', 'https://staging-api.deepcleanhub.com/api'),
  ENVIRONMENT: 'staging',
  SENTRY_DSN: getEnvVar('SENTRY_DSN'),
  CRASHLYTICS_ENABLED: getBooleanEnvVar('CRASHLYTICS_ENABLED', true),
  LOG_LEVEL: 'info',
  ENABLE_ANALYTICS: getBooleanEnvVar('ENABLE_ANALYTICS', true),
  ENABLE_CRASH_REPORTING: getBooleanEnvVar('ENABLE_CRASH_REPORTING', true),
  CACHE_DURATION: getNumberEnvVar('CACHE_DURATION', 10 * 60 * 1000), // 10 minutes
  SESSION_TIMEOUT: getNumberEnvVar('SESSION_TIMEOUT', 30 * 60 * 1000), // 30 minutes
  TOKEN_REFRESH_INTERVAL: getNumberEnvVar('TOKEN_REFRESH_INTERVAL', 25 * 60 * 1000), // 25 minutes
};

const productionConfig: EnvironmentConfig = {
  API_BASE_URL: getEnvVar('API_BASE_URL', 'https://api.deepcleanhub.com/api'),
  ENVIRONMENT: 'production',
  SENTRY_DSN: getEnvVar('SENTRY_DSN'),
  CRASHLYTICS_ENABLED: getBooleanEnvVar('CRASHLYTICS_ENABLED', true),
  LOG_LEVEL: 'error',
  ENABLE_ANALYTICS: getBooleanEnvVar('ENABLE_ANALYTICS', true),
  ENABLE_CRASH_REPORTING: getBooleanEnvVar('ENABLE_CRASH_REPORTING', true),
  CACHE_DURATION: getNumberEnvVar('CACHE_DURATION', 15 * 60 * 1000), // 15 minutes
  SESSION_TIMEOUT: getNumberEnvVar('SESSION_TIMEOUT', 30 * 60 * 1000), // 30 minutes
  TOKEN_REFRESH_INTERVAL: getNumberEnvVar('TOKEN_REFRESH_INTERVAL', 25 * 60 * 1000), // 25 minutes
};

// Determine current environment
const getCurrentEnvironment = (): 'development' | 'staging' | 'production' => {
  const env = getEnvVar('ENVIRONMENT', 'development');
  if (env === 'staging' || env === 'production') {
    return env;
  }
  return 'development';
};

// Get configuration based on current environment
const getConfig = (): EnvironmentConfig => {
  const currentEnv = getCurrentEnvironment();
  
  switch (currentEnv) {
    case 'staging':
      return stagingConfig;
    case 'production':
      return productionConfig;
    default:
      return developmentConfig;
  }
};

// Export the configuration
export const config = getConfig();

// Export individual config values for convenience
export const {
  API_BASE_URL,
  ENVIRONMENT,
  SENTRY_DSN,
  CRASHLYTICS_ENABLED,
  LOG_LEVEL,
  ENABLE_ANALYTICS,
  ENABLE_CRASH_REPORTING,
  CACHE_DURATION,
  SESSION_TIMEOUT,
  TOKEN_REFRESH_INTERVAL,
} = config;

// Utility functions
export const isDevelopment = (): boolean => ENVIRONMENT === 'development';
export const isStaging = (): boolean => ENVIRONMENT === 'staging';
export const isProduction = (): boolean => ENVIRONMENT === 'production';

export const shouldLog = (level: 'debug' | 'info' | 'warn' | 'error'): boolean => {
  const levels = ['debug', 'info', 'warn', 'error'];
  const currentLevelIndex = levels.indexOf(LOG_LEVEL);
  const requestedLevelIndex = levels.indexOf(level);
  return requestedLevelIndex >= currentLevelIndex;
};

// Log configuration on startup (only in development)
if (isDevelopment()) {
  console.log('🔧 Environment Configuration:', {
    environment: ENVIRONMENT,
    apiBaseUrl: API_BASE_URL,
    logLevel: LOG_LEVEL,
    analyticsEnabled: ENABLE_ANALYTICS,
    crashReportingEnabled: ENABLE_CRASH_REPORTING,
  });
}
