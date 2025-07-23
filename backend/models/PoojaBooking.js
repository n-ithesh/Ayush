const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pooja: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pooja',
    required: true,
  },
  name: String,
  email: String,
  phone: String,
  address: String,
  poojaDate: {
    type: Date,
    required: true,
  },
  time: String,
  notes: String,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
