import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, Pressable, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { apiGet, apiPut, getImageUrl } from '@/utils/api';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await apiGet('/orders/my', true); // ✅ Auth required
    if (res.success && res.orders) {
      setOrders(res.orders);
    }
    setLoading(false);
  };

  const cancelOrder = async (orderId: string) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            const res = await apiPut(`/orders/${orderId}/status`, { status: 'Cancelled' }, true);
            if (res.success) {
              fetchOrders(); // Refresh orders
              Alert.alert('Order cancelled successfully.');
            } else {
              Alert.alert('Failed to cancel order.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderStatus}>Status: {item.status}</Text>

      {item.items.map((prod: any) => (
  <View key={prod.product?._id || Math.random()} style={styles.productRow}>
    {prod.product ? (
      <>
        <Image
          source={{
            uri:
              Array.isArray(prod.product.images) && prod.product.images.length > 0
                ? getImageUrl(prod.product.images[0])
                : 'https://via.placeholder.com/100',
          }}
          style={styles.productImage}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.productName}>
            {prod.product.name} x{prod.quantity}
          </Text>
          <Text style={styles.productPrice}>₹{prod.product.price}</Text>
        </View>
      </>
    ) : (
      <Text style={{ color: 'red' }}>Product info not available</Text>
    )}
  </View>
      ))}


      <Text style={styles.total}>Total: ₹{item.totalAmount}</Text>

      {(item.status !== 'Cancelled' && item.status !== 'Delivered') && (
        <Pressable
          style={styles.cancelButton}
          onPress={() => cancelOrder(item._id)}
        >
          <Text style={styles.cancelButtonText}>Cancel Order</Text>
        </Pressable>
      )}
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
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No orders yet.</Text>
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
  orderStatus: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 10,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productName: { fontSize: 14, fontWeight: '600', color: '#333' },
  productPrice: { fontSize: 14, color: '#666', marginTop: 4 },
  total: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
    color: '#000',
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
