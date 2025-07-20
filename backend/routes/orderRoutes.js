// backend/routes/order.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Order = require('../models/Order');

// Place new order (customer)
router.post('/', authMiddleware, async (req, res) => {
  try {
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
    res.status(500).json({ success: false, msg: 'Failed to place order' });
  }
});

// Get all orders for current logged-in user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Could not fetch orders' });
  }
});

// Admin: Get all orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    // ✅ ALLOW if fake token:
    if (req.headers.authorization === 'Bearer admin-token') {
      const orders = await Order.find().populate('user items.product');
      return res.json({ success: true, orders });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Forbidden' });
    }

    const orders = await Order.find().populate('user items.product');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Could not fetch orders' });
  }
});

// Update order status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, msg: 'Order not found' });
    }

    if (status === 'Cancelled') {
      if (String(order.user) !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, msg: 'Unauthorized' });
      }
      order.status = 'Cancelled';
      await order.save();
      return res.json({ success: true, msg: 'Order cancelled', order });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Only admin can update status' });
    }

    order.status = status;
    await order.save();
    res.json({ success: true, msg: 'Status updated', order });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Could not update order status' });
  }
});

// GET /api/orders/stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Forbidden' });
    }

    const orders = await Order.find().populate('user');
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    const recentActivities = orders
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map((order) => ({
        message: `Order ${order._id.slice(-5)} placed by ${order.user?.name || 'Unknown'}`,
      }));

    res.json({ success: true, totalOrders, totalRevenue, recentActivities });
  } catch (err) {
    console.error('Order stats error:', err);
    res.status(500).json({ success: false, msg: 'Failed to fetch stats' });
  }
});


module.exports = router;
