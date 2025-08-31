const Recipe = require('../models/Recipe');

// Get all recipes
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate('author', 'firstName lastName username')
            .sort({ createdAt: -1 });

        res.json(recipes);
    } catch (error) {
        console.error('Get recipes error:', error);
        res.status(500).json({ message: 'Server error while fetching recipes' });
    }
};

// Get recipe by ID
const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('author', 'firstName lastName username');

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (error) {
        console.error('Get recipe error:', error);
        res.status(500).json({ message: 'Server error while fetching recipe' });
    }
};

// Create new recipe
const createRecipe = async (req, res) => {
    try {
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
            servings,
            ingredients,
            instructions,
            nutrition,
            tags
        } = req.body;

        // Validate required fields
        if (!title || !description || !image || !cuisine || !category || !ingredients || !instructions) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newRecipe = new Recipe({
            title,
            description,
            image,
            video: video || '',
            cuisine,
            category,
            difficulty,
            prepTime,
            cookTime,
            servings,
            ingredients,
            instructions,
            nutrition,
            tags,
            author: req.userId // Assuming userId is set from auth middleware
        });

        await newRecipe.save();

        // Populate author info
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

// Update recipe
const updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Check if user is the author
        if (recipe.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to update this recipe' });
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).populate('author', 'firstName lastName username');

        res.json({
            message: 'Recipe updated successfully',
            recipe: updatedRecipe
        });
    } catch (error) {
        console.error('Update recipe error:', error);
        res.status(500).json({ message: 'Server error while updating recipe' });
    }
};

// Delete recipe
const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Check if user is the author
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

// Search recipes
const searchRecipes = async (req, res) => {
    try {
        const { query, cuisine, category, difficulty } = req.query;
        let searchCriteria = {};

        if (query) {
            searchCriteria.$text = { $search: query };
        }
        if (cuisine) {
            searchCriteria.cuisine = cuisine;
        }
        if (category) {
            searchCriteria.category = category;
        }
        if (difficulty) {
            searchCriteria.difficulty = difficulty;
        }

        const recipes = await Recipe.find(searchCriteria)
            .populate('author', 'firstName lastName username')
            .sort({ createdAt: -1 });

        res.json(recipes);
    } catch (error) {
        console.error('Search recipes error:', error);
        res.status(500).json({ message: 'Server error while searching recipes' });
    }
};

module.exports = {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes
};
