import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // Import the param list

// Define navigation prop type for this screen
type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

type Props = {
  navigation: SplashScreenNavigationProp;
};

// Grasshopper-inspired color palette
const COLORS = {
  primaryGreen: '#4CAF50', // Vibrant green
  lightGreen: '#C8E6C9',
  darkGreen: '#388E3C',
  textPrimary: '#333333',
  textSecondary: '#757575',
  background: '#E8F5E9', // Very light green background
};

const SplashScreen = ({ navigation }: Props) => {

  useEffect(() => {
    // Simulate loading time and navigate to Login
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Use replace to prevent going back to splash
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        // Use require for static assets in React Native/Expo
        source={require('../../assets/images/grasshopper_mascot.png')} // Correct path relative to this file
        style={styles.mascot}
        resizeMode="contain"
      />
      <Text style={styles.title}>Medication Hopper</Text>
      <Text style={styles.subtitle}>Seu despertador amigável de medicação</Text>
      <ActivityIndicator size="large" color={COLORS.darkGreen} style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  mascot: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.darkGreen,
    marginBottom: 10,
    // Consider adding a playful font if available/installed
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;

