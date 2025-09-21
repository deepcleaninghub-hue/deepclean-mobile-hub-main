import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  useTheme,
  Surface,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { validationSchemas, validateInput } from '../utils/validation';

const SignUpScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { signUp, loading } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleSignUp = async () => {
    // Reset errors
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // SECURITY FIX: Use comprehensive validation
    const formData = {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
    };

    const validation = validateInput.form(validationSchemas.userRegistration, formData);
    
    if (!validation.success) {
      // Set individual field errors
      if (validation.errors) {
        setFirstNameError(validation.errors.firstName || '');
        setLastNameError(validation.errors.lastName || '');
        setEmailError(validation.errors.email || '');
        setPhoneError(validation.errors.phone || '');
        setPasswordError(validation.errors.password || '');
        setConfirmPasswordError(validation.errors.confirmPassword || '');
      }
      return;
    }

    // Attempt sign up with validated data
    const success = await signUp(
      validation.data!.email,
      validation.data!.password,
      validation.data!.firstName,
      validation.data!.lastName,
      validation.data!.phone || undefined
    );

    if (success) {
      // Navigation will be handled by the auth context
      console.log('Sign up successful');
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="person-add" size={60} color={theme.colors.primary} />
            </View>
            <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
              Create Account
            </Text>
            <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Join Deep Cleaning Hub and get started
            </Text>
          </View>

          {/* Sign Up Form */}
          <Surface style={[styles.formCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
            <View style={styles.formContainer}>
              {/* First Name & Last Name */}
              <View style={styles.rowContainer}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <TextInput
                    label="First Name"
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                      if (firstNameError) setFirstNameError('');
                    }}
                    mode="outlined"
                    autoCapitalize="words"
                    error={!!firstNameError}
                    style={styles.input}
                  />
                  {firstNameError ? (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>
                      {firstNameError}
                    </Text>
                  ) : null}
                </View>

                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <TextInput
                    label="Last Name"
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                      if (lastNameError) setLastNameError('');
                    }}
                    mode="outlined"
                    autoCapitalize="words"
                    error={!!lastNameError}
                    style={styles.input}
                  />
                  {lastNameError ? (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>
                      {lastNameError}
                    </Text>
                  ) : null}
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
                  }}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  error={!!emailError}
                  left={<TextInput.Icon icon="email" />}
                  style={styles.input}
                />
                {emailError ? (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {emailError}
                  </Text>
                ) : null}
              </View>

              {/* Phone Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Phone (Optional)"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (phoneError) setPhoneError('');
                  }}
                  mode="outlined"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  error={!!phoneError}
                  left={<TextInput.Icon icon="call" />}
                  style={styles.input}
                />
                {phoneError ? (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {phoneError}
                  </Text>
                ) : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  autoComplete="password-new"
                  error={!!passwordError}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  style={styles.input}
                />
                {passwordError ? (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {passwordError}
                  </Text>
                ) : null}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (confirmPasswordError) setConfirmPasswordError('');
                  }}
                  mode="outlined"
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="password-new"
                  error={!!confirmPasswordError}
                  left={<TextInput.Icon icon="lock-check" />}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? "eye-off" : "eye"}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  }
                  style={styles.input}
                />
                {confirmPasswordError ? (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {confirmPasswordError}
                  </Text>
                ) : null}
              </View>

              {/* Sign Up Button */}
              <Button
                mode="contained"
                onPress={handleSignUp}
                loading={loading}
                disabled={loading}
                style={styles.signUpButton}
                contentStyle={styles.buttonContent}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Already have an account?{' '}
                </Text>
                <Button
                  mode="text"
                  onPress={handleLogin}
                  style={styles.loginButton}
                  labelStyle={{ color: theme.colors.primary }}
                >
                  Sign In
                </Button>
              </View>
            </View>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  formCard: {
    borderRadius: 16,
  },
  formContainer: {
    padding: 24,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  signUpButton: {
    borderRadius: 8,
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginButton: {
    marginLeft: -8,
  },
});

export default SignUpScreen;
