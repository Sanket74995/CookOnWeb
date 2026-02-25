const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes
} = require('../controllers/recipeController');


const router = express.Router();
const storage = multer.diskStorage({
  destination: 'uploads', // make sure this folder exists
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
});


// GET /api/recipes - Get all recipes
router.get('/', getAllRecipes);

// GET /api/recipes/search - Search recipes
router.get('/search', searchRecipes);

// GET /api/recipes/:id - Get recipe by ID
router.get('/:id', getRecipeById);

// POST /api/recipes - Create new recipe (protected)
router.post('/', auth, upload.single('image'), createRecipe);

// PUT /api/recipes/:id - Update recipe (protected)
router.put('/:id', auth, updateRecipe);

// DELETE /api/recipes/:id - Delete recipe (protected)
router.delete('/:id', auth, deleteRecipe);

module.exports = router;
