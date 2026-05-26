import AppHeader from '@/components/AppHeader';
import NotificationModal from '@/components/NotificationModal';
import { auth, signOutUser } from '@/config/firebase';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const index = () => {
  const [notifVisible, setNotifVisible] = useState(false);

  const signOut = () => {
    router.push('/(noAuth)');
    signOutUser(auth);
  }
  
  return (
    <View style = {styles.container}>
      <View style={styles.headerWrapper}>
        <AppHeader title="Home" onNotificationPress={() => setNotifVisible(true)}/>
      </View>
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
      <NotificationModal
        visible={notifVisible}
        onClose={() => setNotifVisible(false)}
      />
    </View>
  )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
        //padding: 20
    },
    headerWrapper: {
    width: '100%',
    height: 100,        
    flexShrink: 0, 
  },
});