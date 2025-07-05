import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiGet, getImageUrl } from '@/utils/api';

export default function Home() {
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['Herbs', 'Oils', 'Supplements', 'Tea', 'Skincare'];

  const offers = [
    { id: '1', title: '20% off on Pooja Kits' },
    { id: '2', title: 'Buy 1 Get 1 Free - Herbal Tea' },
  ];

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    const res = await apiGet('/products'); // Adjust path if needed
    if (res.success && Array.isArray(res.products)) {
      setFeatured(res.products.slice(0, 5)); // Show top 5 as featured
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />

        <Text style={styles.heading}>Featured Products</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featured.map((item: any) => (
              <View key={item._id} style={styles.featuredCard}>
                <Image
                  source={{ uri: getImageUrl(item.images?.[0]) }}
                  style={styles.featuredImage}
                />
                <Text style={styles.featuredTitle}>{item.name}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        <Text style={styles.heading}>Categories</Text>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable style={styles.categoryTile}>
              <Text style={styles.categoryText}>{item}</Text>
            </Pressable>
          )}
        />

        <Text style={styles.heading}>Special Offers</Text>
        {offers.map((offer) => (
          <View key={offer.id} style={styles.offerCard}>
            <Text style={styles.offerText}>{offer.title}</Text>
          </View>
        ))}

        <Pressable style={styles.poojaButton}>
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
  search: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 12,
    color: '#333',
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
  },
  categoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  offerCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  offerText: {
    fontSize: 16,
    color: '#333',
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
