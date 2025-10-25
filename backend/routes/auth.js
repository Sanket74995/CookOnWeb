const express = require('express');
const { register, login, getFavorites, addFavorite, removeFavorite } = require('../controllers/authController');
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

module.exports = router;
