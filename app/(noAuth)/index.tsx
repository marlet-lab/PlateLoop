import { router } from 'expo-router';
import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, signIn, signUp } from '../../config/firebase';

const { width, height } = Dimensions.get('window');
const BACKGROUND_IMAGE = require('../../assets/images/login-background.jpg');

const Index = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignUp = async () => {
    console.log('Email:', email);
    console.log('Password:', password);
    await signUp(auth, email, password);
  };

  const handleLogin = async () => {
    await signIn(auth, email, password);
    auth.currentUser != null ? router.push('/(auth)') : router.push('/(noAuth)');
  }

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
      <Text style={styles.pageTitle}>Manager Access</Text>
      <View style={styles.container}>
        <Text style={styles.cardTitle}>Login Now</Text>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Enter your password"
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
          <Text style={styles.loginButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Index;

const GREEN = '#9ADE51'

const styles = StyleSheet.create({ 
  background: {
    flex: 1,
    width:'100%',
    height:height,
    alignItems:'center',
    justifyContent: 'center',
  },
  pageTitle: {    
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 24,
  },
  container: {
    width:280,    
    backgroundColor: 'rgba(120,120,120,0.70)',
    borderRadius: 16,
    padding: 24,
    gap: 10,
    alignItems: 'center',
  },
    cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  label: {
    color: '#fff',
    alignSelf: 'flex-start',
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 2,
    borderColor: GREEN,
    borderRadius: 30,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  loginButton: {
    width: '100%',
    height: 48,
    backgroundColor: GREEN,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1.5,
  },
});