import { router } from 'expo-router';
import { Button, StyleSheet, View } from 'react-native';

export default function InventoryScreen() {
    return(
        <View style = {styles.container}>
            <Button 
                title = "Go to kitchen view" 
                onPress={() => router.push('/kitchen')}
            />
            <Button
                title = "Go home"
                onPress = {() => router.push('/')}
            />
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
    },
});