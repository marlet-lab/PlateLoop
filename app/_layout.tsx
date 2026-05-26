import { Stack } from 'expo-router';

export default function RootLayout() {
  // Check if we have a user token to determine if the user is authenticated.
  return (
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
    </Stack>
  );
}