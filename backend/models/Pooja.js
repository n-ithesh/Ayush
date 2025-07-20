const mongoose = require('mongoose');

const poojaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  duration: String,
  requirements: [String],
  image: String, // optional
});

module.exports = mongoose.model('Pooja', poojaSchema);
