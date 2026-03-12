const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const {
    addReview,
    getAllRecipes,
    getMyRecipes,
    getRecommendedRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes
} = require('../controllers/recipeController');


const router = express.Router();
const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
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

// GET /api/recipes/mine - Get current user's recipes
router.get('/mine', auth, getMyRecipes);

// GET /api/recipes/recommended - Get food-profile based recommendations
router.get('/recommended', auth, getRecommendedRecipes);

// GET /api/recipes/:id - Get recipe by ID
router.get('/:id', getRecipeById);

// POST /api/recipes - Create new recipe (protected)
router.post('/', auth, upload.single('image'), createRecipe);

// PUT /api/recipes/:id - Update recipe (protected)
router.put('/:id', auth, upload.single('image'), updateRecipe);

// DELETE /api/recipes/:id - Delete recipe (protected)
router.delete('/:id', auth, deleteRecipe);

// POST /api/recipes/:id/reviews - Add or update a review
router.post('/:id/reviews', auth, addReview);

module.exports = router;
