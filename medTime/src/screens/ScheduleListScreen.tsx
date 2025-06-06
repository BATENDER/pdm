
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
// Updated import to include addHistoryEntry
import { loadSchedules, saveSchedules, Schedule, loadMedications, Medication, addHistoryEntry } from '../utils/storage';
import { rescheduleAllNotifications } from '../utils/notifications';
import AddScheduleModal from '../components/AddScheduleModal';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// Define navigation prop type
type ScheduleListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ScheduleList'>;

type Props = {
  navigation: ScheduleListScreenNavigationProp;
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

const ScheduleListScreen = ({ navigation }: Props) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const loadedSchedules = await loadSchedules();
    const loadedMeds = await loadMedications();

    const sortedSchedules = (loadedSchedules || []).sort((a, b) => {
      return a.time.localeCompare(b.time);
    });

    setSchedules(sortedSchedules);
    setMedications(loadedMeds || []);
    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleAddSchedule = () => {
    if (medications.length === 0) {
        Alert.alert("No Medications", "Please add a medication before scheduling.");
        return;
    }
    setIsScheduleModalVisible(true);
  };

  const handleSaveSchedule = async (newScheduleData: Omit<Schedule, 'id' | 'medicationName'>) => {
    const med = medications.find(m => m.id === newScheduleData.medicationId);
    if (!med) {
        Alert.alert("Erro", "Medicação selecionada não foi encontrada.");
        return;
    }

    const newSchedule: Schedule = {
      ...newScheduleData,
      id: uuidv4(),
      medicationName: med.name,
    };

    const updatedSchedules = [...schedules, newSchedule].sort((a, b) => a.time.localeCompare(b.time));
    
    try {
      await saveSchedules(updatedSchedules);
      setSchedules(updatedSchedules);
      await rescheduleAllNotifications(updatedSchedules);

      // Add history entry for the scheduled event
      await addHistoryEntry({
        medicationName: newSchedule.medicationName,
        dosage: med.dosage, // Get dosage from the found medication
        scheduledTime: newSchedule.time,
        eventTime: new Date().toISOString(), // Record when it was scheduled
        status: 'Scheduled',
        // takenTime is not applicable here
      });

      setIsScheduleModalVisible(false);
      Alert.alert("Sucesso", "Horário adicionado e salvo no histórico!");

    } catch (error) {
        console.error("Failed to save schedule or history:", error);
        Alert.alert("Erro", "Erro ao salvar nos horários. Por favor, tente novamente.");
        // Optionally revert state changes if needed
    }
  };

  const handleEditSchedule = (id: string) => {
    Alert.alert("Editar horários", `Navegue para editar o horário ${id} que não foi implementado ainda.`);
  };

  const handleDeleteSchedule = async (id: string) => {
    Alert.alert(
      "Confirmar deleção",
      "Tem certeza que você quer deletar esse horário? Isso também irá cancelar notificações relacionadas.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            const updatedSchedules = schedules.filter(sch => sch.id !== id);
            await saveSchedules(updatedSchedules);
            setSchedules(updatedSchedules);
            await rescheduleAllNotifications(updatedSchedules);
            // TODO: Consider adding a 'Deleted' entry to history?
            Alert.alert("Horário deletado", "O horário e suas notificações foram removidas.");
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
        data={schedules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleTime}>{item.time}</Text>
              <Text style={styles.scheduleMedName}>{item.medicationName}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => handleEditSchedule(item.id)}>
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDeleteSchedule(item.id)}>
                <Text style={styles.actionButtonText}>Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum horário adicionado ainda. Clique em "Adicionar novo horário" para começar.</Text>}
        contentContainerStyle={styles.listContentContainer}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddSchedule}>
        <Text style={styles.addButtonText}>+ Adicionar novo horário</Text>
      </TouchableOpacity>

      <AddScheduleModal
        isVisible={isScheduleModalVisible}
        onClose={() => setIsScheduleModalVisible(false)}
        onSave={handleSaveSchedule}
        medications={medications}
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
    paddingBottom: 80,
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
  scheduleInfo: {
    flex: 1,
    marginRight: 10,
  },
  scheduleTime: {
    fontWeight: 'bold',
    fontSize: 18,
    color: COLORS.darkGreen,
    marginBottom: 3,
  },
  scheduleMedName: {
    fontSize: 15,
    color: COLORS.textPrimary,
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
    position: 'absolute',
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

export default ScheduleListScreen;

