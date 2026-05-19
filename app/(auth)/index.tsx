import { auth, signOutUser } from '@/config/firebase'
import { router } from 'expo-router'
import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

const index = () => {
  const signOut = () => {
    router.push('/(noAuth)');
    signOutUser(auth);
  }
  return (
    <View style = {styles.container}>
        <Button 
            title = "Go to kitchen" 
            onPress={() => router.push('/kitchen')}
        />
        <Button 
            title = "Go to inventory" 
            onPress={() => router.push('/inventory')}
        />
        <Button
            title = "Sign out"
            onPress = {signOut}
        />
        <Button 
           title="Log waste" 
           onPress={() => router.push('/log-waste')}
/>
      <Text> Home screen </Text>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 20
    },
});