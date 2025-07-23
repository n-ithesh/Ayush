const express = require('express');
const router = express.Router();
const Booking = require('../models/PoojaBooking');
const auth = require('../middleware/auth');

// ✅ POST: Create Booking (User)
router.post('/', auth, async (req, res) => {
  console.log('📥 Booking Payload:', req.body);

  try {
    const {
      pooja,
      name,
      email,
      phone,
      address,
      poojaDate,
      time,
      notes,
    } = req.body;

    if (!pooja || !poojaDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const newBooking = new Booking({
      user: req.user.id,
      pooja,
      name,
      email,
      phone,
      address,
      poojaDate,
      time,
      notes,
    });

    await newBooking.save();

    res.status(201).json({ success: true, booking: newBooking });
  } catch (err) {
    console.error('Booking Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ GET: User's Bookings
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('pooja');
    return res.json({ success: true, bookings });
  } catch (err) {
    console.log('error',err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Get all bookings (Admin only)
router.get('/all', auth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user')
      .populate('pooja');
    res.json({ success: true, bookings });
  } catch (err) {
    console.error('Error fetching bookings:', err.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// PATCH /bookings/update/:id
router.patch('/bookings/update/:id', auth, async (req, res) => {
  try {
    const { status, poojaDate, time } = req.body;
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, poojaDate, time },
      { new: true }
    );
    res.json({ success: true, booking: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', auth, async (req, res) => {
  console.log('DELETE route hit:', req.params.id);
  console.log('DELETE:', `${BASE_URL}${path}`);

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Optional: verify if booking belongs to the user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await booking.remove();

    res.json({ success: true, message: 'Booking canceled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
