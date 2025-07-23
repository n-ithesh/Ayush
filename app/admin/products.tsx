import { apiDelete, apiGet, apiPost, apiPut } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { getImageUrl } from '@/utils/api';
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
  
    if (!result.canceled && result.assets?.length > 0) {
      const formData = new FormData();
  
      for (const asset of result.assets) {
        const localUri = asset.uri;
        const filename = localUri.split('/').pop() || `image-${Date.now()}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
  
        formData.append('images', {
          uri: localUri,
          name: filename,
          type,
        } as any);
      }
  
      try {
        const res = await fetch('http://192.168.189.36:5000/api/products/upload', {
          method: 'POST',
          body: formData,
          
        });
  
        const data = await res.json();
  
        if (data?.urls?.length > 0) {
          setForm((prevForm) => ({
            ...prevForm,
            images: [...prevForm.images, ...data.urls],
          }));
        } else {
          Alert.alert('Upload Failed', 'Image upload did not return valid URLs.');
        }
      } catch (err) {
        console.error('Upload error:', err);
        Alert.alert('Upload Error', 'Something went wrong during upload');
      }
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
                source={{ uri: getImageUrl(item.images[0]) }}
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

<Modal visible={modalVisible} animationType="slide" transparent>
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>
      <ScrollView contentContainerStyle={styles.modalScroll}>
        <Text style={styles.modalTitle}>
          {editingId ? 'Edit Product' : 'Add Product'}
        </Text>

        {/* Name */}
        <TextInput
          placeholder="Product Name"
          style={styles.input}
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
        />

        {/* Price */}
        <TextInput
          placeholder="Price"
          keyboardType="numeric"
          style={styles.input}
          value={form.price}
          onChangeText={(v) => setForm({ ...form, price: v })}
        />

        {/* Stock */}
        <TextInput
          placeholder="Stock"
          keyboardType="numeric"
          style={styles.input}
          value={form.stock}
          onChangeText={(v) => setForm({ ...form, stock: v })}
        />

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerWrapper}>
          <RNPickerSelect
            onValueChange={(value) => setForm({ ...form, category: value })}
            value={form.category}
            placeholder={{ label: 'Select Category', value: '' }}
            items={[
              { label: 'Oil', value: 'Oil' },
              { label: 'Tablet', value: 'Tablets' },
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
        </View>

        {/* Description, Benefits, Usage */}
        <TextInput
          placeholder="Description"
          style={styles.textArea}
          multiline
          value={form.description}
          onChangeText={(v) => setForm({ ...form, description: v })}
        />
        <TextInput
          placeholder="Benefits"
          style={styles.textArea}
          multiline
          value={form.benefits}
          onChangeText={(v) => setForm({ ...form, benefits: v })}
        />
        <TextInput
          placeholder="Usage"
          style={styles.textArea}
          multiline
          value={form.usage}
          onChangeText={(v) => setForm({ ...form, usage: v })}
        />

        {/* Image Picker */}
        <Pressable onPress={pickImages} style={styles.imageBtn}>
          <Ionicons name="image" size={20} color="#fff" />
          <Text style={styles.imageBtnText}>Select Images</Text>
        </Pressable>

        {/* Thumbnails */}
        <ScrollView horizontal contentContainerStyle={{ marginVertical: 10 }}>
          {form.images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.imageThumb} />
              <Pressable
                style={styles.removeImageBtn}
                onPress={() => removeImage(index)}
              >
                <Ionicons name="close-circle" size={20} color="red" />
              </Pressable>
            </View>
          ))}
        </ScrollView>

        {/* Buttons */}
        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>{editingId ? 'Update' : 'Save'}</Text>
        </Pressable>
        <Pressable
          style={styles.cancelBtn}
          onPress={() => {
            setModalVisible(false);
            setEditingId(null);
          }}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </View>
  </View>
</Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
    textAlign: 'center',
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  search: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fafafa',
    color: '#000',
  },
  addBtn: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: 8,
    borderRadius: 10,
    elevation: 2,
  },
  addText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  meta: {
    fontSize: 12,
    color: '#555',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 10,
    backgroundColor: '#e0e0e0',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  stockBtn: {
    padding: 4,
  },
  deleteBtn: {
    backgroundColor: '#d32f2f',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
  modal: {
    padding: 16,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fafafa',
    color: '#000',
  },
  imageBtn: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },
  imageThumb: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
  },
  saveBtn: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelBtn: {
    alignItems: 'center',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  
  modalCard: {
    backgroundColor: '#fff',
    width: '90%',
    maxHeight: '95%',
    borderRadius: 16,
    padding: 16,
    elevation: 5,
  },
  
  modalScroll: {
    paddingBottom: 30,
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    height: 80,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 6,
    marginBottom: 12,
  },
  
  imageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e86de',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  
  imageBtnText: {
    color: '#fff',
    marginLeft: 8,
  },
  
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  
  imageThumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  
  saveBtn: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  cancelBtn: {
    marginTop: 10,
    alignItems: 'center',
  },
  
  cancelText: {
    color: '#555',
    fontWeight: '600',
  },
  
});

