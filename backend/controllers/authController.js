const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ REGISTER CONTROLLER
exports.register = async (req, res) => {
  const { name, email, password, phone, addresses = [] } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already exists  goto Login' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      addresses,
    });

    await newUser.save();

    // Return success
    res.status(201).json({ msg: 'User registered' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// ✅ LOGIN CONTROLLER
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' }); // 👈 clearer error
    }

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid password' }); // 👈 clearer error
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Respond with token and user info
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

// Add New Address
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.push(req.body.address);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Could not add address' });
  }
};

// Update Address by Index
exports.updateAddress = async (req, res) => {
  try {
    const { index, address } = req.body;
    const user = await User.findById(req.user.id);

    if (user.addresses[index] === undefined) {
      return res.status(400).json({ success: false, msg: 'Invalid address index' });
    }

    user.addresses[index] = address;
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Could not update address' });
  }
};

// Delete Address by Index
exports.deleteAddress = async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const user = await User.findById(req.user.id);

    if (isNaN(index) || index < 0 || index >= user.addresses.length) {
      return res.status(400).json({ success: false, msg: 'Invalid index' });
    }

    user.addresses.splice(index, 1);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Could not delete address' });
  }
};

//upload-profile-picture
exports.uploadProfilePicture = async (req, res) => {
  const userId = req.user.id;
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ success: false, msg: 'No image provided' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });

    user.profilePicture = image;
    await user.save();

    res.json({ success: true, msg: 'Profile picture updated', profilePicture: image });
  } catch (error) {
    console.error('Profile upload error:', error.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};
