const fs = require('fs');
const path = require('path');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

const DIETARY_FILTERS = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'high-protein', 'low-carb', 'diabetic-friendly', 'heart-healthy'];
const INGREDIENT_EXCLUSIONS = {
    vegetarian: /chicken|beef|pork|fish|seafood|lamb|mutton|bacon|ham|shrimp|prawn/i,
    vegan: /chicken|beef|pork|fish|seafood|lamb|mutton|bacon|ham|shrimp|prawn|milk|cheese|paneer|butter|cream|ghee|yogurt|curd|egg|honey/i,
    'gluten-free': /wheat|maida|flour|bread|pasta|noodle|semolina|sooji|rava/i,
    'dairy-free': /milk|cheese|paneer|butter|cream|ghee|yogurt|curd/i
};

const normalizeNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const parseFractionNumber = (value) => {
    const normalized = String(value || '').trim();
    if (!normalized) return null;

    if (/^\d+\/\d+$/.test(normalized)) {
        const [numerator, denominator] = normalized.split('/').map(Number);
        return denominator ? numerator / denominator : null;
    }

    if (/^\d+\s+\d+\/\d+$/.test(normalized)) {
        const [whole, fraction] = normalized.split(/\s+/);
        const [numerator, denominator] = fraction.split('/').map(Number);
        return denominator ? Number(whole) + numerator / denominator : null;
    }

    const numeric = Number(normalized.replace(/[^0-9.]/g, ''));
    return Number.isFinite(numeric) ? numeric : null;
};

const parseIngredients = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value !== 'string') {
        return [];
    }

    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => {
            const match = item.match(/^([\d./]+\s*[a-zA-Z]*)\s+(.+)$/);

            if (!match) {
                return {
                    name: item,
                    quantity: '1',
                    unit: ''
                };
            }

            const [, quantityAndUnit, name] = match;
            const parts = quantityAndUnit.trim().split(/\s+/);

            return {
                name: name.trim(),
                quantity: parts[0] || '1',
                unit: parts.slice(1).join(' ')
            };
        });
};

const parseInstructions = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value !== 'string') {
        return [];
    }

    return value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, index) => ({
            step: index + 1,
            description: line.replace(/^\d+[\).\s-]*/, '').trim()
        }))
        .filter((step) => step.description);
};

const parseTags = (value) => {
    if (Array.isArray(value)) {
        return value.map((tag) => String(tag).trim()).filter(Boolean);
    }

    if (typeof value !== 'string') {
        return [];
    }

    return value.split(',').map((tag) => tag.trim()).filter(Boolean);
};

const parseDietaryFilters = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
    }

    if (typeof value !== 'string') {
        return [];
    }

    return value
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
};

