import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  // Check if we have a user token to determine if the user is authenticated.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen 
            name = "index" options={{ title: '' }}
          />  
          <Stack.Screen 
            name = "(auth)" options={{title: 'PlateLoop (home)'}}
          />
          <Stack.Screen
            name = "(noAuth)/index" options={{title: 'Login'}}
          />
          <Stack.Screen
            name="inventory/index"
            options={{ title: 'Välj ingredienser' }}
          />
          <Stack.Screen 
            name="inventory/swipe" 
            options={{title: 'Swipe your ingredients'}} 
          />
        </Stack>
    </GestureHandlerRootView>
  );
}