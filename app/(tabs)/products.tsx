import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import AshwagandhaImage from '../../assets/images/ashwagandha-powder.png';
import NeemOilImage from '../../assets/images/neem-oil.png';
import AloeVeraGelImage from '../../assets/images/aloeveragel.png';
import TulsiTeaImage from '../../assets/images/Tulsi-Tea.png';

const allProducts = [
  { id: '1', name: 'Ashwagandha', price: '₹250', image: AshwagandhaImage },
  { id: '2', name: 'Neem Oil', price: '₹150', image: NeemOilImage },
  { id: '3', name: 'Tulsi Tea', price: '₹180', image: 'Tulsi-TeaImage' },
  { id: '4', name: 'Aloe Vera Gel', price: '₹200', image: AloeVeraGelImage },
];

const { width } = Dimensions.get('window');

export default function Products() {
  const [isGrid, setIsGrid] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  const toggleView = () => setIsGrid(!isGrid);

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter((p) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleFilterApply = () => {
    setShowFilter(false);
    alert('Filter applied!');
  };

  const handleSortApply = () => {
    setShowSort(false);
    alert('Sort applied!');
  };

  const renderProduct = ({ item }: { item: any }) => (
  <Pressable
    style={isGrid ? styles.gridCard : styles.listCard}
    onPress={() => router.push('/product-details')}
  >
    <Image
      source={typeof item.image === 'string' ? { uri: item.image } : item.image}
      style={isGrid ? styles.gridImage : styles.listImage}
    />
    <View style={styles.cardContent}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </View>
  </Pressable>
);


  return (
    <View style={styles.container}>
      {/* ✅ Search Bar */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <Pressable style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>

      {/* ✅ Toggle & Actions */}
      <View style={styles.actions}>
        <Pressable onPress={toggleView} style={styles.actionButton}>
          <Text style={styles.actionText}>{isGrid ? 'List View' : 'Grid View'}</Text>
        </Pressable>
        <Pressable onPress={() => setShowFilter(true)} style={styles.actionButton}>
          <Text style={styles.actionText}>Filter</Text>
        </Pressable>
        <Pressable onPress={() => setShowSort(true)} style={styles.actionButton}>
          <Text style={styles.actionText}>Sort</Text>
        </Pressable>
      </View>

      {/* ✅ Product List */}
      <FlatList
        data={filteredProducts}
        key={isGrid ? 'G' : 'L'} // force rerender on toggle
        numColumns={isGrid ? 2 : 1}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
      />

      {/* ✅ Filter Modal */}
      <Modal visible={showFilter} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Options</Text>
            {/* Add real filter form here */}
            <Pressable style={styles.modalButton} onPress={handleFilterApply}>
              <Text style={styles.modalButtonText}>Apply Filter</Text>
            </Pressable>
            <TouchableOpacity onPress={() => setShowFilter(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ Sort Modal */}
      <Modal visible={showSort} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort Options</Text>
            {/* Add real sort form here */}
            <Pressable style={styles.modalButton} onPress={handleSortApply}>
              <Text style={styles.modalButtonText}>Apply Sort</Text>
            </Pressable>
            <TouchableOpacity onPress={() => setShowSort(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  searchRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  actionText: { color: '#fff', fontWeight: '600' },
  gridCard: {
    flex: 1,
    margin: 6,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  gridImage: {
    width: (width / 2) - 24,
    height: 120,
  },
  listCard: {
    flexDirection: 'row',
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  listImage: {
    width: 120,
    height: 120,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  productName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  productPrice: { fontSize: 14, color: '#4CAF50', fontWeight: '500' },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalClose: {
    color: '#999',
    fontSize: 16,
  },
});
