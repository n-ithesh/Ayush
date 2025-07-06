import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { apiGet } from '@/utils/api';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await apiGet('/orders/my', true); // ✅ Auth required
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderId}>Order ID: {item._id}</Text>
      <Text style={styles.orderStatus}>Status: {item.status}</Text>

      {item.items.map((prod: any) => (
        <View key={prod.product._id} style={styles.productRow}>
          <Text style={styles.productName}>
            {prod.product.name} x{prod.quantity}
          </Text>
          <Text style={styles.productPrice}>₹{prod.product.price}</Text>
        </View>
      ))}

      <Text style={styles.total}>Total: ₹{item.totalAmount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Orders</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              No orders yet.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 28, fontWeight: '700', marginBottom: 20, color: '#333' },
  orderCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  orderId: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  orderStatus: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 10,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  productName: { fontSize: 14, color: '#333' },
  productPrice: { fontSize: 14, fontWeight: '600', color: '#333' },
  total: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
    color: '#333',
  },
});
