import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
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