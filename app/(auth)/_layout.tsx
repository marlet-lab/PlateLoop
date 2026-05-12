import AppHeader from '@/components/AppHeader';
import { Stack } from 'expo-router';

export default function RootLayout() {
  // Check if we have a user token to determine if the user is authenticated.
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