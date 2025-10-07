const Recipe = require('../models/Recipe');

// Process chatbot queries and return recipe suggestions
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

        // Handle different types of queries
        if (parsedQuery.type === 'ingredients') {
            recipes = await searchByIngredients(parsedQuery.ingredients);
            responseMessage = generateIngredientResponse(recipes, parsedQuery.ingredients);
        } else if (parsedQuery.type === 'dietary') {
            recipes = await searchByDietary(parsedQuery.dietary);
            responseMessage = generateDietaryResponse(recipes, parsedQuery.dietary);
        } else if (parsedQuery.type === 'cuisine') {
            recipes = await searchByCuisine(parsedQuery.cuisine);
            responseMessage = generateCuisineResponse(recipes, parsedQuery.cuisine);
        } else if (parsedQuery.type === 'category') {
            recipes = await searchByCategory(parsedQuery.category);
            responseMessage = generateCategoryResponse(recipes, parsedQuery.category);
        } else if (parsedQuery.type === 'specific_recipe') {
            recipes = await searchByName(parsedQuery.recipeName);
            responseMessage = generateSpecificRecipeResponse(recipes, parsedQuery.recipeName);
        } else if (parsedQuery.type === 'random') {
            recipes = await getRandomRecipes(3);
            responseMessage = generateRandomResponse(recipes);
        } else {
            // Default response for unrecognized queries
            responseMessage = "I'm your friendly recipe assistant! 😊 You can ask me for recipes by ingredients (like 'I have chicken'), dietary preferences (like 'vegetarian recipes'), cuisine (like 'Italian food'), or specific dishes (like 'pizza'). What would you like to cook today?";
        }

        res.json({
            message: responseMessage,
            recipes: recipes.slice(0, 5), // Limit to 5 recipes for chat
            queryType: parsedQuery.type
        });

    } catch (error) {
        console.error('Chatbot query error:', error);
        res.status(500).json({
            message: 'Sorry, I encountered an error while processing your request. Please try again.',
            recipes: []
        });
    }
};

// Parse user query to determine intent
const parseUserQuery = (query) => {
    // Normalize query
    const normalizedQuery = query.toLowerCase().trim();

    // Check for ingredient-based queries with more keywords
    // Check for ingredient-based queries with improved multi-ingredient parsing
const ingredientKeywords = ['with', 'using', 'made with', 'containing', 'have', 'i have', 'using only', 'recipes with', 'cook with', 'make with'];
for (const keyword of ingredientKeywords) {
    if (normalizedQuery.includes(keyword)) {
        const parts = normalizedQuery.split(keyword);
        if (parts.length > 1) {
            const ingredientPart = parts[1].trim();

            // Split on commas, 'and', or 'or'
            const ingredients = ingredientPart
                .split(/\s*(?:,|and|or|\&)\s*/)
                .map(i => i.trim())
                .filter(i => i.length > 0 && i.length > 1);

            if (ingredients.length > 0) {
                return { type: 'ingredients', ingredients };
            }
        }
    }
}


    // Expanded common ingredients
    const commonIngredients = ['potato', 'rice', 'chicken', 'paneer', 'tomato', 'onion', 'garlic', 'carrot', 'beans', 'peas', 'corn', 'spinach', 'mushroom', 'beef', 'pork', 'fish', 'egg', 'cheese', 'milk', 'flour', 'sugar', 'butter', 'oil', 'salt', 'pepper', 'bread', 'pasta', 'noodle'];
    for (const ingredient of commonIngredients) {
        if (normalizedQuery.includes(ingredient)) {
            return { type: 'ingredients', ingredients: [ingredient] };
        }
    }

    // Check for dietary preferences
    const dietaryKeywords = ['vegetarian', 'vegan', 'gluten free', 'dairy free', 'keto', 'low carb', 'healthy'];
    for (const diet of dietaryKeywords) {
        if (normalizedQuery.includes(diet.replace(' ', ''))) {
            return { type: 'dietary', dietary: diet };
        }
    }

    // Check for cuisine queries with more options
    const cuisines = ['italian', 'indian', 'chinese', 'mexican', 'thai', 'japanese', 'french', 'greek', 'spanish', 'american', 'mediterranean', 'korean', 'vietnamese', 'turkish', 'lebanese'];
    for (const cuisine of cuisines) {
        if (normalizedQuery.includes(cuisine)) {
            return { type: 'cuisine', cuisine };
        }
    }

    // Check for category queries with more options
    const categories = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'appetizer', 'main course', 'salad', 'soup', 'starter', 'side dish'];
    for (const category of categories) {
        if (normalizedQuery.includes(category)) {
            return { type: 'category', category };
        }
    }

    // Check for specific recipe names with more options
    const recipeNames = ['pizza', 'pasta', 'curry', 'chicken', 'beef', 'fish', 'salad', 'soup', 'cake', 'cookies', 'bread', 'burger', 'sandwich', 'stir fry', 'roast', 'grill', 'bake'];
    for (const recipeName of recipeNames) {
        if (normalizedQuery.includes(recipeName)) {
            return { type: 'specific_recipe', recipeName };
        }
    }

    // Check for general recipe requests
    if (normalizedQuery.includes('recipe') || normalizedQuery.includes('cook') || normalizedQuery.includes('food') || normalizedQuery.includes('dish') || normalizedQuery.includes('something') || normalizedQuery.includes('suggest')) {
        return { type: 'random' };
    }

    return { type: 'unknown' };
};

