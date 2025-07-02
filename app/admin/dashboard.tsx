// app/admin/dashboard.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function Dashboard() {
  const mockStats = {
    products: 120,
    orders: 45,
    revenue: 27500,
    lowStockAlerts: [
      { name: 'Tulsi Drops', quantity: 3 },
      { name: 'Ayur Face Cream', quantity: 1 },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      {/* Summary Cards */}
      <View style={styles.row}>
        <StatCard icon={<Ionicons name="cube-outline" size={24} color="#fff" />} label="Products" value={mockStats.products} />
        <StatCard icon={<FontAwesome5 name="shopping-cart" size={20} color="#fff" />} label="Orders" value={mockStats.orders} />
        <StatCard icon={<MaterialIcons name="attach-money" size={26} color="#fff" />} label="Revenue" value={`₹${mockStats.revenue}`} />
      </View>

      {/* Recent Activity */}
      <Text style={styles.subheading}>Recent Activity</Text>
      <View style={styles.card}>
        <Text>✓ New order received</Text>
        <Text>✓ 3 products updated</Text>
        <Text>✓ 1 user registered</Text>
      </View>

      {/* Alerts */}
      <Text style={styles.subheading}>Alerts</Text>
      {mockStats.lowStockAlerts.map((item, index) => (
        <View key={index} style={styles.alert}>
          <Text style={{ color: 'red' }}>{item.name} is low in stock ({item.quantity} left)</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const StatCard = ({ icon, label, value }) => (
  <View style={styles.statCard}>
    {icon}
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  subheading: { fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: {
    backgroundColor: '#00897b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    margin: 5,
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  statLabel: { color: '#fff', marginTop: 4 },
  card: { backgroundColor: '#f0f0f0', padding: 16, borderRadius: 12 },
  alert: { backgroundColor: '#ffe6e6', padding: 10, borderRadius: 8, marginBottom: 6 },
});
