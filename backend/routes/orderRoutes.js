const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Order = require('../models/Order');

// ✅ Place new order (customer)
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Incoming Order Body:', req.body);
    console.log('User from token:', req.user);

    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    const order = new Order({
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: 'Pending',
    });

    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    console.error('❌ Order creation failed:', err);
    res.status(500).json({ success: false, msg: 'Failed to place order' });
  }
});


// ✅ Get all orders for current logged-in user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.json({ success: true, orders });
  } catch (err) {
    console.error('❌ Fetch user orders failed:', err);
    res.status(500).json({ success: false, msg: 'Could not fetch orders' });
  }
});

// ✅ Admin: Get all orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Forbidden' });
    }

    const orders = await Order.find().populate('user items.product');
    res.json({ success: true, orders });
  } catch (err) {
    console.error('❌ Fetch all orders failed:', err);
    res.status(500).json({ success: false, msg: 'Could not fetch orders' });
  }
});

// ✅ Admin: Update order status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Forbidden' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, msg: 'Order not found' });
    }

    order.status = req.body.status;
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    console.error('❌ Update order status failed:', err);
    res.status(500).json({ success: false, msg: 'Could not update order status' });
  }
});

module.exports = router;
