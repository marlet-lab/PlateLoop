import Card from '@/components/Card';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function KitchenScreen() {
    return (
        <View style={styles.container}>
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
});
