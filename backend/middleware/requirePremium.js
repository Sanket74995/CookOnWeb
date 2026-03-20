const User = require('../models/User');

const requirePremium = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('subscription');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (String(user.subscription?.plan || 'free') !== 'premium') {
      return res.status(403).json({
        message: 'This feature is available only on the Premium plan. Upgrade your subscription to continue.'
      });
    }

    next();
  } catch (error) {
    console.error('Premium access check error:', error);
    res.status(500).json({ message: 'Server error while checking subscription access' });
  }
};

module.exports = requirePremium;
