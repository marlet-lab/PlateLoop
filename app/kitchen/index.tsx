import {View, Text, Button, StyleSheet} from 'react-native';
import { router} from 'expo-router';

export default function KitchenScreen() {
    return(
        <View style = {styles.container}>
            <Button 
                title = "Go to inventory" 
                onPress={() => router.push('/inventory')}
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
    }

});