const jwt = require('jsonwebtoken');
const Recipe = require('../models/Recipe');
const ChatLog = require('../models/ChatLog');
const User = require('../models/User');
const MealPlan = require('../models/MealPlan');

const COMMON_INGREDIENTS = [
  'potato', 'aloo', 'rice', 'chawal', 'chicken', 'paneer', 'tomato', 'onion', 'garlic',
  'carrot', 'beans', 'peas', 'corn', 'spinach', 'mushroom', 'beef', 'pork', 'fish',
  'egg', 'anda', 'cheese', 'milk', 'flour', 'maida', 'atta', 'sugar', 'butter', 'oil',
  'salt', 'pepper', 'bread', 'pasta', 'noodle', 'maggi', 'oats', 'yogurt', 'tofu'
];

const DIETARY_KEYWORDS = [
  'vegetarian', 'veg', 'vegan', 'gluten free', 'dairy free', 'keto', 'low carb', 'healthy',
  'high protein', 'gym', 'diabetic', 'heart healthy', 'pcos', 'kid friendly', 'kids lunchbox',
  'kidney friendly', 'low sodium'
];

const CUISINES = [
  'italian', 'indian', 'south indian', 'north indian', 'chinese', 'indo chinese',
  'mexican', 'thai', 'japanese', 'french', 'greek', 'spanish', 'american',
  'mediterranean', 'korean', 'vietnamese', 'turkish', 'lebanese', 'international',
  'asian', 'indonesian'
];

const CATEGORIES = [
  'breakfast', 'lunch', 'dinner', 'snack', 'tiffin', 'dessert', 'sweet', 'appetizer',
  'starter', 'main course', 'salad', 'soup', 'side dish'
];

const RECIPE_KEYWORDS = [
  'pizza', 'pasta', 'curry', 'dal', 'sambar', 'biryani', 'pulao', 'fried rice',
  'chicken', 'paneer', 'chole', 'rajma', 'fish', 'salad', 'soup', 'cake', 'cookies',
  'brownie', 'burger', 'sandwich', 'stir fry', 'roast', 'grill', 'bake', 'oats', 'idli', 'upma'
];

const INGREDIENT_KEYWORDS = [
  'with', 'using', 'made with', 'containing', 'have', 'i have', 'using only',
  'recipes with', 'cook with', 'make with'
];

const GOAL_HINTS = {
  gym: ['gym', 'high-protein', 'protein', 'meal-prep'],
  diabetic: ['diabetic', 'low-sugar', 'low-carb'],
  'heart-healthy': ['heart-healthy', 'light', 'low-sodium'],
  'weight-loss': ['weight-loss', 'low-carb', 'light'],
  'pcos-friendly': ['pcos-friendly', 'high-fiber', 'balanced'],
  'kids-lunchbox': ['kids-lunchbox', 'kid-friendly']
};

const GOAL_ALIASES = {
  gym: ['gym', 'workout', 'muscle gain', 'high protein', 'protein rich', 'bulking'],
  diabetic: ['diabetic', 'diabetes', 'low sugar', 'sugar free', 'low carb'],
  'heart-healthy': ['heart healthy', 'heart-friendly', 'cardiac', 'low cholesterol'],
  'weight-loss': ['weight loss', 'fat loss', 'low calorie', 'light meal'],
  'pcos-friendly': ['pcos', 'pcod', 'pcos friendly'],
  'kids-lunchbox': ['kids', 'kid', 'lunchbox', 'tiffin', 'school lunch', 'kids lunchbox'],
  'low-sodium': ['low sodium', 'kidney friendly', 'kidney-friendly', 'renal']
};

const PREFERENCE_ALIASES = {
  spicy: ['spicy', 'masaledar', 'hot'],
  mild: ['mild', 'less spicy', 'not spicy'],
  quick: ['quick', 'fast', 'easy', 'simple'],
  healthy: ['healthy', 'clean', 'nutritious'],
  sweet: ['sweet', 'dessert'],
  crispy: ['crispy', 'crunchy'],
  comfort: ['comfort', 'homestyle', 'home style'],
  refreshing: ['refreshing', 'light', 'cool'],
  protein: ['protein', 'high protein'],
  vegetarian: ['vegetarian', 'veg'],
  vegan: ['vegan']
};

const SHOPPING_INTENTS = ['shopping list', 'grocery list', 'groceries', 'buy for this week'];
const PLANNER_INTENTS = ['meal plan', 'plan my week', 'weekly plan', 'planner', 'schedule meals'];
const SCALE_INTENTS = ['scale recipe', 'double recipe', 'halve recipe', 'half recipe', 'servings'];
const GENERATE_INTENTS = ['generate recipe', 'create recipe', 'make recipe from', 'recipe from ingredients'];

const safeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getStartOfWeek = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  const clone = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = clone.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  clone.setUTCDate(clone.getUTCDate() + diff);
  return clone.toISOString().slice(0, 10);
};

