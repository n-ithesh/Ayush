const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getProfile);
router.post('/update-profile', auth, authController.updateProfile);
router.post('/add-address', auth, authController.addAddress);
router.post('/update-address', auth, authController.updateAddress);
router.delete('/delete-address/:index', auth, authController.deleteAddress);
router.post('/upload-profile-picture', auth, authController.uploadProfilePicture);

module.exports = router;
