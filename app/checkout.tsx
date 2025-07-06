import { apiGet, apiPost, getImageUrl } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function Checkout() {
  const { product } = useLocalSearchParams();
  const parsed = JSON.parse(decodeURIComponent(product as string));

  const [user, setUser] = useState({ name: '', email: '', phone: '' });
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState({ name: '', email: '', phone: '', address: '' });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await apiGet('/auth/me', true);
      let userObj = res?.user || res;

      if (userObj && userObj._id) {
        const info = {
          name: userObj.name || '',
          email: userObj.email || '',
          phone: userObj.phone || '',
          address: userObj.addresses?.[0] || '',
        };
        setUser(info);
        setEditedUser(info);
        setAddress(info.address);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load user info');
    }
    setLoading(false);
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      Alert.alert('Please enter a shipping address.');
      return;
    }

    const orderData = {
      items: [{ product: parsed._id, quantity: 1 }],
      shippingAddress: address,
      paymentMethod,
      totalAmount: parsed.price,
    };

    const res = await apiPost('/orders', orderData, true);
    if (res.success) {
      Alert.alert('Order placed successfully!');
      router.replace('/orders');
    } else {
      Alert.alert('Error', res.msg || 'Order failed');
    }
  };

  const handleSaveUser = async () => {
    if (!editedUser.name || !editedUser.email || !editedUser.phone || !editedUser.address) {
      Alert.alert('All fields are required');
      return;
    }

    const res = await apiPost(
      '/auth/update-profile',
      {
        name: editedUser.name,
        email: editedUser.email,
        phone: editedUser.phone,
        addresses: [editedUser.address],
      },
      true
    );

    if (res.success) {
      setUser({
        name: editedUser.name,
        email: editedUser.email,
        phone: editedUser.phone,
        address: editedUser.address,
      });
      setAddress(editedUser.address);
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated');
    } else {
      Alert.alert('Error', res.msg || 'Update failed');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading user info...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Pressable onPress={() => router.back()} style={{ marginBottom: 16 }}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>

        {/* Product Summary */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image
            source={{ uri: getImageUrl(parsed.images?.[0]) }}
            style={{ width: 140, height: 140, borderRadius: 8 }}
          />
          <Text style={{ fontSize: 20, fontWeight: '700', marginTop: 8 }}>{parsed.name}</Text>
          <Text style={{ fontSize: 18, color: '#4CAF50' }}>₹{parsed.price}</Text>
        </View>

        {/* User Info */}
        <Text style={styles.label}>User Information</Text>
        <View style={styles.userInfoBox}>
          <Text style={styles.userInfoText}>
            <Text style={styles.bold}>Name:</Text> {user.name}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.bold}>Email:</Text> {user.email}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.bold}>Phone:</Text> {user.phone}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.bold}>Address:</Text> {address}
          </Text>
          <Pressable onPress={() => setEditModalVisible(true)}>
            <Text style={styles.editLink}>Edit</Text>
          </Pressable>
        </View>

        {/* Payment Method */}
        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.radioGroup}>
          {['COD', 'UPI'].map((method) => (
            <Pressable
              key={method}
              onPress={() => setPaymentMethod(method)}
              style={styles.radioOption}
            >
              <Ionicons
                name={paymentMethod === method ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color="#4CAF50"
              />
              <Text style={styles.radioText}>
                {method === 'COD' ? 'Cash on Delivery' : 'UPI'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.button} onPress={handlePlaceOrder}>
          <Text style={styles.buttonText}>Place Order</Text>
        </Pressable>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Information</Text>

            <TextInput
              placeholder="Name"
              value={editedUser.name}
              onChangeText={(t) => setEditedUser({ ...editedUser, name: t })}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Email"
              value={editedUser.email}
              onChangeText={(t) => setEditedUser({ ...editedUser, email: t })}
              style={styles.modalInput}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Phone"
              value={editedUser.phone}
              onChangeText={(t) => setEditedUser({ ...editedUser, phone: t })}
              style={styles.modalInput}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="Address"
              value={editedUser.address}
              onChangeText={(t) => setEditedUser({ ...editedUser, address: t })}
              style={styles.modalInput}
              multiline
            />

            <Pressable style={styles.saveBtn} onPress={handleSaveUser}>
              <Text style={styles.saveBtnText}>Save</Text>
            </Pressable>
            <Pressable onPress={() => setEditModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginTop: 28,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  radioGroup: {
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },
  userInfoBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  userInfoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  bold: {
    fontWeight: '700',
    color: '#000',
  },
  editLink: {
    color: '#2196F3',
    fontWeight: '600',
    marginTop: 6,
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
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
  },
});
