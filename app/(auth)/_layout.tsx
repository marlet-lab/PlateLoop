import AppHeader from '@/components/AppHeader';
import { Stack } from 'expo-router';

export default function RootLayout() {
  // Check if we have a user token to determine if the user is authenticated.
  return (
    <Stack
      screenOptions={{
        header: ({ options, navigation, route }) => (
          <AppHeader
            title={(options.title as string)}
            canGoBack={navigation.canGoBack()}
            logoSource={route.name === 'index' ? require('../../assets/images/logo_1.png') : undefined}
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
      <Stack.Screen
        name = "kitchen/camera" options={{ headerShown: false }}
      />
    </Stack>
  );
}