
import React, { useEffect, useState, useRef } from 'react'; // Added useState, useRef
import { StatusBar } from 'expo-status-bar';
import AppNavigator from '../navigation/AppNavigator';
import { requestNotificationPermissions, rescheduleAllNotifications } from '../utils/notifications';
import { loadSchedules, loadMedications, Medication, Schedule } from '../utils/storage'; // Added loadMedications, Medication, Schedule
import * as Notifications from 'expo-notifications';
import { AuthProvider, useAuth } from '../context/AuthContext'; // Import useAuth
import MedicationAlertModal from '../components/MedicationAlertModal'; // Import the alert modal
import { AppState } from 'react-native'; // Import AppState

// Main App Component wrapped with AuthProvider
const AppWrapper = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

// Inner App Component to access AuthContext
function App() {
  const { userRole } = useAuth(); // Get user role
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [alertModalData, setAlertModalData] = useState<{ medication: Medication | null; schedule: Schedule | null; isGentleReminder?: boolean }>({ medication: null, schedule: null });
  const appState = useRef(AppState.currentState);

  // Function to fetch data and show modal
  const triggerAlertModal = async (data: any) => {
    const scheduleId = data?.scheduleId;
    const isGentle = data?.isGentleReminder || false;
    if (!scheduleId) {
      console.warn('Informação da notificação está faltando scheduleId');
      return;
    }

    // Fetch schedule and medication details
    const schedules = await loadSchedules() || [];
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) {
      console.warn(`Schedule not found for ID: ${scheduleId}`);
      return;
    }

    const medications = await loadMedications() || [];
    const medication = medications.find(m => m.id === schedule.medicationId);
    if (!medication) {
      console.warn(`Medication not found for ID: ${schedule.medicationId}`);
      return;
    }

    // Set state to show the modal
    setAlertModalData({ medication, schedule, isGentleReminder: isGentle });
    setIsAlertModalVisible(true);
  };

  useEffect(() => {
    const setupApp = async () => {
      await requestNotificationPermissions();
      // Reschedule notifications only if a user is logged in (optional)
      if (userRole) {
        const schedules = await loadSchedules();
        if (schedules && schedules.length > 0) {
          await rescheduleAllNotifications(schedules);
        }
      }
    };

    setupApp();

    // Listener for notifications received while app is foregrounded
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received while app foregrounded:', notification);
      // Trigger the modal directly
      triggerAlertModal(notification.request.content.data);
    });

    // Listener for user tapping on a notification (app was backgrounded/closed)
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      // Trigger the modal when user interacts
      triggerAlertModal(response.notification.request.content.data);
    });

    // Listener for AppState changes (optional: could be used to refresh/reschedule)
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        // Optionally re-check permissions or reschedule notifications here
      }
      appState.current = nextAppState;
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
      subscription.remove();
    };
  }, [userRole]); // Re-run setup if userRole changes

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
      {/* Render the Alert Modal globally */}
      <MedicationAlertModal
        isVisible={isAlertModalVisible}
        onClose={() => setIsAlertModalVisible(false)}
        medication={alertModalData.medication}
        schedule={alertModalData.schedule}
        isGentleReminder={alertModalData.isGentleReminder}
      />
    </>
  );
}

export default AppWrapper;

