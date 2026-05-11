import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
        <View style = {styles.container}>
            <View style={styles.sideCard}>
                {canGoBack && (
                    <Pressable onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#0D7A5F" />
                    </Pressable>
                )}

                <Pressable onPress={() => router.push('/')}>
                    <Ionicons name="home-outline" size={24} color="#0D7A5F" />
                </Pressable>
            </View>

            <Text style={styles.title}>{title}</Text>

            <View style={styles.sideCard}>
                <Pressable>
                    <Ionicons name="settings-outline" size={24} color="#0D7A5F" />
                </Pressable>

                <Pressable>
                    <Ionicons name="notifications-outline" size={24} color="#0D7A5F" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height:100, 
        backgroundColor: 'F3F7F5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    sideCard: {

    },
    title: {
        fontSize: 34,
        fontWeight: '700',
        color: '#8B7Ae',
    },
});