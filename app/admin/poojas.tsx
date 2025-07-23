import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { apiGet, apiPost, apiDelete } from '@/utils/api';

export default function Poojas() {
  const [poojas, setPoojas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    requirements: '',
  });

  const fetchPoojas = async () => {
    const res = await apiGet('/poojas');
    if (res.success) setPoojas(res.data || []);
    else console.error('Error fetching poojas:', res.message || res.error);
  };

  const addPooja = async () => {
    const payload = {
      ...form,
      price: parseFloat(form.price),
      requirements: form.requirements.split(',').map((r) => r.trim()),
    };

    const res = await apiPost('/poojas', payload);
    if (res.success) {
      setForm({
        name: '',
        description: '',
        price: '',
        duration: '',
        requirements: '',
      });
      setModalVisible(false);
      fetchPoojas();
    } else alert('Failed to add pooja');
  };

  const deletePooja = async (id: string) => {
    const confirm = window.confirm ? window.confirm("Are you sure?") : true;
    if (!confirm) return;

    const res = await apiDelete(`/poojas/${id}`);
    if (res.success) fetchPoojas();
    else alert('Failed to delete pooja');
  };

  useEffect(() => {
    fetchPoojas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pooja Management</Text>

      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>＋ Add New Pooja</Text>
      </Pressable>

      <FlatList
        data={poojas}
        keyExtractor={(item: any) => item._id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.detail}>{item.description}</Text>
            <Text style={styles.subDetail}> ₹{item.price}</Text>
            <Text style={styles.subDetail}>⏱ Duration: {item.duration}</Text>
            <Text style={styles.subDetail}>
               Requirements: {item.requirements?.join(', ')}
            </Text>

            <Pressable style={styles.deleteButton} onPress={() => deletePooja(item._id)}>
              <Text style={styles.deleteButtonText}> Delete</Text>
            </Pressable>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Pooja</Text>

              <TextInput
                placeholder="Name"
                style={styles.input}
                value={form.name}
                onChangeText={(v) => setForm({ ...form, name: v })}
              />
              <TextInput
                placeholder="Description"
                style={[styles.input, { height: 80 }]}
                value={form.description}
                onChangeText={(v) => setForm({ ...form, description: v })}
                multiline
              />
              <TextInput
                placeholder="Price"
                keyboardType="numeric"
                style={styles.input}
                value={form.price}
                onChangeText={(v) => setForm({ ...form, price: v })}
              />
              <TextInput
                placeholder="Duration"
                style={styles.input}
                value={form.duration}
                onChangeText={(v) => setForm({ ...form, duration: v })}
              />
              <TextInput
                placeholder="Requirements (comma separated)"
                style={styles.input}
                value={form.requirements}
                onChangeText={(v) => setForm({ ...form, requirements: v })}
              />

              <Pressable style={styles.primaryButton} onPress={addPooja}>
                <Text style={styles.primaryButtonText}> Add Pooja</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
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
    backgroundColor: '#f1f5f9',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detail: {
    marginBottom: 4,
    color: '#444',
  },
  subDetail: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
  deleteButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#ef4444',
    borderRadius: 6,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modal: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  saveButton: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#94a3b8',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    maxHeight: '90%',
  },
  
  modalContent: {
    paddingBottom: 20,
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1e293b',
  },
  
  input: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  
  primaryButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  
  secondaryButton: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  
  secondaryButtonText: {
    color: '#334155',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  
});
