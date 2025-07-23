import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.189.36:5000/api'; // ⚠️ Use your local IP


const IMAGE_BASE_URL = 'http://192.168.189.36:5000/uploads';

// ✅ Utility to generate full image URL
export const getImageUrl = (path?: string) => {
  if (!path) return 'https://via.placeholder.com/150';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `http://192.168.189.36:5000${path}`;
  return `http://192.168.189.36:5000/uploads/${path}`;
};



// Save token to AsyncStorage
export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// Retrieve token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// POST API request
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

    return {
      ...data,
      success: response.ok,
      status: response.status,
    };
  } catch (error: any) {
    console.error('API POST error:', error.message);
    return {
      success: false,
      msg: 'Network error',
    };
  }
};

// ✅ NEW: GET API request
export const apiGet = async (path: string, auth = false) => {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    return {
      ...data,
      success: response.ok,
      status: response.status,
    };
  } catch (error: any) {
    console.error('API GET error:', error.message);
    return {
      success: false,
      msg: 'Network error',
    };
  }
};

// ✅ DELETE API request (used for deleting address)
export const apiDelete = async (path: string, auth = false) => {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers,
    });

    const contentType = response.headers.get('content-type');
    
    // 🔐 Check if response is JSON
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text(); // get raw text (e.g., HTML)
      console.error('Expected JSON, got:', text);
      return {
        success: false,
        msg: 'Invalid server response',
        raw: text,
      };
    }

    return {
      ...data,
      success: response.ok,
      status: response.status,
    };
  } catch (error: any) {
    console.error('API DELETE error:', error.message);
    return {
      success: false,
      msg: 'Network error',
    };
  }
};


// ✅ PUT API request
export const apiPut = async (path: string, body: any, auth = false) => {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      ...data,
      success: response.ok,
      status: response.status,
    };
  } catch (error: any) {
    console.error('API PUT error:', error.message);
    return {
      success: false,
      msg: 'Network error',
    };
  }
};

// ✅ PATCH API request
export const apiPatch = async (path: string, body: any, auth = false) => {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      ...data,
      success: response.ok,
      status: response.status,
    };
  } catch (error: any) {
    console.error('API PATCH error:', error.message);
    return {
      success: false,
      msg: 'Network error',
    };
  }
};
