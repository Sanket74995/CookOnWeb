const Recipe = require('../models/Recipe');
const ChatLog = require('../models/ChatLog');

// 🔹 Keywords / config
const COMMON_INGREDIENTS = [
  'potato','aloo','rice','chawal','chicken','paneer','tomato','onion','garlic',
  'carrot','beans','peas','corn','spinach','mushroom','beef','pork','fish',
  'egg','anda','cheese','milk','flour','maida','atta','sugar','butter','oil',
  'salt','pepper','bread','pasta','noodle','maggi'
];

const DIETARY_KEYWORDS = [
  'vegetarian','veg','vegan','gluten free','dairy free','keto','low carb','healthy'
];

const CUISINES = [
  'italian','indian','south indian','north indian','chinese','indo chinese',
  'mexican','thai','japanese','french','greek','spanish','american',
  'mediterranean','korean','vietnamese','turkish','lebanese'
];

const CATEGORIES = [
  'breakfast','lunch','dinner','snack','tiffin','dessert','sweet','appetizer',
  'starter','main course','salad','soup','side dish'
];

const RECIPE_KEYWORDS = [
  'pizza','pasta','curry','dal','sambar','biryani','pulao','fried rice',
  'chicken','paneer','chole','rajma','fish','salad','soup','cake','cookies',
  'brownie','burger','sandwich','stir fry','roast','grill','bake'
];

const INGREDIENT_KEYWORDS = [
  'with','using','made with','containing','have','i have','using only',
  'recipes with','cook with','make with'
];


// 🔹 Parse user query to determine intent + filters
const parseUserQuery = (query) => {
  const normalizedQuery = query.toLowerCase().trim();
  let parsedQuery = { type: 'unknown' };

  // Filters
  let maxTime = null;
  let difficulty = null;
  let spiceLevel = null;

  // ⏱ Time: "15 min", "20 minutes", "1 hour"
  const timeMatch = normalizedQuery.match(/(\d+)\s*(min|mins|minute|minutes|hour|hours|hr|hrs)/);
  if (timeMatch) {
    const value = parseInt(timeMatch[1], 10);
    const unit = timeMatch[2];
    if (['hour','hours','hr','hrs'].includes(unit)) {
      maxTime = value * 60;
    } else {
      maxTime = value;
    }
  }

  // 🧩 Difficulty: "easy", "simple", "quick", "hard"
  if (
    normalizedQuery.includes('easy') ||
    normalizedQuery.includes('simple') ||
    normalizedQuery.includes('quick') ||
    normalizedQuery.includes('fast')
  ) {
    difficulty = 'easy';
  } else if (
    normalizedQuery.includes('hard') ||
    normalizedQuery.includes('difficult') ||
    normalizedQuery.includes('complex') ||
    normalizedQuery.includes('advanced')
  ) {
    difficulty = 'hard';
  }

  // 🌶 Spice level (optional)
  if (
    normalizedQuery.includes('less spicy') ||
    normalizedQuery.includes('not spicy') ||
    normalizedQuery.includes('mild')
  ) {
    spiceLevel = 'mild';
  } else if (
    normalizedQuery.includes('spicy') ||
    normalizedQuery.includes('masaledar') ||
    normalizedQuery.includes('very spicy')
  ) {
    spiceLevel = 'spicy';
  }

  // 1️⃣ Ingredient queries with keywords
  for (const keyword of INGREDIENT_KEYWORDS) {
    if (normalizedQuery.includes(keyword)) {
      const parts = normalizedQuery.split(keyword);
      if (parts.length > 1) {
        const ingredientPart = parts[1].trim();
        const ingredients = ingredientPart
          .split(/\s*(?:,|and|or|\&|\+)\s*/)
          .map(i => i.trim())
          .filter(i => i.length > 1);

        if (ingredients.length > 0) {
          parsedQuery = { type: 'ingredients', ingredients };
          break;
        }
      }
    }
  }

  // 2️⃣ Multi-ingredient without keywords (e.g., "chicken, tomato, garlic")
  if (parsedQuery.type === 'unknown') {
    if (normalizedQuery.includes(',') || normalizedQuery.includes(' and ')) {
      const potentialIngredients = normalizedQuery
        .split(/\s*(?:,|and|or|\&)\s*/)
        .map(i => i.trim())
        .filter(i => i.length > 1);

      const ingredients = potentialIngredients.filter(i =>
        COMMON_INGREDIENTS.includes(i)
      );

      if (ingredients.length > 1) {
        parsedQuery = { type: 'ingredients', ingredients };
      }
    }
  }

  // 3️⃣ Dietary preferences
  if (parsedQuery.type === 'unknown') {
    for (const diet of DIETARY_KEYWORDS) {
      if (normalizedQuery.includes(diet)) {
        parsedQuery = { type: 'dietary', dietary: diet };
        break;
      }
      if (diet === 'vegetarian' || diet === 'veg') {
        if (normalizedQuery.includes('veg') && !normalizedQuery.includes('non-veg')) {
          parsedQuery = { type: 'dietary', dietary: 'vegetarian' };
          break;
        }
      }
    }
  }

  // 4️⃣ Cuisine
  if (parsedQuery.type === 'unknown') {
    for (const cuisine of CUISINES) {
      if (normalizedQuery.includes(cuisine)) {
        parsedQuery = { type: 'cuisine', cuisine };
        break;
      }
    }
    // extra: "indian style" → indian
    if (parsedQuery.type === 'unknown' && normalizedQuery.includes('indian style')) {
      parsedQuery = { type: 'cuisine', cuisine: 'indian' };
    }
  }

  // 5️⃣ Category (include synonyms like "sweet" → dessert)
  if (parsedQuery.type === 'unknown') {
    for (const category of CATEGORIES) {
      if (normalizedQuery.includes(category)) {
        let finalCategory = category;
        if (category === 'sweet') finalCategory = 'dessert';
        if (category === 'tiffin') finalCategory = 'snack';
        parsedQuery = { type: 'category', category: finalCategory };
        break;
      }
    }
  }

  // 6️⃣ Specific recipe names / dish types
  if (parsedQuery.type === 'unknown') {
    for (const recipeName of RECIPE_KEYWORDS) {
      if (normalizedQuery.includes(recipeName)) {
        parsedQuery = { type: 'specific_recipe', recipeName };
        break;
      }
    }
  }

  // 7️⃣ General recipe / suggestion
  if (parsedQuery.type === 'unknown') {
    if (
      normalizedQuery.includes('recipe') ||
      normalizedQuery.includes('cook') ||
      normalizedQuery.includes('food') ||
      normalizedQuery.includes('dish') ||
      normalizedQuery.includes('something') ||
      normalizedQuery.includes('suggest')
    ) {
      parsedQuery = { type: 'random' };
    }
  }

  // 8️⃣ Single ingredient fallback
  if (parsedQuery.type === 'unknown') {
    for (const ingredient of COMMON_INGREDIENTS) {
      if (normalizedQuery.includes(ingredient)) {
        parsedQuery = { type: 'ingredients', ingredients: [ingredient] };
        break;
      }
    }
  }

  // Attach filters
  parsedQuery.maxTime = maxTime;
  parsedQuery.difficulty = difficulty;
  parsedQuery.spiceLevel = spiceLevel;

  return parsedQuery;
};


