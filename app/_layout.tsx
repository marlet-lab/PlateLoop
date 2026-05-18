import { Inter_400Regular, Inter_600SemiBold, useFonts } from '@expo-google-fonts/inter';
import { OpenSans_400Regular } from '@expo-google-fonts/open-sans';
import { Stack } from 'expo-router';

export default function RootLayout() {
  //Add fonts
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_600SemiBold, OpenSans_400Regular });
  if (!fontsLoaded) return null;
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