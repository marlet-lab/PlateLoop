import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchPastWeek, fetchWeather } from '../services/weatherService';

const PANEL_WIDTH = Platform.OS === 'web' ? 500 : Dimensions.get('window').width * 0.85;
const COLORS = { primary: '#3352BA', primaryDark: '#0000B8', accent: '#FFC168', background: '#F5FAF9', text: '#333333' };

const TIPS = [
  'Try turmeric in your soup for an anti-inflammatory boost.', 'Ripe bananas are perfect for baking.',
  'Add garlic late — it loses benefits when overcooked.', 'Use more spinach than you think — it wilts a lot.',
  'Lemon zest adds flavour without the acidity.', 'Chickpeas are a great meat substitute in stews.',
  'Add fresh herbs at the end of cooking.'
];

const WEATHER_ICONS: Record<string, any> = {
  // Open-Meteo
  'Clear sky': 'weather-sunny', 'Mainly clear': 'weather-sunny',
  'Partly cloudy': 'weather-partly-cloudy', 'Overcast': 'weather-cloudy',
  'Foggy': 'weather-fog', 'Icy fog': 'weather-fog',
  'Light drizzle': 'weather-rainy', 'Moderate drizzle': 'weather-rainy', 'Heavy drizzle': 'weather-pouring',
  'Light rain': 'weather-rainy', 'Moderate rain': 'weather-rainy', 'Heavy rain': 'weather-pouring',
  'Light snow': 'weather-snowy', 'Moderate snow': 'weather-snowy', 'Heavy snow': 'weather-snowy-heavy',
  'Light showers': 'weather-rainy', 'Moderate showers': 'weather-rainy', 'Heavy showers': 'weather-pouring',
  'Thunderstorm': 'weather-lightning-rainy', 'Thunderstorm with hail': 'weather-hail',

  // OpenWeatherMap
  'clear sky': 'weather-sunny', 'few clouds': 'weather-partly-cloudy',
  'scattered clouds': 'weather-cloudy', 'broken clouds': 'weather-cloudy', 'overcast clouds': 'weather-cloudy',
  'light rain': 'weather-rainy', 'moderate rain': 'weather-rainy', 'heavy intensity rain': 'weather-pouring',
  'shower rain': 'weather-rainy', 'light shower rain': 'weather-rainy',
  'drizzle': 'weather-rainy', 'light intensity drizzle': 'weather-rainy',
  'thunderstorm': 'weather-lightning-rainy',
  'snow': 'weather-snowy', 'light snow': 'weather-snowy',
  'mist': 'weather-fog', 'fog': 'weather-fog', 'haze': 'weather-fog',
};

type Item = { id: number; isReal: boolean; weather: string; tip: string; timeLabel: string; };

export default function NotificationModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(PANEL_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideAnim, { toValue: visible ? 0 : PANEL_WIDTH, duration: visible ? 250 : 200, useNativeDriver: true }).start();
    
    if (!visible) return;
    
    setLoading(true);
    Promise.all([fetchWeather('Perth,AU'), fetchPastWeek(-31.9505, 115.8605)])
      .then(([today, pastDays]) => setItems([
        { id: 0, isReal: true, weather: `${today.description}, ${today.temp}°C`, tip: TIPS[0], timeLabel: 'Today' },
        ...pastDays.map((d, i) => ({ id: i + 1, isReal: true, weather: d.description, tip: TIPS[(i + 1) % TIPS.length], timeLabel: d.timeLabel }))
      ]))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <Animated.View style={[styles.panel, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.header}>
          <Text style={styles.heading}>Notifications</Text>
          <TouchableOpacity onPress={onClose}><Ionicons name="close" size={20} color={COLORS.text} /></TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {loading ? <ActivityIndicator color={COLORS.primary} style={{ marginTop: 24 }} /> : items.map(item => (
            <View key={item.id} style={styles.item}>
              <MaterialCommunityIcons 
                name={WEATHER_ICONS[item.weather.split(',')[0]] || 'weather-cloudy'} 
                size={24} color={item.isReal ? COLORS.primary : '#6B7280'} style={{ marginTop: 2 }} 
              />
              <View style={styles.itemBody}>
                <View style={styles.itemTop}>
                  <Text style={styles.itemWeather}>{item.weather}</Text>
                  <Text style={styles.itemTime}>{item.timeLabel}</Text>
                </View>
                <Text style={styles.itemTip}>{item.tip}</Text>
                {!item.isReal && <Text style={styles.exampleTag}>example</Text>}
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.30)' },
  panel: { position: 'absolute', top: 0, right: 0, bottom: 0, width: PANEL_WIDTH, backgroundColor: COLORS.background, paddingTop: 56, paddingHorizontal: 18, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#D9EAE7' },
  heading: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: COLORS.primary },
  item: { flexDirection: 'row', gap: 12, marginBottom: 14, backgroundColor: '#ECFDF5', borderRadius: 24, paddingVertical: 14, paddingHorizontal: 18, borderWidth: 1, borderColor: '#000' },
  itemBody: { flex: 1, gap: 3 },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemWeather: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.text },
  itemTime: { fontFamily: 'OpenSans_400Regular', fontSize: 10, color: '#999' },
  itemTip: { fontFamily: 'OpenSans_400Regular', fontSize: 11, color: '#555', lineHeight: 16 },
  exampleTag: { fontFamily: 'OpenSans_400Regular', fontSize: 10, color: COLORS.accent, fontStyle: 'italic' },
});