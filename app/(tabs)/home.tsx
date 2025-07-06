import { apiGet, getImageUrl } from '@/utils/api';
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
  TextInput
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
    const res = await apiGet('/auth/me', true); // ✅ pass `true` to enable auth
    console.log('User fetched:', res); // optional: debug
    if (res.success && res.user) {
      setUserName(res.user.name);
    }
  };
  

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
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

  const greeting = (() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good Morning🌞' : hour < 18 ? 'Good Afternoon⛅' : 'Good Evening🌚';
  })();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.greeting}>{greeting}</Text>

        <TextInput
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearchSubmit}
          style={styles.search}
        />

        <Animated.Text style={[styles.heading]}>Featured Products</Animated.Text>
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

        <Animated.Text style={[styles.heading]}>Categories</Animated.Text>
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

        <Pressable style={styles.poojaButton} onPress={() => router.push('/pooja-booking')}>
          <Text style={styles.poojaButtonText}>Book a Pooja Service</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    color: '#4CAF50',
  },
  search: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 12,
    color: 'balck',
  },
  featuredCard: {
    marginRight: 16,
    width: 120,
    alignItems: 'center',
  },
  featuredImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  featuredTitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  categoryTile: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  poojaButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  poojaButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
});
