const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email or username'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const user = await User.findById(req.userId);
    if (!user.favorites.some(id => id.toString() === recipeId)) {
      user.favorites.push(recipeId);
      await user.save();
    }
    res.json({ message: 'Added to favorites' });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const user = await User.findById(req.userId);
    user.favorites = user.favorites.filter(id => id.toString() !== recipeId);
    await user.save();
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ NEW: GET /api/auth/me
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ NEW: PUT /api/auth/me
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName, email },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ NEW: POST /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ NEW: simple settings
const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('settings');
    res.json(user?.settings || {});
  } catch (err) {
    console.error('Get settings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body; // e.g. { language: 'en', theme: 'dark' }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { settings },
      { new: true }
    ).select('settings');

    res.json({ message: 'Settings updated', settings: user.settings });
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ NEW: simple subscription info
const getSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('subscription');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // if subscription not set, return default
    const sub = user.subscription || {
      plan: 'free',
      status: 'active',
    };

    res.json(sub);
  } catch (err) {
    console.error('Get subscription error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Simple upgrade to premium (mock, no real payment)
const upgradeSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.subscription = {
      plan: 'premium',
      status: 'active',
      startedAt: new Date(),
      expiresAt: null, // or set 30 days later if you want
    };

    await user.save();

    res.json({
      message: 'Upgraded to premium successfully',
      subscription: user.subscription,
    });
  } catch (err) {
    console.error('Upgrade subscription error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔥 Single export object (no exports.* below this)
module.exports = {
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
  upgradeSubscription, // 👈 add this
};
