import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { router } from 'expo-router';
import { apiGet } from '@/utils/api';

const { width } = Dimensions.get('window');

export default function Products() {
  const [search, setSearch] = useState('');
  const [isGrid, setIsGrid] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  const categories = ['All', 'Oil',
        'Tablets',
        'Syrup',
        'Powder',
        'Capsule',
        'Health Supplement',
        'Juice',
        'Churna',
        'Paste',
        'Soap',
        'Other',
        'Tonic'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await apiGet('/products');
    if (res?.products) {
      const top20 = res.products.slice(0, 20);
      setProducts(top20);
      setFilteredProducts(top20);
    }
  };

  const handleSearch = () => {
    applyFilters(search, selectedCategory, selectedPrice);
  };

  const applyFilters = (searchValue = search, category = selectedCategory, price = selectedPrice) => {
    let filtered = [...products];

    // Search filter
    if (searchValue.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Category filter
    if (category && category !== 'All') {
      filtered = filtered.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }

    // Price filter
    if (price) {
      filtered = filtered.filter((p) => {
        if (price === '<200') return p.price < 200;
        if (price === '200-500') return p.price >= 200 && p.price <= 500;
        if (price === '>500') return p.price > 500;
        return true;
      });
    }

    setFilteredProducts(filtered);
  };

  const renderProduct = ({ item }: { item: any }) => (
    <Pressable
      onPress={() =>
        router.push({ pathname: '/product-details', params: { product: JSON.stringify(item) } })
      }
      style={isGrid ? styles.gridCard : styles.listCard}
    >
      <Image
        source={{
          uri: item.images?.[0] || 'https://via.placeholder.com/150',
        }}
        style={isGrid ? styles.gridImage : styles.listImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <Pressable onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        <View style={styles.pickerWrapper}>
          <Text style={styles.filterLabel}>Category:</Text>
          <Picker
            selectedValue={selectedCategory}
            style={styles.picker}
            onValueChange={(value) => {
              setSelectedCategory(value);
              applyFilters(search, value, selectedPrice);
            }}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerWrapper}>
          <Text style={styles.filterLabel}>Price:</Text>
          <Picker
            selectedValue={selectedPrice}
            style={styles.picker}
            onValueChange={(value) => {
              setSelectedPrice(value);
              applyFilters(search, selectedCategory, value);
            }}
          >
            <Picker.Item label="All" value="" />
            <Picker.Item label="< ₹200" value="<200" />
            <Picker.Item label="₹200 - ₹500" value="200-500" />
            <Picker.Item label="> ₹500" value=">500" />
          </Picker>
        </View>
      </View>

      {/* View Toggle */}
      <View style={styles.actions}>
        <Pressable onPress={() => setIsGrid(!isGrid)} style={styles.actionButton}>
          <Text style={styles.actionText}>{isGrid ? 'List View' : 'Grid View'}</Text>
        </Pressable>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        key={isGrid ? 'G' : 'L'}
        numColumns={isGrid ? 2 : 1}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  searchRow: { flexDirection: 'row', marginBottom: 12 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  searchButtonText: { color: '#fff' },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  picker: {
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  filterLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionText: { color: '#fff' },

  gridCard: {
    flex: 1,
    margin: 6,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  listCard: {
    flexDirection: 'row',
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridImage: { width: (width / 2) - 24, height: 120 },
  listImage: { width: 120, height: 120 },
  cardContent: { flex: 1, padding: 12 },
  productName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  productPrice: { fontSize: 14, color: '#4CAF50' },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
});
