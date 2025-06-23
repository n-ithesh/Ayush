import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Onboarding() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Ayush</Text>
      <Text style={styles.subtitle}>Your Ayurveda & Pooja companion</Text>

      <Pressable style={styles.button} onPress={() => router.push('./auth/login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 12, color: '#333' },
  subtitle: { fontSize: 16, marginBottom: 40, textAlign: 'center', color: '#666' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
