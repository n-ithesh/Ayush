import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { apiGet, apiPut } from '@/utils/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await apiGet('/orders', true); // ✅ Admin-only route
    if (res.success && res.orders) {
      setOrders(res.orders);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
    const nextStatus =
      currentStatus === 'Pending'
        ? 'Shipped'
        : currentStatus === 'Shipped'
        ? 'Delivered'
        : 'Delivered';

    const res = await apiPut(`/orders/${orderId}`, { status: nextStatus }, true);
    if (res.success) {
      Alert.alert('Status Updated', `Order marked as ${nextStatus}`);
      fetchOrders();
    } else {
      Alert.alert('Error', res.msg || 'Failed to update status');
    }
  };

  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderId}>Order ID: {item._id}</Text>
      <Text style={styles.user}>User: {item.user?.name || 'Unknown'}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>

      {item.items.map((it: any) => (
        <View key={it.product._id} style={styles.productRow}>
          <Text>{it.product.name} x{it.quantity}</Text>
          <Text>₹{it.product.price}</Text>
        </View>
      ))}

      <Text style={styles.total}>Total: ₹{item.totalAmount}</Text>

      <Pressable
        onPress={() => handleStatusUpdate(item._id, item.status)}
        style={styles.updateButton}
      >
        <Text style={styles.updateText}>Mark as {item.status === 'Pending' ? 'Shipped' : 'Delivered'}</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All Orders</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  orderCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  orderId: { fontWeight: '700', marginBottom: 4 },
  user: { marginBottom: 6, color: '#444' },
  status: { marginBottom: 10, fontWeight: '600', color: '#4CAF50' },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  total: {
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 10,
    textAlign: 'right',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
  },
  updateText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
