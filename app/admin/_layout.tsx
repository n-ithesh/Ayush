import { Tabs, router } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutButton = () => (
  <Pressable
    onPress={async () => {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('token'); // or your auth key
            router.replace('../onboarding'); // navigate to login screen
          },
        },
      ]);
    }}
    style={{ marginRight: 16 }}
  >
    <Ionicons name="log-out-outline" size={24} color="#00897b" />
  </Pressable>
);

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00897b',
        tabBarInactiveTintColor: '#aaa',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          paddingTop: 4,
          backgroundColor: '#fff',
        },
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => <LogoutButton />, // 👈 Add this
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="speedometer-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <MaterialIcons name="inventory" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => <FontAwesome5 name="clipboard-list" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="poojas"
        options={{
          title: 'Poojas',
          tabBarIcon: ({ color }) => <Ionicons name="flower-outline" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
