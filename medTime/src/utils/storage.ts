
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define keys for storage
const MEDICATION_KEY = '@MedicationReminder:medications';
const SCHEDULE_KEY = '@MedicationReminder:schedules';
const HISTORY_KEY = '@MedicationReminder:history';

// --- Generic Storage Functions ---

const saveData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error saving data to AsyncStorage:', key, e);
  }
};

const loadData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error loading data from AsyncStorage:', key, e);
    return null;
  }
};

// --- Specific Data Types ---

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  notes?: string;
}

export interface Schedule {
  id: string;
  medicationId: string;
  medicationName: string; // Denormalized for easier display
  time: string; // Store time in HH:mm format
}

export type HistoryStatus = 'Taken' | 'Missed' | 'Skipped' | 'Scheduled';

export interface HistoryEntry {
  id: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string; // HH:mm time it was scheduled for
  eventTime: string; // ISO timestamp when the event occurred (scheduled, taken, etc.)
  status: HistoryStatus;
  takenTime?: string; // ISO timestamp - only relevant for 'Taken' status
}

// --- Specific Data Functions ---

// Medications CRUD
export const saveMedications = async (medications: Medication[]) => saveData(MEDICATION_KEY, medications);
export const loadMedications = async (): Promise<Medication[] | null> => loadData(MEDICATION_KEY);

// Schedules CRUD
export const saveSchedules = async (schedules: Schedule[]) => saveData(SCHEDULE_KEY, schedules);
export const loadSchedules = async (): Promise<Schedule[] | null> => loadData(SCHEDULE_KEY);

// History CRUD
export const saveHistory = async (history: HistoryEntry[]) => saveData(HISTORY_KEY, history);
export const loadHistory = async (): Promise<HistoryEntry[] | null> => loadData(HISTORY_KEY);

export const addHistoryEntry = async (entryData: Omit<HistoryEntry, 'id'>) => {
  const history = await loadHistory() || [];
  // Sort history by eventTime descending before adding new entry
  history.sort((a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime());
  
  const newEntry: HistoryEntry = {
    ...entryData,
    id: uuidv4(), // Use uuid for more robust unique IDs
  };
  
  // Add to the beginning of the array for chronological order (newest first)
  const updatedHistory = [newEntry, ...history];
  
  await saveHistory(updatedHistory);
  console.log(`History entry added: ${newEntry.status} - ${newEntry.medicationName} at ${newEntry.eventTime}`);
  return newEntry;
};

// Clear all data
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([MEDICATION_KEY, SCHEDULE_KEY, HISTORY_KEY, 'userRole']); // Also clear userRole
    console.log('All app data cleared from AsyncStorage.');
  } catch (e) {
    console.error('Error clearing all data from AsyncStorage:', e);
  }
};

// Import uuid - ensure it's installed or handle potential error
let v4: () => string;
try {
  // Dynamically import uuid
  const uuid = require('react-native-uuid');
  v4 = uuid.v4;
} catch (error) {
  console.warn('react-native-uuid not found, using fallback ID generation.');
  // Fallback ID generator if uuid is not available
  v4 = () => Date.now().toString() + Math.random().toString(36).substring(2, 15);
  // Install uuid: npx expo install react-native-uuid
  // Make sure to also import 'react-native-get-random-values'; at the top of your entry file (e.g., App.tsx)
}
const uuidv4 = v4;

