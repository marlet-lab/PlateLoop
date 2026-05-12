import { Stack } from 'expo-router';
import AppHeader from '@/components/AppHeader';

export default function InventoryLayout() {
    return (
        <Stack
            screenOptions={{
                header: ({ options, navigation }) => (
                    <AppHeader
                        title={options.title as string}
                        canGoBack={navigation.canGoBack()}
                    />
                ),
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Inventory' }} />
        </Stack>
    );
}