const parseQuantityValue = (value) => {
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

const formatQuantity = (value) => {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
};

const buildShoppingListFromEntries = (entries = []) => {
  const grouped = new Map();

  entries.forEach((entry) => {
    const recipe = entry.recipe;
    if (!recipe) return;

    const baseServings = safeNumber(recipe.servings, 1) || 1;
    const scale = (safeNumber(entry.servings, baseServings) || baseServings) / baseServings;

    (recipe.ingredients || []).forEach((ingredient) => {
      const name = String(ingredient.name || '').trim();
      if (!name) return;

      const unit = String(ingredient.unit || '').trim().toLowerCase();
      const key = `${name.toLowerCase()}::${unit}`;
      const numericQuantity = parseQuantityValue(ingredient.quantity);

      if (!grouped.has(key)) {
        grouped.set(key, {
          name,
          unit: ingredient.unit || '',
          quantityValue: 0,
          quantityText: [],
          recipes: []
        });
      }

      const current = grouped.get(key);
      current.recipes.push(recipe.title);

      if (numericQuantity != null) {
        current.quantityValue += numericQuantity * scale;
      } else if (ingredient.quantity) {
        current.quantityText.push(`${ingredient.quantity}${ingredient.unit ? ` ${ingredient.unit}` : ''}`.trim());
      }
    });
  });

  return [...grouped.values()].map((item) => ({
    name: item.name,
    unit: item.unit,
    quantity: item.quantityValue > 0 ? formatQuantity(item.quantityValue) : item.quantityText.join(' + '),
    recipes: [...new Set(item.recipes)].slice(0, 3)
  })).sort((a, b) => a.name.localeCompare(b.name));
};

const findRelevantMealPlan = async (userId, requestedWeekStart = null) => {
  const populate = {
    path: 'entries.recipe',
    select: 'title ingredients servings'
  };

  if (requestedWeekStart) {
    const requestedPlan = await MealPlan.findOne({ user: userId, weekStart: requestedWeekStart }).populate(populate);
    if (requestedPlan?.entries?.length) {
      return requestedPlan;
    }
  }

  return MealPlan.findOne({ user: userId, 'entries.0': { $exists: true } })
    .sort({ updatedAt: -1, createdAt: -1 })
    .populate(populate);
};

const buildGeneratedRecipe = (ingredients = [], options = {}, sourceRecipes = []) => {
  const cleaned = ingredients.map((item) => String(item || '').trim()).filter(Boolean).slice(0, 8);
  const title = `${cleaned.slice(0, 3).map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(' ')} Bowl`.trim() || 'Pantry Bowl';
  const tags = [...new Set([
    ...(options.dietaryFilters || []),
    ...sourceRecipes.flatMap((recipe) => recipe.tags || []),
    ...cleaned
  ])].slice(0, 8);

  return {
    title,
    description: `A quick recipe concept using ${cleaned.join(', ')}${options.dietaryFilters?.length ? ` for a ${options.dietaryFilters.join(', ')} meal` : ''}.`,
    ingredients: cleaned.map((item) => ({ name: item, quantity: '1', unit: 'cup' })),
    instructions: [
      { step: 1, description: 'Prep the ingredients into even pieces.' },
      { step: 2, description: 'Cook aromatics first, then add the main ingredients.' },
      { step: 3, description: 'Season well and simmer or saute until tender.' },
      { step: 4, description: 'Finish with herbs or lemon and serve warm.' }
    ],
    tags
  };
};

const extractRecipeNameForScaling = (normalizedQuery) => {
  const cleaned = normalizedQuery
    .replace(/^(please\s+)?(can you\s+)?/i, '')
    .replace(/\b(scale|double|halve|half)\b/gi, '')
    .replace(/\b(recipe)\b/gi, '')
    .replace(/\bto\s+\d+\s*(servings|people|portion|portions)\b/gi, '')
    .replace(/\bfor\s+\d+\s*(servings|people|portion|portions)\b/gi, '')
    .replace(/\b\d+\s*(servings|people|portion|portions)\b/gi, '')
    .replace(/\bplease\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
};

const extractQueryGoals = (normalizedQuery) => {
  const matchedGoals = [];

  Object.entries(GOAL_ALIASES).forEach(([goal, aliases]) => {
    if (aliases.some((alias) => normalizedQuery.includes(alias))) {
      matchedGoals.push(goal);
    }
  });

  return [...new Set(matchedGoals)];
};

const extractPreferenceTags = (normalizedQuery) => {
  const matchedTags = [];

  Object.entries(PREFERENCE_ALIASES).forEach(([tag, aliases]) => {
    if (aliases.some((alias) => normalizedQuery.includes(alias))) {
      matchedTags.push(tag);
    }
  });

  return [...new Set(matchedTags)];
};

const getConversationIntent = (normalizedQuery) => {
  if (['hi', 'hello', 'hey', 'hey bot', 'good morning', 'good evening'].includes(normalizedQuery)) {
    return 'greeting';
  }

  if (['thanks', 'thank you', 'ok thanks', 'great thanks'].includes(normalizedQuery)) {
    return 'thanks';
  }

  if (
    normalizedQuery.includes('what can you do') ||
    normalizedQuery.includes('help me') ||
    normalizedQuery === 'help'
  ) {
    return 'help';
  }

  if (
    normalizedQuery.includes('who are you') ||
    normalizedQuery.includes('what are you')
  ) {
    return 'about';
  }

  return null;
};

const getUserFromRequest = async (req) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return await User.findById(decoded.userId).select('-password');
  } catch (error) {
    return null;
  }
};

