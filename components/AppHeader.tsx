import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Card from './Card';

type AppHeaderProps = {
    title: string;
    canGoBack?: boolean;
};

export default function AppHeader({
    title,
    canGoBack = false,
}: AppHeaderProps) {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Card style={styles.sideCardLeft}>
                {canGoBack && (
                    <Pressable onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#0D7A5F" />
                    </Pressable>
                )}
                <Pressable onPress={() => router.push('/')}>
                    <Ionicons name="home-outline" size={24} color="#0D7A5F" />
                </Pressable>
            </Card>

            <Text style={styles.title}>{title}</Text>

            <Card style={styles.sideCardRight}>
                <Pressable>
                    <Ionicons name="settings-outline" size={24} color="#0D7A5F" />
                </Pressable>
                <Pressable>
                    <Ionicons name="notifications-outline" size={24} color="#0D7A5F" />
                </Pressable>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        width: '100%',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sideCardLeft: {
        flexDirection: 'row',
        flex: 0.8,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
    },
    sideCardRight: {
        flexDirection: 'row',
        flex: 0.8,
        borderTopLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
    },
    title: {
        flex: 7,
        fontSize: 34,
        fontWeight: '700',
        color: '#93BBB2',
        textAlign: 'center',
    },
});