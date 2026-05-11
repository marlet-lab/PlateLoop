import { Stack } from 'expo-router';
import AppHeader from '@/components/AppHeader';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({ options, navigation }) => (
          <AppHeader 
           // title={(options.title as string) || 'PlateLoop'}
            title={(options.title as string)}
            canGoBack = {navigation.canGoBack()}
          />
        ),
      }}
    >
      <Stack.Screen 
        name = "index" options={{ title: 'PlateLoop (home)' }}
      />  
      <Stack.Screen 
        name = "kitchen" options={{title: 'Kitchen View'}}
      />
      <Stack.Screen
        name = "inventory" options={{title: 'Inventory'}}
      />
    </Stack>
  );
}