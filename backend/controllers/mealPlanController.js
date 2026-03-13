const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');
const FamilyGroup = require('../models/FamilyGroup');

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

const toIsoDate = (value) => {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) {
        return new Date().toISOString().slice(0, 10);
    }
    return date.toISOString().slice(0, 10);
};

const getStartOfWeek = (value) => {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) {
        return toIsoDate();
    }

    const clone = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const day = clone.getUTCDay();
    const diff = day === 0 ? -6 : 1 - day;
    clone.setUTCDate(clone.getUTCDate() + diff);
    return clone.toISOString().slice(0, 10);
};

const safeNumber = (value, fallback = 1) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const resolvePlanOwner = async (req) => {
    const familyGroupId = req.body.familyGroupId || req.query.familyGroupId || null;

    if (!familyGroupId) {
        return { user: req.userId, familyGroup: null };
    }

    const group = await FamilyGroup.findById(familyGroupId).select('members');
    if (!group || !group.members.some((member) => String(member.user) === String(req.userId))) {
        throw new Error('Not authorized to access this family group');
    }

    return { user: req.userId, familyGroup: familyGroupId };
};

const parseQuantityValue = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    const normalized = String(value || '').trim();
    if (!normalized) return null;

    if (/^\d+\/\d+$/.test(normalized)) {
        const [numerator, denominator] = normalized.split('/').map(Number);
        if (denominator) return numerator / denominator;
    }

    if (/^\d+\s+\d+\/\d+$/.test(normalized)) {
        const [whole, fraction] = normalized.split(/\s+/);
        const [numerator, denominator] = fraction.split('/').map(Number);
        if (denominator) return Number(whole) + numerator / denominator;
    }

    const decimal = Number(normalized.replace(/[^0-9.]/g, ''));
    return Number.isFinite(decimal) && decimal > 0 ? decimal : null;
};

const formatQuantity = (value) => {
    if (!Number.isFinite(value)) return '';
    const rounded = Math.round(value * 100) / 100;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
};

const normalizeEntries = async (entries = []) => {
    const normalizedEntries = entries
        .filter((entry) => entry && entry.recipe)
        .map((entry) => ({
            date: toIsoDate(entry.date),
            mealType: MEAL_TYPES.includes(entry.mealType) ? entry.mealType : 'dinner',
            recipe: entry.recipe?._id || entry.recipe,
            servings: safeNumber(entry.servings, 1),
            notes: String(entry.notes || '').trim()
        }));

    const uniqueIds = [...new Set(normalizedEntries.map((entry) => String(entry.recipe)))];
    const recipes = await Recipe.find({ _id: { $in: uniqueIds } }).select('_id');
    const validIds = new Set(recipes.map((recipe) => String(recipe._id)));

    return normalizedEntries.filter((entry) => validIds.has(String(entry.recipe)));
};