const parseNutrition = (value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return {
            calories: normalizeNumber(value.calories, undefined),
            protein: normalizeNumber(value.protein, undefined),
            carbs: normalizeNumber(value.carbs, undefined),
            fat: normalizeNumber(value.fat, undefined)
        };
    }

    if (typeof value !== 'string' || !value.trim()) {
        return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    try {
        return parseNutrition(JSON.parse(value));
    } catch (error) {
        return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
};

const getRecipeIngredientNames = (recipe) =>
    (recipe.ingredients || []).map((ingredient) => String(ingredient.name || '').toLowerCase());

const getRecipeTags = (recipe) =>
    (recipe.tags || []).map((tag) => String(tag).toLowerCase());

const matchesDietaryFilter = (recipe, dietaryFilter) => {
    const filter = String(dietaryFilter || '').toLowerCase();
    const ingredients = getRecipeIngredientNames(recipe).join(' ');
    const tags = getRecipeTags(recipe);
    const nutrition = recipe.nutrition || {};

    if (INGREDIENT_EXCLUSIONS[filter]) {
        return !INGREDIENT_EXCLUSIONS[filter].test(ingredients) || tags.includes(filter);
    }

    if (filter === 'high-protein') {
        return Number(nutrition.protein || 0) >= 18 || tags.includes('high-protein') || tags.includes('gym') || tags.includes('protein');
    }

    if (filter === 'low-carb') {
        return (Number(nutrition.carbs || 0) > 0 && Number(nutrition.carbs) <= 25) || tags.includes('low-carb') || tags.includes('keto');
    }

    if (filter === 'diabetic-friendly') {
        return tags.includes('diabetic') || tags.includes('low-sugar') || tags.includes('low-carb') || (
            !/sugar|syrup|sweetened|jaggery|honey/i.test(ingredients) &&
            (Number(nutrition.carbs || 0) === 0 || Number(nutrition.carbs || 0) <= 30)
        );
    }

    if (filter === 'heart-healthy') {
        return tags.includes('heart-healthy') || tags.includes('low-sodium') || (
            !/butter|cream|ghee/i.test(ingredients) &&
            (Number(nutrition.fat || 0) === 0 || Number(nutrition.fat || 0) <= 18)
        );
    }

    return tags.includes(filter);
};

const applyDietaryFilters = (recipes, dietaryFilters = []) => {
    if (!dietaryFilters.length) {
        return recipes;
    }

    return recipes.filter((recipe) => dietaryFilters.every((filter) => matchesDietaryFilter(recipe, filter)));
};

const formatTitleCase = (value) =>
    String(value || '')
        .split(/[\s-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

const extractYouTubeVideoId = (url) => {
    const value = String(url || '').trim();
    const shortMatch = value.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
    if (shortMatch) return shortMatch[1];

    const longMatch = value.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
    if (longMatch) return longMatch[1];

    const embedMatch = value.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);
    return embedMatch ? embedMatch[1] : '';
};

const buildGeneratedRecipe = (ingredients = [], options = {}, sourceRecipes = []) => {
    const cleanedIngredients = ingredients
        .map((item) => String(item || '').trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 8);

    const primary = cleanedIngredients.slice(0, 3).map(formatTitleCase);
    const cuisine = options.cuisine ? formatTitleCase(options.cuisine) : '';
    const dietary = options.dietaryFilters?.map(formatTitleCase) || [];
    const titleCore = primary.length ? primary.join(' ') : 'Pantry';
    const title = `${cuisine ? `${cuisine} ` : ''}${titleCore} Skillet`;

    const sourceTags = [...new Set(sourceRecipes.flatMap((recipe) => recipe.tags || []))].slice(0, 4);
    const sourceIngredientNames = sourceRecipes.flatMap((recipe) => (recipe.ingredients || []).map((item) => item.name)).slice(0, 5);
    const combinedIngredients = [...new Set([...cleanedIngredients, ...sourceIngredientNames.map((item) => String(item).toLowerCase())])].slice(0, 10);

    const ingredientObjects = combinedIngredients.map((name, index) => ({
        name: formatTitleCase(name),
        quantity: index < cleanedIngredients.length ? '1' : '0.5',
        unit: index < cleanedIngredients.length ? 'cup' : 'cup'
    }));

    const instructions = [
        `Prep ${primary.length ? primary.join(', ').toLowerCase() : 'your pantry ingredients'} into bite-sized pieces.`,
        `Heat a pan, add aromatics or oil, and cook the base ingredients for 4 to 5 minutes.`,
        `Add the remaining ingredients with salt, pepper, and your favorite spices, then cook until tender.`,
        `Finish with herbs or a squeeze of lemon and serve warm.`
    ].map((description, index) => ({
        step: index + 1,
        description
    }));

    return {
        title,
        description: `A quick ${dietary.length ? `${dietary.join(', ')} ` : ''}recipe idea generated from your available ingredients.`,
        cuisine: cuisine || 'Flexible',
        category: options.category || 'main course',
        difficulty: options.maxTime && Number(options.maxTime) <= 20 ? 'easy' : 'medium',
        prepTime: 10,
        cookTime: options.maxTime ? Math.max(10, Math.min(30, Number(options.maxTime))) : 20,
        servings: 2,
        ingredients: ingredientObjects,
        instructions,
        tags: [...new Set([...sourceTags, ...cleanedIngredients, ...(options.dietaryFilters || [])])].slice(0, 8)
    };
};

const cleanupFile = async (filePath) => {
    if (!filePath) return;
    try {
        await fs.promises.unlink(filePath);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error('Image cleanup error:', error);
        }
    }
};

const uploadToCloudinary = async (file) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset || !file?.path) {
        return null;
    }

    const formData = new FormData();
    const fileBuffer = await fs.promises.readFile(file.path);
    const extension = path.extname(file.originalname || '').toLowerCase();
    const mimeType = file.mimetype || (
        extension === '.png' ? 'image/png' :
        extension === '.webp' ? 'image/webp' :
        'image/jpeg'
    );

    formData.append('file', new Blob([fileBuffer], { type: mimeType }), file.originalname || 'recipe-image');
    formData.append('upload_preset', uploadPreset);
    if (process.env.CLOUDINARY_FOLDER) {
        formData.append('folder', process.env.CLOUDINARY_FOLDER);
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(`Cloudinary upload failed: ${message}`);
    }

    const payload = await response.json();
    return payload.secure_url || payload.url || null;
};

