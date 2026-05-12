import { router, useNavigation } from 'expo-router';
import { Button, StyleSheet, View } from 'react-native';

export default function KitchenScreen() {
    const navigation = useNavigation();
    navigation.setOptions({ title: 'Kitchen View' }); // Set the header title for this screen
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