import { View, Text, StyleSheet } from 'react-native';

export default function KitchenScreen() {
    return (
        <View style={styles.container}>
            <Text>Kitchen View</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