// 🔹 Common filter helper (time, difficulty, spice, etc.)
const applyFilters = (recipes, filters = {}) => {
  let result = recipes;

  // ⏱ Max time filter (uses recipe.cookTime in minutes)
  if (filters.maxTime) {
    result = result.filter(r => typeof r.cookTime === 'number' && r.cookTime <= filters.maxTime);
  }

  // 🧩 Difficulty filter (easy / hard, etc.)
  if (filters.difficulty) {
    const diff = filters.difficulty.toLowerCase();
    result = result.filter(r =>
      r.difficulty &&
      r.difficulty.toLowerCase().includes(diff)
    );
  }

  // 🌶 Spice level filter (only if you store spiceLevel or tags)
  if (filters.spiceLevel) {
    const spice = filters.spiceLevel.toLowerCase();
    result = result.filter(r =>
      (r.spiceLevel && r.spiceLevel.toLowerCase().includes(spice)) ||
      (Array.isArray(r.tags) && r.tags.some(t => t.toLowerCase().includes(spice)))
    );
  }

  return result;
};


// 🔹 Search recipes by ingredients
const searchByIngredients = async (ingredients, filters = {}) => {
  try {
    const regexArray = ingredients.map(ing => ({
      'ingredients.name': { $regex: new RegExp(ing, 'i') }
    }));

    const recipes = await Recipe.find({ $or: regexArray }).limit(50);

    const rankedRecipes = recipes
      .map(recipe => {
        const matchCount = ingredients.filter(ing =>
          recipe.ingredients.some(rIng => new RegExp(ing, 'i').test(rIng.name))
        ).length;
        return { recipe, matchCount };
      })
      .sort((a, b) => b.matchCount - a.matchCount)
      .map(item => item.recipe);

    const filtered = applyFilters(rankedRecipes, filters);
    return filtered.slice(0, 10);
  } catch (error) {
    console.error('Search by ingredients error:', error);
    return [];
  }
};


