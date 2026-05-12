import { Stack } from 'expo-router';
import AppHeader from '@/components/AppHeader';

export default function KitchenLayout() {
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
            <Stack.Screen name="index" options={{ title: 'Kitchen' }} />
        </Stack>
    );
}
