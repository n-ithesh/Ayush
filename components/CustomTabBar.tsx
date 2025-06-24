// components/CustomTabBar.tsx

import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';

export default function CustomTabBar() {
  const router = useRouter();
  const segments = useSegments();

  // Determine which tab is active
  const current = segments[1] || 'home';

  const tabs: {
    name: string;
    label: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
  }[] = [
    { name: 'home', label: 'Home', icon: 'home-outline' },
    { name: 'products', label: 'Products', icon: 'pricetag-outline' },
    { name: 'pooja-booking', label: 'Pooja', icon: 'calendar-outline' },
    { name: 'orders', label: 'Orders', icon: 'list-outline' },
    { name: 'profile', label: 'Profile', icon: 'person-outline' },
  ];

  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const isActive = current === tab.name;
        return (
          <Pressable
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(`./${tab.name}`)}
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={isActive ? '#4CAF50' : '#555'}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  activeLabel: {
    color: '#4CAF50',
    fontWeight: '700',
  },
});
