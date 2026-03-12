const jwt = require('jsonwebtoken');
const Recipe = require('../models/Recipe');
const ChatLog = require('../models/ChatLog');
const User = require('../models/User');

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
          parsedQuery = { type: 'ingredients', ingredients };
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
      parsedQuery = { type: 'ingredients', ingredients };
    }
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

const processQuery = async (req, res) => {
  try {
    const { message, sessionId = '' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Message is required and must be a string' });
    }

    const user = await getUserFromRequest(req);
    const signals = await collectUserSignals(user);
    const query = message.toLowerCase().trim();
    const parsedQuery = parseUserQuery(query);

    let recipes = [];
    let responseMessage = '';

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

    if (parsedQuery.type === 'ingredients') {
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

    const learningMessage = getLearningMessage(signals, parsedQuery);
    if (learningMessage) {
      responseMessage += `${learningMessage}\n\n`;
    }

    recipes.slice(0, 4).forEach((recipe, index) => {
      responseMessage += `${index + 1}. ${recipe.title}`;
      if (recipe.cuisine) responseMessage += ` (${recipe.cuisine})`;
      if (recipe.category) responseMessage += ` - ${recipe.category}`;
      if (recipe.tags?.length) responseMessage += ` - ${recipe.tags.slice(0, 2).join(', ')}`;
      responseMessage += '\n';
    });

    if (!responseMessage.trim()) {
      responseMessage = "I'm your recipe assistant. Ask for ingredients, cuisines, diabetic-friendly meals, gym meals, breakfast ideas, or quick recipes.";
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
