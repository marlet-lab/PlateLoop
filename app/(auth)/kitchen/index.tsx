import AppHeader from '@/components/AppHeader';
import Card from '@/components/Card';
import NotificationModal from '@/components/NotificationModal';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, } from 'react-native';

export default function KitchenScreen() {
    const [notifVisible, setNotifVisible] = useState(false);
    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    header: ({ navigation }) => (
                        <AppHeader
                            title="Kitchen View"
                            canGoBack={navigation.canGoBack()}
                            onNotificationPress={() => setNotifVisible(true)}
                        />
                    ),
                }}
            />

            <Pressable onPress={() => router.push('/inventory')}>
                {({ pressed }) => (
                    <Card style={[styles.cardButton, pressed && styles.cardButtonPressed]}>
                        <Text style={[styles.buttonText, pressed && styles.buttonTextPressed]}>
                            Go to inventory
                        </Text>
                    </Card>
                )}
            </Pressable>

            <Pressable onPress={() => router.push('/')}>
                {({ pressed }) => (
                    <Card style={[styles.cardButton, pressed && styles.cardButtonPressed]}>
                        <Text style={[styles.buttonText, pressed && styles.buttonTextPressed]}>
                            Go home
                        </Text>
                    </Card>
                )}
            </Pressable>

            <Pressable onPress={() => router.push('/kitchen/camera')}>
                {({ pressed }) => (
                    <Card style={[styles.cardButton, pressed && styles.cardButtonPressed]}>
                        <Text style={[styles.buttonText, pressed && styles.buttonTextPressed]}>
                            Open camera
                        </Text>
                    </Card>
                )}
            </Pressable>
            <NotificationModal visible={notifVisible} onClose={() => setNotifVisible(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 20,
    },
    cardButton: {
        padding: 20,
        gap: 10,
    },
    cardButtonPressed: {
        backgroundColor: '#0D7A5F',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0D7A5F',
    },
    buttonTextPressed: {
        color: '#FFFFFF',
    },
    headerWrapper: {
    width: '100%',
    height: 100,        
    flexShrink: 0,
  },
});
