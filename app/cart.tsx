import { useState } from 'react';
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

const mockCartItems = [
  { id: '1', name: 'Ashwagandha', price: 250, quantity: 1, image: 'https://via.placeholder.com/100' },
  { id: '2', name: 'Tulsi Tea', price: 180, quantity: 2, image: 'https://via.placeholder.com/100' },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [coupon, setCoupon] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('COD');

  const increaseQuantity = (id: string) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updated);
  };

  const decreaseQuantity = (id: string) => {
    const updated = cartItems.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updated);
  };

  const applyCoupon = () => {
    Alert.alert('Coupon Applied', `Coupon "${coupon}" applied!`);
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
      <View style={styles.container}>
        <Text style={styles.heading}>Your Cart</Text>

        <FlatList
          data={cartItems}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>₹{item.price}</Text>

                <View style={styles.quantityRow}>
                  <Pressable onPress={() => decreaseQuantity(item.id)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>−</Text>
                  </Pressable>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <Pressable onPress={() => increaseQuantity(item.id)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={
            <>
              <Text style={styles.sectionTitle}>Coupon Code</Text>
              <View style={styles.row}>
                <TextInput
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChangeText={setCoupon}
                  style={styles.input}
                />
                <Pressable style={styles.couponBtn} onPress={applyCoupon}>
                  <Text style={styles.couponBtnText}>Apply</Text>
                </Pressable>
              </View>

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
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  image: { width: 80, height: 80, borderRadius: 8 },
  name: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#333' },
  price: { fontSize: 14, fontWeight: '500', color: '#4CAF50' },
  quantityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  qtyBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  qtyBtnText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  qtyValue: { marginHorizontal: 12, fontSize: 16, fontWeight: '600' },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  couponBtn: {
    marginLeft: 8,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  couponBtnText: { color: '#fff', fontWeight: '600' },
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
