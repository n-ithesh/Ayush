import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { apiGet } from '@/utils/api';

export default function Dashboard() {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);

    try {
      const prodRes = await apiGet('/products', true);
      const orderStats = await apiGet('/orders/stats', true);

      if (prodRes.success) {
        setProductCount(prodRes.products.length);
      }

      if (orderStats.success) {
        setOrderCount(orderStats.totalOrders || 0);
        setTotalRevenue(orderStats.totalRevenue || 0);
        setRecentActivities(orderStats.recentActivities || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats', error);
    }

    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <>
          {/* Summary Cards */}
          <View style={styles.row}>
            <StatCard
              icon={<Ionicons name="cube-outline" size={24} color="#fff" />}
              label="Products"
              value={productCount}
            />
            <StatCard
              icon={<FontAwesome5 name="shopping-cart" size={20} color="#fff" />}
              label="Orders"
              value={orderCount}
            />
            <StatCard
              icon={<MaterialIcons name="attach-money" size={26} color="#fff" />}
              label="Revenue"
              value={`₹${totalRevenue}`}
            />
          </View>

          {/* Recent Activity */}
          <Text style={styles.subheading}>Recent Activity</Text>
          <View style={styles.card}>
            {recentActivities.length === 0 ? (
              <Text>No recent activity</Text>
            ) : (
              recentActivities.map((item: any, idx) => (
                <Text key={idx}>• {item.message}</Text>
              ))
            )}
          </View>
        </>
      )}
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
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
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },
});
