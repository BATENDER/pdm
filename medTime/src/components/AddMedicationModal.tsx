
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { Medication } from '../utils/storage'; // Assuming Medication type is defined here

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

interface AddMedicationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (medication: Omit<Medication, 'id'>) => void; // Pass data without ID
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({ isVisible, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [notes, setNotes] = useState('');
  const [nameError, setNameError] = useState('');
  const [dosageError, setDosageError] = useState('');

  const handleSave = () => {
    let isValid = true;
    if (!name.trim()) {
      setNameError('O nome da medicação está faltando.');
      isValid = false;
    } else {
      setNameError('');
    }
    if (!dosage.trim()) {
      setDosageError('Dosagem necessária.');
      isValid = false;
    } else {
      setDosageError('');
    }

    if (isValid) {
      onSave({ name: name.trim(), dosage: dosage.trim(), notes: notes.trim() });
      // Reset fields after saving
      setName('');
      setDosage('');
      setNotes('');
      onClose(); // Close modal after save
    }
  };

  const handleClose = () => {
    // Reset fields and errors on close
    setName('');
    setDosage('');
    setNotes('');
    setNameError('');
    setDosageError('');
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose} // Close on backdrop press
      onBackButtonPress={handleClose} // Close on hardware back button press (Android)
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropColor={COLORS.modalBackground}
      style={styles.modal}
      // Accessibility props
      aria-modal={true}
      accessibilityViewIsModal={true}
      // Avoid focus issues by not hiding background content explicitly here,
      // rely on modal library's behavior or use 'inert' if needed via web-specific props.
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Medication</Text>

            <Text style={styles.label}>Medication Name *</Text>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : null]}
              placeholder="ex. Paracetamol"
              value={name}
              onChangeText={setName}
              accessibilityLabel="Entrada para o nome da medicação"
              accessibilityHint="Entre com o nome da medicação"
              autoFocus={true} // Focus the first input when modal opens
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

            <Text style={styles.label}>Dosagem *</Text>
            <TextInput
              style={[styles.input, dosageError ? styles.inputError : null]}
              placeholder="e.g., 500mg tablet"
              value={dosage}
              onChangeText={setDosage}
              accessibilityLabel="Dosage Input"
              accessibilityHint="Enter the dosage information"
            />
            {dosageError ? <Text style={styles.errorText}>{dosageError}</Text> : null}

            <Text style={styles.label}>Notas (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="ex. Tomar com água"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              accessibilityLabel="Notes Input"
              accessibilityHint="Enter any additional notes for this medication"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleClose}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar Medicação</Text>
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
  keyboardAvoidingView: {
    // Takes up necessary space, especially important for 'height' behavior
  },
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
  textArea: {
    height: 80,
    textAlignVertical: 'top', // Align text to the top for multiline
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginBottom: 5,
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
    flex: 1, // Make buttons share space
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: COLORS.textSecondary,
  },
  saveButton: {
    backgroundColor: COLORS.primaryGreen,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddMedicationModal;

