const User = require('../models/User');
const FamilyGroup = require('../models/FamilyGroup');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const makeInviteCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const logger = {
  info: (message, data) => console.info('[AUTH]', message, data || ''),
  warn: (message, data) => console.warn('[AUTH]', message, data || ''),
  error: (message, data) => console.error('[AUTH]', message, data || '')
};

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    trialDays: 0,
    description: 'Good for exploring recipes, planning meals, and setting up your kitchen profile.',
    audience: 'Best for casual home cooks getting started.',
    badge: 'Starter',
    spotlight: 'Plan your week, store pantry basics, and discover recipes before upgrading.',
    features: [
      'Browse public recipes',
      'Weekly meal planner',
      'Pantry inventory',
      'Basic AI cooking help',
      'Profile and nutrition settings'
    ],
    modules: [
      { key: 'planner', label: 'Meal planner', value: 'Included' },
      { key: 'pantry', label: 'Pantry tracker', value: 'Included' },
      { key: 'ai', label: 'AI assistant', value: 'Limited' },
      { key: 'collections', label: 'Recipe collections', value: 'Premium only' },
      { key: 'family', label: 'Family groups', value: 'Premium only' },
      { key: 'publishing', label: 'Publish recipes', value: 'Premium only' }
    ],
    highlights: [
      'Weekly planning tools included',
      'Personal pantry and nutrition profile',
      'Great for exploring before upgrading'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 199,
    priceYearly: 1990,
    trialDays: 7,
    description: 'Best for daily cooking, premium publishing, family planning, and deeper personalization.',
    audience: 'Best for creators, families, and serious meal planners.',
    badge: 'Most Popular',
    spotlight: 'Unlock premium recipe publishing, shared planning, smarter organization, and faster support.',
    features: [
      'Unlimited AI chatbot help',
      'Publish and manage your own recipes',
      'Private and public recipe collections',
      'Family groups and shared planning',
      'Priority access to new cooking tools'
    ],
    modules: [
      { key: 'planner', label: 'Meal planner', value: 'Included' },
      { key: 'pantry', label: 'Pantry tracker', value: 'Included' },
      { key: 'ai', label: 'AI assistant', value: 'Unlimited' },
      { key: 'collections', label: 'Recipe collections', value: 'Unlimited' },
      { key: 'family', label: 'Family groups', value: 'Included' },
      { key: 'publishing', label: 'Publish recipes', value: 'Included' }
    ],
    highlights: [
      'Create and publish recipes',
      'Organize unlimited collections',
      'Collaborate with family members',
      'Priority support and early feature access'
    ]
  }
};

const normalizeSubscription = (subscription = {}) => {
  const planId = SUBSCRIPTION_PLANS[subscription.plan] ? subscription.plan : 'free';
  const status = String(subscription.status || 'active').trim().toLowerCase() || 'active';
  const startedAt = subscription.startedAt || null;
  const expiresAt = subscription.expiresAt || null;
  const cancelledAt = subscription.cancelledAt || null;
  const renewalAt = subscription.renewalAt || null;
  const billingCycle = subscription.billingCycle || 'monthly';
  const basePlan = SUBSCRIPTION_PLANS[planId];

  return {
    plan: planId,
    planName: basePlan.name,
    status,
    billingCycle,
    startedAt,
    expiresAt,
    renewalAt,
    cancelledAt,
    priceMonthly: basePlan.priceMonthly,
    priceYearly: basePlan.priceYearly,
    trialDays: basePlan.trialDays,
    description: basePlan.description,
    audience: basePlan.audience,
    badge: basePlan.badge,
    spotlight: basePlan.spotlight,
    features: basePlan.features,
    modules: basePlan.modules,
    highlights: basePlan.highlights,
    limits: {
      aiChats: planId === 'premium' ? 'Unlimited' : 'Limited',
      premiumRecipes: planId === 'premium',
      plannerSync: true,
      recipePublishing: planId === 'premium',
      collections: planId === 'premium' ? 'Unlimited' : 'Locked',
      familyGroups: planId === 'premium' ? 'Included' : 'Locked',
      support: planId === 'premium' ? 'Priority' : 'Standard'
    }
  };
};

const buildSubscriptionPayload = (user) => ({
  subscription: normalizeSubscription(user?.subscription || {}),
  plans: Object.values(SUBSCRIPTION_PLANS),
  premiumModules: [
    {
      id: 'recipe-publishing',
      title: 'Recipe Publishing',
      summary: 'Let creators publish and manage recipes directly from their profile.'
    },
    {
      id: 'collections',
      title: 'Collections',
      summary: 'Save themed recipe boards for events, prep plans, and seasonal cooking.'
    },
    {
      id: 'family-planner',
      title: 'Family Planner',
      summary: 'Share invite-based planning and group coordination for home cooking.'
    }
  ],
  retention: {
    annualSavings: SUBSCRIPTION_PLANS.premium.priceMonthly * 12 - SUBSCRIPTION_PLANS.premium.priceYearly,
    promise: 'Cancel anytime. Premium access remains active until the current billing period ends.',
    trialMessage: `${SUBSCRIPTION_PLANS.premium.trialDays}-day premium trial included in this mock flow.`
  },
  canUpgrade: normalizeSubscription(user?.subscription || {}).plan !== 'premium',
  canCancel: normalizeSubscription(user?.subscription || {}).plan === 'premium'
});


