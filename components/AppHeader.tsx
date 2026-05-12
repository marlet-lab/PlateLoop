import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AppHeaderProps = {
    title: string;
    canGoBack?: boolean;
}; 


export default function AppHeader({
    title,
    canGoBack = false,
}: AppHeaderProps) {
    const router = useRouter();
    console.log('title:', title); // Log the value of title
    return (
        <View style = {styles.container}>
            <View style={styles.sideCardLeft}>
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

            <View style={styles.sideCardRight}>
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
        width: '100%',
        backgroundColor: 'F3F7F5',
        flexDirection: 'row',
        flex: 11,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sideCardLeft: {
        flexDirection: 'row',
        flex: 2, 


    },
    sideCardRight: {
        flexDirection: 'row',
        flex: 2, 
        gap: 24,
        justifyContent: 'flex-end',
    },
    title: {
        flex: 7, 
        fontSize: 34,
        fontWeight: '700',
        color: '#8B7Ae',
        textAlign: 'center',
    },
});