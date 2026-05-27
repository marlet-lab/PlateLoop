import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchPastWeek, fetchWeather } from '../services/weatherService';

const PANEL_WIDTH = Platform.OS === 'web' ? 500 : Dimensions.get('window').width * 0.85;
const COLORS = { primary: '#005D47', background: '#F5FAF9', text: '#333333' };

const WEATHER_TIPS: Record<string, string> = {
  // Rainy
  'light rain':        'Slow-cooked stews taste best on rainy days — try a chickpea curry.',
  'moderate rain':     'Perfect soup weather — add turmeric for an anti-inflammatory boost.',
  'heavy rain':        'Bake today! Ripe bananas make excellent banana bread.',
  'shower rain':       'Warm lentil soup is ideal for a drizzly day.',
  'Light rain':        'Slow-cooked stews taste best on rainy days — try a chickpea curry.',
  'Moderate rain':     'Perfect soup weather — add turmeric for an anti-inflammatory boost.',
  'Heavy rain':        'Bake today! Ripe bananas make excellent banana bread.',
  'Light showers':     'Warm lentil soup is ideal for a drizzly day.',
  'Moderate showers':  'Try a slow roast — the oven will warm the kitchen too.',
  'Heavy showers':     'Bake today! Ripe bananas make excellent banana bread.',
  'Light drizzle':     'A warm bowl of porridge with cinnamon suits drizzly mornings.',
  'Moderate drizzle':  'Slow-cooked stews taste best on rainy days — try a chickpea curry.',
  'Heavy drizzle':     'Perfect soup weather — add turmeric for an anti-inflammatory boost.',

  // Sunny / Clear
  'clear sky':         'Fresh salads shine on sunny days — try lemon zest for extra flavour.',
  'Clear sky':         'Fresh salads shine on sunny days — try lemon zest for extra flavour.',
  'Mainly clear':      'Great day for a cold pasta salad — add fresh herbs at the end.',
  'few clouds':        'Grill something today — marinate in garlic and olive oil overnight.',
  'scattered clouds':  'Ideal day for a fresh smoothie — spinach blends well with banana.',

  // Cloudy
  'broken clouds':     'Cloudy days call for comfort food — try a hearty vegetable soup.',
  'overcast clouds':   'Overcast? Perfect for baking — sourdough loves a cool kitchen.',
  'Partly cloudy':     'A light stir-fry works well today — add garlic late to keep its flavour.',
  'Overcast':          'Overcast? Perfect for baking — sourdough loves a cool kitchen.',

  // Cold / Snow
  'Light snow':        'Warm up with a spiced hot chocolate — add a pinch of chilli.',
  'Moderate snow':     'Hearty root vegetable soup is perfect for snowy days.',
  'Heavy snow':        'Nothing beats slow-cooked lamb on a heavy snow day.',
  'snow':              'Warm up with a spiced hot chocolate — add a pinch of chilli.',

  // Fog / Mist
  'mist':              'A warm ginger tea with honey is perfect for misty mornings.',
  'fog':               'Foggy days call for warming spices — try cardamom in your porridge.',
  'Foggy':             'A warm ginger tea with honey is perfect for misty mornings.',
  'Icy fog':           'Warm up from the inside — bone broth is ideal for icy days.',
  'haze':              'Keep it light today — a simple vegetable stir-fry works well.',

  // Storms
  'thunderstorm':      'Stay in and bake — fresh bread is perfect for a stormy evening.',
  'Thunderstorm':      'Stay in and bake — fresh bread is perfect for a stormy evening.',
  'Thunderstorm with hail': 'Perfect excuse to make a big batch of soup for the week.',
};

const DEFAULT_TIP = 'Add fresh herbs at the end of cooking to keep their flavour.';

function getTip(weatherString: string): string {
  const condition = weatherString.split(',')[0].trim();
  return WEATHER_TIPS[condition] ?? DEFAULT_TIP;
}

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
    // NotificationModal.tsx — in useEffect
Promise.allSettled([fetchWeather('Perth,AU'), fetchPastWeek(-31.9505, 115.8605)])
  .then(([todayResult, pastResult]) => {
    const newItems: Item[] = [];

    if (todayResult.status === 'fulfilled') {
      const today = todayResult.value;
      newItems.push({
        id: 0,
        isReal: true,
        weather: `${today.description}, ${today.temp}°C`,
        tip: getTip(today.description),
        timeLabel: 'Today',
      });
    }

    if (pastResult.status === 'fulfilled') {
      pastResult.value.forEach((d, i) =>
        newItems.push({
          id: i + 1,
          isReal: true,
          weather: d.description,
          tip: getTip(d.description),
          timeLabel: d.timeLabel,
        })
      );
    }

    setItems(newItems);
  })
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
  itemTip: { fontFamily: 'OpenSans_400Regular', fontSize: 11, color: '#000', lineHeight: 16 },
});