// Register a new user
const register = async (req, res) => {
  try {
    const payload = registerSchema.safeParse(req.body);
    if (!payload.success) {
      return res.status(400).json({ message: 'Invalid input', errors: payload.error.errors });
    }

    const { username, email, password, firstName, lastName } = payload.data;

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
    logger.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const payload = loginSchema.safeParse(req.body);
    if (!payload.success) {
      return res.status(400).json({ message: 'Invalid input', errors: payload.error.errors });
    }

    const { email, password } = payload.data;

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
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    logger.error('Get favorites error:', error);
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
    logger.error('Add favorite error:', error);
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
    logger.error('Remove favorite error:', error);
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
    logger.error('Get profile error:', err);
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
    logger.error('Update profile error:', err);
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
    logger.error('Change password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ NEW: simple settings
const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('settings');
    res.json(user?.settings || {});
  } catch (err) {
    logger.error('Get settings error:', err);
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
    logger.error('Update settings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPantry = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('pantry');
    res.json(user?.pantry || []);
  } catch (err) {
    logger.error('Get pantry error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePantry = async (req, res) => {
  try {
    const pantry = Array.isArray(req.body.pantry) ? req.body.pantry : [];
    const user = await User.findByIdAndUpdate(
      req.userId,
      { pantry },
      { new: true }
    ).select('pantry');

    res.json({ message: 'Pantry updated', pantry: user?.pantry || [] });
  } catch (err) {
    logger.error('Update pantry error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getFamilyGroups = async (req, res) => {
  try {
    const groups = await FamilyGroup.find({ 'members.user': req.userId })
      .populate('members.user', 'firstName lastName username email')
      .select('name inviteCode owner members createdAt');

    res.json(groups);
  } catch (err) {
    logger.error('Get family groups error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createFamilyGroup = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) {
      return res.status(400).json({ message: 'Family group name is required' });
    }

    const group = await FamilyGroup.create({
      name,
      inviteCode: makeInviteCode(),
      owner: req.userId,
      members: [{ user: req.userId, role: 'owner' }]
    });

    await User.findByIdAndUpdate(req.userId, { $addToSet: { familyGroups: group._id } });
    const populated = await FamilyGroup.findById(group._id).populate('members.user', 'firstName lastName username email');
    res.status(201).json({ message: 'Family group created', group: populated });
  } catch (err) {
    console.error('Create family group error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const joinFamilyGroup = async (req, res) => {
  try {
    const inviteCode = String(req.body.inviteCode || '').trim().toUpperCase();
    if (!inviteCode) {
      return res.status(400).json({ message: 'Invite code is required' });
    }

    const group = await FamilyGroup.findOne({ inviteCode });
    if (!group) {
      return res.status(404).json({ message: 'Family group not found' });
    }

    if (!group.members.some((member) => String(member.user) === String(req.userId))) {
      group.members.push({ user: req.userId, role: 'member' });
      await group.save();
      await User.findByIdAndUpdate(req.userId, { $addToSet: { familyGroups: group._id } });
    }

    const populated = await FamilyGroup.findById(group._id).populate('members.user', 'firstName lastName username email');
    res.json({ message: 'Joined family group', group: populated });
  } catch (err) {
    console.error('Join family group error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ NEW: simple subscription info
const getSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('subscription');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(buildSubscriptionPayload(user));
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
      renewalAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      expiresAt: null,
      cancelledAt: null,
      billingCycle: 'monthly'
    };

    await user.save();

    res.json({
      message: 'Upgraded to premium successfully',
      ...buildSubscriptionPayload(user)
    });
  } catch (err) {
    console.error('Upgrade subscription error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (String(user.subscription?.plan || 'free') !== 'premium') {
      return res.status(400).json({ message: 'Only premium subscriptions can be cancelled' });
    }

    user.subscription = {
      ...user.subscription.toObject?.() || user.subscription,
      status: 'cancelled',
      cancelledAt: new Date(),
      expiresAt: user.subscription?.renewalAt || null
    };

    await user.save();

    res.json({
      message: 'Subscription cancelled. Premium access stays active until the current period ends.',
      ...buildSubscriptionPayload(user)
    });
  } catch (err) {
    console.error('Cancel subscription error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const reactivateSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (String(user.subscription?.plan || 'free') !== 'premium') {
      return res.status(400).json({ message: 'Only premium subscriptions can be reactivated' });
    }

    user.subscription = {
      ...user.subscription.toObject?.() || user.subscription,
      status: 'active',
      cancelledAt: null,
      expiresAt: null,
      renewalAt: user.subscription?.renewalAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    await user.save();

    res.json({
      message: 'Subscription reactivated successfully',
      ...buildSubscriptionPayload(user)
    });
  } catch (err) {
    console.error('Reactivate subscription error:', err);
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
  getPantry,
  getFamilyGroups,
  updateSettings,
  updatePantry,
  createFamilyGroup,
  joinFamilyGroup,
  getSubscription,
  upgradeSubscription,
  cancelSubscription,
  reactivateSubscription,
};
