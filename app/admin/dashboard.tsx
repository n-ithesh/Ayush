// app/admin/dashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Platform,
} from 'react-native';
import {
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiGet , apiPatch } from '@/utils/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function Dashboard() {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalBookings, setTotalBookings] = useState(0);
  const [bookingActivities, setBookingActivities] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Pending');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const allBookings = await apiGet('/bookings/all', true);
      if (allBookings.success) {
        const sorted = allBookings.bookings.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBookingActivities(sorted);
        setTotalBookings(sorted.length);
      }

      const prodRes = await apiGet('/products', true);
      const orderStats = await apiGet('/orders/stats', true);
      const userRes = await apiGet('/admin/user-count', true);

      if (prodRes.success) setProductCount(prodRes.products.length);
      if (orderStats.success) {
        setOrderCount(orderStats.totalOrders || 0);
        setTotalRevenue(orderStats.totalRevenue || 0);
        setRecentActivities(orderStats.recentActivities || []);
      }
      if (userRes.success) setUserCount(userRes.count || 0);
    } catch (error) {
      console.error('Failed to load dashboard stats', error);
    }
    setLoading(false);
  };

  const filteredBookings = bookingActivities.filter(
    (b) => b.status === selectedStatus
  );

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
              icon={<Ionicons name="cube-outline" size={24} color="#000" />}
              label="Products"
              value={productCount}
            />
            <StatCard
              icon={<FontAwesome5 name="shopping-cart" size={20} color="#000" />}
              label="Orders"
              value={orderCount}
            />
            <StatCard
              icon={<MaterialIcons name="attach-money" size={26} color="#000" />}
              label="Revenue"
              value={`₹${totalRevenue}`}
            />
            <StatCard
              icon={<Ionicons name="person-outline" size={24} color="#000" />}
              label="Users"
              value={userCount}
            />
            <StatCard
              icon={<FontAwesome5 name="pray" size={20} color="#000" />}
              label="Bookings"
              value={totalBookings}
            />
          </View>

          {/* Booked Poojas Section */}
          <Text style={styles.subheading}>All Booked Poojas</Text>

          {/* Toggle Filter */}
          <View style={styles.toggleRow}>
            {['Pending', 'Confirmed', 'Cancelled'].map((status) => (
              <Pressable
                key={status}
                onPress={() => setSelectedStatus(status)}
                style={[
                  styles.toggleButton,
                  selectedStatus === status && styles.toggleButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.toggleText,
                    selectedStatus === status && styles.toggleTextActive,
                  ]}
                >
                  {status}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Booking Cards */}
          <View>
            {filteredBookings.length === 0 ? (
              <Text style={{ padding: 16 }}>No bookings with status: {selectedStatus}</Text>
            ) : (
              filteredBookings.map((item, idx) => (
                <BookingCard key={idx} booking={item} reload={loadStats} />
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

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return '#f57c00';
    case 'Confirmed': return '#388e3c';
    case 'Cancelled': return '#d32f2f';
    default: return '#555';
  }
};

const BookingCard = ({ booking, reload }) => {
  const [status, setStatus] = useState(booking.status || 'Pending');
  const [date, setDate] = useState(new Date(booking.poojaDate));
  const [time, setTime] = useState(
    booking.time ? new Date(`1970-01-01T${booking.time}`) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await apiPatch(`/bookings/update/${booking._id}`, {
        status,
        poojaDate: date.toISOString(),
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }, true);
      if (res.success) {
        alert('Booking updated');
        reload();
      } else {
        alert('Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating booking');
    }
    setUpdating(false);
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#e0e0e0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bookingItem}
    >
      <Text style={styles.bookingText}>
        POOJA: <Text style={{ fontWeight: '600' }}>{booking.pooja?.name || 'N/A'}</Text>
      </Text>
      <Text style={styles.bookingText}>
      NAME: {booking.name || booking.user?.name || 'Unknown'} | PHONE: {booking.phone || booking.user?.phone || 'N/A'}
      </Text>
      <Text style={styles.bookingText}>LOCATION: {booking.address}</Text>

      <Pressable onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{date.toDateString()}</Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Pressable onPress={() => setShowTimePicker(true)} style={styles.input}>
        <Text>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </Pressable>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

      <View style={styles.dropdown}>
        {['Pending', 'Confirmed', 'Cancelled'].map((s) => (
          <Text
            key={s}
            onPress={() => setStatus(s)}
            style={[
              styles.dropdownOption,
              status === s && { backgroundColor: '#4CAF50', color: '#fff' },
            ]}
          >
            {s}
          </Text>
        ))}
      </View>

      <Text style={[styles.status, { color: getStatusColor(status) }]}>
        Status: {status}
      </Text>

      <Pressable
        style={[styles.updateButton, updating && { backgroundColor: '#999' }]}
        onPress={handleUpdate}
        disabled={updating}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          {updating ? 'Updating...' : 'Update Booking'}
        </Text>
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1b1b1b',
    marginBottom: 16,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: '#1b1b1b',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 8,
  },
  statLabel: {
    color: '#1b1b1b',
    fontSize: 14,
    marginTop: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    color: '#333',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
  bookingItem: {
    borderRadius: 14,
    padding: 16,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  bookingText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    backgroundColor: '#fafafa',
    color: '#000',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  dropdownOption: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 6,
    marginRight: 6,
    minWidth: 80,
    textAlign: 'center',
    color: '#000',
    fontWeight: '500',
  },
  status: {
    fontWeight: '600',
    marginTop: 6,
    fontSize: 14,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginTop: 12,
    borderRadius: 8,
  },
});

