// components/NotificationModal.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { fetchWeather } from '../services/weatherService';

type Props = {
  visible: boolean;
  onClose: () => void;
};

// One ingredient tip per day — add/edit as many as you like
const INGREDIENT_TIPS: string[] = [
  'Try adding turmeric to your soup for an anti-inflammatory boost.',
  'Ripe bananas are perfect for baking — don\'t throw them away.',
  'Garlic loses its benefits when overcooked. Add it late.',
  'Spinach wilts to a fraction of its size — use more than you think.',
  'Lemon zest adds flavour without the acidity of juice.',
  'Chickpeas are a great meat substitute in stews.',
  'Fresh herbs should be added at the end of cooking.',
];

const WEATHER_CONDITIONS = [
  'Rainy Day',
  'Sunny Day',
  'Cloudy Day',
  'Windy Day',
  'Snowy Day',
  'Partly Cloudy',
  'Clear Sky',
];

// Fixed panel width — change this to adjust size
const PANEL_WIDTH = 260;

function getTimeLabel(daysAgo: number): string {
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  return `${daysAgo} days ago`;
}

function buildNotifications(currentWeather: string) {
  return Array.from({ length: 7 }, (_, i) => ({
    id: i,
    weather: i === 0 ? currentWeather : WEATHER_CONDITIONS[i % WEATHER_CONDITIONS.length],
    tip: INGREDIENT_TIPS[i % INGREDIENT_TIPS.length],
    timeLabel: getTimeLabel(i),
  }));
}

export default function NotificationModal({ visible, onClose }: Props) {
  const [notifications, setNotifications] = useState<ReturnType<typeof buildNotifications>>([]);
  const [loading, setLoading] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(PANEL_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      loadNotifications();
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: PANEL_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  async function loadNotifications() {
    setLoading(true);
    try {
      const weather = await fetchWeather('London'); // change city as needed
      setNotifications(buildNotifications(`${weather.description}, ${weather.temp}°C`));
    } catch {
      setNotifications(buildNotifications('Weather unavailable'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Dark overlay — tap to close */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Sliding right panel */}
      <Animated.View style={[styles.panel, { transform: [{ translateX: slideAnim }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Notifications</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color="#555" />
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator color="#0D7A5F" style={{ marginTop: 20 }} />}

        {/* Notification list */}
        {!loading && notifications.map((n) => (
          <View key={n.id} style={styles.item}>
            <View style={styles.iconWrapper}>
              <Ionicons name="leaf-outline" size={20} color="#0D7A5F" />
            </View>
            <View style={styles.itemContent}>
              <View style={styles.itemRow}>
                <Text style={styles.itemTitle}>{n.weather}</Text>
                <Text style={styles.itemTime}>{n.timeLabel}</Text>
              </View>
              <Text style={styles.itemTip} numberOfLines={2}>{n.tip}</Text>
            </View>
          </View>
        ))}
      </Animated.View>
    </Modal>
  );
}

const GREEN = '#0D7A5F';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: PANEL_WIDTH,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
    gap: 10,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8f5f1',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemContent: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  itemTime: {
    fontSize: 11,
    color: '#aaa',
  },
  itemTip: {
    fontSize: 12,
    color: '#666',
    lineHeight: 17,
  },
});