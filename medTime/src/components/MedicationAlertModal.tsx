
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Modal from 'react-native-modal';
// Updated import: HistoryEntry, HistoryStatus, addHistoryEntry
import { Medication, Schedule, addHistoryEntry } from '../utils/storage'; 

// Grasshopper-inspired color palette
const COLORS = {
  primaryGreen: '#4CAF50',
  lightGreen: '#C8E6C9',
  darkGreen: '#388E3C',
  textPrimary: '#333333',
  textSecondary: '#757575',
  background: '#FFF9C4',
  white: '#FFFFFF',
  error: '#D32F2F',
  accentBlue: '#2196F3',
  modalBackground: 'rgba(0, 0, 0, 0.6)',
};

interface MedicationAlertModalProps {
  isVisible: boolean;
  onClose: () => void;
  medication: Medication | null;
  schedule: Schedule | null;
  isGentleReminder?: boolean;
}

const MedicationAlertModal: React.FC<MedicationAlertModalProps> = ({ 
  isVisible, 
  onClose, 
  medication, 
  schedule, 
  isGentleReminder 
}) => {
  const [isTaken, setIsTaken] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsTaken(false);
    }
  }, [isVisible, schedule?.id]);

  const handleMarkAsTaken = async () => {
    if (!medication || !schedule) return;

    setIsTaken(true);
    const nowISO = new Date().toISOString();

    try {
      // Ensure all required fields for HistoryEntry are provided
      await addHistoryEntry({
        medicationName: medication.name,
        dosage: medication.dosage,
        scheduledTime: schedule.time,
        eventTime: nowISO, // Time the 'Taken' event occurred
        status: 'Taken',
        takenTime: nowISO, // Record the specific time it was marked as taken
      });
      console.log(`${medication.name} marked as taken via modal.`);
      Alert.alert("Confirmation", `${medication.name} marked as taken!`, [
          { text: "OK", onPress: onClose } 
      ]);
    } catch (error) {
        console.error("Failed to save history entry:", error);
        Alert.alert("Error", "Failed to record medication administration.");
        setIsTaken(false);
    }
  };

  if (!medication || !schedule) {
    return null; 
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropColor={COLORS.modalBackground}
      style={styles.modal}
      aria-modal={true}
      accessibilityViewIsModal={true}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.modalContent}>
          <Image
            source={require('../../assets/images/grasshopper_mascot.png')}
            style={styles.mascot}
            resizeMode="contain"
          />
          <Text style={styles.title}>
            {isGentleReminder ? 'Gentle Reminder ✨' : 'Time for your medication! 💊'}
          </Text>
          <View style={styles.detailsCard}>
            <Text style={styles.medicationName}>{medication.name}</Text>
            <Text style={styles.details}>Dosagem: {medication.dosage}</Text>
            <Text style={styles.details}>Tempo definido: {schedule.time}</Text>
            {medication.notes && <Text style={styles.notes}>Notas: {medication.notes}</Text>}
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
                source={require('../../assets/images/grasshopper_mascot.png')}
                style={styles.buttonImage}
              />
              <Text style={styles.buttonImageText}>Clique em mim quando tomar!</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.confirmationContainer}>
                <Text style={styles.confirmationText}>Bom trabalho! 👍</Text>
                <Text style={styles.confirmationSubText}>Medicação tomada.</Text>
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    padding: 22,
    borderRadius: 17,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
  mascot: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryGreen,
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
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
    marginBottom: 20,
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 15,
    padding: 15,
    width: '90%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  buttonImageText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmationContainer: {
      alignItems: 'center',
      marginBottom: 20,
      padding: 15,
  },
  confirmationText: {
    fontSize: 20,
    color: COLORS.darkGreen,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmationSubText: {
      fontSize: 15,
      color: COLORS.textSecondary,
      marginTop: 5,
  },
  closeButton: {
      marginTop: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
  },
  closeButtonText: {
      fontSize: 16,
      color: COLORS.accentBlue,
      fontWeight: '500',
  }
});

export default MedicationAlertModal;

