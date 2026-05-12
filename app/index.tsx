
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { auth } from '../config/firebase';

const index = () => {
    console.log('Current user:', auth.currentUser); // Log the current user to check if it's null or not
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => {
        auth.currentUser != null ? router.push('/(auth)') : router.push('/(noAuth)');
        }, 2000); // Simulate a loading time of 2 seconds
    }, []);
  return (
    <View style = {styles.container}>
        <Image source={require('../assets/images/logo_1.png')} />
        <ActivityIndicator size="large" color="#0D7A5F" />
        <Text> Loading... </Text>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        padding: 20
    },
});
