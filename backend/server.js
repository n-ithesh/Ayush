require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json({ limit: '5mb' })); // allow base64 images
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/auth', authRoutes);

// ✅ Connect DB + start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(5000, '0.0.0.0', () => {
      console.log('🚀 Server running on http://localhost:5000');
    });
  })
  .catch(err => console.error(err));
