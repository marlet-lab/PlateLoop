import Card from '@/components/Card';
import { auth, signOutUser } from '@/config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const signOut = () => {
  router.push('/(noAuth)');
  signOutUser(auth);
};

export default function DashboardScreen() {
    const signOut = () => {
        router.push('/(noAuth)');
        signOutUser(auth);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.row}>
                {/* Insights-kort */}
                <Pressable style={styles.halfCard} onPress={() => router.push('/insights')}>
                    <Card style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Insights</Text>
                            <Ionicons name="arrow-forward" size={20} color="#000" />
                        </View>
                        <Image 
                        source={require('@/assets/images/GraphImage.png')}
                        style={styles.graphImage}
                        resizeMode="cover"
                        />
                    </Card>
                </Pressable>

                {/* Kitchen-kort */}
                <Pressable style={styles.halfCard} onPress={() => router.push('/kitchen')}>
                    <Card style={[styles.card, { justifyContent: 'flex-start' }, { justifyContent: 'space-between' }]}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Kitchen view</Text>
                            <Ionicons name="arrow-forward" size={20} color="#000" />
                        </View>
                        <View style={styles.scanButton}>
                            <Text style={styles.scanText}>Start Scanning  [A]</Text>
                        </View>
                    </Card>
                </Pressable>
            </View>
            
            <View style={styles.row}>
                {/* Expiring soon */}
                <Pressable style={styles.halfCard} onPress={() => router.push('/expiring')}>
                    <Card style={styles.smallCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Expiring soon</Text>
                            <Ionicons name="arrow-forward" size={20} color="#000" />
                        </View>
                    </Card>
                </Pressable>

                {/* Recipes */}
                <Pressable style={styles.halfCard} onPress={() => router.push('/recipes')}>
                    <Card style={styles.smallCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Recipes</Text>
                            <Ionicons name="arrow-forward" size={20} color="#000" />
                        </View>
                    </Card>
                </Pressable>
            </View>

            {/* Inventory */}
            <Pressable onPress={() => router.push('/inventory')}>
                <Card style={styles.wideCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Inventory</Text>
                        <Pressable style={styles.addButton}>
                            <Text style={styles.addButtonText}>Add Item +</Text>
                        </Pressable>
                    </View>
                </Card>
            </Pressable>

            {/* + knapp */}
            <View style={styles.fabContainer}>
                <Pressable style={styles.fab}>
                    <Ionicons name="add" size={32} color="#fff" />
                </Pressable>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
        backgroundColor: '#F5FAF9',
        flexGrow: 1,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    halfCard: {
        flex: 1,
    },
    card: {
        gap: 12,
        padding: 16,
        alignItems: 'flex-start',
        height: 250,
        width: '100%',
    },
    wideCard: {
        padding: 16,
        alignItems: 'flex-start',
        width: '100%',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
    },

    scanButton: {
        backgroundColor: '#731AE8',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    scanText: {
        color: '#fff',
        fontWeight: '600',
    },
    addButton: {
        backgroundColor: '#005D47',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    fabContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    fab: {
        backgroundColor: '#731AE8',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },

    graphImage: {
      width: '100%',
      flex: 1,
      borderRadius: 12,
  },

    smallCard: {
        padding: 16,
        alignItems: 'flex-start',
        width: '100%',
    },
});