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
            responseMessage = "I'm here to help you find recipes! You can ask me for recipes by ingredients (like 'chicken recipes'), cuisine (like 'Italian food'), or specific dishes (like 'pizza'). What would you like to cook?";
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

const parseUserQuery = (query) => {
    // Check for ingredient-based queries
    const ingredientKeywords = ['with', 'using', 'made with', 'containing', 'have'];
    for (const keyword of ingredientKeywords) {
        if (query.includes(keyword)) {
            const parts = query.split(keyword);
            if (parts.length > 1) {
                const ingredients = parts[1].trim().split(/[,&\sand]+/).map(i => i.trim()).filter(i => i.length > 0);
                return { type: 'ingredients', ingredients };
            }
        }
    }

    // If query contains common ingredient names directly, treat as ingredients query
    const commonIngredients = ['potato', 'rice', 'chicken', 'paneer', 'tomato', 'onion', 'garlic', 'carrot', 'beans', 'peas', 'corn', 'spinach', 'mushroom'];
    for (const ingredient of commonIngredients) {
        if (query.includes(ingredient)) {
            return { type: 'ingredients', ingredients: [ingredient] };
        }
    }

    // Check for cuisine queries
    const cuisines = ['italian', 'indian', 'chinese', 'mexican', 'thai', 'japanese', 'french', 'greek', 'spanish', 'american', 'mediterranean'];
    for (const cuisine of cuisines) {
        if (query.includes(cuisine)) {
            return { type: 'cuisine', cuisine };
        }
    }

    // Check for category queries
    const categories = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'appetizer', 'main course', 'salad', 'soup'];
    for (const category of categories) {
        if (query.includes(category)) {
            return { type: 'category', category };
        }
    }

    // Check for specific recipe names
    const recipeNames = ['pizza', 'pasta', 'curry', 'chicken', 'beef', 'fish', 'salad', 'soup', 'cake', 'cookies', 'bread'];
    for (const recipeName of recipeNames) {
        if (query.includes(recipeName)) {
            return { type: 'specific_recipe', recipeName };
        }
    }

    // Check for general recipe requests
    if (query.includes('recipe') || query.includes('cook') || query.includes('food') || query.includes('dish')) {
        return { type: 'random' };
    }

    return { type: 'unknown' };
};

// Search recipes by ingredients
const searchByIngredients = async (ingredients) => {
    try {
        const ingredientRegex = ingredients.map(ing => new RegExp(ing, 'i'));
        const recipes = await Recipe.find({
            $or: ingredientRegex.map(regex => ({
                'ingredients.name': { $regex: regex }
            }))
        }).limit(10);

        return recipes;
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

    const ingredientStr = ingredients.join(' and ');
    let message = `Here are some delicious recipes using ${ingredientStr}:\n\n`;

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
