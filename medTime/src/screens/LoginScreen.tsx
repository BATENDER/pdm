
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth, UserRole } from '../context/AuthContext'; // Import useAuth

// Define navigation prop type
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

// Grasshopper-inspired color palette
const COLORS = {
  primaryGreen: '#4CAF50',
  lightGreen: '#C8E6C9',
  darkGreen: '#388E3C',
  textPrimary: '#333333',
  textSecondary: '#757575',
  background: '#E8F5E9',
  white: '#FFFFFF',
  error: '#D32F2F',
};

// Mock credentials for demonstration
const MOCK_CREDENTIALS = {
  user: { username: 'ubuntu_user', password: '123456' },
  caregiver: { username: 'cuidador', password: '123456' },
  admin: { username: 'adm', password: '123456' },
};

const LoginScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // Get login function from context

  const handleLogin = async () => {
    setError(''); // Clear previous errors
    let loggedInRole: UserRole = null;

    // Check credentials against mock data
    if (username === MOCK_CREDENTIALS.user.username && password === MOCK_CREDENTIALS.user.password) {
      loggedInRole = 'user';
    } else if (username === MOCK_CREDENTIALS.caregiver.username && password === MOCK_CREDENTIALS.caregiver.password) {
      loggedInRole = 'caregiver';
    } else if (username === MOCK_CREDENTIALS.admin.username && password === MOCK_CREDENTIALS.admin.password) {
      loggedInRole = 'admin';
    }

    if (loggedInRole) {
      try {
        await login(loggedInRole); // Call context login function
        // Navigation is handled automatically by AppNavigator based on userRole change
      } catch (e) {
        setError('Erro na tentativa de Login. Por favor tente novamente.');
        console.error('Login error:', e);
      }
    } else {
      setError('Username ou senha inválidos.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        // Ensure the path is correct relative to this file
        source={require('../../assets/images/grasshopper_mascot.png')}
        style={styles.mascot}
        resizeMode="contain"
      />
      <Text style={styles.title}>Medication Hopper</Text>
      <Text style={styles.subtitle}>Faça LOGIN para continuar</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Username (ubuntu_user/cuidador/adm)"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor={COLORS.textSecondary}
        accessibilityLabel="Username Input"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha (use '123456')"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={COLORS.textSecondary}
        accessibilityLabel="Password Input"
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Optional: Add info about mock credentials */}
      <Text style={styles.infoText}>Demo users: ubuntu_user, cuidador, adm (password: '123456')</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: COLORS.background,
  },
  mascot: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.darkGreen,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGreen,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 15,
    textAlign: 'center',
  },
  infoText: {
      marginTop: 20,
      fontSize: 12,
      color: COLORS.textSecondary,
      textAlign: 'center',
  }
});

export default LoginScreen;

