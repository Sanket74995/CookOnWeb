const MealPlan = require('../models/MealPlan');
const User = require('../models/User');

const DEFAULT_GOALS = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    fiber: 25
};

const PERIOD_DAYS = {
    week: 7,
    month: 30,
    '3months': 90
};

const toIsoDate = (value) => new Date(value).toISOString().slice(0, 10);

const getStartDate = (period = 'week') => {
    const now = new Date();
    const days = PERIOD_DAYS[period] || PERIOD_DAYS.week;
    const start = new Date(now);
    start.setDate(now.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);
    return start;
};

const safeNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const getProgressStatus = (current, target) => {
    const percentage = target > 0 ? (current / target) * 100 : 0;
    if (percentage < 70) return 'low';
    if (percentage < 90) return 'moderate';
    if (percentage <= 110) return 'good';
    return 'high';
};

const getNutritionAnalytics = async (req, res) => {
    try {
        const period = req.query.period || 'week';
        const startDate = getStartDate(period);
        const startDateIso = toIsoDate(startDate);
        const days = PERIOD_DAYS[period] || PERIOD_DAYS.week;

        const user = await User.findById(req.userId).select('settings.nutritionGoals');
        const goals = {
            ...DEFAULT_GOALS,
            ...(user?.settings?.nutritionGoals || {})
        };

        const mealPlans = await MealPlan.find({
            user: req.userId,
            weekStart: { $gte: startDateIso }
        }).populate({
            path: 'entries.recipe',
            select: 'title nutrition ingredients rating'
        });

        const entries = mealPlans
            .flatMap((plan) => plan.entries || [])
            .filter((entry) => entry?.recipe && entry.date >= startDateIso);

        const summary = {
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            totalFiber: 0,
            averageRating: 0
        };

        const dailyMap = new Map();
        const mealCalories = {
            breakfast: 0,
            lunch: 0,
            dinner: 0,
            snacks: 0
        };
        const ingredientMap = new Map();
        let ratedEntryCount = 0;

        entries.forEach((entry) => {
            const recipe = entry.recipe;
            const baseServings = safeNumber(recipe.servings) || 1;
            const scale = (safeNumber(entry.servings) || baseServings) / baseServings;
            const calories = safeNumber(recipe.nutrition?.calories) * scale;
            const protein = safeNumber(recipe.nutrition?.protein) * scale;
            const carbs = safeNumber(recipe.nutrition?.carbs) * scale;
            const fat = safeNumber(recipe.nutrition?.fat) * scale;

            summary.totalCalories += calories;
            summary.totalProtein += protein;
            summary.totalCarbs += carbs;
            summary.totalFat += fat;

            if (safeNumber(recipe.rating?.average) > 0) {
                summary.averageRating += safeNumber(recipe.rating.average);
                ratedEntryCount += 1;
            }

            const dayStats = dailyMap.get(entry.date) || {
                date: entry.date,
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            };

            dayStats.calories += calories;
            dayStats.protein += protein;
            dayStats.carbs += carbs;
            dayStats.fat += fat;
            dailyMap.set(entry.date, dayStats);

            const mealKey = entry.mealType === 'snack' ? 'snacks' : entry.mealType;
            if (mealCalories[mealKey] != null) {
                mealCalories[mealKey] += calories;
            }

            (recipe.ingredients || []).forEach((ingredient) => {
                const key = String(ingredient.name || '').trim().toLowerCase();
                if (!key) return;
                const current = ingredientMap.get(key) || {
                    name: ingredient.name,
                    amount: 0,
                    unit: ingredient.unit || '',
                    nutrition: {
                        calories: 0,
                        protein: 0,
                        carbs: 0,
                        fat: 0
                    }
                };

                current.amount += safeNumber(ingredient.quantity) || 1;
                current.nutrition.calories += calories / Math.max((recipe.ingredients || []).length, 1);
                current.nutrition.protein += protein / Math.max((recipe.ingredients || []).length, 1);
                current.nutrition.carbs += carbs / Math.max((recipe.ingredients || []).length, 1);
                current.nutrition.fat += fat / Math.max((recipe.ingredients || []).length, 1);
                ingredientMap.set(key, current);
            });
        });

        summary.averageRating = ratedEntryCount > 0 ? Number((summary.averageRating / ratedEntryCount).toFixed(1)) : 0;

        const totalMealCalories = Object.values(mealCalories).reduce((sum, value) => sum + value, 0) || 1;
        const mealDistribution = Object.fromEntries(
            Object.entries(mealCalories).map(([meal, calories]) => [meal, Math.round((calories / totalMealCalories) * 100)])
        );

        const topIngredients = [...ingredientMap.values()]
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5)
            .map((item) => ({
                ...item,
                amount: Math.round(item.amount * 100) / 100,
                nutrition: {
                    calories: Math.round(item.nutrition.calories),
                    protein: Math.round(item.nutrition.protein * 10) / 10,
                    carbs: Math.round(item.nutrition.carbs * 10) / 10,
                    fat: Math.round(item.nutrition.fat * 10) / 10
                }
            }));

        const averageDaily = {
            calories: summary.totalCalories / days,
            protein: summary.totalProtein / days,
            carbs: summary.totalCarbs / days,
            fat: summary.totalFat / days
        };

        const deficiencies = [
            { nutrient: 'Calories', current: Math.round(averageDaily.calories), recommended: goals.calories },
            { nutrient: 'Protein', current: Math.round(averageDaily.protein), recommended: goals.protein },
            { nutrient: 'Carbohydrates', current: Math.round(averageDaily.carbs), recommended: goals.carbs },
            { nutrient: 'Fat', current: Math.round(averageDaily.fat), recommended: goals.fat }
        ].map((item) => ({
            ...item,
            status: getProgressStatus(item.current, item.recommended)
        }));

        return res.json({
            summary: {
                ...summary,
                totalCalories: Math.round(summary.totalCalories),
                totalProtein: Math.round(summary.totalProtein),
                totalCarbs: Math.round(summary.totalCarbs),
                totalFat: Math.round(summary.totalFat)
            },
            dailyBreakdown: [...dailyMap.values()].sort((a, b) => a.date.localeCompare(b.date)),
            topIngredients,
            mealDistribution,
            deficiencies,
            goals
        });
    } catch (error) {
        console.error('Nutrition analytics error:', error);
        return res.status(500).json({ message: 'Server error while fetching nutrition analytics' });
    }
};

const updateNutritionGoals = async (req, res) => {
    try {
        const nextGoals = {
            ...DEFAULT_GOALS,
            ...(req.body || {})
        };

        const user = await User.findByIdAndUpdate(
            req.userId,
            { 'settings.nutritionGoals': nextGoals },
            { new: true }
        ).select('settings.nutritionGoals');

        return res.json({
            message: 'Nutrition goals updated',
            goals: user?.settings?.nutritionGoals || nextGoals
        });
    } catch (error) {
        console.error('Update nutrition goals error:', error);
        return res.status(500).json({ message: 'Server error while updating nutrition goals' });
    }
};

module.exports = {
    getNutritionAnalytics,
    updateNutritionGoals
};
