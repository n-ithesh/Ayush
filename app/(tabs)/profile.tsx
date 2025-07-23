import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { apiDelete, apiGet, apiPost, getToken } from '../../utils/api';

interface User {
  name: string;
  email: string;
  phone: string;
  addresses: string[];
  profilePicture?: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhone, setEditedPhone] = useState('');

  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const data = await apiGet('/auth/me', true);
      console.log('Profile data received:', data);
      setUser(data);
      setProfileImage(data.profilePicture || null);
      console.log('Profile picture set to:', data.profilePicture);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logged Out', 'You have been logged out.');
    await getToken();
    router.replace('../onboarding');
  };

  const openEditModal = () => {
    if (!user) return;
    setEditedName(user.name);
    setEditedEmail(user.email);
    setEditedPhone(user.phone);
    setEditModalVisible(true);
  };

  const handleUpdateProfile = async () => {
    if (!editedName || !editedEmail || !editedPhone) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      const res = await apiPost(
        '/auth/update-profile',
        {
          name: editedName,
          email: editedEmail,
          phone: editedPhone,
        },
        true
      );

      if (res.success) {
        Alert.alert('Success', 'Profile updated.');
        setEditModalVisible(false);
        fetchProfile();
      } else {
        Alert.alert('Error', res.msg || 'Update failed');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Network error');
    }
  };

  const handleAddOrUpdateAddress = async () => {
    if (!newAddress) return;

    try {
      let res;
      if (editingAddressIndex !== null) {
        res = await apiPost(
          '/auth/update-address',
          {
            index: editingAddressIndex,
            address: newAddress,
          },
          true
        );
      } else {
        res = await apiPost('/auth/add-address', { address: newAddress }, true);
      }

      if (res.success) {
        setAddressModalVisible(false);
        setNewAddress('');
        setEditingAddressIndex(null);
        fetchProfile();
      } else {
        Alert.alert('Error', res.msg || 'Failed to update address');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Network error');
    }
  };

  const handleDeleteAddress = async (index: number) => {
    try {
      const res = await apiDelete(`/auth/delete-address/${index}`, true);
      if (res.success) {
        fetchProfile();
      } else {
        Alert.alert('Error', res.msg || 'Failed to delete address');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Network error');
    }
  };

  const openEditAddress = (index: number, address: string) => {
    setNewAddress(address);
    setEditingAddressIndex(index);
    setAddressModalVisible(true);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets?.length) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      console.log('Uploading image, base64 length:', base64Img.length);
      
      const res = await apiPost('/auth/upload-profile-picture', { image: base64Img }, true);
      console.log('Upload response:', res);
      
      if (res.success) {
        Alert.alert('Success', 'Profile picture updated.');
        await fetchProfile();
      } else {
        Alert.alert('Error', res.msg || 'Upload failed');
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}> 
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>No user data found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={user.addresses}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item, index }) => (
          <View style={styles.addressCard}>
            <Text style={styles.addressLabel}>Address {index + 1}</Text>
            <Text style={styles.addressText}>{item}</Text>
            <View style={{ flexDirection: 'row', marginTop: 6 }}>
              <Pressable onPress={() => openEditAddress(index, item)}>
                <Text style={[styles.editBtntext, { marginRight: 12 }]}>Edit</Text>
              </Pressable>
              <Pressable onPress={() => handleDeleteAddress(index)}>
                <Text style={{ color: 'rgba(181, 21, 21, 0.5)', fontWeight: '600',}}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.container}>
            <Text style={styles.heading}>My Profile</Text>

            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Pressable onPress={handlePickImage} style={styles.profileImageWrapper}>
                <Image
                  source={profileImage ? { uri: profileImage } : require('../../assets/images/ayush-icon.png')}
                  style={styles.profileImage}
                  onError={(error) => console.log('Image loading error:', error)}
                />
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </Pressable>
            </View>

            <View style={styles.profileCard}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.info}>{user.email}</Text>
              <Text style={styles.info}>{user.phone}</Text>

              <Pressable style={styles.editBtn} onPress={openEditModal}>
                <Text style={styles.editBtnText}>Edit Profile</Text>
              </Pressable>
            </View>

            <Text style={styles.sectionTitle}>Address Book</Text>
            <Pressable
              style={styles.addBtn}
              onPress={() => {
                setNewAddress('');
                setEditingAddressIndex(null);
                setAddressModalVisible(true);
              }}
            >
              <Text style={styles.addBtnText}>+ Add New Address</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          <View style={styles.container}>
            <Text style={styles.sectionTitle}>Order History</Text>
            <View style={styles.historyCard}>
              <Text style={styles.historyText}>Order ID: ORD123</Text>
              <Text style={styles.status}>Delivered</Text>
            </View>

            <Text style={styles.sectionTitle}>Pooja Booking History</Text>
            <View style={styles.historyCard}>
              <Text style={styles.historyText}>Ganahoma</Text>
              <Text style={styles.status}>Completed</Text>
            </View>

            <View style={styles.notifyRow}>
              <Text style={styles.sectionTitle}>Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ true: '#4CAF50' }}
              />
            </View>

            <Pressable style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        }
      />

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              placeholder="Full Name"
              value={editedName}
              onChangeText={setEditedName}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Email"
              value={editedEmail}
              onChangeText={setEditedEmail}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Phone"
              value={editedPhone}
              onChangeText={setEditedPhone}
              style={styles.modalInput}
              keyboardType="phone-pad"
            />
            <Pressable style={styles.saveBtn} onPress={handleUpdateProfile}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </Pressable>
            <Pressable onPress={() => setEditModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Add or Edit Address Modal */}
      <Modal visible={addressModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}</Text>
            <TextInput
              placeholder="Enter your address"
              value={newAddress}
              onChangeText={setNewAddress}
              style={[styles.modalInput, { height: 100 }]}
              multiline
            />
            <Pressable style={styles.saveBtn} onPress={handleAddOrUpdateAddress}>
              <Text style={styles.saveBtnText}>{editingAddressIndex !== null ? 'Update Address' : 'Add Address'}</Text>
            </Pressable>
            <Pressable onPress={() => setAddressModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 24,
    color: '#111827',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    color: '#111827',
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 1,
  },
  addressLabel: {
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#374151',
  },
  addBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyText: {
    fontSize: 14,
    color: '#1F2937',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  notifyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 24,
  },
  logoutText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  editBtn: {
    marginTop: 16,
    alignSelf: 'flex-end',
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  editBtntext: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
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
    borderRadius: 12,
    width: '88%',
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#111827',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 14,
    color: '#111827',
  },
  saveBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
  },
  profileImageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#10B981',
    backgroundColor: '#F3F4F6',
  },
  changePhotoText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
});

