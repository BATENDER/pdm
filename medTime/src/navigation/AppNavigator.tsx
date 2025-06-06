
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native'; // Import ActivityIndicator

// Import Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import MedicationListScreen from '../screens/MedicationListScreen';
import ScheduleListScreen from '../screens/ScheduleListScreen';
import AlertScreen from '../screens/AlertScreen';
import HistoryScreen from '../screens/HistoryScreen';

// Import Auth Context & Hook
import { useAuth, UserRole } from '../context/AuthContext';

// Define Param List for type safety
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  MedicationList: undefined;
  ScheduleList: undefined;
  Alert: { 
    medicationId?: string;
    scheduleId?: string; 
    isGentleReminder?: boolean; 
  };
  History: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Define screen options (can be customized)
const screenOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: '#4CAF50', // Example color
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

// Define stacks for different roles
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const UserStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
    <Stack.Screen name="MedicationList" component={MedicationListScreen} options={{ title: 'Medicações' }} />
    <Stack.Screen name="ScheduleList" component={ScheduleListScreen} options={{ title: 'Horários' }} />
    {/* Alert screen might be triggered differently, not directly navigable by user? */}
    {/* <Stack.Screen name="Alert" component={AlertScreen} options={{ title: 'Take Medication' }} /> */}
  </Stack.Navigator>
);

const CaregiverStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
    <Stack.Screen name="MedicationList" component={MedicationListScreen} options={{ title: 'Medicações' }} />
    <Stack.Screen name="ScheduleList" component={ScheduleListScreen} options={{ title: 'Horários' }} />
    <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Histórico' }} />
    {/* Alert screen might be triggered differently */}
    {/* <Stack.Screen name="Alert" component={AlertScreen} options={{ title: 'Take Medication' }} /> */}
  </Stack.Navigator>
);

const AdminStack = () => (
  // Admin has access to all main screens
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Admin Dashboard' }} />
    <Stack.Screen name="MedicationList" component={MedicationListScreen} options={{ title: 'Medicações' }} />
    <Stack.Screen name="ScheduleList" component={ScheduleListScreen} options={{ title: 'Horário' }} />
    <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Histórico' }} />
    {/* Alert screen might be triggered differently */}
    <Stack.Screen name="Alert" component={AlertScreen} options={{ title: 'Tomar a medicação' }} />
    {/* Add any Admin-specific screens here */}
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { userRole, isLoading } = useAuth();

  if (isLoading) {
    // Show a loading screen while checking auth state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userRole === null ? (
        // No user logged in
        <AuthStack />
      ) : userRole === 'user' ? (
        // User role logged in
        <UserStack />
      ) : userRole === 'caregiver' ? (
        // Caregiver role logged in
        <CaregiverStack />
      ) : userRole === 'admin' ? (
        // Admin role logged in
        <AdminStack />
      ) : (
        // Fallback or should not happen
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;

