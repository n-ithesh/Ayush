import { apiGet, apiDelete, getImageUrl } from '@/utils/api';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Home() {
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [poojaBookings, setPoojaBookings] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<'all' | 'confirmed'>('all');

  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  const categories = [
    { name: 'Herbs', icon: 'leaf' },
    { name: 'Oils', icon: 'oil-can' },
    { name: 'Supplements', icon: 'pills' },
    { name: 'Tea', icon: 'mug-hot' },
    { name: 'Skincare', icon: 'spa' },
  ];

  useEffect(() => {
    fetchData();
    fetchUser();
    fetchBookings();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await apiGet('/products');
    if (res.success && Array.isArray(res.products)) {
      setFeatured(res.products.slice(0, 5));
    }
    setLoading(false);
  };

  const fetchUser = async () => {
    const res = await apiGet('/auth/me', true);
    if (res.success && res.user) {
      setUserName(res.user.name);
    }
  };

  const fetchBookings = async () => {
    const res = await apiGet('/bookings/my', true);
    if (res.success && Array.isArray(res.bookings)) {
      const sorted = res.bookings.sort(
        (a, b) => new Date(b.poojaDate).getTime() - new Date(a.poojaDate).getTime()
      );
      setPoojaBookings(sorted);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    await fetchUser();
    await fetchBookings();
    setRefreshing(false);
  };

  const handleSearchSubmit = () => {
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search)}`);
    }
  };

  const goToProductDetails = (product: any) => {
    setRecentlyViewed((prev) => [product, ...prev.slice(0, 4)]);
    router.push({
      pathname: '/product-details',
      params: { product: encodeURIComponent(JSON.stringify(product)) },
    });
  };

  const handleCancelBooking = async (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            const res = await apiDelete(`/bookings/${bookingId}`);
            if (res.success) {
              alert('Booking canceled successfully.');
              fetchBookings();
            } else {
              alert('Failed to cancel booking.');
            }
          },
        },
      ]
    );
  };

  const greeting = (() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  })();

  const filteredBookings =
    selectedTab === 'confirmed'
      ? poojaBookings.filter((b) => b.status?.toLowerCase() === 'confirmed')
      : poojaBookings;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}edges={['left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.greeting}>
          {greeting}{userName ? `, ${userName}` : ''}
        </Text>

        <TextInput
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearchSubmit}
          style={styles.search}
          placeholderTextColor="#999"
        />

        <Text style={styles.sectionTitle}>Featured Products</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featured.map((item) => (
              <Pressable key={item._id} style={styles.featuredCard} onPress={() => goToProductDetails(item)}>
                <Image source={{ uri: getImageUrl(item.images?.[0]) }} style={styles.featuredImage} />
                <Text style={styles.featuredTitle}>{item.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <Pressable style={styles.categoryTile}>
              <FontAwesome5 name={item.icon} size={16} color="#fff" />
              <Text style={styles.categoryText}>{item.name}</Text>
            </Pressable>
          )}
        />

        <Text style={styles.sectionTitle}>Your Pooja Bookings</Text>

        {/* Toggle Selector */}
        <View style={styles.toggleContainer}>
          <Pressable
            onPress={() => setSelectedTab('all')}
            style={[styles.toggleButton, selectedTab === 'all' && styles.activeToggle]}
          >
            <Text style={selectedTab === 'all' ? styles.activeToggleText : styles.toggleText}>All Bookings</Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedTab('confirmed')}
            style={[styles.toggleButton, selectedTab === 'confirmed' && styles.activeToggle]}
          >
            <Text style={selectedTab === 'confirmed' ? styles.activeToggleText : styles.toggleText}>Confirmed</Text>
          </Pressable>
        </View>

        {filteredBookings.length === 0 ? (
          <Text style={styles.emptyText}>No bookings found.</Text>
        ) : (
          filteredBookings.map((booking) => (
            <View key={booking._id} style={styles.bookingCard}>
              <Text style={styles.bookingTitle}>{booking.pooja?.name}</Text>
              <Text style={styles.bookingLine}>Description: {booking.pooja?.description}</Text>
              <Text style={styles.bookingLine}>Duration: {booking.pooja?.duration}</Text>
              <Text style={styles.bookingLine}>Date: {new Date(booking.poojaDate).toDateString()}</Text>
              <Text style={styles.bookingLine}>Time: {booking.time}</Text>
              <Text style={styles.bookingLine}>Location: {booking.address}</Text>
              <Text style={styles.bookingLine}>Price: ₹{booking.pooja?.price}</Text>
              <Text style={styles.bookingLine}>Status: {booking.status || 'Confirmed'}</Text>

              <Pressable
                onPress={() => handleCancelBooking(booking._id)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel Booking</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff', // white background
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000000', // black text
    marginBottom: 10,
  },
  search: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    marginBottom: 24,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    marginTop: 16,
  },
  featuredCard: {
    marginRight: 16,
    width: 160,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    padding: 12,
  },
  featuredImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
  },
  featuredTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },
  categoryTile: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  categoryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bookingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2e7d32', // green title
    marginBottom: 8,
  },
  bookingLine: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginVertical: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 6,
    backgroundColor: '#f0f0f0',
  },
  activeToggle: {
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  activeToggleText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

