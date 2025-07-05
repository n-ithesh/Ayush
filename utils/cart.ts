import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = 'AYUSH_CART';

export const getCart = async () => {
  const json = await AsyncStorage.getItem(CART_KEY);
  return json ? JSON.parse(json) : [];
};

export const addToCart = async (product: any) => {
  const cart = await getCart();
  const index = cart.findIndex((item: any) => item._id === product._id);
  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const updateCart = async (updatedCart: any[]) => {
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
};

export const clearCart = async () => {
  await AsyncStorage.removeItem(CART_KEY);
};
