import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { apiPost } from '../../utils/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword || !phone || !address) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const res = await apiPost('/auth/register', {
        name, email, password, phone, addresses: [address],
      });

      if (res.msg === 'User registered') {
        Alert.alert('Success', 'You can now log in.');
        router.replace('./login');
      } else {
        Alert.alert('Error', res.msg || 'Registration failed.');
      }
    } catch (err) {
      Alert.alert('Error', 'Network or server error.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Customers only</Text>

      <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Phone Number" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
      <TextInput placeholder="Address" value={address} onChangeText={setAddress} multiline numberOfLines={3} style={[styles.input, { height: 80 }]} />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>

      <Pressable onPress={() => router.replace('./login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff', flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 8, textAlign: 'center', color: '#333' },
  subtitle: { fontSize: 16, marginBottom: 32, textAlign: 'center', color: '#666' },
  input: {
    borderWidth: 1, borderColor: '#ddd', backgroundColor: '#f9f9f9',
    padding: 14, borderRadius: 8, marginBottom: 16, fontSize: 16, color: '#333'
  },
  button: { backgroundColor: '#4CAF50', paddingVertical: 16, borderRadius: 8, marginBottom: 20 },
  buttonText: { textAlign: 'center', color: '#fff', fontWeight: '600', fontSize: 18 },
  link: { color: '#4CAF50', textAlign: 'center', fontSize: 16 },
});
