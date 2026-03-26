const express = require('express');
const auth = require('../middleware/auth');
const {
    getNutritionAnalytics,
    updateNutritionGoals
} = require('../controllers/nutritionController');

const router = express.Router();

router.get('/analytics', auth, getNutritionAnalytics);
router.put('/goals', auth, updateNutritionGoals);

module.exports = router;