const buildShoppingList = (entries = []) => {
    const grouped = new Map();

    entries.forEach((entry) => {
        const recipe = entry.recipe;
        const scale = safeNumber(entry.servings, recipe?.servings || 1) / safeNumber(recipe?.servings, 1);

        (recipe?.ingredients || []).forEach((ingredient) => {
            const name = String(ingredient.name || '').trim();
            if (!name) return;

            const unit = String(ingredient.unit || '').trim().toLowerCase();
            const key = `${name.toLowerCase()}::${unit}`;
            const quantityValue = parseQuantityValue(ingredient.quantity);
            const source = {
                recipeId: recipe._id,
                recipeTitle: recipe.title,
                mealType: entry.mealType,
                date: entry.date,
                originalQuantity: ingredient.quantity || '',
                scaledQuantity: quantityValue != null ? formatQuantity(quantityValue * scale) : ingredient.quantity || '',
                unit: ingredient.unit || ''
            };

            if (!grouped.has(key)) {
                grouped.set(key, {
                    name,
                    unit: ingredient.unit || '',
                    quantityValue: 0,
                    quantityText: [],
                    sources: []
                });
            }

            const current = grouped.get(key);
            current.sources.push(source);

            if (quantityValue != null) {
                current.quantityValue += quantityValue * scale;
            } else if (ingredient.quantity) {
                current.quantityText.push(`${ingredient.quantity}${ingredient.unit ? ` ${ingredient.unit}` : ''}`.trim());
            }
        });
    });

    return [...grouped.values()]
        .map((item) => ({
            name: item.name,
            unit: item.unit,
            quantity: item.quantityValue > 0 ? formatQuantity(item.quantityValue) : item.quantityText.join(' + '),
            sources: item.sources
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
};

const populateMealPlan = (query) => query.populate({
    path: 'entries.recipe',
    select: 'title image cuisine category servings ingredients prepTime cookTime tags'
});

const getCurrentMealPlan = async (req, res) => {
    try {
        const weekStart = getStartOfWeek(req.query.weekStart);
        const owner = await resolvePlanOwner(req);
        let mealPlan = await populateMealPlan(
            MealPlan.findOne({ ...owner, weekStart })
        );

        if (!mealPlan) {
            mealPlan = await MealPlan.create({
                ...owner,
                weekStart,
                entries: []
            });
            mealPlan = await populateMealPlan(MealPlan.findById(mealPlan._id));
        }

        return res.json({
            weekStart,
            entries: mealPlan.entries || [],
            familyGroupId: owner.familyGroup
        });
    } catch (error) {
        console.error('Get meal plan error:', error);
        return res.status(error.message.includes('authorized') ? 403 : 500).json({ message: error.message || 'Server error while fetching meal plan' });
    }
};

const saveCurrentMealPlan = async (req, res) => {
    try {
        const weekStart = getStartOfWeek(req.body.weekStart);
        const owner = await resolvePlanOwner(req);
        const entries = await normalizeEntries(req.body.entries || []);

        const mealPlan = await MealPlan.findOneAndUpdate(
            { ...owner, weekStart },
            { ...owner, weekStart, entries, updatedAt: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const populated = await populateMealPlan(MealPlan.findById(mealPlan._id));
        return res.json({
            message: 'Meal plan saved successfully',
            weekStart,
            entries: populated.entries || [],
            familyGroupId: owner.familyGroup
        });
    } catch (error) {
        console.error('Save meal plan error:', error);
        return res.status(error.message.includes('authorized') ? 403 : 500).json({ message: error.message || 'Server error while saving meal plan' });
    }
};

const generateShoppingList = async (req, res) => {
    try {
        const weekStart = getStartOfWeek(req.body.weekStart || req.query.weekStart);
        const owner = await resolvePlanOwner(req);
        const recipeIds = Array.isArray(req.body.recipeIds) ? req.body.recipeIds : [];
        const servingsByRecipe = req.body.servingsByRecipe && typeof req.body.servingsByRecipe === 'object'
            ? req.body.servingsByRecipe
            : {};

        let entries = [];

        if (recipeIds.length > 0) {
            const recipes = await Recipe.find({ _id: { $in: recipeIds } }).select('title ingredients servings');
            entries = recipes.map((recipe) => ({
                date: weekStart,
                mealType: 'dinner',
                servings: safeNumber(servingsByRecipe[String(recipe._id)], recipe.servings || 1),
                recipe
            }));
        } else {
            const mealPlan = await populateMealPlan(
                MealPlan.findOne({ ...owner, weekStart })
            );
            entries = mealPlan?.entries || [];
        }

        return res.json({
            weekStart,
            items: buildShoppingList(entries)
        });
    } catch (error) {
        console.error('Generate shopping list error:', error);
        return res.status(error.message.includes('authorized') ? 403 : 500).json({ message: error.message || 'Server error while generating shopping list' });
    }
};

const getNutritionDashboard = async (req, res) => {
    try {
        const weekStart = getStartOfWeek(req.query.weekStart);
        const owner = await resolvePlanOwner(req);
        const mealPlan = await populateMealPlan(
            MealPlan.findOne({ ...owner, weekStart })
        );

        const entries = mealPlan?.entries || [];
        const totals = entries.reduce((acc, entry) => {
            const recipe = entry.recipe;
            const baseServings = safeNumber(recipe?.servings, 1);
            const scale = safeNumber(entry.servings, baseServings) / baseServings;
            const nutrition = recipe?.nutrition || {};

            acc.calories += safeNumber(nutrition.calories, 0) * scale;
            acc.protein += safeNumber(nutrition.protein, 0) * scale;
            acc.carbs += safeNumber(nutrition.carbs, 0) * scale;
            acc.fat += safeNumber(nutrition.fat, 0) * scale;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

        const byDay = entries.reduce((acc, entry) => {
            const key = entry.date;
            const recipe = entry.recipe;
            const baseServings = safeNumber(recipe?.servings, 1);
            const scale = safeNumber(entry.servings, baseServings) / baseServings;
            const nutrition = recipe?.nutrition || {};

            if (!acc[key]) {
                acc[key] = { calories: 0, protein: 0, carbs: 0, fat: 0, meals: [] };
            }

            acc[key].calories += safeNumber(nutrition.calories, 0) * scale;
            acc[key].protein += safeNumber(nutrition.protein, 0) * scale;
            acc[key].carbs += safeNumber(nutrition.carbs, 0) * scale;
            acc[key].fat += safeNumber(nutrition.fat, 0) * scale;
            acc[key].meals.push({
                mealType: entry.mealType,
                recipeTitle: recipe?.title || 'Recipe'
            });
            return acc;
        }, {});

        return res.json({
            weekStart,
            familyGroupId: owner.familyGroup,
            totals,
            byDay
        });
    } catch (error) {
        console.error('Nutrition dashboard error:', error);
        return res.status(error.message.includes('authorized') ? 403 : 500).json({ message: error.message || 'Server error while building nutrition dashboard' });
    }
};

module.exports = {
    getCurrentMealPlan,
    getNutritionDashboard,
    saveCurrentMealPlan,
    generateShoppingList
};