const parseUserQuery = (query) => {
  const normalizedQuery = query.toLowerCase().trim();
  let parsedQuery = { type: 'unknown' };
  let maxTime = null;
  let difficulty = null;
  let spiceLevel = null;
  const conversationIntent = getConversationIntent(normalizedQuery);
  const queryGoals = extractQueryGoals(normalizedQuery);
  const preferenceTags = extractPreferenceTags(normalizedQuery);

  if (conversationIntent) {
    return {
      type: 'conversation',
      intent: conversationIntent,
      queryGoals,
      preferenceTags,
      maxTime,
      difficulty,
      spiceLevel
    };
  }

  if (SHOPPING_INTENTS.some((term) => normalizedQuery.includes(term))) {
    parsedQuery = { type: 'shopping_list' };
  }

  if (parsedQuery.type === 'unknown' && PLANNER_INTENTS.some((term) => normalizedQuery.includes(term))) {
    parsedQuery = { type: 'meal_plan' };
  }

  if (parsedQuery.type === 'unknown' && SCALE_INTENTS.some((term) => normalizedQuery.includes(term))) {
    const servingsMatch = normalizedQuery.match(/(\d+)\s*(servings|people|portion)/);
    parsedQuery = {
      type: 'scale_recipe',
      targetServings: servingsMatch ? Number(servingsMatch[1]) : null,
      recipeName: extractRecipeNameForScaling(normalizedQuery)
    };
  }

  const timeMatch = normalizedQuery.match(/(\d+)\s*(min|mins|minute|minutes|hour|hours|hr|hrs)/);
  if (timeMatch) {
    const value = parseInt(timeMatch[1], 10);
    maxTime = ['hour', 'hours', 'hr', 'hrs'].includes(timeMatch[2]) ? value * 60 : value;
  }

  if (['easy', 'simple', 'quick', 'fast'].some((term) => normalizedQuery.includes(term))) {
    difficulty = 'easy';
  } else if (['hard', 'difficult', 'complex', 'advanced'].some((term) => normalizedQuery.includes(term))) {
    difficulty = 'hard';
  }

  if (['less spicy', 'not spicy', 'mild'].some((term) => normalizedQuery.includes(term))) {
    spiceLevel = 'mild';
  } else if (['spicy', 'masaledar', 'very spicy'].some((term) => normalizedQuery.includes(term))) {
    spiceLevel = 'spicy';
  }

  for (const keyword of INGREDIENT_KEYWORDS) {
    if (normalizedQuery.includes(keyword)) {
      const parts = normalizedQuery.split(keyword);
      if (parts.length > 1) {
        const ingredients = parts[1]
          .trim()
          .split(/\s*(?:,|and|or|\&|\+)\s*/)
          .map((item) => item.trim())
          .filter((item) => item.length > 1);

        if (ingredients.length > 0) {
          parsedQuery = {
            type: GENERATE_INTENTS.some((term) => normalizedQuery.includes(term)) ? 'generate_recipe' : 'ingredients',
            ingredients
          };
          break;
        }
      }
    }
  }

  if (parsedQuery.type === 'unknown' && (normalizedQuery.includes(',') || normalizedQuery.includes(' and '))) {
    const potentialIngredients = normalizedQuery
      .split(/\s*(?:,|and|or|\&)\s*/)
      .map((item) => item.trim())
      .filter((item) => item.length > 1);

    const ingredients = potentialIngredients.filter((item) => COMMON_INGREDIENTS.includes(item));
    if (ingredients.length > 1) {
      parsedQuery = {
        type: GENERATE_INTENTS.some((term) => normalizedQuery.includes(term)) ? 'generate_recipe' : 'ingredients',
        ingredients
      };
    }
  }

  if (parsedQuery.type === 'unknown' && GENERATE_INTENTS.some((term) => normalizedQuery.includes(term))) {
    parsedQuery = { type: 'generate_recipe', ingredients: [] };
  }

  if (parsedQuery.type === 'unknown' && queryGoals.length > 0) {
    parsedQuery = { type: 'dietary', dietary: queryGoals[0] };
  }

  if (parsedQuery.type === 'unknown') {
    for (const diet of DIETARY_KEYWORDS) {
      if (normalizedQuery.includes(diet)) {
        parsedQuery = { type: 'dietary', dietary: diet };
        break;
      }
    }
  }

  if (parsedQuery.type === 'unknown') {
    for (const cuisine of CUISINES) {
      if (normalizedQuery.includes(cuisine)) {
        parsedQuery = { type: 'cuisine', cuisine };
        break;
      }
    }
  }

  if (parsedQuery.type === 'unknown') {
    for (const category of CATEGORIES) {
      if (normalizedQuery.includes(category)) {
        parsedQuery = { type: 'category', category: category === 'sweet' ? 'dessert' : category === 'tiffin' ? 'snack' : category };
        break;
      }
    }
  }

  if (parsedQuery.type === 'unknown') {
    for (const recipeName of RECIPE_KEYWORDS) {
      if (normalizedQuery.includes(recipeName)) {
        parsedQuery = { type: 'specific_recipe', recipeName };
        break;
      }
    }
  }

  if (parsedQuery.type === 'unknown') {
    if (preferenceTags.length > 0) {
      parsedQuery = { type: 'preference', preferenceTags };
    }
  }

  if (parsedQuery.type === 'unknown') {
    if (['recipe', 'cook', 'food', 'dish', 'something', 'suggest', 'recommend'].some((term) => normalizedQuery.includes(term))) {
      parsedQuery = { type: 'random' };
    }
  }

  if (parsedQuery.type === 'unknown') {
    for (const ingredient of COMMON_INGREDIENTS) {
      if (normalizedQuery.includes(ingredient)) {
        parsedQuery = { type: 'ingredients', ingredients: [ingredient] };
        break;
      }
    }
  }

  parsedQuery.maxTime = maxTime;
  parsedQuery.difficulty = difficulty;
  parsedQuery.spiceLevel = spiceLevel;
  parsedQuery.queryGoals = queryGoals;
  parsedQuery.preferenceTags = preferenceTags;
  return parsedQuery;
};

const applyFilters = (recipes, filters = {}) => {
  let result = recipes;

  if (filters.maxTime) {
    result = result.filter((recipe) => (Number(recipe.cookTime || 0) + Number(recipe.prepTime || 0)) <= filters.maxTime);
  }

  if (filters.difficulty) {
    result = result.filter((recipe) => String(recipe.difficulty || '').toLowerCase().includes(filters.difficulty.toLowerCase()));
  }

  if (filters.spiceLevel) {
    result = result.filter((recipe) =>
      (recipe.spiceLevel && recipe.spiceLevel.toLowerCase().includes(filters.spiceLevel.toLowerCase())) ||
      (Array.isArray(recipe.tags) && recipe.tags.some((tag) => String(tag).toLowerCase().includes(filters.spiceLevel.toLowerCase())))
    );
  }

  return result;
};

const collectUserSignals = async (user) => {
  if (!user) {
    return {
      topTags: [],
      topIngredients: [],
      topCuisines: [],
      foodProfile: null
    };
  }

  const favoriteRecipes = await Recipe.find({ _id: { $in: user.favorites || [] } }).select('tags ingredients cuisine');
  const recentLogs = await ChatLog.find({ user: user._id, helpful: { $ne: false } })
    .sort({ createdAt: -1 })
    .limit(30)
    .populate('recipesReturned', 'tags ingredients cuisine');

  const tagCounts = new Map();
  const ingredientCounts = new Map();
  const cuisineCounts = new Map();

  const observeRecipe = (recipe, weight = 1) => {
    (recipe.tags || []).forEach((tag) => {
      const key = String(tag).toLowerCase();
      tagCounts.set(key, (tagCounts.get(key) || 0) + weight);
    });

    (recipe.ingredients || []).forEach((ingredient) => {
      const key = String(ingredient.name || '').toLowerCase();
      if (key) ingredientCounts.set(key, (ingredientCounts.get(key) || 0) + weight);
    });

    if (recipe.cuisine) {
      const key = String(recipe.cuisine).toLowerCase();
      cuisineCounts.set(key, (cuisineCounts.get(key) || 0) + weight);
    }
  };

  favoriteRecipes.forEach((recipe) => observeRecipe(recipe, 3));
  recentLogs.forEach((log) => (log.recipesReturned || []).forEach((recipe) => observeRecipe(recipe, 1)));

  const top = (map) => [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([key]) => key);

  return {
    topTags: top(tagCounts),
    topIngredients: top(ingredientCounts),
    topCuisines: top(cuisineCounts),
    foodProfile: user.settings?.foodProfile || null
  };
};

