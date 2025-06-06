
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker'; // Need to install this
import { Schedule, Medication } from '../utils/storage'; // Assuming types are defined here

// Grasshopper-inspired color palette (ensure consistency)
const COLORS = {
  primaryGreen: '#4CAF50',
  lightGreen: '#C8E6C9',
  darkGreen: '#388E3C',
  textPrimary: '#333333',
  textSecondary: '#757575',
  background: '#E8F5E9',
  white: '#FFFFFF',
  error: '#D32F2F',
  accentBlue: '#2196F3',
  modalBackground: 'rgba(0, 0, 0, 0.5)',
};

interface AddScheduleModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (schedule: Omit<Schedule, 'id' | 'medicationName'>) => void; // Pass data without ID or name (will derive name)
  medications: Medication[]; // Pass the list of available medications
}

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({ isVisible, onClose, onSave, medications }) => {
  const [selectedMedicationId, setSelectedMedicationId] = useState<string | undefined>(medications.length > 0 ? medications[0].id : undefined);
  const [time, setTime] = useState(''); // Simple HH:MM format for now
  const [medicationError, setMedicationError] = useState('');
  const [timeError, setTimeError] = useState('');

  // Update default selected medication if the list changes
  useEffect(() => {
    if (!selectedMedicationId && medications.length > 0) {
      setSelectedMedicationId(medications[0].id);
    }
  }, [medications]);

  // Basic HH:MM validation
  const isValidTimeFormat = (input: string): boolean => {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(input);
  };

  const handleSave = () => {
    let isValid = true;
    if (!selectedMedicationId) {
      setMedicationError('Por favor, selecione a medicação.');
      isValid = false;
    } else {
      setMedicationError('');
    }

    if (!time.trim()) {
      setTimeError('Tempo é necessário.');
      isValid = false;
    } else if (!isValidTimeFormat(time.trim())) {
      setTimeError('Por favor, entre com o tempo no formato HH:MM (ex. 20:45).');
      isValid = false;
    } else {
      setTimeError('');
    }

    if (isValid && selectedMedicationId) {
      onSave({ medicationId: selectedMedicationId, time: time.trim() });
      // Reset fields after saving
      setSelectedMedicationId(medications.length > 0 ? medications[0].id : undefined);
      setTime('');
      onClose(); // Close modal after save
    }
  };

  const handleClose = () => {
    // Reset fields and errors on close
    setSelectedMedicationId(medications.length > 0 ? medications[0].id : undefined);
    setTime('');
    setMedicationError('');
    setTimeError('');
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropColor={COLORS.modalBackground}
      style={styles.modal}
      aria-modal={true}
      accessibilityViewIsModal={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adcione um novo horário</Text>

            <Text style={styles.label}>Medicação *</Text>
            {medications.length > 0 ? (
              <View style={[styles.pickerContainer, medicationError ? styles.inputError : null]}>
                <Picker
                  selectedValue={selectedMedicationId}
                  onValueChange={(itemValue) => setSelectedMedicationId(itemValue)}
                  style={styles.picker}
                  accessibilityLabel="Selecione a Medicação"
                  accessibilityHint="Escolha a medicação para o agendamento"
                >
                  {medications.map((med) => (
                    <Picker.Item key={med.id} label={`${med.name} (${med.dosage})`} value={med.id} />
                  ))}
                </Picker>
              </View>
            ) : (
              <Text style={styles.noMedsText}>Sem medicações disponíveis. Por favor adicione uma medicação antes.</Text>
            )}
            {medicationError ? <Text style={styles.errorText}>{medicationError}</Text> : null}

            <Text style={styles.label}>Tempo (HH:MM) *</Text>
            <TextInput
              style={[styles.input, timeError ? styles.inputError : null]}
              placeholder="ex. 08:00 or 17:30"
              value={time}
              onChangeText={setTime}
              keyboardType="numeric" // Suggest numeric keyboard, but validation handles format
              maxLength={5}
              accessibilityLabel="Time Input"
              accessibilityHint="Enter the scheduled time in HH:MM format"
              // Consider using a dedicated TimePicker component for better UX
            />
            {timeError ? <Text style={styles.errorText}>{timeError}</Text> : null}

            {/* Add fields for frequency, days, etc. later if needed */}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleClose}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton, medications.length === 0 ? styles.disabledButton : null]}
                onPress={handleSave}
                disabled={medications.length === 0} // Disable save if no meds
              >
                <Text style={styles.buttonText}>Salvar horário</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  keyboardAvoidingView: {},
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 22,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.darkGreen,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: COLORS.lightGreen,
  },
  pickerContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGreen,
    marginBottom: 5,
    // Height might need adjustment depending on platform
  },
  picker: {
    // Styling Picker can be tricky and platform-dependent
    // height: 50, // Example height
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginBottom: 5,
  },
  noMedsText: {
      color: COLORS.textSecondary,
      fontStyle: 'italic',
      marginTop: 5,
      marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: COLORS.textSecondary,
  },
  saveButton: {
    backgroundColor: COLORS.primaryGreen,
  },
  disabledButton: {
      backgroundColor: COLORS.lightGreen, // Indicate disabled state
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddScheduleModal;

