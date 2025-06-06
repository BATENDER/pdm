import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Schedule } from './storage'; // Assuming Schedule interface is exported from storage.ts

// --- Notification Handler Setup ---

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true, // Use default sound for the first alert
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// --- Permissions ---

export const requestNotificationPermissions = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250], // Standard vibration
      lightColor: '#FF231F7C',
    });
    // Optional: Create a channel for the gentler second alarm
    await Notifications.setNotificationChannelAsync('gentle', {
        name: 'gentle-reminders',
        importance: Notifications.AndroidImportance.DEFAULT, // Lower importance
        vibrationPattern: [0, 100, 100, 100], // Softer vibration
        sound: undefined, // Potentially no sound or a softer one
      });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    alert('Failed to get notification permissions. Please enable them in settings.');
    return false;
  }
  return true;
};

// --- Scheduling Notifications ---

// Helper to convert HH:mm time to Date object for today/tomorrow
const getNextTriggerDate = (time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const triggerDate = new Date();
  triggerDate.setHours(hours, minutes, 0, 0);

  // If the time has already passed for today, schedule for tomorrow
  if (triggerDate < now) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }
  return triggerDate;
};

// Schedule a single notification for a medication
export const scheduleMedicationNotification = async (schedule: Schedule) => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return null;

  const triggerDate = getNextTriggerDate(schedule.time);

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Medication Reminder! 💊',
        body: `Time to take your ${schedule.medicationName}.`,
        data: { scheduleId: schedule.id, medicationName: schedule.medicationName, time: schedule.time }, // Pass data to handle interaction
        sound: true, // Default sound for first notification
      },
      trigger: { type: 'date', date: triggerDate },
      // TODO: Add repeat logic if needed (e.g., daily)
      // trigger: { hour: triggerDate.getHours(), minute: triggerDate.getMinutes(), repeats: true },
    });
    console.log(`Notification scheduled for ${schedule.medicationName} at ${schedule.time} with ID: ${notificationId}`);

    // TODO: Implement scheduling for the second, gentler alarm [cite: 9]
    // Example: Schedule another notification 5 minutes later on the 'gentle' channel
    const gentleTriggerDate = new Date(triggerDate.getTime() + 5 * 60000); // 5 minutes later
    const gentleNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Gentle Reminder 🌿',
          body: `Just checking in - did you take your ${schedule.medicationName}?`,
          data: { scheduleId: schedule.id, isGentleReminder: true },
          sound: false, // Or a custom soft sound
        },
        trigger: { type: 'date', date: gentleTriggerDate },
        // Specify channel for Android
        ...(Platform.OS === 'android' && { channelId: 'gentle' }),
      });
    console.log(`Gentle notification scheduled for ${schedule.medicationName} with ID: ${gentleNotificationId}`);


    return { main: notificationId, gentle: gentleNotificationId };
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

// Cancel a specific notification
export const cancelNotification = async (notificationId: string) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('Notification cancelled:', notificationId);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All scheduled notifications cancelled.');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
};

// Function to reschedule all notifications based on current schedules
// Call this when schedules are added, updated, or deleted, or on app start
export const rescheduleAllNotifications = async (schedules: Schedule[]) => {
    await cancelAllNotifications(); // Clear existing ones first
    console.log('Rescheduling all notifications...');
    for (const schedule of schedules) {
        // TODO: Store the returned notification IDs (main & gentle) with the schedule in AsyncStorage
        // This allows cancelling specific notifications later if a schedule is deleted/updated.
        await scheduleMedicationNotification(schedule);
    }
    console.log('Finished rescheduling notifications.');
};

