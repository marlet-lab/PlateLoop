import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

//Tells iOS/Android to display the alert if the user is currently using the app
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,   
    shouldShowBanner: true,  
    shouldShowList: true,
  }),
});

//asking first to be able to send notifications
export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

//The core scheduling logic
export async function scheduleDailyNotification(
  title: string,
  body: string,
  hour: number = 8,
  minute: number = 0
) {
  if (Platform.OS === 'web') {
    scheduleWebDailyNotification(title, body, hour, minute);
    return;
  }

  // Clear previous schedules to not get duplicates every time the app opens
  await Notifications.cancelAllScheduledNotificationsAsync();
 
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

// Web-only helper
let webIntervalId: ReturnType<typeof setInterval> | null = null;

function scheduleWebDailyNotification(title: string, body: string, hour: number, minute: number) {
  if (webIntervalId) clearInterval(webIntervalId);
  webIntervalId = setInterval(() => {
    const now = new Date();
    if (now.getHours() === hour && now.getMinutes() === minute) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.ico' });
      }
    }
  }, 60_000);
}