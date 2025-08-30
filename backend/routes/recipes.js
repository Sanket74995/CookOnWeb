const express = require('express');
const {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes
} = require('../controllers/recipeController');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/recipes - Get all recipes
router.get('/', getAllRecipes);

// GET /api/recipes/search - Search recipes
router.get('/search', searchRecipes);

// GET /api/recipes/:id - Get recipe by ID
router.get('/:id', getRecipeById);

// POST /api/recipes - Create new recipe (protected)
router.post('/', auth, createRecipe);

// PUT /api/recipes/:id - Update recipe (protected)
router.put('/:id', auth, updateRecipe);

// DELETE /api/recipes/:id - Delete recipe (protected)
router.delete('/:id', auth, deleteRecipe);

module.exports = router;
