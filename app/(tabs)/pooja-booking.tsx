import { useEffect, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, FlatList, TextInput,
  Alert, ActivityIndicator, Platform, ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiGet, apiPost } from '@/utils/api';

export default function PoojaBooking() {
  const [step, setStep] = useState(1);
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState<'date' | 'time' | null>(null);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchPoojas();
    fetchUser();
  }, []);

  const fetchPoojas = async () => {
    try {
      const res = await apiGet('/poojas');
      setPoojas(res.data);
    } catch (err) {
      Alert.alert('Failed to load poojas');
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await apiGet('/auth/me');
      setUser(res.user);
    } catch (err) {
      Alert.alert('Failed to load user data');
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const confirmBooking = async () => {
    try {
      const payload = {
        pooja: selectedService._id,
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        address: location,
        poojaDate: date.toISOString(), // full datetime
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes,
      };
  
      const res = await apiPost('/bookings', payload,true);
      if (res.success) {
        Alert.alert('Booking Confirmed!', 'Thank you for booking.');
        setStep(1);
        setSelectedService(null);
        setLocation('');
        setNotes('');
      } else {
        console.log('Booking response:', res);
        Alert.alert('Booking failed', res?.message || 'Server didn’t respond properly.');        
      }
    } catch (err) {
      Alert.alert('Something went wrong!');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Book a Pooja</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <>
          {step === 1 && (
            <>
              <Text style={styles.subHeading}>Available Poojas</Text>
              <FlatList
                data={poojas}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.serviceCard}>
                    <Text style={styles.serviceName}>{item.name}</Text>
                    <Text style={styles.serviceDetail}><Text style={styles.bold}>Description:</Text> {item.description}</Text>
                    <Text style={styles.serviceDetail}><Text style={styles.bold}>Price:</Text> ₹{item.price}</Text>
                    <Text style={styles.serviceDetail}><Text style={styles.bold}>Duration:</Text> {item.duration} mins</Text>
                    {item.requirements?.length > 0 && (
                      <Text style={styles.serviceDetail}>
                        <Text style={styles.bold}>Requirements:</Text> {item.requirements.join(', ')}
                      </Text>
                    )}
                    <Pressable
                      style={styles.bookNowButton}
                      onPress={() => {
                        setSelectedService(item);
                        setStep(2);
                      }}
                    >
                      <Text style={styles.bookNowText}>Book Now</Text>
                    </Pressable>
                  </View>
                )}
              />
            </>
          )}

{step === 2 && (
  <>
    <Text style={styles.subHeading}>Select Date & Time</Text>

    <Pressable style={styles.dateButton} onPress={() => setShowDatePicker('date')}>
      <Text style={styles.dateButtonText}>
        Select Date: {date.toDateString()}
      </Text>
    </Pressable>

    <Pressable style={styles.dateButton} onPress={() => setShowDatePicker('time')}>
      <Text style={styles.dateButtonText}>
        Select Time: {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </Pressable>

    {showDatePicker === 'date' && (
      <DateTimePicker
        value={date}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        minimumDate={new Date()}
        onChange={(event, selectedDate) => {
          if (Platform.OS === 'android') setShowDatePicker(null);
          if (selectedDate) {
            const newDate = new Date(date);
            newDate.setFullYear(selectedDate.getFullYear());
            newDate.setMonth(selectedDate.getMonth());
            newDate.setDate(selectedDate.getDate());
            setDate(newDate);
          }
        }}
      />
    )}

    {showDatePicker === 'time' && (
      <DateTimePicker
        value={date}
        mode="time"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={(event, selectedTime) => {
          if (Platform.OS === 'android') setShowDatePicker(null);
          if (selectedTime) {
            const newDate = new Date(date);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            newDate.setSeconds(0);
            setDate(newDate);
          }
        }}
      />
    )}

    <Pressable
      style={styles.bookNowButton}
      onPress={() => {
        if (date < new Date()) {
          Alert.alert('Invalid time', 'Please select a future date and time');
          return;
        }
        setStep(3);
      }}
    >
      <Text style={styles.bookNowText}>Continue</Text>
    </Pressable>
  </>
)}


          {step === 3 && (
            <>
              <Text style={styles.subHeading}>Location & Notes</Text>
              <TextInput
                placeholder="Enter Location"
                value={location}
                onChangeText={setLocation}
                style={styles.input}
              />
              <TextInput
                placeholder="Additional Requirements (optional)"
                value={notes}
                onChangeText={setNotes}
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                multiline
              />
              <Pressable
                style={styles.bookNowButton}
                onPress={() => setStep(4)}
              >
                <Text style={styles.bookNowText}>Continue</Text>
              </Pressable>
            </>
          )}

          {step === 4 && (
            <>
              <Text style={styles.subHeading}>Summary</Text>
              <View style={styles.summary}>
                <Text style={styles.summaryText}><Text style={styles.bold}>Service:</Text> {selectedService?.name}</Text>
                <Text style={styles.summaryText}><Text style={styles.bold}>Date:</Text> {date.toDateString()}</Text>
                <Text style={styles.summaryText}><Text style={styles.bold}>Time:</Text> {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                <Text style={styles.summaryText}><Text style={styles.bold}>Location:</Text> {location}</Text>
                {notes ? <Text style={styles.summaryText}><Text style={styles.bold}>Notes:</Text> {notes}</Text> : null}
              </View>
              <Pressable
                style={styles.bookButton}
                onPress={confirmBooking}
              >
                <Text style={styles.buttonText}>Book</Text>
              </Pressable>
            </>
          )}

          {step > 1 && (
            <Pressable style={styles.backButton} onPress={prevStep}>
              <Text style={styles.buttonText}>Back</Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 28, fontWeight: '700', marginBottom: 12, color: '#333' },
  subHeading: { fontSize: 20, fontWeight: '600', marginBottom: 12, color: '#4CAF50' },
  serviceCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  serviceName: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  serviceDetail: { fontSize: 14, color: '#555', marginBottom: 4 },
  bold: { fontWeight: '700' },
  bookNowButton: {
    marginTop: 12,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  bookNowText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  dateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  dateButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  summary: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  summaryText: { fontSize: 16, marginBottom: 8, color: '#333' },
  bookButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
