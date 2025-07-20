// backend/seedPoojas.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pooja = require('./models/Pooja');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

const poojas = [
  {
    name: 'Ganapathi Homam',
    description: 'Performed to remove obstacles and ensure success in all endeavors.',
    price: 1500,
    duration: '1 hour',
    requirements: ['Coconut', 'Bananas', 'Flowers', 'Betel Leaves', 'Ghee'],
  },
  {
    name: 'Lakshmi Pooja',
    description: 'Dedicated to Goddess Lakshmi for wealth and prosperity.',
    price: 2000,
    duration: '1.5 hours',
    requirements: ['Coins', 'Turmeric', 'Rice', 'Lamp', 'Milk'],
  },
  {
    name: 'Navagraha Pooja',
    description: 'Performed to appease the nine planetary deities.',
    price: 2500,
    duration: '2 hours',
    requirements: ['Nine Colored Cloths', 'Sesame Seeds', 'Ghee Lamps', 'Flowers'],
  },
  {
    name: 'Saraswati Pooja',
    description: 'For blessings in education and arts.',
    price: 1800,
    duration: '1 hour',
    requirements: ['Books', 'White Cloth', 'Fruits', 'Flowers'],
  },
  {
    name: 'Satyanarayan Pooja',
    description: 'To seek blessings for prosperity and happiness.',
    price: 2200,
    duration: '1.5 hours',
    requirements: ['Tulsi Leaves', 'Bananas', 'Sweets', 'Coconut', 'Panchamrit'],
  }
];

const seedPoojas = async () => {
  try {
    await Pooja.deleteMany();
    await Pooja.insertMany(poojas);
    console.log('✅ Poojas seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedPoojas();
