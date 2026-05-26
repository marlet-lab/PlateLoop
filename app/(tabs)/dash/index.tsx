import Graph from '@/components/graph';
import { StyleSheet, Text, View } from 'react-native';

const DATA = [
    { day: 1, weight: 6 },
    { day: 2, weight: 9 },
    { day: 3, weight: 7 },
    { day: 4, weight: 10 },
    { day: 5, weight: 15 },
    { day: 6, weight: 12 },
    { day: 7, weight: 7 },
    { day: 8, weight: 6 },
    { day: 9, weight: 9 },
    { day: 10, weight: 7 },
    { day: 11, weight: 10 },
    { day: 12, weight: 15 },
    { day: 13, weight: 12 },
    { day: 14, weight: 7 },
    { day: 15, weight: 6 },
    { day: 16, weight: 9 },
    { day: 17, weight: 8 },
    { day: 18, weight: 10 },
    { day: 19, weight: 11 },
    { day: 20, weight: 12 },
    { day: 21, weight: 14 },
    { day: 22, weight: 13 },
    { day: 23, weight: 9 },
    { day: 24, weight: 8 },
    { day: 25, weight: 8 },
    { day: 26, weight: 7 },
    { day: 27, weight: 5 },
    { day: 28, weight: 6 },
];

const totalWaste = DATA.reduce((sum, d) => sum + d.weight, 0);

export default function InsightsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Waste Overview
            </Text>

            <Graph data={DATA}/>

            <Text style={styles.summary}>
                Total waste this month: {totalWaste} kg
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    summary: {
        marginTop: 20,
        textAlign: 'center',
    },
});