const resolveImageUrl = async (req) => {
    if (!req.file) {
        return req.body.image || '';
    }

    try {
        const cloudUrl = await uploadToCloudinary(req.file);
        if (cloudUrl) {
            await cleanupFile(req.file.path);
            return cloudUrl;
        }
    } catch (error) {
        console.error('Cloud image upload error, falling back to local file:', error.message);
    }

    return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
};

const buildRecipePayload = async (req, { isUpdate = false } = {}) => {
    const {
        title,
        description,
        image,
        video,
        cuisine,
        category,
        difficulty,
        prepTime,
        cookTime,
        cookingTime,
        servings,
        ingredients,
        instructions,
        nutrition,
        tags
    } = req.body;

    const payload = {};

    if (title !== undefined) payload.title = title;
    if (description !== undefined) payload.description = description;
    if (video !== undefined) payload.video = video || '';
    if (cuisine !== undefined) payload.cuisine = cuisine;
    if (category !== undefined) payload.category = category;
    if (difficulty !== undefined) payload.difficulty = difficulty || 'medium';
    if (prepTime !== undefined) payload.prepTime = normalizeNumber(prepTime, 0);
    if (cookTime !== undefined || cookingTime !== undefined) payload.cookTime = normalizeNumber(cookTime || cookingTime, 0);
    if (servings !== undefined) payload.servings = normalizeNumber(servings, 1);
    if (ingredients !== undefined) payload.ingredients = parseIngredients(ingredients);
    if (instructions !== undefined) payload.instructions = parseInstructions(instructions);
    if (tags !== undefined) payload.tags = parseTags(tags);
    if (nutrition !== undefined) payload.nutrition = parseNutrition(nutrition);

    const resolvedImage = await resolveImageUrl(req);
    if (resolvedImage) {
        payload.image = resolvedImage;
    } else if (!isUpdate && image) {
        payload.image = image;
    }

    if (!isUpdate) {
        payload.video = payload.video || '';
        payload.difficulty = payload.difficulty || 'medium';
        payload.prepTime = payload.prepTime ?? 0;
        payload.cookTime = payload.cookTime ?? 0;
        payload.servings = payload.servings ?? 1;
        payload.ingredients = payload.ingredients || [];
        payload.instructions = payload.instructions || [];
        payload.tags = payload.tags || [];
        payload.nutrition = payload.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    return payload;
};

const validateRecipePayload = (payload, { isUpdate = false } = {}) => {
    const requiredFields = ['title', 'description', 'image', 'cuisine', 'category'];
    if (!isUpdate) {
        for (const field of requiredFields) {
            if (!payload[field]) {
                return `${field} is required`;
            }
        }
    }

    if ((payload.ingredients && payload.ingredients.length === 0) || (!isUpdate && !payload.ingredients?.length)) {
        return 'At least one ingredient is required';
    }

    if ((payload.instructions && payload.instructions.length === 0) || (!isUpdate && !payload.instructions?.length)) {
        return 'At least one instruction is required';
    }

    if (!isUpdate && !payload.cookTime) {
        return 'Cook time is required';
    }

    if (!isUpdate && !payload.servings) {
        return 'Servings is required';
    }

    return null;
};

const populateRecipeQuery = (query) => query
    .populate('author', 'firstName lastName username')
    .populate('reviews.user', 'firstName lastName username');

const includesAny = (values, patterns) => {
    const haystack = (values || []).map((value) => String(value).toLowerCase());
    return patterns.some((pattern) => haystack.some((value) => value.includes(pattern)));
};

const scoreRecipeForProfile = (recipe, foodProfile = {}) => {
    const goal = (foodProfile.goal || 'balanced').toLowerCase();
    const conditions = (foodProfile.conditions || []).map((item) => item.toLowerCase());
    const preferredCuisines = (foodProfile.preferredCuisines || []).map((item) => item.toLowerCase());
    const avoidIngredients = (foodProfile.avoidIngredients || []).map((item) => item.toLowerCase());
    const tags = (recipe.tags || []).map((tag) => String(tag).toLowerCase());
    const ingredientNames = (recipe.ingredients || []).map((ingredient) => String(ingredient.name || '').toLowerCase());
    const cuisine = String(recipe.cuisine || '').toLowerCase();
    const nutrition = recipe.nutrition || {};
    const totalTime = Number(recipe.prepTime || 0) + Number(recipe.cookTime || 0);

    let score = 0;
    const reasons = [];

    if (preferredCuisines.includes(cuisine)) {
        score += 3;
        reasons.push(`Matches preferred cuisine: ${recipe.cuisine}`);
    }

    if (avoidIngredients.length && includesAny(ingredientNames, avoidIngredients)) {
        return { score: -100, reasons: ['Contains ingredients you want to avoid'] };
    }

    const highProtein = Number(nutrition.protein || 0) >= 18 || includesAny(tags, ['high-protein', 'protein', 'gym']);
    const lowSugar = !includesAny(tags, ['dessert', 'sweet', 'sugary']) && !includesAny(ingredientNames, ['sugar', 'honey', 'syrup']);
    const lowCarb = Number(nutrition.carbs || 0) > 0 ? Number(nutrition.carbs) <= 25 : includesAny(tags, ['low-carb', 'keto']);
    const lowFat = Number(nutrition.fat || 0) > 0 ? Number(nutrition.fat) <= 15 : includesAny(tags, ['light', 'healthy']);
    const moderateCalories = Number(nutrition.calories || 0) > 0 ? Number(nutrition.calories) <= 450 : true;

    if (goal === 'gym' || goal === 'high-protein') {
        if (highProtein) {
            score += 5;
            reasons.push('Higher protein fit for gym goals');
        }
        if (moderateCalories) {
            score += 1;
        }
    }

    if (goal === 'weight-loss') {
        if (moderateCalories) {
            score += 4;
            reasons.push('Moderate calorie recipe');
        }
        if (lowFat) {
            score += 2;
        }
        if (highProtein) {
            score += 1;
        }
    }

    if (goal === 'diabetic' || conditions.includes('diabetic')) {
        if (lowSugar) {
            score += 5;
            reasons.push('Avoids obviously sugary ingredients');
        } else {
            score -= 5;
        }
        if (lowCarb) {
            score += 3;
            reasons.push('Lower carb profile');
        }
    }

    if (goal === 'heart-healthy' || conditions.includes('heart')) {
        if (lowFat) {
            score += 4;
            reasons.push('Lower fat profile');
        }
        if (!includesAny(ingredientNames, ['butter', 'cream'])) {
            score += 2;
        }
    }

    if (goal === 'balanced') {
        score += 2;
        if (moderateCalories) score += 1;
        if (totalTime && totalTime <= 45) score += 1;
    }

    if (conditions.includes('vegetarian')) {
        const hasMeat = includesAny(ingredientNames, ['chicken', 'beef', 'pork', 'fish', 'lamb', 'mutton', 'seafood']);
        score += hasMeat ? -8 : 4;
        if (!hasMeat) {
            reasons.push('Vegetarian-friendly');
        }
    }

    return { score, reasons };
};

const getAllRecipes = async (req, res) => {
    try {
        const recipes = await populateRecipeQuery(Recipe.find())
            .sort({ createdAt: -1 });

        res.json(recipes);
    } catch (error) {
        console.error('Get recipes error:', error);
        res.status(500).json({ message: 'Server error while fetching recipes' });
    }
};

const getMyRecipes = async (req, res) => {
    try {
        const recipes = await populateRecipeQuery(
            Recipe.find({ author: req.userId })
        ).sort({ updatedAt: -1 });

        res.json(recipes);
    } catch (error) {
        console.error('Get my recipes error:', error);
        res.status(500).json({ message: 'Server error while fetching your recipes' });
    }
};

const getRecommendedRecipes = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('settings.foodProfile');
        const foodProfile = user?.settings?.foodProfile || {};
        const recipes = await populateRecipeQuery(Recipe.find()).sort({ createdAt: -1 });

        const recommended = recipes
            .map((recipe) => {
                const result = scoreRecipeForProfile(recipe, foodProfile);
                return {
                    recipe,
                    score: result.score,
                    reasons: result.reasons
                };
            })
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 12)
            .map((item) => ({
                ...item.recipe.toObject(),
                recommendationReasons: item.reasons
            }));

        res.json({
            foodProfile,
            recipes: recommended
        });
    } catch (error) {
        console.error('Get recommended recipes error:', error);
        res.status(500).json({ message: 'Server error while fetching recommendations' });
    }
};

