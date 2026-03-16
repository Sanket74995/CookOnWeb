const express = require('express');
const auth = require('../middleware/auth');
const {
    getUserCollections,
    getPublicCollections,
    getCollectionById,
    createCollection,
    updateCollection,
    deleteCollection,
    addRecipeToCollection,
    removeRecipeFromCollection
} = require('../controllers/collectionController');

const router = express.Router();

// GET /api/collections - Get current user's collections
router.get('/', auth, getUserCollections);

// GET /api/collections/public - Get public collections
router.get('/public', getPublicCollections);

// GET /api/collections/:id - Get collection by ID
router.get('/:id', auth, getCollectionById);

// POST /api/collections - Create new collection
router.post('/', auth, createCollection);

// PUT /api/collections/:id - Update collection
router.put('/:id', auth, updateCollection);

// DELETE /api/collections/:id - Delete collection
router.delete('/:id', auth, deleteCollection);

// POST /api/collections/:id/recipes - Add recipe to collection
router.post('/:id/recipes', auth, addRecipeToCollection);

// DELETE /api/collections/:id/recipes/:recipeId - Remove recipe from collection
router.delete('/:id/recipes/:recipeId', auth, removeRecipeFromCollection);

module.exports = router;