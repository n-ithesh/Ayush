import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { apiPost, saveToken } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    // Admin Shortcut
    if (email === 'admin@ayush.com' && password === 'admin123') {
      await AsyncStorage.setItem('authToken', 'admin-token');
      await AsyncStorage.setItem('isAdmin', 'true');
      router.replace('/admin/dashboard');
      return;
    }

    const data = await apiPost('/auth/login', { email, password });

    if (data.success && data.token) {
      await saveToken(data.token);
      Alert.alert('Success', 'Logged in successfully!');
      router.replace('/(tabs)/home');
    } else if (data.msg === 'User not found') {
      Alert.alert('Account Not Found', 'You don’t have an account. Please register.');
    } else if (data.msg === 'Invalid password') {
      Alert.alert('Incorrect Password', 'The password you entered is incorrect.');
    } else {
      Alert.alert('Login Failed', data.msg || 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👋 Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your Ayush account</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { flex: 1 }]}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable onPress={() => router.push('./register')}>
        <Text style={styles.link}>New user? Register here</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    color: '#7f8c8d',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#34495e',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeButton: {
    padding: 12,
    marginLeft: -40,
  },
  button: {
    backgroundColor: '#27ae60',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 16,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    color: '#2980b9',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
