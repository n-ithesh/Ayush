import { View, Text, FlatList, StyleSheet } from 'react-native';

// Mock orders — replace with API response later!
const orders = [
  {
    id: 'ORD123',
    status: 'Delivered',
    total: 680,
    items: [
      { productId: '1', name: 'Ashwagandha', price: 250, quantity: 1 },
      { productId: '2', name: 'Tulsi Tea', price: 180, quantity: 2 },
    ],
  },
  {
    id: 'ORD124',
    status: 'Shipped',
    total: 200,
    items: [
      { productId: '4', name: 'Aloe Vera Gel', price: 200, quantity: 1 },
    ],
  },
];

export default function Orders() {
  const renderOrder = ({ item }: { item: typeof orders[0] }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderId}>Order ID: {item.id}</Text>
      <Text style={styles.orderStatus}>Status: {item.status}</Text>

      {item.items.map((prod) => (
        <View key={prod.productId} style={styles.productRow}>
          <Text style={styles.productName}>
            {prod.name} x{prod.quantity}
          </Text>
          <Text style={styles.productPrice}>₹{prod.price}</Text>
        </View>
      ))}

      <Text style={styles.total}>Total: ₹{item.total}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