const personalizeRecipes = (recipes, signals, parsedQuery = null) => {
  if (!signals) return recipes;

  const preferredTags = signals.topTags || [];
  const preferredIngredients = signals.topIngredients || [];
  const preferredCuisines = signals.topCuisines || [];
  const explicitQueryGoal = parsedQuery?.queryGoals?.[0] || '';
  const goal = explicitQueryGoal || signals.foodProfile?.goal || '';
  const conditions = (signals.foodProfile?.conditions || []).map((item) => String(item).toLowerCase());
  const avoidIngredients = (signals.foodProfile?.avoidIngredients || []).map((item) => String(item).toLowerCase());

  return recipes
    .map((recipe) => {
      let score = 0;
      const tags = (recipe.tags || []).map((tag) => String(tag).toLowerCase());
      const ingredients = (recipe.ingredients || []).map((ingredient) => String(ingredient.name || '').toLowerCase());
      const cuisine = String(recipe.cuisine || '').toLowerCase();

      if (preferredCuisines.includes(cuisine)) score += 4;
      preferredTags.forEach((tag) => { if (tags.includes(tag)) score += 2; });
      preferredIngredients.forEach((ingredient) => {
        if (ingredients.some((item) => item.includes(ingredient))) score += 1;
      });

      if (avoidIngredients.some((ingredient) => ingredients.some((item) => item.includes(ingredient)))) {
        score -= 20;
      }

      const goalHints = GOAL_HINTS[goal] || [];
      goalHints.forEach((hint) => {
        if (tags.includes(hint)) score += 3;
      });

      if ((goal === 'diabetic' || conditions.includes('diabetic')) && (tags.includes('diabetic') || tags.includes('low-sugar') || tags.includes('low-carb'))) score += 4;
      if ((goal === 'gym' || goal === 'high-protein') && (tags.includes('high-protein') || tags.includes('gym'))) score += 4;
      if ((goal === 'heart-healthy' || conditions.includes('heart')) && (tags.includes('heart-healthy') || tags.includes('low-sodium'))) score += 4;
      if ((goal === 'pcos-friendly' || conditions.includes('pcos')) && tags.includes('pcos-friendly')) score += 4;
      if (goal === 'kids-lunchbox' && (tags.includes('kids-lunchbox') || tags.includes('kid-friendly'))) score += 4;
      if (goal === 'low-sodium' && (tags.includes('low-sodium') || tags.includes('kidney-friendly'))) score += 4;

      return { recipe, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.recipe);
};

const searchByIngredients = async (ingredients, filters = {}, signals = null, parsedQuery = null) => {
  try {
    const regexArray = ingredients.map((ingredient) => ({
      'ingredients.name': { $regex: new RegExp(ingredient, 'i') }
    }));

    const recipes = await Recipe.find({ $or: regexArray }).limit(60);
    const rankedRecipes = recipes
      .map((recipe) => {
        const matchCount = ingredients.filter((ingredient) =>
          recipe.ingredients.some((recipeIngredient) => new RegExp(ingredient, 'i').test(recipeIngredient.name))
        ).length;
        return { recipe, matchCount };
      })
      .sort((a, b) => b.matchCount - a.matchCount)
      .map((item) => item.recipe);

    return applyFilters(personalizeRecipes(rankedRecipes, signals, parsedQuery), filters).slice(0, 10);
  } catch (error) {
    console.error('Search by ingredients error:', error);
    return [];
  }
};

const searchByCuisine = async (cuisine, filters = {}, signals = null, parsedQuery = null) => {
  try {
    const recipes = await Recipe.find({ cuisine: new RegExp(cuisine, 'i') }).limit(50);
    return applyFilters(personalizeRecipes(recipes, signals, parsedQuery), filters).slice(0, 10);
  } catch (error) {
    console.error('Search by cuisine error:', error);
    return [];
  }
};

const searchByCategory = async (category, filters = {}, signals = null, parsedQuery = null) => {
  try {
    const recipes = await Recipe.find({ category: new RegExp(category, 'i') }).limit(50);
    return applyFilters(personalizeRecipes(recipes, signals, parsedQuery), filters).slice(0, 10);
  } catch (error) {
    console.error('Search by category error:', error);
    return [];
  }
};

const searchByDietary = async (dietary, filters = {}, signals = null, parsedQuery = null) => {
  try {
    let query = {};
    if (dietary === 'vegetarian' || dietary === 'veg') {
      query = { 'ingredients.name': { $not: /meat|chicken|beef|pork|fish|seafood|lamb/i } };
    } else if (dietary === 'vegan') {
      query = { 'ingredients.name': { $not: /meat|chicken|beef|pork|fish|seafood|lamb|dairy|milk|cheese|egg|honey/i } };
    } else if (dietary === 'gluten free') {
      query = { 'ingredients.name': { $not: /wheat|flour|bread|pasta/i } };
    } else if (dietary === 'dairy free') {
      query = { 'ingredients.name': { $not: /milk|cheese|butter|cream|yogurt/i } };
    } else if (dietary === 'keto' || dietary === 'low carb') {
      query = { tags: { $in: ['low-carb', 'keto'] } };
    } else if (dietary === 'healthy') {
      query = { tags: { $in: ['healthy', 'balanced', 'light'] } };
    } else if (dietary === 'gym' || dietary === 'high protein') {
      query = { tags: { $in: ['gym', 'high-protein'] } };
    } else if (dietary === 'diabetic') {
      query = { tags: { $in: ['diabetic', 'low-sugar', 'low-carb'] } };
    } else if (dietary === 'kids-lunchbox') {
      query = { tags: { $in: ['kids-lunchbox', 'kid-friendly'] } };
    } else if (dietary === 'pcos-friendly') {
      query = { tags: { $in: ['pcos-friendly', 'high-fiber', 'balanced'] } };
    } else if (dietary === 'low-sodium') {
      query = { tags: { $in: ['low-sodium', 'kidney-friendly'] } };
    }

    const recipes = await Recipe.find(query).limit(50);
    return applyFilters(personalizeRecipes(recipes, signals, parsedQuery), filters).slice(0, 10);
  } catch (error) {
    console.error('Search by dietary error:', error);
    return [];
  }
};

const searchByName = async (recipeName, filters = {}, signals = null, parsedQuery = null) => {
  try {
    const recipes = await Recipe.find({
      $or: [
        { title: new RegExp(recipeName, 'i') },
        { tags: new RegExp(recipeName, 'i') }
      ]
    }).limit(50);

    return applyFilters(personalizeRecipes(recipes, signals, parsedQuery), filters).slice(0, 10);
  } catch (error) {
    console.error('Search by name error:', error);
    return [];
  }
};

const searchByPreferences = async (preferenceTags, filters = {}, signals = null, parsedQuery = null) => {
  try {
    const regexes = preferenceTags.map((tag) => new RegExp(tag, 'i'));
    const recipes = await Recipe.find({
      $or: [
        { tags: { $in: regexes } },
        { title: { $in: regexes } },
        { description: { $in: regexes } }
      ]
    }).limit(60);

    const rankedRecipes = recipes
      .map((recipe) => {
        const tags = (recipe.tags || []).map((tag) => String(tag).toLowerCase());
        const description = `${recipe.title || ''} ${recipe.description || ''}`.toLowerCase();
        let score = 0;

        preferenceTags.forEach((tag) => {
          if (tags.includes(tag)) score += 4;
          if (description.includes(tag)) score += 2;
          if (tag === 'protein' && (tags.includes('high-protein') || tags.includes('gym'))) score += 4;
          if (tag === 'quick' && Number(recipe.prepTime || 0) + Number(recipe.cookTime || 0) <= 30) score += 4;
          if (tag === 'spicy' && tags.includes('spicy')) score += 4;
          if (tag === 'sweet' && recipe.category === 'dessert') score += 3;
          if (tag === 'healthy' && ['healthy', 'balanced', 'light'].some((item) => tags.includes(item))) score += 4;
        });

        return { recipe, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.recipe);

    const fallbackRecipes = rankedRecipes.length > 0 ? rankedRecipes : await Recipe.find().limit(40);
    return applyFilters(personalizeRecipes(fallbackRecipes, signals, parsedQuery), filters).slice(0, 10);
  } catch (error) {
    console.error('Search by preferences error:', error);
    return [];
  }
};

const getRandomRecipes = async (count, filters = {}, signals = null, parsedQuery = null) => {
  try {
    const recipes = await Recipe.aggregate([{ $sample: { size: count * 4 } }]);
    return applyFilters(personalizeRecipes(recipes, signals, parsedQuery), filters).slice(0, count);
  } catch (error) {
    console.error('Get random recipes error:', error);
    return [];
  }
};

const getLearningMessage = (signals, parsedQuery) => {
  if (!signals || (!signals.topTags.length && !signals.foodProfile?.goal && !parsedQuery?.queryGoals?.length)) {
    return '';
  }

  if (parsedQuery?.preferenceTags?.length) {
    return '';
  }

  if (parsedQuery?.queryGoals?.length) {
    return `I prioritized ${parsedQuery.queryGoals[0].replace(/-/g, ' ')} recipes based on your request.`;
  }

  if (signals.foodProfile?.goal) {
    return `I used your ${signals.foodProfile.goal.replace(/-/g, ' ')} food plan to rank these.`;
  }

  if (signals.topTags.length) {
    return `I ranked these using what you've liked before, especially ${signals.topTags.slice(0, 2).join(' and ')} recipes.`;
  }

  return '';
};

const getGeminiConfig = () => ({
  apiKey: process.env.GEMINI_API_KEY || '',
  model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite'
});

const summarizeSessionMemory = (sessionMemory = []) =>
  sessionMemory
    .slice(0, 4)
    .reverse()
    .map((item) => `${item.queryType || 'message'}: ${String(item.userMessage || '').trim()}`)
    .join('\n');

const buildLLMContext = ({
  userMessage,
  parsedQuery,
  recipes = [],
  shoppingList = [],
  generatedRecipe = null,
  mealPlan = null,
  scalePreview = null,
  signals = null,
  sessionMemory = [],
  fallbackMessage = ''
}) => {
  const profile = signals?.foodProfile || {};

  return {
    userMessage,
    parsedQuery,
    profile: {
      goal: profile.goal || '',
      conditions: profile.conditions || [],
      preferredCuisines: profile.preferredCuisines || [],
      avoidIngredients: profile.avoidIngredients || []
    },
    topTags: signals?.topTags || [],
    recentConversation: summarizeSessionMemory(sessionMemory),
    recipes: recipes.slice(0, 5).map((recipe) => ({
      title: recipe.title,
      cuisine: recipe.cuisine,
      category: recipe.category,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      rating: recipe.rating?.average || 0,
      tags: recipe.tags || [],
      ingredients: (recipe.ingredients || []).slice(0, 8).map((ingredient) => ingredient.name)
    })),
    shoppingList: shoppingList.slice(0, 10),
    generatedRecipe,
    mealPlan: mealPlan ? {
      weekStart: mealPlan.weekStart,
      entries: (mealPlan.entries || []).slice(0, 8).map((entry) => ({
        date: entry.date,
        mealType: entry.mealType,
        recipeTitle: entry.recipe?.title || ''
      }))
    } : null,
    scalePreview,
    fallbackMessage
  };
};

const generateGeminiReply = async (context) => {
  const { apiKey, model } = getGeminiConfig();
  if (!apiKey) return null;

  const systemPrompt = [
    'You are CookOnWeb\'s recipe assistant.',
    'Answer naturally and helpfully using ONLY the provided application context.',
    'Do not invent recipes, meal plans, shopping items, or user preferences that are not in the context.',
    'If there are recipe matches, recommend the best ones with short reasons.',
    'If there is a generated recipe idea, present it clearly as a generated idea.',
    'If there is a shopping list or meal plan, summarize it in a user-friendly way.',
    'Keep the answer concise, practical, and conversational.'
  ].join(' ');

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemPrompt}\n\nApplication context:\n${JSON.stringify(context, null, 2)}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 400
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${errorText}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join('\n').trim() || null;
};

const getSessionMemory = async (sessionId) => {
  if (!sessionId) return [];

  return ChatLog.find({ sessionId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('userMessage queryType createdAt');
};

const formatList = (items = [], limit = 3) =>
  items
    .filter(Boolean)
    .slice(0, limit)
    .join(', ');

const buildRecipeReason = (recipe, parsedQuery, signals) => {
  const reasons = [];
  const totalTime = Number(recipe.prepTime || 0) + Number(recipe.cookTime || 0);
  const tags = (recipe.tags || []).map((tag) => String(tag).toLowerCase());

  if (parsedQuery?.ingredients?.length) {
    const ingredientNames = (recipe.ingredients || []).map((ingredient) => String(ingredient.name || '').toLowerCase());
    const matched = parsedQuery.ingredients.filter((ingredient) =>
      ingredientNames.some((name) => name.includes(String(ingredient).toLowerCase()))
    );
    if (matched.length) reasons.push(`uses ${formatList(matched)}`);
  }

  if (parsedQuery?.dietary && tags.some((tag) => tag.includes(String(parsedQuery.dietary).toLowerCase()))) {
    reasons.push(`fits ${parsedQuery.dietary}`);
  }

  if (signals?.foodProfile?.goal && tags.includes(String(signals.foodProfile.goal).toLowerCase())) {
    reasons.push(`matches your ${signals.foodProfile.goal.replace(/-/g, ' ')}`);    
  }

  if (totalTime > 0 && totalTime <= 30) {
    reasons.push(`ready in about ${totalTime} min`);
  }

  if (recipe.rating?.average >= 4) {
    reasons.push(`rated ${recipe.rating.average}/5`);
  }

  return reasons.slice(0, 2);
};

const buildAssistantReply = ({
  parsedQuery,
  recipes = [],
  shoppingList = [],
  generatedRecipe = null,
  mealPlan = null,
  scalePreview = null,
  signals = null,
  sessionMemory = [],
  fallbackMessage = ''
}) => {
  const memoryHint = sessionMemory.length > 1
    ? `I also looked at your recent chat context so this stays consistent with what we were discussing.`
    : '';

  if (parsedQuery.type === 'shopping_list') {
    if (!shoppingList.length) {
      return fallbackMessage || 'I could not find a saved meal plan yet. Save your planner week first, or ask me to create one for you.';
    }

    const topItems = shoppingList.slice(0, 8).map((item, index) =>
      `${index + 1}. ${item.name} - ${item.quantity}${item.unit ? ` ${item.unit}` : ''}`
    ).join('\n');

    return `I built your shopping list from the saved meal plan for the week starting ${mealPlan?.weekStart || 'your latest saved week'}.\n\n${topItems}\n\n${memoryHint}`.trim();
  }

  if (parsedQuery.type === 'meal_plan' && mealPlan?.entries?.length) {
    const preview = mealPlan.entries.slice(0, 6).map((entry, index) =>
      `${index + 1}. ${entry.date} - ${entry.mealType}: ${entry.recipe?.title || 'Recipe'}`
    ).join('\n');

    return `I created a weekly meal plan for the week starting ${mealPlan.weekStart}. I balanced it around your saved food profile and stronger recipe matches.\n\n${preview}\n\nYou can open Planner to edit any slot.`.trim();
  }

  if (parsedQuery.type === 'scale_recipe' && scalePreview) {
    const items = scalePreview.ingredients.slice(0, 8).map((ingredient, index) =>
      `${index + 1}. ${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`.trim()
    ).join('\n');

    return `I scaled ${scalePreview.title} from ${scalePreview.baseServings} to ${scalePreview.targetServings} servings.\n\n${items}\n\nIf you want, I can also help turn this into a shopping list.`.trim();
  }

  if (parsedQuery.type === 'generate_recipe' && generatedRecipe) {
    const matchedTitles = recipes.length ? `I also found a few similar recipes in your collection: ${formatList(recipes.map((recipe) => recipe.title), 3)}.` : '';
    return `I generated a recipe idea called "${generatedRecipe.title}". ${generatedRecipe.description}\n\nCore ingredients: ${formatList(generatedRecipe.ingredients.map((item) => item.name), 6)}.\n\n${matchedTitles}`.trim();
  }

  if (recipes.length) {
    const introByType = {
      ingredients: `I found recipes that make good use of ${formatList(parsedQuery.ingredients, 3)}.`,
      dietary: `I found options that fit ${parsedQuery.dietary}.`,
      cuisine: `I found some ${parsedQuery.cuisine} recipes.`,
      category: `I found some ${parsedQuery.category} ideas.`,
      specific_recipe: `I found close matches for ${parsedQuery.recipeName}.`,
      preference: `I found recipe ideas that fit ${formatList(parsedQuery.preferenceTags, 3)}.`,
      random: 'Here are a few recipe ideas from your collection.'
    };

    const summary = recipes.slice(0, 4).map((recipe, index) => {
      const reasonText = buildRecipeReason(recipe, parsedQuery, signals);
      return `${index + 1}. ${recipe.title}${recipe.cuisine ? ` (${recipe.cuisine})` : ''}${reasonText.length ? ` - ${reasonText.join(', ')}` : ''}`;
    }).join('\n');

    const learningMessage = getLearningMessage(signals, parsedQuery);

    return `${introByType[parsedQuery.type] || fallbackMessage || 'Here are some suggestions.'}\n\n${summary}${learningMessage ? `\n\n${learningMessage}` : ''}${memoryHint ? `\n\n${memoryHint}` : ''}`.trim();
  }

  return fallbackMessage || "I couldn't find a strong match yet, but try giving me a main ingredient, cuisine, meal type, or health goal.";
};

const createWeeklyMealPlan = async (user, signals) => {
  const weekStart = getStartOfWeek();
  const foodProfile = signals?.foodProfile || {};
  const recipes = await Recipe.find().sort({ 'rating.average': -1, createdAt: -1 }).limit(80);

  const scored = personalizeRecipes(recipes, signals, { queryGoals: foodProfile.goal ? [foodProfile.goal] : [] }).slice(0, 21);
  const weekEntries = [];
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(`${weekStart}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + index);
    return date.toISOString().slice(0, 10);
  });
  const mealTypes = ['breakfast', 'lunch', 'dinner'];

  days.forEach((date, dayIndex) => {
    mealTypes.forEach((mealType, mealIndex) => {
      const recipe = scored[(dayIndex * mealTypes.length + mealIndex) % Math.max(scored.length, 1)];
      if (!recipe) return;

      weekEntries.push({
        date,
        mealType,
        recipe: recipe._id,
        servings: recipe.servings || 1,
        notes: foodProfile.goal ? `Picked for ${String(foodProfile.goal).replace(/-/g, ' ')}` : ''
      });
    });
  });

  const mealPlan = await MealPlan.findOneAndUpdate(
    { user: user._id, weekStart },
    { user: user._id, weekStart, entries: weekEntries, updatedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).populate({
    path: 'entries.recipe',
    select: 'title cuisine category servings ingredients'
  });

  return {
    weekStart,
    entries: mealPlan.entries || []
  };
};

const processQuery = async (req, res) => {
  try {
    const { message, sessionId = '' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Message is required and must be a string' });
    }

    const user = await getUserFromRequest(req);
    const signals = await collectUserSignals(user);
    const sessionMemory = await getSessionMemory(sessionId);
    const query = message.toLowerCase().trim();
    const parsedQuery = parseUserQuery(query);

    let recipes = [];
    let responseMessage = '';
    let shoppingList = [];
    let generatedRecipe = null;
    let mealPlan = null;
    let scalePreview = null;

    const filters = {
      maxTime: parsedQuery.maxTime,
      difficulty: parsedQuery.difficulty,
      spiceLevel: parsedQuery.spiceLevel
    };

    if (parsedQuery.type === 'conversation') {
      const responses = {
        greeting: "Hi. Ask for recipes by mood, ingredient, meal type, or food goal. For example: 'something spicy', 'quick breakfast', or 'gym dinner'.",
        thanks: "You're welcome. Ask for another recipe idea anytime.",
        help: "I can suggest recipes by ingredient, cuisine, meal type, health goal, or mood. Try: 'something spicy', 'Indian diabetic breakfast', 'quick paneer recipe', or 'kids lunchbox ideas'.",
        about: "I'm your recipe assistant. I can recommend meals using your request, your saved food plan, and what you've liked before."
      };

      const reply = responses[parsedQuery.intent] || "Ask me for recipe ideas and I'll suggest something useful.";

      const chatLog = await ChatLog.create({
        user: user?._id || null,
        sessionId,
        userMessage: message,
        botMessage: reply,
        parsedQuery,
        queryType: parsedQuery.type,
        recipesReturned: []
      });

      return res.json({
        message: reply,
        recipes: [],
        queryType: parsedQuery.type,
        logId: chatLog._id,
        learnedFrom: {
          source: null,
          foodProfileGoal: null,
          topTags: []
        }
      });
    }

    if (parsedQuery.type === 'shopping_list') {
      if (!user) {
        responseMessage = 'Log in first and save a weekly meal plan, then I can build your shopping list.';
      } else {
        const weekStart = getStartOfWeek();
        const plan = await findRelevantMealPlan(user._id, weekStart);
        const entries = plan?.entries || [];
        mealPlan = plan ? { weekStart: plan.weekStart, entries: plan.entries || [] } : null;
        shoppingList = buildShoppingListFromEntries(entries);
        responseMessage = shoppingList.length
          ? `Here is your shopping list for the week starting ${plan.weekStart}.\n\n`
          : 'I could not find a saved meal plan yet. Save your planner week first, or ask me to create a meal plan for you.';
        shoppingList.slice(0, 10).forEach((item, index) => {
          responseMessage += `${index + 1}. ${item.name} - ${item.quantity}${item.unit ? ` ${item.unit}` : ''}\n`;
        });
      }
    } else if (parsedQuery.type === 'meal_plan') {
      if (!user) {
        responseMessage = 'Log in first and I can create a personalized weekly meal plan for you.';
      } else {
        mealPlan = await createWeeklyMealPlan(user, signals);
        recipes = mealPlan.entries.slice(0, 6).map((entry) => entry.recipe).filter(Boolean);
        responseMessage = `I created a weekly meal plan for the week starting ${mealPlan.weekStart}.\n\n`;
        mealPlan.entries.slice(0, 6).forEach((entry, index) => {
          responseMessage += `${index + 1}. ${entry.date} - ${entry.mealType}: ${entry.recipe?.title || 'Recipe'}\n`;
        });
      }
    } else if (parsedQuery.type === 'scale_recipe') {
      const recipeSearchTerm = parsedQuery.recipeName || query;
      const candidateRecipes = await searchByName(recipeSearchTerm, filters, signals, parsedQuery);
      const recipe = candidateRecipes[0];
      const targetServings = parsedQuery.targetServings || (recipe ? Math.max(2, Number(recipe.servings || 1) * 2) : 2);

      if (!recipe) {
        responseMessage = 'Tell me which recipe to scale, for example: scale paneer curry to 4 servings.';
      } else {
        scalePreview = {
          recipeId: recipe._id,
          title: recipe.title,
          baseServings: recipe.servings || 1,
          targetServings,
          ingredients: (recipe.ingredients || []).map((ingredient) => {
            const quantity = parseQuantityValue(ingredient.quantity);
            const scaledQuantity = quantity != null
              ? formatQuantity(quantity * (targetServings / Math.max(Number(recipe.servings || 1), 1)))
              : ingredient.quantity;
            return {
              name: ingredient.name,
              unit: ingredient.unit || '',
              quantity: scaledQuantity
            };
          })
        };
        recipes = [recipe];
        responseMessage = `Scaled ${recipe.title} from ${scalePreview.baseServings} to ${targetServings} servings.\n\n`;
        scalePreview.ingredients.slice(0, 8).forEach((ingredient, index) => {
          responseMessage += `${index + 1}. ${ingredient.quantity} ${ingredient.unit} ${ingredient.name}\n`;
        });
      }
    } else if (parsedQuery.type === 'generate_recipe') {
      const ingredients = parsedQuery.ingredients || [];
      recipes = ingredients.length ? await searchByIngredients(ingredients, filters, signals, parsedQuery) : [];
      generatedRecipe = buildGeneratedRecipe(ingredients, {
        dietaryFilters: parsedQuery.queryGoals || []
      }, recipes);
      responseMessage = ingredients.length
        ? `I generated a recipe idea using ${ingredients.join(', ')}.\n\n`
        : 'Tell me a few ingredients and I can generate a recipe idea from them.';
      if (ingredients.length) {
        responseMessage += `${generatedRecipe.title}\n${generatedRecipe.description}\n`;
      }
    } else if (parsedQuery.type === 'ingredients') {
      recipes = await searchByIngredients(parsedQuery.ingredients, filters, signals, parsedQuery);
      responseMessage = recipes.length
        ? `Here are some recipes that use ${parsedQuery.ingredients.join(', ')}.\n\n`
        : `I couldn't find good matches with ${parsedQuery.ingredients.join(', ')}.`;
    } else if (parsedQuery.type === 'dietary') {
      recipes = await searchByDietary(parsedQuery.dietary, filters, signals, parsedQuery);
      responseMessage = recipes.length
        ? `Here are some ${parsedQuery.dietary} options.\n\n`
        : `I couldn't find strong ${parsedQuery.dietary} matches right now.`;
    } else if (parsedQuery.type === 'cuisine') {
      recipes = await searchByCuisine(parsedQuery.cuisine, filters, signals, parsedQuery);
      responseMessage = recipes.length
        ? `Here are some ${parsedQuery.cuisine} dishes.\n\n`
        : `I don't have enough ${parsedQuery.cuisine} results yet.`;
    } else if (parsedQuery.type === 'category') {
      recipes = await searchByCategory(parsedQuery.category, filters, signals, parsedQuery);
      responseMessage = recipes.length
        ? `Here are some ${parsedQuery.category} ideas.\n\n`
        : `I couldn't find enough ${parsedQuery.category} recipes.`;
    } else if (parsedQuery.type === 'specific_recipe') {
      recipes = await searchByName(parsedQuery.recipeName, filters, signals, parsedQuery);
      responseMessage = recipes.length
        ? `Here are some ${parsedQuery.recipeName} recipes.\n\n`
        : `I don't have a strong match for ${parsedQuery.recipeName} yet.`;
    } else if (parsedQuery.type === 'preference') {
      recipes = await searchByPreferences(parsedQuery.preferenceTags, filters, signals, parsedQuery);
      responseMessage = recipes.length
        ? `Here are some ${parsedQuery.preferenceTags.join(', ')} recipe ideas.\n\n`
        : `I couldn't find strong ${parsedQuery.preferenceTags.join(', ')} matches right now.`;
    } else {
      recipes = await getRandomRecipes(4, filters, signals, parsedQuery);
      responseMessage = recipes.length
        ? `Here are some recipe suggestions for you.\n\n`
        : `I don't have any recipes in my collection yet.`;
    }

    const localReply = buildAssistantReply({
      parsedQuery,
      recipes,
      shoppingList,
      generatedRecipe,
      mealPlan,
      scalePreview,
      signals,
      sessionMemory,
      fallbackMessage: responseMessage
    });
    responseMessage = localReply;

    try {
      const llmReply = await generateGeminiReply(buildLLMContext({
        userMessage: message,
        parsedQuery,
        recipes,
        shoppingList,
        generatedRecipe,
        mealPlan,
        scalePreview,
        signals,
        sessionMemory,
        fallbackMessage: localReply
      }));

      if (llmReply) {
        responseMessage = llmReply;
      }
    } catch (llmError) {
      console.error('Gemini reply generation failed, using local fallback:', llmError.message);
    }

    const chatLog = await ChatLog.create({
      user: user?._id || null,
      sessionId,
      userMessage: message,
      botMessage: responseMessage,
      parsedQuery,
      queryType: parsedQuery.type,
      recipesReturned: recipes.slice(0, 5).map((recipe) => recipe._id)
    });

    return res.json({
      message: responseMessage,
      recipes: recipes.slice(0, 5),
      shoppingList,
      generatedRecipe,
      mealPlan,
      scalePreview,
      queryType: parsedQuery.type,
      logId: chatLog._id,
      learnedFrom: {
        source: parsedQuery.queryGoals?.[0] ? 'query' : signals.foodProfile?.goal ? 'food-plan' : signals.topTags.length ? 'likes' : null,
        foodProfileGoal: parsedQuery.queryGoals?.[0] || signals.foodProfile?.goal || null,
        topTags: signals.topTags.slice(0, 3)
      }
    });
  } catch (error) {
    console.error('Chatbot query error:', error);
    return res.status(500).json({
      message: 'Sorry, I encountered an error while processing your request. Please try again.',
      recipes: []
    });
  }
};

const submitFeedback = async (req, res) => {
  try {
    const { logId, helpful, clickedRecipeId, note = '' } = req.body;

    if (!logId) {
      return res.status(400).json({ message: 'logId is required' });
    }

    const user = await getUserFromRequest(req);
    const log = await ChatLog.findById(logId);
    if (!log) {
      return res.status(404).json({ message: 'Chat log not found' });
    }

    if (user && !log.user) {
      log.user = user._id;
    }
    if (typeof helpful === 'boolean') {
      log.helpful = helpful;
    }
    if (clickedRecipeId) {
      log.clickedRecipe = clickedRecipeId;
    }
    if (typeof note === 'string' && note.trim()) {
      log.feedbackNote = note.trim();
    }

    await log.save();
    return res.json({ message: 'Feedback saved' });
  } catch (error) {
    console.error('Chatbot feedback error:', error);
    return res.status(500).json({ message: 'Server error while saving feedback' });
  }
};

module.exports = {
  processQuery,
  submitFeedback
};