// 🔹 Search recipes by cuisine
const searchByCuisine = async (cuisine, filters = {}) => {
  try {
    const recipes = await Recipe.find({
      cuisine: new RegExp(cuisine, 'i')
    }).limit(50);

    const filtered = applyFilters(recipes, filters);
    return filtered.slice(0, 10);
  } catch (error) {
    console.error('Search by cuisine error:', error);
    return [];
  }
};


// 🔹 Search recipes by category
const searchByCategory = async (category, filters = {}) => {
  try {
    const recipes = await Recipe.find({
      category: new RegExp(category, 'i')
    }).limit(50);

    const filtered = applyFilters(recipes, filters);
    return filtered.slice(0, 10);
  } catch (error) {
    console.error('Search by category error:', error);
    return [];
  }
};


// 🔹 Search recipes by dietary preferences
const searchByDietary = async (dietary, filters = {}) => {
  try {
    let query = {};
    if (dietary === 'vegetarian') {
      query = { 'ingredients.name': { $not: /meat|chicken|beef|pork|fish|seafood|lamb/i } };
    } else if (dietary === 'vegan') {
      query = { 'ingredients.name': { $not: /meat|chicken|beef|pork|fish|seafood|lamb|dairy|milk|cheese|egg|honey/i } };
    } else if (dietary === 'gluten free') {
      query = { 'ingredients.name': { $not: /wheat|flour|bread|pasta/i } };
    } else if (dietary === 'dairy free') {
      query = { 'ingredients.name': { $not: /milk|cheese|butter|cream|yogurt/i } };
    } else if (dietary === 'keto' || dietary === 'low carb') {
      query = { 'ingredients.name': { $not: /sugar|rice|bread|pasta|potato/i } };
    } else if (dietary === 'healthy') {
      query = { category: { $in: ['salad', 'soup', 'vegetable'] } };
    }

    const recipes = await Recipe.find(query).limit(50);
    const filtered = applyFilters(recipes, filters);
    return filtered.slice(0, 10);
  } catch (error) {
    console.error('Search by dietary error:', error);
    return [];
  }
};


// 🔹 Search recipes by name
const searchByName = async (recipeName, filters = {}) => {
  try {
    const recipes = await Recipe.find({
      $or: [
        { title: new RegExp(recipeName, 'i') },
        { tags: new RegExp(recipeName, 'i') }
      ]
    }).limit(50);

    const filtered = applyFilters(recipes, filters);
    return filtered.slice(0, 10);
  } catch (error) {
    console.error('Search by name error:', error);
    return [];
  }
};


// 🔹 Get random recipes
const getRandomRecipes = async (count, filters = {}) => {
  try {
    const recipes = await Recipe.aggregate([
      { $sample: { size: count * 3 } } // sample more then filter
    ]);

    const filtered = applyFilters(recipes, filters);
    return filtered.slice(0, count);
  } catch (error) {
    console.error('Get random recipes error:', error);
    return [];
  }
};


// 🔹 Generate response messages
const generateIngredientResponse = (recipes, ingredients) => {
  if (recipes.length === 0) {
    return `I couldn't find any recipes with ${ingredients.join(' or ')}. Try different ingredients or be more specific!`;
  }

  const ingredientStr = ingredients.join(', ').replace(/, ([^,]*)$/, ' and $1');
  let message = `Here are some recipes that use ${ingredientStr}:\n\n`;

  recipes.slice(0, 3).forEach((recipe, index) => {
    message += `${index + 1}. ${recipe.title}`;
    if (recipe.cuisine) message += ` (${recipe.cuisine})`;
    if (recipe.category) message += ` – ${recipe.category}`;
    if (recipe.cookTime) message += ` – ${recipe.cookTime} mins`;
    message += `\n`;
  });

  if (recipes.length > 3) {
    message += `\nAnd ${recipes.length - 3} more recipes!`;
  }

  message += `\n\nTap a recipe from the list below to see full details.`;

  return message;
};

const generateCuisineResponse = (recipes, cuisine) => {
  if (recipes.length === 0) {
    return `I don't have any ${cuisine} recipes in my collection yet. Would you like to try a different cuisine?`;
  }

  let message = `Here are some amazing ${cuisine} dishes:\n\n`;

  recipes.slice(0, 3).forEach((recipe, index) => {
    message += `${index + 1}. ${recipe.title} (${recipe.category})\n`;
  });

  if (recipes.length > 3) {
    message += `\nAnd ${recipes.length - 3} more ${cuisine} recipes!`;
  }

  return message;
};

