const express = require('express');
const {
  register,
  login,
  getFavorites,
  addFavorite,
  removeFavorite,
  getProfile,
  updateProfile,
  changePassword,
  getSettings,
  updateSettings,
  getSubscription,
  upgradeSubscription, // 👈 add
} = require('../controllers/authController');

const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', register);

// POST /api/auth/login - Login user
router.post('/login', login);

// GET /api/auth/favorites - Get user's favorites
router.get('/favorites', auth, getFavorites);

// POST /api/auth/favorites/:recipeId - Add to favorites
router.post('/favorites/:recipeId', auth, addFavorite);

// DELETE /api/auth/favorites/:recipeId - Remove from favorites
router.delete('/favorites/:recipeId', auth, removeFavorite);

// ✅ NEW ROUTES:

// Get logged-in user profile
router.get('/me', auth, getProfile);

// Update profile
router.put('/me', auth, updateProfile);

// Change password
router.post('/change-password', auth, changePassword);

// Settings
router.get('/settings', auth, getSettings);
router.put('/settings', auth, updateSettings);

// Subscription
router.get('/subscription', auth, getSubscription);
// GET /api/auth/subscription - Get user subscription
router.get('/subscription', auth, getSubscription);

// POST /api/auth/subscription/upgrade - Upgrade to premium (mock)
router.post('/subscription/upgrade', auth, upgradeSubscription);


module.exports = router;
