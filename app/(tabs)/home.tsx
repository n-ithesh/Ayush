import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = ['Herbs', 'Oils', 'Supplements', 'Tea', 'Skincare'];
const featured = [
  { id: '1', title: 'Ashwagandha', image: 'https://via.placeholder.com/150' },
  { id: '2', title: 'Neem Oil', image: 'https://via.placeholder.com/150' },
  { id: '3', title: 'Tulsi Tea', image: 'https://via.placeholder.com/150' },
];

const offers = [
  { id: '1', title: '20% off on Pooja Kits' },
  { id: '2', title: 'Buy 1 Get 1 Free - Herbal Tea' },
];

export default function Home() {
  const [search, setSearch] = useState('');

  return (
   
    <ScrollView contentContainerStyle={styles.container}>
      {/* ✅ Search Bar */}
      <TextInput
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* ✅ Featured Carousel */}
      <Text style={styles.heading}>Featured Products</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {featured.map((item) => (
          <View key={item.id} style={styles.featuredCard}>
            <Image source={{ uri: item.image }} style={styles.featuredImage} />
            <Text style={styles.featuredTitle}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>

      {/* ✅ Categories */}
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

      {/* ✅ Special Offers */}
      <Text style={styles.heading}>Special Offers</Text>
      {offers.map((offer) => (
        <View key={offer.id} style={styles.offerCard}>
          <Text style={styles.offerText}>{offer.title}</Text>
        </View>
      ))}

      {/* ✅ Quick Access to Pooja */}
      <Pressable style={styles.poojaButton}>
        <Text style={styles.poojaButtonText}>Book a Pooja Service</Text>
      </Pressable>
    </ScrollView>
   
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