const generateCategoryResponse = (recipes, category) => {
  if (recipes.length === 0) {
    return `I couldn't find any ${category} recipes. Try a different category like breakfast, lunch, or dinner!`;
  }

  let message = `Perfect for ${category}! Here are some options:\n\n`;

  recipes.slice(0, 3).forEach((recipe, index) => {
    message += `${index + 1}. ${recipe.title} (${recipe.cuisine})\n`;
  });

  if (recipes.length > 3) {
    message += `\nAnd ${recipes.length - 3} more ${category} recipes!`;
  }

  return message;
};

const generateSpecificRecipeResponse = (recipes, recipeName) => {
  if (recipes.length === 0) {
    return `I don't have a recipe for ${recipeName} yet. Would you like me to suggest similar dishes?`;
  }

  let message = `Here are some ${recipeName} recipes:\n\n`;

  recipes.slice(0, 3).forEach((recipe, index) => {
    message += `${index + 1}. ${recipe.title} (${recipe.cuisine}, ${recipe.difficulty})\n`;
  });

  if (recipes.length > 3) {
    message += `\nAnd ${recipes.length - 3} more ${recipeName} recipes!`;
  }

  return message;
};

const generateDietaryResponse = (recipes, dietary) => {
  if (recipes.length === 0) {
    return `I couldn't find any ${dietary} recipes in my collection. Would you like to try a different dietary preference?`;
  }

  let message = `Here are some great ${dietary} options:\n\n`;

  recipes.slice(0, 3).forEach((recipe, index) => {
    message += `${index + 1}. ${recipe.title} (${recipe.cuisine}, ${recipe.category})\n`;
  });

  if (recipes.length > 3) {
    message += `\nAnd ${recipes.length - 3} more ${dietary} recipes!`;
  }

  return message;
};

const generateRandomResponse = (recipes) => {
  if (recipes.length === 0) {
    return "I don't have any recipes in my collection yet. Please check back later!";
  }

  let message = `Here are some recipe suggestions:\n\n`;

  recipes.forEach((recipe, index) => {
    message += `${index + 1}. ${recipe.title} (${recipe.cuisine}, ${recipe.category})\n`;
  });

  return message;
};


// 🔹 MAIN: Process chatbot queries and return recipe suggestions
const processQuery = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        message: 'Message is required and must be a string'
      });
    }

    const query = message.toLowerCase().trim();

    // Parse the query to determine what the user is asking for
    const parsedQuery = parseUserQuery(query);

    let recipes = [];
    let responseMessage = '';

    const filters = {
      maxTime: parsedQuery.maxTime,
      difficulty: parsedQuery.difficulty,
      spiceLevel: parsedQuery.spiceLevel
    };

    // Handle different types of queries
    if (parsedQuery.type === 'ingredients') {
      recipes = await searchByIngredients(parsedQuery.ingredients, filters);
      responseMessage = generateIngredientResponse(recipes, parsedQuery.ingredients);
    } else if (parsedQuery.type === 'dietary') {
      recipes = await searchByDietary(parsedQuery.dietary, filters);
      responseMessage = generateDietaryResponse(recipes, parsedQuery.dietary);
    } else if (parsedQuery.type === 'cuisine') {
      recipes = await searchByCuisine(parsedQuery.cuisine, filters);
      responseMessage = generateCuisineResponse(recipes, parsedQuery.cuisine);
    } else if (parsedQuery.type === 'category') {
      recipes = await searchByCategory(parsedQuery.category, filters);
      responseMessage = generateCategoryResponse(recipes, parsedQuery.category);
    } else if (parsedQuery.type === 'specific_recipe') {
      recipes = await searchByName(parsedQuery.recipeName, filters);
      responseMessage = generateSpecificRecipeResponse(recipes, parsedQuery.recipeName);
    } else if (parsedQuery.type === 'random') {
      recipes = await getRandomRecipes(3, filters);
      responseMessage = generateRandomResponse(recipes);
    } else {
      // Default response for unrecognized queries
      responseMessage =
        "I'm your friendly recipe assistant! 😊 You can ask me for recipes by ingredients (like 'I have chicken'), dietary preferences , cuisine (like 'Italian food'), or specific dishes (like 'pizza'). What would you like to cook today?";
    }

    // ✅ Log chat
    await ChatLog.create({
      userMessage: message,
      botMessage: responseMessage,
      parsedQuery,
      queryType: parsedQuery.type,
      recipesReturned: recipes.slice(0, 5).map(r => r._id)
    });

    return res.json({
      message: responseMessage,
      recipes: recipes.slice(0, 5), // Limit to 5 recipes for chat
      queryType: parsedQuery.type
    });

  } catch (error) {
    console.error('Chatbot query error:', error);
    return res.status(500).json({
      message: 'Sorry, I encountered an error while processing your request. Please try again.',
      recipes: []
    });
  }
};

// (like 'vegetarian recipes')
module.exports = {
  processQuery
};