const getRecipeById = async (req, res) => {
    try {
        const recipe = await populateRecipeQuery(
            Recipe.findById(req.params.id)
        );

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (error) {
        console.error('Get recipe error:', error);
        res.status(500).json({ message: 'Server error while fetching recipe' });
    }
};

const createRecipe = async (req, res) => {
    try {
        const payload = await buildRecipePayload(req);
        const validationError = validateRecipePayload(payload);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const newRecipe = new Recipe({
            ...payload,
            author: req.userId
        });

        await newRecipe.save();
        await newRecipe.populate('author', 'firstName lastName username');

        res.status(201).json({
            message: 'Recipe created successfully',
            recipe: newRecipe
        });
    } catch (error) {
        console.error('Create recipe error:', error);
        res.status(500).json({ message: 'Server error while creating recipe' });
    }
};

const updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (recipe.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to update this recipe' });
        }

        const payload = await buildRecipePayload(req, { isUpdate: true });
        const validationError = validateRecipePayload(payload, { isUpdate: true });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        Object.assign(recipe, payload, { updatedAt: Date.now() });
        await recipe.save();
        await recipe.populate('author', 'firstName lastName username');

        res.json({
            message: 'Recipe updated successfully',
            recipe
        });
    } catch (error) {
        console.error('Update recipe error:', error);
        res.status(500).json({ message: 'Server error while updating recipe' });
    }
};

