import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

// Mock user data
const user = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+91 9876543210',
  addresses: [
    '123, MG Road, Bangalore',
    '456, Brigade Road, Bangalore',
  ],
};

// Mock order & pooja bookings
const orderHistory = [
  { id: 'ORD123', status: 'Delivered' },
  { id: 'ORD124', status: 'Shipped' },
];
const poojaHistory = [
  { id: 'POOJA1', service: 'Ganahoma', status: 'Completed' },
  { id: 'POOJA2', service: 'Navagraha Pooja', status: 'Pending' },
];

export default function Profile() {
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logged Out', 'You have been logged out.');
    router.replace('../onboarding');
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.heading}>My Profile</Text>

      {/* Profile Info */}
      <View style={styles.profileCard}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.info}>{user.email}</Text>
        <Text style={styles.info}>{user.phone}</Text>
      </View>

      {/* Address Book */}
      <Text style={styles.sectionTitle}>Address Book</Text>
      <FlatList
        data={user.addresses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.addressCard}>
            <Text>{item}</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <Pressable style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Add New Address</Text>
          </Pressable>
        )}
      />

      {/* Order History */}
      <Text style={styles.sectionTitle}>Order History</Text>
      {orderHistory.map((order) => (
        <View key={order.id} style={styles.historyCard}>
          <Text style={styles.historyText}>Order ID: {order.id}</Text>
          <Text style={styles.status}>{order.status}</Text>
        </View>
      ))}

      {/* Pooja Booking History */}
      <Text style={styles.sectionTitle}>Pooja Booking History</Text>
      {poojaHistory.map((b) => (
        <View key={b.id} style={styles.historyCard}>
          <Text style={styles.historyText}>{b.service}</Text>
          <Text style={styles.status}>{b.status}</Text>
        </View>
      ))}

      {/* Notification Preferences */}
      <View style={styles.notifyRow}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ true: '#4CAF50' }}
        />
      </View>

      {/* Logout */}
      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 28, fontWeight: '700', marginBottom: 20, color: '#333' },
  profileCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  info: { fontSize: 14, color: '#555' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 20, marginBottom: 10, color: '#333' },
  addressCard: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  addBtn: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnText: { color: '#fff', fontWeight: '600' },
  historyCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyText: { fontSize: 14, color: '#333' },
  status: { fontSize: 14, fontWeight: '600', color: '#4CAF50' },
  notifyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutBtn: {
    backgroundColor: '#FF5252',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
