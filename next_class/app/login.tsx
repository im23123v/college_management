import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from '@env';

export default function Login() {
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
 

const handleLogin = async () => {
  if (!userId || !password) {
    Alert.alert('Error', 'Please enter both Email/User ID and Password');
    return;
  }
 console.log("http://localhost:5000/auth/login");

  try {
   

    const res = await fetch(`http://localhost:5000/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: userId,
        password
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      Alert.alert('Login Failed', data.msg || 'Invalid credentials');
      return;
    }
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('email', data.identifier); 
    switch (data.user.role.name) {
      case 'developer':
        router.push('/developer');
        break;
      case 'admin':
      case 'college-admin':
        router.push('/admin');
        break;
      default:
        Alert.alert('Error', 'Unknown role');
        break;
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Something went wrong. Please try again.');
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Email or User ID"
          value={userId}
          onChangeText={setUserId}
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Developer button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#27ae60', marginTop: 15 }]}
          onPress={() => router.push('/developer')}
        >
          <Text style={styles.buttonText}>Login as Developer</Text>
        </TouchableOpacity>

        {/* Admin button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#8e44ad', marginTop: 10 }]}
          onPress={() => router.push('/admin')}
        >
          <Text style={styles.buttonText}>Login as Admin</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
  },
});
