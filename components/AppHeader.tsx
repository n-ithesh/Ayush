import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AppHeader() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {/* Logo / Brand */}
      <Text style={styles.logo}>Ayush</Text>

      {/* Right Icons */}
      <View style={styles.icons}>
        <Pressable onPress={() => router.push('/cart')}>
          <Ionicons name="cart-outline" size={24} color="#333" style={styles.icon} />
        </Pressable>
        <Pressable onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle-outline" size={28} color="#333" style={styles.icon} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
  },
  icons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 20,
  },
});
