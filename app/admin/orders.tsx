import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGet, apiPut } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '@/utils/api';

const STATUS_OPTIONS = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, selectedStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    const isAdmin = await AsyncStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      Alert.alert('Access Denied', 'Only admins can view all orders.');
      setLoading(false);
      return;
    }
    const res = await apiGet('/orders', true);
    if (res.success && res.orders) {
      setOrders(res.orders);
    } else {
      Alert.alert('Error', res.msg || 'Failed to fetch orders');
    }
    setLoading(false);
  };

  const filterOrders = () => {
    if (selectedStatus === 'All') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((o) => o.status === selectedStatus));
    }
  };

  const toggleSelectOrder = (orderId: string) => {
    const newSet = new Set(selectedOrders);
    if (newSet.has(orderId)) {
      newSet.delete(orderId);
    } else {
      newSet.add(orderId);
    }
    setSelectedOrders(newSet);
  };

  const bulkUpdateStatus = async (status: string) => {
    const promises = Array.from(selectedOrders).map((id) =>
      apiPut(`/orders/${id}/status`, { status }, true)
    );
    await Promise.all(promises);
    Alert.alert('Success', `Updated ${selectedOrders.size} orders to ${status}`);
    setSelectedOrders(new Set());
    fetchOrders();
  };

  const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
    let nextStatus = '';
    if (currentStatus === 'Pending') nextStatus = 'Shipped';
    else if (currentStatus === 'Shipped') nextStatus = 'Delivered';
    else return;

    Alert.alert(
      'Update Status',
      `Mark order as ${nextStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            const res = await apiPut(`/orders/${orderId}/status`, { status: nextStatus }, true);
            if (res.success) {
              Alert.alert('Success', `Order marked as ${nextStatus}`);
              fetchOrders();
            } else {
              Alert.alert('Error', res.msg || 'Failed to update status');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#f57c00';
      case 'Shipped': return '#0288d1';
      case 'Delivered': return '#388e3c';
      case 'Cancelled': return '#d32f2f';
      default: return '#666';
    }
  };

  const renderOrder = ({ item }: { item: any }) => {
    const isSelected = selectedOrders.has(item._id);
    const createdAt = new Date(item.createdAt).toLocaleString();
    const address = item.shippingAddress || {};
    const fullAddress = [address.street, address.city, address.state, address.zip]
      .filter(Boolean).join(', ');

    return (
      <TouchableOpacity onLongPress={() => toggleSelectOrder(item._id)}>
        <View style={[styles.orderCard, isSelected && styles.selectedCard]}>
          <View style={styles.headerRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="person" size={16} color="#333" />
              <Text style={styles.user}> {item.user?.name || 'Unknown'}</Text>
            </View>
            <Text style={[styles.status, { color: getStatusColor(item.status) }]}>Status: {item.status}</Text>
          </View>

          <Text style={styles.date}><Ionicons name="time-outline" size={14} /> Placed On: {createdAt}</Text>

          {fullAddress ? (
            <Text style={styles.address}><Ionicons name="location-outline" size={14} /> {fullAddress}</Text>
          ) : null}

          <View style={styles.divider} />

          {item.items.map((it: any) => (
            <View key={it.product._id} style={styles.productRow}>
              <Image
                source={{ uri: getImageUrl(it.product.images[0]) }} // ✅ fix this line
                style={{ width: 60, height: 60, borderRadius: 8 }}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text>{it.product.name}</Text>
                <Text>Qty: {it.quantity}</Text>
              </View>
              <Text>₹{it.product.price}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <Text style={styles.total}>Total: ₹{item.totalAmount}</Text>

          {(item.status !== 'Delivered' && item.status !== 'Cancelled') && (
            <Pressable
              onPress={() => handleStatusUpdate(item._id, item.status)}
              style={styles.updateButton}
            >
              <Text style={styles.updateText}>
                Mark as {item.status === 'Pending' ? 'Shipped' : 'Delivered'}
              </Text>
            </Pressable>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All Orders</Text>

      <View style={styles.filterRow}>
        {STATUS_OPTIONS.map((status) => (
          <Pressable
            key={status}
            onPress={() => setSelectedStatus(status)}
            style={[styles.filterBtn, selectedStatus === status && styles.activeFilter]}
          >
            <Text style={{ color: selectedStatus === status ? '#fff' : '#333', fontSize: 13 }}>
              {status}
            </Text>
          </Pressable>
        ))}
      </View>

      {selectedOrders.size > 0 && (
        <View style={styles.bulkActionRow}>
          {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
            <Pressable
              key={s}
              onPress={() => bulkUpdateStatus(s)}
              style={styles.bulkButton}
            >
              <Text style={styles.bulkButtonText}>{s}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={filteredOrders}
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e9',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  user: { fontWeight: '600', fontSize: 15 },
  status: { fontSize: 13, fontWeight: '600' },
  date: { fontSize: 12, color: '#777', marginBottom: 4 },
  address: { fontSize: 13, color: '#555', marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  total: {
    fontWeight: '700',
    textAlign: 'right',
    fontSize: 15,
    marginBottom: 10,
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginRight: 6,
    marginBottom: 6,
  },
  activeFilter: {
    backgroundColor: '#4CAF50',
  },
  bulkActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  bulkButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  bulkButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
