import { apiDelete, apiGet, apiPost, apiPut } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';


import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// ✅ Define Product type
type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  usage: string;
  benefits: string;
  images: string[];
};

type ProductForm = Omit<Product, '_id' | 'price' | 'stock'> & {
  price: string;
  stock: string;
};

export default function Products() {
  const [search, setSearch] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<ProductForm>({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    usage: '',
    benefits: '',
    images: [],
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await apiGet('/products');
    if (res && Array.isArray(res.products)) {
      setProducts(res.products);
    } else {
      console.warn('Unexpected product response:', res);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const updateStock = async (productId: string, change: number) => {
    const target = products.find((p) => p._id === productId);
    if (!target) return;
    const newStock = Math.max(0, target.stock + change);
    const res = await apiPut(`/products/stock/${productId}`, { stock: newStock }, true);
    if (res.success) loadProducts();
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow media library access to select images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setForm((prevForm) => ({
        ...prevForm,
        images: [...prevForm.images, ...newUris],
      }));
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const openEditModal = (product: Product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category || '',
      description: product.description || '',
      usage: product.usage || '',
      benefits: product.benefits || '',
      images: product.images || [],
    } as unknown as ProductForm);
    setModalVisible(true);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
      description: form.description,
      usage: form.usage,
      benefits: form.benefits,
      images: form.images,
    };

    let res;
    if (editingId) {
      res = await apiPut(`/products/${editingId}`, payload, true);
    } else {
      res = await apiPost('/products', payload, true);
    }

    if (res.success) {
      setModalVisible(false);
      setForm({
        name: '',
        price: '',
        stock: '',
        category: '',
        description: '',
        usage: '',
        benefits: '',
        images: [],
      });
      setEditingId(null);
      loadProducts();
    } else {
      Alert.alert('Error', res.message || 'Could not save product');
    }
  };

  const handleDelete = async () => {
    for (let id of selected) {
      await apiDelete(`/products/${id}`, true);
    }
    setSelected([]);
    loadProducts();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Products</Text>

      <View style={styles.topRow}>
        <TextInput
          placeholder="Search products..."
          style={styles.search}
          value={search}
          onChangeText={setSearch}
        />
        <Pressable
          onPress={() => {
            setModalVisible(true);
            setEditingId(null);
            setForm({
              name: '',
              price: '',
              stock: '',
              category: '',
              description: '',
              usage: '',
              benefits: '',
              images: [],
            });
          }}
          style={styles.addBtn}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={products.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Pressable onLongPress={() => openEditModal(item)} style={styles.item}>
            <Pressable onPress={() => toggleSelect(item._id)}>
              <Ionicons
                name={selected.includes(item._id) ? 'checkbox' : 'square-outline'}
                size={22}
              />
            </Pressable>

            <Image
              source={{
                uri:
                  item.images.length > 0
                    ? item.images[0]
                    : 'https://via.placeholder.com/100',
              }}
              style={styles.productImage}
            />

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>₹{item.price}</Text>
              <Text style={styles.meta}>Category: {item.category}</Text>
            </View>

            <View style={styles.stockRow}>
              <Pressable
                onPress={() => updateStock(item._id, -1)}
                style={styles.stockBtn}
              >
                <Ionicons name="remove-circle-outline" size={20} color="#555" />
              </Pressable>
              <Text style={{ marginHorizontal: 6 }}>{item.stock}</Text>
              <Pressable
                onPress={() => updateStock(item._id, 1)}
                style={styles.stockBtn}
              >
                <Ionicons name="add-circle-outline" size={20} color="#555" />
              </Pressable>
            </View>
          </Pressable>
        )}
      />

      {selected.length > 0 && (
        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete {selected.length} selected</Text>
        </Pressable>
      )}

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView style={styles.modal}>
          <Text style={styles.modalTitle}>
            {editingId ? 'Edit Product' : 'Add Product'}
          </Text>

          <TextInput placeholder="Name" style={styles.input} value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} />
          <TextInput placeholder="Price" keyboardType="numeric" style={styles.input} value={form.price} onChangeText={(v) => setForm({ ...form, price: v })} />
          <TextInput placeholder="Stock" keyboardType="numeric" style={styles.input} value={form.stock} onChangeText={(v) => setForm({ ...form, stock: v })} />
          <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Category</Text>
          <RNPickerSelect
            onValueChange={(value) => setForm({ ...form, category: value })}
            value={form.category}
            placeholder={{ label: 'Select Category', value: '' }}
            items={[
              { label: 'Oil', value: 'Oil' },
              { label: 'Tablet', value: 'Tablet' },
              { label: 'Syrup', value: 'Syrup' },
              { label: 'Powder', value: 'Powder' },
              { label: 'Capsule', value: 'Capsule' },
              { label: 'Health Supplement', value: 'Health Supplement' },
              { label: 'Juice', value: 'Juice' },
              { label: 'Churna', value: 'Churna' },
              { label: 'Paste', value: 'Paste' },
              { label: 'Soap', value: 'Soap' },
              { label: 'Other', value: 'Other' },
            ]}
          />
          <TextInput placeholder="Description" style={styles.input} multiline value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} />
          <TextInput placeholder="Benefits" style={styles.input} multiline value={form.benefits} onChangeText={(v) => setForm({ ...form, benefits: v })} />
          <TextInput placeholder="Usage" style={styles.input} multiline value={form.usage} onChangeText={(v) => setForm({ ...form, usage: v })} />

          <Pressable onPress={pickImages} style={styles.imageBtn}>
            <Ionicons name="image" size={20} color="#fff" />
            <Text style={{ color: '#fff' }}>Select Images</Text>
          </Pressable>

          <ScrollView horizontal>
            {form.images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.imageThumb} />
                <Pressable style={styles.removeImageBtn} onPress={() => removeImage(index)}>
                  <Ionicons name="close-circle" size={20} color="red" />
                </Pressable>
              </View>
            ))}
          </ScrollView>

          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>{editingId ? 'Update' : 'Save'}</Text>
          </Pressable>

          <Pressable onPress={() => { setModalVisible(false); setEditingId(null); }} style={styles.cancelBtn}>
            <Text>Cancel</Text>
          </Pressable>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  topRow: { flexDirection: 'row', marginBottom: 10 },
  search: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 8,
  },
  addBtn: {
    backgroundColor: '#00897b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginLeft: 8,
    borderRadius: 10,
  },
  addText: { color: '#fff', marginLeft: 4 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  name: { fontWeight: 'bold' },
  meta: { fontSize: 12, color: '#666' },
  deleteBtn: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteText: { color: '#fff' },
  modal: { padding: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  imageBtn: {
    backgroundColor: '#00897b',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  imageThumb: { width: 60, height: 60, borderRadius: 6 },
  imageWrapper: { position: 'relative', marginRight: 8 },
  removeImageBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
  },
  saveBtn: {
    backgroundColor: '#00897b',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
  cancelBtn: { alignItems: 'center', marginTop: 10 },
  stockRow: { flexDirection: 'row', alignItems: 'center' },
  stockBtn: { padding: 4 },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginLeft: 10,
    backgroundColor: '#eee',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
  },
  picker: {
    height: 48,
    width: '100%',
  },
  
});
