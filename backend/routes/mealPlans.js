const express = require('express');
const auth = require('../middleware/auth');
const {
    getCurrentMealPlan,
    getNutritionDashboard,
    saveCurrentMealPlan,
    generateShoppingList
} = require('../controllers/mealPlanController');

const router = express.Router();

router.get('/current', auth, getCurrentMealPlan);
router.get('/nutrition', auth, getNutritionDashboard);
router.put('/current', auth, saveCurrentMealPlan);
router.post('/shopping-list', auth, generateShoppingList);

module.exports = router;
