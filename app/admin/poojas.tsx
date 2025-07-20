import { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Modal, StyleSheet } from 'react-native';
import { apiGet, apiPost, apiDelete } from '@/utils/api';

export default function Poojas() {
  const [poojas, setPoojas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', duration: '', requirements: '' });

  const fetchPoojas = async () => {
    const res = await apiGet('/poojas');
    if (res.success) {
      setPoojas(res.data || []);
    } else {
      console.error('Error fetching poojas:', res.message || res.error);
    }
  };

  const addPooja = async () => {
    const payload = {
      ...form,
      price: parseFloat(form.price),
      requirements: form.requirements.split(',').map(r => r.trim()),
    };

    const res = await apiPost('/poojas', payload);
    if (res.success) {
      setForm({ name: '', description: '', price: '', duration: '', requirements: '' });
      setModalVisible(false);
      fetchPoojas();
    } else {
      alert('Failed to add pooja');
    }
  };

  const deletePooja = async (id: string) => {
    const confirm = window.confirm ? window.confirm("Are you sure you want to delete this pooja?") : true;
    if (!confirm) return;
  
    const res = await apiDelete(`/poojas/${id}`);
    if (res.success) {
      fetchPoojas();
    } else {
      alert('Failed to delete pooja');
    }
  };
  

  useEffect(() => {
    fetchPoojas();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Add New Pooja" onPress={() => setModalVisible(true)} />

      <FlatList
        data={poojas}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Price: ₹{item.price}</Text>
            <Text>Duration: {item.duration}</Text>
            <Text>Requirements: {item.requirements?.join(', ')}</Text>

            <View style={{ marginTop: 8 }}>
              <Button title="Delete" color="red" onPress={() => deletePooja(item._id)} />
            </View>
          </View>
        )}
      />


      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <TextInput placeholder="Name" style={styles.input} value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} />
          <TextInput placeholder="Description" style={styles.input} value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} />
          <TextInput placeholder="Price" keyboardType="numeric" style={styles.input} value={form.price} onChangeText={(v) => setForm({ ...form, price: v })} />
          <TextInput placeholder="Duration" style={styles.input} value={form.duration} onChangeText={(v) => setForm({ ...form, duration: v })} />
          <TextInput placeholder="Requirements (comma separated)" style={styles.input} value={form.requirements} onChangeText={(v) => setForm({ ...form, requirements: v })} />

          <Button title="Add Pooja" onPress={addPooja} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 8,
  },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 6, borderRadius: 6,
  },
  modal: { padding: 20, flex: 1, justifyContent: 'center' },
});