const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (recipe.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this recipe' });
        }

        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Delete recipe error:', error);
        res.status(500).json({ message: 'Server error while deleting recipe' });
    }
};

const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const normalizedRating = normalizeNumber(rating, 0);

        if (normalizedRating < 1 || normalizedRating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const existingReview = recipe.reviews.find((review) => review.user.toString() === req.userId);
        const reviewerName = [req.user.firstName, req.user.lastName].filter(Boolean).join(' ') || req.user.username;

        if (existingReview) {
            existingReview.rating = normalizedRating;
            existingReview.comment = (comment || '').trim();
            existingReview.name = reviewerName;
            existingReview.createdAt = new Date();
        } else {
            recipe.reviews.push({
                user: req.userId,
                name: reviewerName,
                rating: normalizedRating,
                comment: (comment || '').trim()
            });
        }

        recipe.rating.count = recipe.reviews.length;
        recipe.rating.average = recipe.reviews.length
            ? Number((recipe.reviews.reduce((sum, review) => sum + review.rating, 0) / recipe.reviews.length).toFixed(1))
            : 0;

        await recipe.save();
        await recipe.populate('reviews.user', 'firstName lastName username');
        await recipe.populate('author', 'firstName lastName username');

        res.status(201).json({
            message: existingReview ? 'Review updated successfully' : 'Review added successfully',
            recipe
        });
    } catch (error) {
        console.error('Add review error:', error);
        res.status(500).json({ message: 'Server error while adding review' });
    }
};

const searchRecipes = async (req, res) => {
    try {
        const {
            query,
            cuisine,
            category,
            difficulty,
            dietary,
            tags,
            maxTime,
            minRating,
            author,
            sort = 'latest'
        } = req.query;

        const searchCriteria = {};
        const dietaryFilters = parseDietaryFilters(dietary);

        if (query) {
            searchCriteria.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { 'ingredients.name': { $regex: query, $options: 'i' } },
                { tags: { $elemMatch: { $regex: query, $options: 'i' } } }
            ];
        }
        if (cuisine) {
            searchCriteria.cuisine = { $regex: cuisine, $options: 'i' };
        }
        if (category) {
            searchCriteria.category = category;
        }
        if (difficulty) {
            searchCriteria.difficulty = difficulty;
        }
        if (author) {
            searchCriteria.author = author;
        }
        if (tags) {
            const tagArray = parseTags(tags);
            if (tagArray.length) {
                searchCriteria.tags = { $all: tagArray };
            }
        }
        if (maxTime) {
            searchCriteria.$expr = {
                $lte: [
                    { $add: ['$prepTime', '$cookTime'] },
                    normalizeNumber(maxTime, 0)
                ]
            };
        }
        if (minRating) {
            searchCriteria['rating.average'] = { $gte: normalizeNumber(minRating, 0) };
        }

        let sortCriteria = { createdAt: -1 };
        if (sort === 'rating') {
            sortCriteria = { 'rating.average': -1, 'rating.count': -1 };
        } else if (sort === 'time') {
            sortCriteria = { cookTime: 1, prepTime: 1 };
        } else if (sort === 'popular') {
            sortCriteria = { 'rating.count': -1, createdAt: -1 };
        }

        const recipes = await populateRecipeQuery(Recipe.find(searchCriteria))
            .sort(sortCriteria);

        res.json(applyDietaryFilters(recipes, dietaryFilters));
    } catch (error) {
        console.error('Search recipes error:', error);
        res.status(500).json({ message: 'Server error while searching recipes' });
    }
};

