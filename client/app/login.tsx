import React, { useState } from 'react';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Placeholder: Add authentication logic here
    alert('Login with: ' + phone);
    // router.push('home'); // Example navigation after login
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Login</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#BFD8E6"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <ThemedText style={styles.buttonText}>Continue</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#162447',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    color: '#00CFFF',
    marginBottom: 32,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#1D3D47',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#00CFFF',
  },
  button: {
    backgroundColor: '#00CFFF',
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: 'center',
  },
  buttonText: {
    color: '#162447',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
