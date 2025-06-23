import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';

const product = {
  name: 'Ashwagandha',
  image: 'https://via.placeholder.com/300',
  description: 'Ashwagandha is an ancient medicinal herb with multiple health benefits...',
  benefits: 'Reduces stress and anxiety, boosts energy, improves concentration.',
  usage: 'Take 1-2 capsules daily after meals or as directed by your physician.',
  price: '₹250',
};

const relatedProducts = [
  { id: '1', name: 'Tulsi Tea', image: 'https://via.placeholder.com/120' },
  { id: '2', name: 'Neem Oil', image: 'https://via.placeholder.com/120' },
  { id: '3', name: 'Aloe Vera Gel', image: 'https://via.placeholder.com/120' },
];

export default function ProductDetails() {
  const [tab, setTab] = useState<'Description' | 'Benefits' | 'Usage'>('Description');

  const handleAddToCart = () => {
    Alert.alert('Success', 'Added to cart!');
    // TODO: Add to real cart state later
  };

  const handleBuyNow = () => {
    Alert.alert('Proceeding to checkout...');
    // TODO: Navigate to checkout screen
  };

  const renderTabContent = () => {
    switch (tab) {
      case 'Description':
        return <Text style={styles.tabText}>{product.description}</Text>;
      case 'Benefits':
        return <Text style={styles.tabText}>{product.benefits}</Text>;
      case 'Usage':
        return <Text style={styles.tabText}>{product.usage}</Text>;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Product Image */}
        <Image source={{ uri: product.image }} style={styles.image} />

        {/* Product Name & Price */}
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{product.price}</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {['Description', 'Benefits', 'Usage'].map((label) => (
            <Pressable
              key={label}
              style={[styles.tabButton, tab === label && styles.tabButtonActive]}
              onPress={() => setTab(label as any)}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  tab === label && styles.tabButtonTextActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>{renderTabContent()}</View>

        {/* Related Products */}
        <Text style={styles.heading}>Related Products</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {relatedProducts.map((rp) => (
            <View key={rp.id} style={styles.relatedCard}>
              <Image source={{ uri: rp.image }} style={styles.relatedImage} />
              <Text style={styles.relatedName}>{rp.name}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Pressable style={styles.addToCart} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </Pressable>
        <Pressable style={styles.buyNow} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100, // so content won't hide behind buttons
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  tabButtonActive: {
    borderBottomColor: '#4CAF50',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#666',
  },
  tabButtonTextActive: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  tabContent: {
    marginBottom: 24,
  },
  tabText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  relatedCard: {
    marginRight: 12,
    alignItems: 'center',
  },
  relatedImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 6,
  },
  relatedName: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    width: '100%',
  },
  addToCart: {
    flex: 1,
    backgroundColor: '#FF9800',
    marginRight: 8,
    paddingVertical: 16,
    borderRadius: 8,
  },
  buyNow: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
  },
  addToCartText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  buyNowText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
