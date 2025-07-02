const mongoose = require('mongoose');
const Product = require('./models/Product'); // Adjust the path if needed

// 🟢 Replace this with your MongoDB Atlas connection string
const MONGO_URI = 'mongodb+srv://nithesh975:U9umMhiNy2FnxNTp@ayush.dftgduc.mongodb.net/?retryWrites=true&w=majority&appName=Ayush';

// Sample Ayurvedic products (10 base items)
const baseProducts = [
  {
    name: 'Ashwagandha Capsules',
    price: 249,
    description: 'Promotes vitality and relieves stress.',
    benefits: 'Stress relief, improved sleep, immunity booster',
    usage: 'Take 1 capsule twice daily after meals',
    stock: 50,
    category: 'Health Supplement',
  },
  {
    name: 'Triphala Juice',
    price: 199,
    description: 'Supports digestion and detoxification.',
    benefits: 'Digestive health, detox, mild laxative',
    usage: '30ml twice a day before meals',
    stock: 40,
    category: 'Juice',
  },
  {
    name: 'Chyawanprash',
    price: 299,
    description: 'Ayurvedic tonic for energy and immunity.',
    benefits: 'Boosts immunity, rejuvenates health',
    usage: '1-2 tsp daily with milk',
    stock: 60,
    category: 'Tonic',
  },
  {
    name: 'Neem Tablets',
    price: 179,
    description: 'Promotes healthy skin and blood purification.',
    benefits: 'Anti-acne, blood purifier, detox',
    usage: '1-2 tablets daily with water',
    stock: 100,
    category: 'Tablets',
  },
  {
    name: 'Brahmi Syrup',
    price: 225,
    description: 'Improves concentration and mental clarity.',
    benefits: 'Memory enhancer, stress reliever',
    usage: '10ml twice daily after meals',
    stock: 25,
    category: 'Syrup',
  },
  {
    name: 'Shatavari Powder',
    price: 189,
    description: 'Women’s health and hormonal balance.',
    benefits: 'Supports lactation, hormonal balance',
    usage: '1 tsp with warm milk daily',
    stock: 30,
    category: 'Powder',
  },
  {
    name: 'Karela Juice',
    price: 210,
    description: 'Helps regulate blood sugar and digestion.',
    benefits: 'Controls sugar levels, improves digestion',
    usage: '30ml with water in the morning',
    stock: 45,
    category: 'Juice',
  },
  {
    name: 'Moringa Tablets',
    price: 160,
    description: 'Rich in nutrients and antioxidants.',
    benefits: 'Energy booster, antioxidant, detox',
    usage: '2 tablets daily after meals',
    stock: 70,
    category: 'Tablets',
  },
  {
    name: 'Ayurvedic Hair Oil',
    price: 129,
    description: 'Strengthens hair and prevents hair fall.',
    benefits: 'Hair growth, reduces dandruff',
    usage: 'Apply twice weekly and massage into scalp',
    stock: 35,
    category: 'Oil',
  },
  {
    name: 'Digestive Churna',
    price: 99,
    description: 'Natural herbal remedy for indigestion.',
    benefits: 'Improves digestion, relieves bloating',
    usage: '1 tsp after meals with warm water',
    stock: 55,
    category: 'Churna',
  },
];

// 🔁 Generate 50 products by repeating and randomizing
const allProducts = [];

for (let i = 0; i < 5; i++) {
  baseProducts.forEach((prod) => {
    allProducts.push({
      ...prod,
      name: `${prod.name} - Batch ${i + 1}`,
      price: prod.price + Math.floor(Math.random() * 50),
      stock: prod.stock + Math.floor(Math.random() * 25),
      images: [], // 🔴 BLANK for now
      featured: Math.random() > 0.7,
    });
  });
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    await Product.deleteMany({});
    console.log('🧹 Cleared existing products');

    await Product.insertMany(allProducts);
    console.log(`✅ Seeded ${allProducts.length} products`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
