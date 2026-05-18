import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

//Notifications for iOS and android app
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true, 
    }),
});

export async function requestPermissions(): Promise<boolean> {
    //Browser notification API for web
    if(Platform.OS === 'web') {
        if(!('Notification' in window)) return false;
        if(Notification.permission === 'granted') return true;
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    if(!Device.isDevice) {
        console.warn('Local notifications work on physical devices only for iOS');
    }
    const { status: existing } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

export async function sendNotificationNow(title: string, body: string) {
  if (Platform.OS === 'web') {
    if (Notification.permission !== 'granted') return;
    new Notification(title, { body, icon: '/favicon.ico' });
    return;
  }
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: null,
  });
}

export async function scheduleDailyNotification(
  title: string,
  body: string,
  hour: number = 8,
  minute: number = 0
): Promise<string | null> {
  if (Platform.OS === 'web') {
    scheduleWebDailyNotification(title, body, hour, minute);
    return 'web-interval';
  }
  await cancelDailyNotification();
 
  const id = await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
  return id;
}

export async function cancelDailyNotification() {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
 
let webIntervalId: ReturnType<typeof setInterval> | null = null;
 
function scheduleWebDailyNotification(
  title: string,
  body: string,
  hour: number,
  minute: number
) {
  if (webIntervalId) clearInterval(webIntervalId);
  webIntervalId = setInterval(() => {
    const now = new Date();
    if (now.getHours() === hour && now.getMinutes() === minute) {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  }, 60_000);
}
