import Card from '@/components/Card';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const attentionItems = [
    { name: 'Carrots', amount: '3,2 kg', category: 'Vegetables', location: 'Refrigerator 1', expiry: 'Expires today', tone: 'red' as const },
    { name: 'Heavy cream', amount: '1 L', category: 'Dairy', location: 'Refrigerator 1', expiry: 'Expires in 2 days', tone: 'orange' as const },
    { name: 'Onions', amount: '2 kg', category: 'Vegetables', location: 'Refrigerator 2', expiry: 'Expires in 2 days', tone: 'green' as const },
];

const prepItems = [
    { name: 'Carrots', amount: '3,2 kg', tone: 'red' as const, filled: false },
    { name: 'Heavy cream', amount: '1 L', tone: 'orange' as const, filled: false },
    { name: 'Onions', amount: '2 kg', tone: 'green' as const, filled: false },
    { name: 'Heavy cream', amount: '1 L', tone: 'orange' as const, filled: true },
    { name: 'Heavy cream', amount: '1 L', tone: 'orange' as const, filled: true },
];

const toneColors = {
    red: { bg: '#FDE7E7', text: '#C0392B' },
    orange: { bg: '#FCE9D4', text: '#C97A1A' },
    green: { bg: '#E0F2E5', text: '#2E7D4F' },
};

export default function KitchenScreen() {
    return (
        <View style={styles.container}>
            {/* Left column */}
            <View style={styles.leftColumn}>
                <Pressable onPress={() => router.push('/kitchen/camera')}>
                    <Card style={styles.scanButton}>
                        <Text style={styles.scanText}>Start Scanning</Text>
                        <Ionicons name="scan-outline" size={32} color="#FFFFFF" />
                    </Card>
                </Pressable>

                <Card style={styles.listCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="alert-circle-outline" size={22} color="#7A5230" />
                        <Text style={styles.cardHeaderText}>Needs attention</Text>
                    </View>

                    {attentionItems.map((item, i) => (
                        <View key={i} style={styles.attentionRow}>
                            <View style={styles.attentionLeft}>
                                <View style={[styles.badge, { backgroundColor: toneColors[item.tone].bg }]}>
                                    <Text style={[styles.badgeText, { color: toneColors[item.tone].text }]}>
                                        {item.expiry}
                                    </Text>
                                </View>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemMeta}>
                                    {item.amount}  •  {item.category}  •  {item.location}
                                </Text>
                            </View>
                            <Text style={styles.addToList}>+ Add to list</Text>
                        </View>
                    ))}
                </Card>
            </View>

            {/* Right column */}
            <View style={styles.rightColumn}>
                <Card style={styles.addItemsButton}>
                    <Ionicons name="add" size={22} color="#FFFFFF" />
                    <Text style={styles.addItemsText}>Add items</Text>
                </Card>

                <Card style={styles.prepCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="clipboard-outline" size={22} color="#1E3A8A" />
                        <Text style={[styles.cardHeaderText, { color: '#1E3A8A' }]}>Prep List</Text>
                    </View>

                    {prepItems.map((item, i) => (
                        <View key={i} style={styles.prepRow}>
                            <View
                                style={[
                                    styles.dot,
                                    { borderColor: toneColors[item.tone].text },
                                    item.filled && { backgroundColor: toneColors[item.tone].text },
                                ]}
                            />
                            <Text style={styles.prepName}>{item.name}</Text>
                            <Text style={styles.prepAmount}>{item.amount}</Text>
                            <Ionicons name="pencil-outline" size={16} color="#9CA3AF" />
                        </View>
                    ))}
                </Card>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 24,
        gap: 24,
    },
    leftColumn: {
        flex: 2,
        gap: 24,
    },
    rightColumn: {
        flex: 1,
        gap: 24,
    },

    // Start scanning button
    scanButton: {
        flexDirection: 'row',
        gap: 16,
        backgroundColor: '#C8A8E9',
        borderColor: '#8E6FBF',
        borderWidth: 2,
        paddingVertical: 32,
    },
    scanText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Add items button
    addItemsButton: {
        flexDirection: 'row',
        gap: 8,
        backgroundColor: '#0D5944',
        borderColor: '#0D5944',
        paddingVertical: 14,
        alignSelf: 'flex-end',
        paddingHorizontal: 28,
    },
    addItemsText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // Card headers
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    cardHeaderText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#7A5230',
    },

    // Needs attention card
    listCard: {
        alignItems: 'stretch',
        gap: 16,
    },
    attentionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#EAEAEA',
    },
    attentionLeft: {
        gap: 4,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 8,
        marginBottom: 4,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
    itemMeta: {
        fontSize: 12,
        color: '#999',
    },
    addToList: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0D7A5F',
    },

    // Prep list card
    prepCard: {
        alignItems: 'stretch',
        gap: 14,
        backgroundColor: '#F0F5FA',
        borderColor: '#7BA7E8',
    },
    prepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#D9E4F3',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1.5,
    },
    prepName: {
        flex: 1,
        fontSize: 14,
        color: '#222',
    },
    prepAmount: {
        fontSize: 14,
        color: '#222',
        marginRight: 6,
    },
});
