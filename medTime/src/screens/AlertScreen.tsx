import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, Platform, ActivityIndicator, ScrollView, Alert } from 'react-native'; // Added Alert import
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator'; // Uses updated ParamList
import { addHistoryEntry, HistoryEntry, Medication, Schedule, loadMedications, loadSchedules } from '../utils/storage';

// Define navigation prop types using the updated RootStackParamList
type AlertScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Alert'>;
type AlertScreenRouteProp = RouteProp<RootStackParamList, 'Alert'>;

type Props = {
  navigation: AlertScreenNavigationProp;
  route: AlertScreenRouteProp;
};

// Grasshopper-inspired color palette - Added 'error' color
const COLORS = {
  primaryGreen: '#4CAF50',
  lightGreen: '#C8E6C9',
  darkGreen: '#388E3C',
  textPrimary: '#333333',
  textSecondary: '#757575',
  background: '#FFF9C4', // Light yellow/orange for alert
  white: '#FFFFFF',
  accentBlue: '#2196F3',
  error: '#D32F2F', // Added error color
};

// Placeholder for API call
const notifyMaintenanceTeam = async (medicationName: string, time: string) => {
  console.log(`[API Call Simulation] Notifying team about ${medicationName} scheduled at ${time}.`);
  // Replace with actual fetch/axios call [cite: 10, 11]
};

const AlertScreen = ({ navigation, route }: Props) => {
  // Access params safely - they are now optional in the type definition
  const scheduleId = route.params?.scheduleId;
  const isGentleReminder = route.params?.isGentleReminder;
  // medicationId is also optional now, handle accordingly if needed
  // const medicationId = route.params?.medicationId;

  const [medication, setMedication] = useState<Medication | null>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaken, setIsTaken] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      if (scheduleId) {
        const allSchedules = await loadSchedules() || [];
        const currentSchedule = allSchedules.find(s => s.id === scheduleId);
        setSchedule(currentSchedule || null);
        if (currentSchedule) {
          const allMedications = await loadMedications() || [];
          const currentMedication = allMedications.find(m => m.id === currentSchedule.medicationId);
          setMedication(currentMedication || null);
          if (!isGentleReminder && currentMedication) {
              await notifyMaintenanceTeam(currentMedication.name, currentSchedule.time);
          }
        }
      } else {
        // Fallback for testing via button (if medicationId is not passed)
        console.warn('AlertScreen opened without scheduleId, using mock data.');
        setMedication({ id: 'mock-id', name: 'Med Teste', dosage: '1 comprimido' });
        setSchedule({ id: 'mock-sch-id', medicationId: 'mock-id', medicationName: 'Med Teste', time: 'Agora' });
      }
      setIsLoading(false);
    };
    loadData();
  }, [scheduleId, isGentleReminder]); // Depend on the actual params

  const handleMarkAsTaken = async () => {
    if (!medication || !schedule) return;

    setIsTaken(true);
    const takenTime = new Date().toISOString();

    await addHistoryEntry({
      medicationName: medication.name,
      dosage: medication.dosage,
      scheduledTime: schedule.time,
      takenTime: takenTime,
      status: 'Taken',
    });

    console.log(`${medication.name} marked as taken.`);
    Alert.alert("Confirmação", `${medication.name} marcado como tomado!`, [
        { text: "OK", onPress: () => navigation.goBack() }
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primaryGreen} /></View>
    );
  }

  if (!medication || !schedule) {
    return (
        <View style={styles.centered}>
            {/* Use the added COLORS.error */}
            <Text style={styles.errorText}>Não foi possível carregar os detalhes da medicação.</Text>
            <Button title="Voltar" onPress={() => navigation.goBack()} color={COLORS.primaryGreen}/>
        </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <Image
        source={require('../../assets/images/grasshopper_mascot.png')} // Use imported image
        style={styles.mascot}
        resizeMode="contain"
      />
      <Text style={styles.title}>
        {isGentleReminder ? 'Gentle Reminder ✨' : 'Tempo da sua medicação! 💊'}
      </Text>
      <View style={styles.detailsCard}>
        <Text style={styles.medicationName}>{medication.name}</Text>
        <Text style={styles.details}>Dosagem: {medication.dosage}</Text>
        <Text style={styles.details}>Horário: {schedule.time}</Text>
        {medication.notes && <Text style={styles.notes}>Nota: {medication.notes}</Text>}
      </View>

      {!isTaken ? (
        <TouchableOpacity
          onPress={handleMarkAsTaken}
          style={styles.interactiveButton}
          accessible={true}
          accessibilityLabel={`Mark ${medication.name} as taken`}
          accessibilityHint={`Tap to confirm you have taken ${medication.name}`}
          accessibilityRole="button"
        >
          <Image
            source={require('../../assets/images/grasshopper_mascot.png')} // Use imported image
            style={styles.buttonImage}
          />
          <Text style={styles.buttonImageText}>Clique em mim quando tomar!</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.confirmationContainer}>
            <Text style={styles.confirmationText}>Bom trabalho! 👍</Text>
            <Text style={styles.confirmationSubText}>Medicação marcado como tomado.</Text>
        </View>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Voltar</Text>
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  errorText: {
      fontSize: 16,
      color: COLORS.error, // Now uses the defined error color
      textAlign: 'center',
      marginBottom: 20,
  },
  mascot: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.darkGreen,
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  medicationName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primaryGreen,
    marginBottom: 10,
  },
  details: {
    fontSize: 17,
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  notes: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  interactiveButton: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 15,
    padding: 20,
    width: '80%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  buttonImageText: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmationContainer: {
      alignItems: 'center',
      marginBottom: 30,
      padding: 20,
  },
  confirmationText: {
    fontSize: 22,
    color: COLORS.darkGreen,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmationSubText: {
      fontSize: 16,
      color: COLORS.textSecondary,
      marginTop: 5,
  },
  backButton: {
      marginTop: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
  },
  backButtonText: {
      fontSize: 16,
      color: COLORS.accentBlue,
      fontWeight: '500',
  }
});

export default AlertScreen;

