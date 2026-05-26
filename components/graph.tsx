/*import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-wagmi-charts';

type GraphData = {
    day: number;
    weight: number;
};

type GraphProps = {
    data: GraphData[];
};

export default function Graph({ data }: GraphProps) {
    const { width } = useWindowDimensions();

    let pointColor = '#3A8C5C';

    return (
        <View style={styles.container}>
            <LineChart.Provider data={data.map(item => ({
                timestamp: item.day,
                value: item.weight,
            }))}>
                <LineChart
                    width={width - 40}
                    height={300}
                >
                    <LineChart.Path
                        color={pointColor}
                        width={3}
                    />

                    <LineChart.CursorCrosshair
                        color={pointColor}
                    >
                        <LineChart.Tooltip />
                    </LineChart.CursorCrosshair>

                </LineChart>

                <View style={styles.tooltipContainer}>
                    <Text style={styles.label}>
                        Selected value
                    </Text>

                    <LineChart.PriceText
                        style={styles.value}
                    />

                    <LineChart.DatetimeText
                        style={styles.day}
                    />
                </View>
            </LineChart.Provider>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },

    tooltipContainer: {
        marginTop: 15,
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },

    label: {
        fontSize: 12,
    },

    value: {
        fontSize: 18,
        fontWeight: '600',
    },

    day: {
        marginTop: 5,
        fontSize: 14,
    },
});*/