import { Tabs, useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import AppHeader from '@/components/AppHeader';

const ACTIVE_COLOR = '#0D7A5F';
const INACTIVE_COLOR = '#888';

const TAB_ITEMS = [
    { key: 'back',      icon: 'arrow-back-outline',  label: 'Back'     },
    { key: 'index',     icon: 'home-outline',         label: 'Home'     },
    { key: 'settings',  icon: 'settings-outline',     label: 'Settings' },
    { key: 'profile',   icon: 'person-outline',       label: 'Profile'  },
] as const;

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
    const router = useRouter();
    const currentRoute = state.routes[state.index]?.name;

    return (
        <View style={styles.tabBar}>
            {TAB_ITEMS.map((item) => {
                const isActive =
                    item.key !== 'back' &&
                    (currentRoute === item.key || currentRoute?.startsWith(item.key));
                const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;

                const onPress =
                    item.key === 'back'
                        ? () => router.back()
                        : () => navigation.navigate(item.key);

                return (
                    <Pressable key={item.key} style={styles.tabItem} onPress={onPress}>
                        <Ionicons name={item.icon} size={24} color={color} />
                        <Text style={[styles.label, { color }]}>{item.label}</Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                header: ({ options, navigation }) => (
                    <AppHeader
                        title={options.title as string}
                        canGoBack={navigation.canGoBack()}
                    />
                ),
            }}
        >
            <Tabs.Screen name="index"     options={{ title: 'Home' }}     />
            <Tabs.Screen name="settings"  options={{ title: 'Settings' }} />
            <Tabs.Screen name="profile"   options={{ title: 'Profile' }}  />
            {/* Hidden from tab bar — navigated to via home screen cards */}
            <Tabs.Screen name="kitchen"   options={{ href: null, title: 'Kitchen' }}   />
            <Tabs.Screen name="inventory" options={{ href: null, title: 'Inventory' }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        height: 64,
        paddingBottom: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    label: {
        fontSize: 11,
    },
});
