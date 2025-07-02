const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    benefits: String,
    usage: String,
    images: [String],
    stock: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Oil',
        'Tablets',
        'Syrup',
        'Powder',
        'Capsule',
        'Health Supplement',
        'Juice',
        'Churna',
        'Paste',
        'Soap',
        'Other',
        'Tonic',
      ],
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
