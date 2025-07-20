import { apiGet } from '@/utils/api';
import { addToCart } from '@/utils/cart';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getImageUrl } from '@/utils/api';


const { width } = Dimensions.get('window');

export default function ProductDetails() {
  const { product } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    if (product) {
      const parsed = JSON.parse(decodeURIComponent(product as string));
      setData(parsed);
      loadRelated(parsed._id);
    }
  }, [product]);

  const loadRelated = async (id: string) => {
    const res = await apiGet('/products');
    if (res?.products) {
      const others = res.products.filter((p: any) => p._id !== id).slice(0, 5);
      setRelated(others);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(data);
      Alert.alert('Added to Cart', `${data.name} has been added.`);
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart.');
      console.error(error);
    }
  };
  

  const handleBuyNow = () => {
    router.push({
      pathname: '/checkout',
      params: {
        product: encodeURIComponent(JSON.stringify(data)),
      },
    });
  };
  
  if (!data) return <Text style={{ margin: 20 }}>Loading...</Text>;

  const { name, images, description, benefits, usage, price, stock, createdAt } = data;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
      <Image
          source={{
            uri:
              Array.isArray(data.images) && data.images.length > 0
                ? getImageUrl(data.images[0])
                : 'https://via.placeholder.com/300',
          }}
          style={styles.image}
          resizeMode="contain"
        />


        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>₹{price}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>Stock: {stock}</Text>
          <Text style={styles.meta}>
            Added: {new Date(createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.sectionText}>{description}</Text>

        <Text style={styles.sectionTitle}>Benefits</Text>
        <Text style={styles.sectionText}>{benefits}</Text>

        <Text style={styles.sectionTitle}>Usage</Text>
        <Text style={styles.sectionText}>{usage}</Text>

        <Text style={styles.sectionTitle}>More Products</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {related.map((item) => (
        <Pressable
          key={item._id}
          style={styles.relatedCard}
          onPress={() =>
            router.push({
              pathname: '/product-details',
              params: { product: encodeURIComponent(JSON.stringify(item)) },
            })
          }
        >
           <Image
        source={{
          uri:
            Array.isArray(item.images) && item.images.length > 0
              ? getImageUrl(item.images[0])
              : 'https://via.placeholder.com/100',
        }}
            style={styles.relatedImage}
          />
          <Text style={styles.relatedName}>{item.name}</Text>
          <Text style={styles.relatedPrice}>₹{item.price}</Text>
        </Pressable>
        ))}
        </ScrollView>
      </ScrollView>

      <View style={styles.actions}>
        <Pressable style={styles.addToCart} onPress={handleAddToCart}>
          <Text style={styles.actionText}>Add to Cart</Text>
        </Pressable>
        <Pressable style={styles.buyNow} onPress={handleBuyNow}>
          <Text style={styles.actionText}>Buy Now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 140,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    backgroundColor: 'rgb(255, 255, 255)',
  },
  
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4CAF50',
    marginVertical: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    color: '#777',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  relatedCard: {
    width: 120,
    marginRight: 12,
    alignItems: 'center',
    padding: 6,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  relatedImage: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginBottom: 6,
  },
  relatedName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  relatedPrice: {
    fontSize: 12,
    color: '#4CAF50',
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  addToCart: {
    flex: 1,
    backgroundColor: '#FF9800',
    marginRight: 10,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buyNow: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
  },
  actionText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
