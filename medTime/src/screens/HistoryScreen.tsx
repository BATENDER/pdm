
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
// Updated import: HistoryEntry and HistoryStatus types
import { loadHistory, HistoryEntry, HistoryStatus } from '../utils/storage'; 

// Define navigation prop type
type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'History'>;

type Props = {
  navigation: HistoryScreenNavigationProp;
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
  // Status colors
  taken: '#4CAF50', // Green
  missed: '#F44336', // Red
  skipped: '#FF9800', // Orange
  scheduled: '#2196F3', // Blue for scheduled
};

const HistoryScreen = ({ navigation }: Props) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    setIsLoading(true);
    const loadedHistory = await loadHistory();
    // Sort history by eventTime, newest first (already sorted in storage.ts, but good practice)
    const sortedHistory = (loadedHistory || []).sort((a, b) => {
      return new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime();
    });
    setHistory(sortedHistory);
    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchHistory();
    }, [])
  );

  // Updated to handle HistoryStatus type and 'Scheduled' status
  const getStatusStyle = (status: HistoryStatus) => {
    switch (status) {
      case 'Taken':
        return { color: COLORS.taken, fontWeight: 'bold' };
      case 'Missed':
        return { color: COLORS.missed, fontWeight: 'bold' };
      case 'Skipped':
        return { color: COLORS.skipped, fontWeight: 'bold' };
      case 'Scheduled':
        return { color: COLORS.scheduled, fontWeight: 'bold' }; // Style for Scheduled
      default:
        return { color: COLORS.textSecondary };
    }
  };

  // Helper to format the event time
  const formatEventTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString(); // Use locale-specific format
    } catch (e) {
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primaryGreen} /></View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.historyInfo}>
              <Text style={styles.medName}>{item.medicationName} ({item.dosage})</Text>
              <Text style={styles.timeText}>Marcado para: {item.scheduledTime}</Text>
              {/* Display event time instead of takenTime */}
              <Text style={styles.timeText}>Horário do evento: {formatEventTime(item.eventTime)}</Text>
              {/* Optionally show takenTime only if status is 'Taken' */}
              {item.status === 'Taken' && item.takenTime && (
                <Text style={styles.timeText}>Tomado em: {formatEventTime(item.takenTime)}</Text>
              )}
            </View>
            <Text style={[styles.statusText, getStatusStyle(item.status)]}>{item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum histórico de medicação marcado no momento.</Text>}
        contentContainerStyle={styles.listContentContainer}
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
  historyInfo: {
    flex: 1,
    marginRight: 10,
  },
  medName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.darkGreen,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 80, // Adjusted width for potentially longer status text
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default HistoryScreen;