const generateRecipeFromIngredients = async (req, res) => {
    try {
        const ingredients = Array.isArray(req.body.ingredients)
            ? req.body.ingredients
            : String(req.body.ingredients || '')
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);

        if (!ingredients.length) {
            return res.status(400).json({ message: 'At least one ingredient is required' });
        }

        const dietaryFilters = parseDietaryFilters(req.body.dietary || req.body.dietaryFilters);
        const maxTime = normalizeNumber(req.body.maxTime, 0);
        const ingredientRegexes = ingredients.map((ingredient) => new RegExp(ingredient, 'i'));

        const recipes = await populateRecipeQuery(Recipe.find({
            $or: ingredientRegexes.map((regex) => ({ 'ingredients.name': { $regex: regex } }))
        }).limit(40));

        const rankedMatches = applyDietaryFilters(recipes, dietaryFilters)
            .map((recipe) => {
                const ingredientNames = getRecipeIngredientNames(recipe);
                const matchCount = ingredients.filter((ingredient) =>
                    ingredientNames.some((name) => name.includes(String(ingredient).toLowerCase()))
                ).length;

                const totalTime = Number(recipe.prepTime || 0) + Number(recipe.cookTime || 0);
                const timeScore = maxTime > 0 && totalTime > 0 && totalTime <= maxTime ? 2 : 0;

                return {
                    recipe,
                    matchScore: matchCount + timeScore
                };
            })
            .sort((a, b) => b.matchScore - a.matchScore)
            .map((item) => item.recipe)
            .slice(0, 5);

        const generatedRecipe = buildGeneratedRecipe(ingredients, {
            cuisine: req.body.cuisine,
            category: req.body.category,
            maxTime,
            dietaryFilters
        }, rankedMatches);

        return res.json({
            message: 'Generated a recipe idea from your ingredients.',
            matchedRecipes: rankedMatches,
            generatedRecipe,
            supportedDietaryFilters: DIETARY_FILTERS
        });
    } catch (error) {
        console.error('Generate recipe from ingredients error:', error);
        return res.status(500).json({ message: 'Server error while generating recipe idea' });
    }
};

const importRecipeFromUrl = async (req, res) => {
    try {
        const sourceUrl = String(req.body.url || '').trim();
        if (!sourceUrl) {
            return res.status(400).json({ message: 'Recipe URL is required' });
        }

        const youtubeId = extractYouTubeVideoId(sourceUrl);
        if (youtubeId) {
            return res.json({
                message: 'Imported YouTube recipe draft successfully',
                recipe: {
                    title: 'Imported YouTube Recipe',
                    description: 'Review the video and update ingredients/instructions before publishing.',
                    image: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
                    video: youtubeId,
                    cuisine: 'International',
                    category: 'main course',
                    difficulty: 'medium',
                    prepTime: 15,
                    cookTime: 20,
                    servings: 2,
                    ingredients: [],
                    instructions: [],
                    tags: ['imported', 'youtube']
                }
            });
        }

        const response = await fetch(sourceUrl, {
            headers: {
                'User-Agent': 'CookOnWeb Recipe Importer'
            }
        });

        if (!response.ok) {
            throw new Error(`Unable to fetch recipe URL (${response.status})`);
        }

        const html = await response.text();
        const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || 'Imported Recipe';
        const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1]?.trim()
            || 'Imported recipe draft. Review and complete the details before publishing.';
        const image = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]?.trim() || '';

        return res.json({
            message: 'Imported recipe draft successfully',
            recipe: {
                title: title.slice(0, 100),
                description: description.slice(0, 500),
                image,
                video: '',
                cuisine: 'International',
                category: 'main course',
                difficulty: 'medium',
                prepTime: 15,
                cookTime: 20,
                servings: 2,
                ingredients: [],
                instructions: [],
                tags: ['imported', 'web']
            }
        });
    } catch (error) {
        console.error('Import recipe error:', error);
        return res.status(500).json({ message: error.message || 'Server error while importing recipe' });
    }
};

module.exports = {
    addReview,
    createRecipe,
    deleteRecipe,
    generateRecipeFromIngredients,
    importRecipeFromUrl,
    getAllRecipes,
    getMyRecipes,
    getRecommendedRecipes,
    getRecipeById,
    searchRecipes,
    updateRecipe
};
