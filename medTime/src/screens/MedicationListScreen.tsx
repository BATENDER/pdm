
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { loadMedications, saveMedications, Medication } from '../utils/storage';
import AddMedicationModal from '../components/AddMedicationModal'; // Import the modal
import  'react-native-get-random-values'; // Import for uuid
import { v4 as uuidv4 } from 'uuid'; // Import uuid

// Define navigation prop type
type MedicationListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MedicationList'>;

type Props = {
  navigation: MedicationListScreenNavigationProp;
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
  accentBlue: '#2196F3',
};

const MedicationListScreen = ({ navigation }: Props) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMedModalVisible, setIsMedModalVisible] = useState(false); // State for modal visibility

  const fetchMedications = async () => {
    setIsLoading(true);
    const loadedMeds = await loadMedications();
    setMedications(loadedMeds || []);
    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMedications();
    }, [])
  );

  const handleAddMedication = () => {
    setIsMedModalVisible(true); // Open the modal instead of Alert
  };

  const handleSaveMedication = async (newMedData: Omit<Medication, 'id'>) => {
    const newMed: Medication = {
      ...newMedData,
      id: uuidv4(), // Generate a unique ID
    };
    const updatedMeds = [...medications, newMed];
    await saveMedications(updatedMeds);
    setMedications(updatedMeds); // Update state to refresh list
    setIsMedModalVisible(false); // Close modal is handled inside the modal component now
    Alert.alert("Success", "Medication added successfully!");
  };

  const handleEditMedication = (id: string) => {
    // TODO: Implement navigation to an Edit screen, passing the medication ID
    Alert.alert("Edit Medication", `Navigation to edit medication ${id} not implemented yet.`);
  };

  const handleDeleteMedication = async (id: string) => {
    // Keep using Alert for delete confirmation for now, or replace with an accessible modal
    Alert.alert(
      "Confirmar a Deleção",
      "Você tem certeza que você quer deletar essa medicação? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            const updatedMeds = medications.filter(med => med.id !== id);
            await saveMedications(updatedMeds);
            setMedications(updatedMeds);
            // TODO: Also delete associated schedules and update notifications
            Alert.alert("Medicação deletada", "A medicação foi removida.");
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primaryGreen} /></View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={medications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.medInfo}>
              <Text style={styles.medName}>{item.name}</Text>
              <Text style={styles.medDosage}>{item.dosage}</Text>
              {item.notes && <Text style={styles.notes}>Notas: {item.notes}</Text>}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => handleEditMedication(item.id)}>
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDeleteMedication(item.id)}>
                <Text style={styles.actionButtonText}>Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Sem medicações adicionadas ainda. Clique em "Adicionar nova medicação" para começar.</Text>}
        contentContainerStyle={styles.listContentContainer}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddMedication}>
        <Text style={styles.addButtonText}>+ Adicionar Nova Medicação</Text>
      </TouchableOpacity>

      {/* Render the modal */}
      <AddMedicationModal
        isVisible={isMedModalVisible}
        onClose={() => setIsMedModalVisible(false)}
        onSave={handleSaveMedication}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  listContentContainer: {
    padding: 15,
    paddingBottom: 80, // Add padding to avoid overlap with add button
  },
  listItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
  },
  medInfo: {
    flex: 1,
    marginRight: 10,
  },
  medName: {
    fontWeight: 'bold',
    fontSize: 17,
    color: COLORS.darkGreen,
  },
  medDosage: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  notes: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 5,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: COLORS.accentBlue,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  addButton: {
    position: 'absolute', // Position button at the bottom
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MedicationListScreen;