// Search recipes by ingredients
const searchByIngredients = async (ingredients) => {
    try {
        // Create a case-insensitive regex for each ingredient
        const regexArray = ingredients.map(ing => ({
            'ingredients.name': { $regex: new RegExp(ing, 'i') }
        }));

        // Step 1: Find recipes that match ANY of the ingredients
        const recipes = await Recipe.find({ $or: regexArray }).limit(20);

        // Step 2: Rank recipes by number of matched ingredients
        const rankedRecipes = recipes
            .map(recipe => {
                const matchCount = ingredients.filter(ing =>
                    recipe.ingredients.some(rIng => new RegExp(ing, 'i').test(rIng.name))
                ).length;
                return { recipe, matchCount };
            })
            .sort((a, b) => b.matchCount - a.matchCount)
            .map(item => item.recipe);

        return rankedRecipes.slice(0, 10); // top 10 ranked results
    } catch (error) {
        console.error('Search by ingredients error:', error);
        return [];
    }
};


// Search recipes by cuisine
const searchByCuisine = async (cuisine) => {
    try {
        const recipes = await Recipe.find({
            cuisine: new RegExp(cuisine, 'i')
        }).limit(10);

        return recipes;
    } catch (error) {
        console.error('Search by cuisine error:', error);
        return [];
    }
};

// Search recipes by category
const searchByCategory = async (category) => {
    try {
        const recipes = await Recipe.find({
            category: new RegExp(category, 'i')
        }).limit(10);

        return recipes;
    } catch (error) {
        console.error('Search by category error:', error);
        return [];
    }
};

// Search recipes by dietary preferences
const searchByDietary = async (dietary) => {
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
        } else if (dietary === 'keto') {
            query = { 'ingredients.name': { $not: /sugar|rice|bread|pasta|potato/i } };
        } else if (dietary === 'low carb') {
            query = { 'ingredients.name': { $not: /sugar|rice|bread|pasta|potato/i } };
        } else if (dietary === 'healthy') {
            query = { category: { $in: ['salad', 'soup', 'vegetable'] } };
        }

        const recipes = await Recipe.find(query).limit(10);
        return recipes;
    } catch (error) {
        console.error('Search by dietary error:', error);
        return [];
    }
};

// Search recipes by name
const searchByName = async (recipeName) => {
    try {
        const recipes = await Recipe.find({
            $or: [
                { title: new RegExp(recipeName, 'i') },
                { tags: new RegExp(recipeName, 'i') }
            ]
        }).limit(10);

        return recipes;
    } catch (error) {
        console.error('Search by name error:', error);
        return [];
    }
};

// Get random recipes
const getRandomRecipes = async (count) => {
    try {
        const recipes = await Recipe.aggregate([
            { $sample: { size: count } }
        ]);

        return recipes;
    } catch (error) {
        console.error('Get random recipes error:', error);
        return [];
    }
};

// Generate response messages
const generateIngredientResponse = (recipes, ingredients) => {
    if (recipes.length === 0) {
        return `I couldn't find any recipes with ${ingredients.join(' or ')}. Try different ingredients or be more specific!`;
    }

    const ingredientStr = ingredients.join(', ').replace(/, ([^,]*)$/, ' and $1');
let message = `Here are some recipes that use ${ingredientStr}:\n\n`;


    recipes.slice(0, 3).forEach((recipe, index) => {
        message += `${index + 1}. ${recipe.title} (${recipe.cuisine})\n`;
    });

    if (recipes.length > 3) {
        message += `\nAnd ${recipes.length - 3} more recipes!`;
    }

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

module.exports = {
    processQuery
};
