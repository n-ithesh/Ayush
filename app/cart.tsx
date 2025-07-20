import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCart, updateCart } from '@/utils/cart';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '@/utils/api';


export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [coupon, setCoupon] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('COD');

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const cart = await getCart();
    setCartItems(cart);
  };

  const increaseQuantity = async (id: string) => {
    const updated = cartItems.map(item =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updated);
    await updateCart(updated);
  };

  const decreaseQuantity = async (id: string) => {
    const updated = cartItems.map(item =>
      item._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updated);
    await updateCart(updated);
  };

  const removeItem = async (id: string) => {
    const updated = cartItems.filter(item => item._id !== id);
    setCartItems(updated);
    await updateCart(updated);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const confirmOrder = () => {
    if (!address) {
      Alert.alert('Error', 'Please enter delivery address.');
      return;
    }
    Alert.alert(
      'Order Confirmed!',
      `Total: ₹${total}\nPayment: ${payment}\nAddress: ${address}`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar with Back Button */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#4CAF50" />
        </Pressable>
        <Text style={styles.topBarTitle}>Your Cart</Text>
      </View>

      <View style={styles.container}>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image
                source={{
                  uri:
                    Array.isArray(item.images) && item.images.length > 0
                      ? getImageUrl(item.images[0])
                      : 'https://via.placeholder.com/300',
                }}
                style={styles.image}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>₹{item.price}</Text>

                <View style={styles.quantityRow}>
                  <Pressable onPress={() => decreaseQuantity(item._id)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>−</Text>
                  </Pressable>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <Pressable onPress={() => increaseQuantity(item._id)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </Pressable>

                  <Pressable onPress={() => removeItem(item._id)} style={styles.removeBtn}>
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={
            <>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <TextInput
                placeholder="Enter full address"
                value={address}
                onChangeText={setAddress}
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                multiline
              />

              <Text style={styles.sectionTitle}>Payment Method</Text>
              <View style={styles.row}>
                <Pressable
                  style={[
                    styles.paymentBtn,
                    payment === 'COD' && styles.paymentBtnActive,
                  ]}
                  onPress={() => setPayment('COD')}
                >
                  <Text
                    style={[
                      styles.paymentBtnText,
                      payment === 'COD' && styles.paymentBtnTextActive,
                    ]}
                  >
                    Cash on Delivery
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.paymentBtn,
                    payment === 'Online' && styles.paymentBtnActive,
                  ]}
                  onPress={() => setPayment('Online')}
                >
                  <Text
                    style={[
                      styles.paymentBtnText,
                      payment === 'Online' && styles.paymentBtnTextActive,
                    ]}
                  >
                    Online Payment
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.sectionTitle}>Order Summary</Text>
              <Text style={styles.total}>Total: ₹{total}</Text>

              <Pressable style={styles.confirmBtn} onPress={confirmOrder}>
                <Text style={styles.confirmBtnText}>Confirm Order</Text>
              </Pressable>
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  backBtn: {
    padding: 8,
    marginRight: 12,
  },
  backText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4CAF50',
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  qtyBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  qtyValue: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  removeBtn: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#e53935',
    marginLeft: 10,
  },
  removeBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  paymentBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  paymentBtnActive: {
    backgroundColor: '#4CAF50',
  },
  paymentBtnText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  paymentBtnTextActive: {
    color: '#fff',
  },
  total: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 12,
    textAlign: 'right',
  },
  confirmBtn: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
});
