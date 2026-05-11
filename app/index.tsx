import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const index = () => {
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