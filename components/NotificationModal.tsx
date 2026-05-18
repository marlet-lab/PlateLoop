import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchWeather } from '../services/weatherService';

type Props = { visible: boolean; onClose: () => void; };

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PANEL_WIDTH = Platform.OS === 'web' ? 500 : SCREEN_WIDTH * 0.85;

// 1. Pre-process static data to include 'id' and 'isReal' natively, avoiding runtime .map() overhead
const EXAMPLE_PAST_DAYS = [
  { id: 1, isReal: false, weather: 'Rainy Day', tip: 'Ripe bananas are perfect for baking.', timeLabel: 'Yesterday' },
  { id: 2, isReal: false, weather: 'Sunny Day', tip: 'Add garlic late — it loses benefits when overcooked.', timeLabel: '2 days ago' },
  { id: 3, isReal: false, weather: 'Cloudy Day', tip: 'Use more spinach than you think — it wilts a lot.', timeLabel: '3 days ago' },
  { id: 4, isReal: false, weather: 'Windy Day', tip: 'Lemon zest adds flavour without the acidity.', timeLabel: '4 days ago' },
  { id: 5, isReal: false, weather: 'Partly Cloudy', tip: 'Chickpeas are a great meat substitute in stews.', timeLabel: '5 days ago' },
  { id: 6, isReal: false, weather: 'Clear Sky', tip: 'Add fresh herbs at the end of cooking.', timeLabel: '6 days ago' },
];

const WEATHER_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  'Rainy Day': 'weather-pouring', 'Sunny Day': 'weather-sunny', 'Cloudy Day': 'weather-cloudy',
  'Windy Day': 'weather-windy', 'Partly Cloudy': 'weather-partly-cloudy', 'Clear Sky': 'weather-sunny',
};

export default function NotificationModal({ visible, onClose }: Props) {
  const [items, setItems] = useState(EXAMPLE_PAST_DAYS); // 2. Default to example data
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(PANEL_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : PANEL_WIDTH,
      duration: visible ? 250 : 200,
      useNativeDriver: true,
    }).start();
    
    if (visible) {
      setLoading(true);      
      fetchWeather('London')
        .then(({ description, temp }) => {
          setItems([{ 
            id: 0, isReal: true, weather: `${description}, ${temp}°C`, 
            tip: 'Try turmeric in your soup for an anti-inflammatory boost.', timeLabel: 'Today' 
          }, ...EXAMPLE_PAST_DAYS]);
        })
        .catch(() => setItems(EXAMPLE_PAST_DAYS))
        .finally(() => setLoading(false));
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <Animated.View style={[styles.panel, { transform: [{ translateX: slideAnim }] }]}>
        
        <View style={styles.header}>
          <Text style={styles.heading}>Notifications</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {loading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 24 }} />
          ) : (
            items.map((item) => (
              <View key={item.id} style={styles.item}>
                <MaterialCommunityIcons 
                  name={WEATHER_ICONS[item.weather.split(',')[0]] || 'weather-cloudy'} 
                  size={24} 
                  color={item.isReal ? COLORS.primary : '#6B7280'} 
                  style={{ marginTop: 2 }}
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
            ))
          )}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const COLORS = { primary: '#3352BA', primaryDark: '#0000B8', accent: '#FFC168', background: '#F5FAF9', text: '#333333' };

// 4. Grouped standard layout properties to save vertical space
const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.30)' },
  panel: {
    position: 'absolute', top: 0, right: 0, bottom: 0, width: PANEL_WIDTH,
    backgroundColor: COLORS.background, paddingTop: 56, paddingHorizontal: 18,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 10,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#D9EAE7' },
  heading: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: COLORS.primary },
  item: {
    flexDirection: 'row', gap: 12, marginBottom: 14, backgroundColor: '#ECFDF5',
    borderRadius: 24, paddingVertical: 14, paddingHorizontal: 18, borderWidth: 1, borderColor: '#000',
  },
  itemBody: { flex: 1, gap: 3 },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemWeather: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.text },
  itemTime: { fontFamily: 'OpenSans_400Regular', fontSize: 10, color: '#999' },
  itemTip: { fontFamily: 'OpenSans_400Regular', fontSize: 11, color: '#555', lineHeight: 16 },
  exampleTag: { fontFamily: 'OpenSans_400Regular', fontSize: 10, color: COLORS.accent, fontStyle: 'italic' },
});