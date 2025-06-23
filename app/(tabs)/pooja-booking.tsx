import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const services = [
  { id: '1', name: 'Ganahoma', description: 'A ritual to invoke Lord Ganesha for blessings.' },
  { id: '2', name: 'Navagraha Pooja', description: 'A pooja to appease the nine planetary gods.' },
  { id: '3', name: 'Lakshmi Pooja', description: 'A ritual to seek prosperity from Goddess Lakshmi.' },
];

export default function PoojaBooking() {
  const [step, setStep] = useState(1);

  const [selectedService, setSelectedService] = useState<any>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const nextStep = () => {
    if (step === 1 && !selectedService) {
      Alert.alert('Select a service first!');
      return;
    }
    if (step === 3 && !location) {
      Alert.alert('Please enter location.');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const confirmBooking = () => {
    Alert.alert(
      'Booking Confirmed!',
      `Service: ${selectedService.name}\nDate: ${date.toDateString()}\nLocation: ${location}\nNotes: ${notes}`
    );
    // TODO: Send to backend
    // Reset flow
    setStep(1);
    setSelectedService(null);
    setLocation('');
    setNotes('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Book a Pooja</Text>

      {step === 1 && (
        <>
          <Text style={styles.subHeading}>Step 1: Select a Service</Text>
          <FlatList
            data={services}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.serviceCard,
                  selectedService?.id === item.id && styles.serviceCardActive,
                ]}
                onPress={() => setSelectedService(item)}
              >
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.serviceDesc}>{item.description}</Text>
              </Pressable>
            )}
          />
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.subHeading}>Step 2: Select Date</Text>
          <Pressable
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {date.toDateString()}
            </Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="calendar"
              onChange={(event, selected) => {
                const currentDate = selected || date;
                setShowDatePicker(false);
                setDate(currentDate);
              }}
            />
          )}
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.subHeading}>Step 3: Location & Notes</Text>
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
        </>
      )}

      {step === 4 && (
        <>
          <Text style={styles.subHeading}>Step 4: Summary</Text>
          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              <Text style={styles.bold}>Service:</Text> {selectedService.name}
            </Text>
            <Text style={styles.summaryText}>
              <Text style={styles.bold}>Date:</Text> {date.toDateString()}
            </Text>
            <Text style={styles.summaryText}>
              <Text style={styles.bold}>Location:</Text> {location}
            </Text>
            {notes ? (
              <Text style={styles.summaryText}>
                <Text style={styles.bold}>Notes:</Text> {notes}
              </Text>
            ) : null}
          </View>
        </>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        {step > 1 && (
          <Pressable style={styles.backButton} onPress={prevStep}>
            <Text style={styles.buttonText}>Back</Text>
          </Pressable>
        )}

        {step < 4 && (
          <Pressable style={styles.nextButton} onPress={nextStep}>
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        )}

        {step === 4 && (
          <Pressable style={styles.bookButton} onPress={confirmBooking}>
            <Text style={styles.buttonText}>Book</Text>
          </Pressable>
        )}
      </View>
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  serviceCardActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  serviceName: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  serviceDesc: { fontSize: 14, color: '#555' },
  dateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
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
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  bold: { fontWeight: '700' },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  backButton: {
    backgroundColor: '#FF9800',
    flex: 1,
    marginRight: 8,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
