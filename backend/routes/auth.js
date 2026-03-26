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
  getPantry,
  getFamilyGroups,
  updateSettings,
  updatePantry,
  createFamilyGroup,
  joinFamilyGroup,
  getSubscription,
  upgradeSubscription,
  cancelSubscription,
  reactivateSubscription
} = require('../controllers/authController');

const auth = require('../middleware/auth');
const requirePremium = require('../middleware/requirePremium');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/favorites', auth, getFavorites);
router.post('/favorites/:recipeId', auth, requirePremium, addFavorite);
router.delete('/favorites/:recipeId', auth, removeFavorite);

router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);
router.post('/change-password', auth, changePassword);

router.get('/settings', auth, getSettings);
router.put('/settings', auth, updateSettings);
router.get('/pantry', auth, getPantry);
router.put('/pantry', auth, updatePantry);

router.get('/family-groups', auth, getFamilyGroups);
router.post('/family-groups', auth, requirePremium, createFamilyGroup);
router.post('/family-groups/join', auth, requirePremium, joinFamilyGroup);

router.get('/subscription', auth, getSubscription);
router.post('/subscription/upgrade', auth, upgradeSubscription);
router.post('/subscription/cancel', auth, cancelSubscription);
router.post('/subscription/reactivate', auth, reactivateSubscription);

module.exports = router;
