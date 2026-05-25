import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    const insets = useSafeAreaInsets();


    return (
        //<View style = {styles.container}>
        <View style={[styles.container, { paddingTop: insets.top }]}>
            

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
      width: '100%',
      height: 80,
      backgroundColor: '#F3F7F5',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    sideCardLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      backgroundColor: '#FFFFFF',
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 16,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    sideCardRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      backgroundColor: '#FFFFFF',
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 16,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    title: {
      flex: 1,
      fontSize: 22,
      fontWeight: '700',
      color: '#93BBB2',
      textAlign: 'center',
      marginHorizontal: 12,
    },
  });

// const styles = StyleSheet.create({
//     container: {
//         color: '#FFFFFF',
//         height:100, 
//         width: '100%',
//         backgroundColor: 'F3F7F5',
//         flexDirection: 'row',
//         flex: 11,
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         margin: 40, 
//     },
//     sideCardLeft: {
//         flexDirection: 'row',
//         color: '#93BBB2',
//         flex: 2, 
//         gap: 24, 


//     },
//     sideCardRight: {
//         flexDirection: 'row',
//         color: '#93BBB2',
//         flex: 2, 
//         gap: 24,
//         justifyContent: 'flex-end',
//     },
//     title: {
//         flex: 7, 
//         fontSize: 34,
//         fontWeight: '700',
//         color: '#93BBB2',
//         textAlign: 'center',
//     },
// });