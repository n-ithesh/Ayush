import { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('./onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/ayush-icon.png')} style={styles.icon} />
      <Text style={styles.text}>Ayush</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  icon: { width: 120, height: 120, marginBottom: 20 },
  text: { fontSize: 32, fontWeight: 'bold', color: '#4CAF50' },
});
