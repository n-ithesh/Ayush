import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Use your system's IP (found via `ipconfig`) — required for mobile to connect
const BASE_URL = 'http://192.168.188.36:5000/api'; // 👈 Update with your correct local IP

// ✅ Save token securely
export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// ✅ Get token for authenticated requests
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// ✅ POST request (handles login, register, etc.)
export const apiPost = async (path: string, body: any, auth = false) => {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Request failed');
    }

    return data;
  } catch (error: any) {
    console.error('API POST error:', error.message);
    throw new Error(error.message || 'Network/server error');
  }
};

// ✅ You can add GET, PUT, DELETE if needed later
