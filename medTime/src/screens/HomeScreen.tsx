
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'; // Added Alert
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext'; // Import useAuth

// Define navigation prop type
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
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
  accentBlue: '#2196F3',
  logoutRed: '#D32F2F', // Color for logout button
};

const HomeScreen = ({ navigation }: Props) => {
  const { userRole, logout } = useAuth(); // Get userRole and logout function

  // Determine welcome message based on role
  const getWelcomeMessage = () => {
    switch (userRole) {
      case 'user':
        return 'Boas-vindas, Ubuntu User!';
      case 'caregiver':
        return 'Boas-vindas, Cuidador!';
      case 'admin':
        return 'Boas-vindas, ADM!';
      default:
        return 'Boas-vindas!';
    }
  };

  // TODO: Fetch actual next medication reminder
  const nextMedication = 'Dipirona às 8:00';

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation back to Login is handled by AppNavigator automatically
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Erro", "Não foi possível realizar o Logout. Por favor tente novamente.");
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeTitle}>{getWelcomeMessage()}</Text>
        <Image
          source={require('../../assets/images/grasshopper_mascot.png')}
          style={styles.mascot}
          resizeMode="contain"
        />
      </View>

      <View style={styles.nextReminderCard}>
        <Text style={styles.cardTitle}>Próximo Lembrete</Text>
        <Text style={styles.cardText}>{nextMedication || 'No upcoming reminders.'}</Text>
      </View>

      <View style={styles.buttonGrid}>
        {/* Conditional rendering of buttons based on role can be added here if needed */}
        <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('MedicationList')}>
          <Text style={styles.buttonText}>💊 Medicações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('ScheduleList')}>
          <Text style={styles.buttonText}>📅 Horários</Text>
        </TouchableOpacity>
        {(userRole === 'caregiver' || userRole === 'admin') && (
          <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('History')}>
            <Text style={styles.buttonText}>📜 Histórico</Text>
          </TouchableOpacity>
        )}
        {/* Add other role-specific buttons here */}
        {/* Example: Admin might have a User Management button */}

        {/* Test Alert Button (Consider removing or hiding based on role) */}
        {userRole === 'admin' && (
            <TouchableOpacity style={[styles.gridButton, styles.testButton]} onPress={() => navigation.navigate('Alert', { scheduleId: 'mock-sch-id' })}> 
              <Text style={styles.buttonText}>🔔 Alerta</Text>
            </TouchableOpacity>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 100, // Add padding at the bottom for logout button
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.darkGreen,
    flex: 1,
  },
  mascot: {
    width: 60,
    height: 60,
    marginLeft: 10,
  },
  nextReminderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGreen,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30, // Add margin below grid
  },
  gridButton: {
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 10,
    paddingVertical: 25,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: COLORS.accentBlue,
  },
  logoutButton: {
    backgroundColor: COLORS.logoutRed, // Use a distinct color for logout
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%', // Make it prominent
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    // Position it if needed, or let it flow after the grid
    // position: 'absolute',
    // bottom: 20,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

