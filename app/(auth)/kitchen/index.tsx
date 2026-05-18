import Card from '@/components/Card';
import { router, useNavigation } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

export default function KitchenScreen() {
    const navigation = useNavigation();
    navigation.setOptions({ title: 'Kitchen View' }); // Set the header title for this screen
    return(
        <View style = {styles.container}>
            <Card style={{ padding: 20, alignItems: 'center', gap: 10 }}>
            <Pressable
                onPress={() => router.push('/inventory')}
            >
                <text>Go to inventory</text>
            </Pressable>
            </Card>
            <Card style={{ padding: 20, alignItems: 'center', gap: 10 }}>
            <Pressable
                onPress={() => router.push('/')}
            >
                <text>Go home</text>
            </Pressable>
            </Card>
        </View>

    ); 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 20
    }

});