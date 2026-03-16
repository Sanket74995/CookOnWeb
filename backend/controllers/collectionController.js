const Collection = require('../models/Collection');
const Recipe = require('../models/Recipe');

// Get all collections for the current user
const getUserCollections = async (req, res) => {
    try {
        const collections = await Collection.find({ author: req.userId })
            .populate('recipes', 'title image rating cuisine category')
            .sort({ updatedAt: -1 });

        res.json(collections);
    } catch (error) {
        console.error('Get user collections error:', error);
        res.status(500).json({ message: 'Server error while fetching collections' });
    }
};

// Get public collections
const getPublicCollections = async (req, res) => {
    try {
        const collections = await Collection.find({ isPublic: true })
            .populate('author', 'firstName lastName username')
            .populate('recipes', 'title image rating cuisine category')
            .sort({ updatedAt: -1 })
            .limit(20);

        res.json(collections);
    } catch (error) {
        console.error('Get public collections error:', error);
        res.status(500).json({ message: 'Server error while fetching public collections' });
    }
};

// Get collection by ID
const getCollectionById = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id)
            .populate('author', 'firstName lastName username')
            .populate('recipes', 'title description image rating cuisine category prepTime cookTime servings');

        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        // Check if user can view this collection
        if (!collection.isPublic && collection.author._id.toString() !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(collection);
    } catch (error) {
        console.error('Get collection by ID error:', error);
        res.status(500).json({ message: 'Server error while fetching collection' });
    }
};

// Create new collection
const createCollection = async (req, res) => {
    try {
        const { name, description, isPublic, tags, recipes } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: 'Collection name is required' });
        }

        // Validate recipes exist and user has access
        if (recipes && recipes.length > 0) {
            const existingRecipes = await Recipe.find({
                _id: { $in: recipes },
                $or: [
                    { author: req.userId },
                    { 'reviews.0': { $exists: true } } // Public recipes with reviews
                ]
            });

            const validRecipeIds = existingRecipes.map(r => r._id.toString());
            const filteredRecipes = recipes.filter(id => validRecipeIds.includes(id));
        }

        const collection = new Collection({
            name: name.trim(),
            description: description ? description.trim() : '',
            author: req.userId,
            isPublic: isPublic || false,
            tags: tags || [],
            recipes: recipes || []
        });

        await collection.save();
        await collection.populate('recipes', 'title image rating cuisine category');

        res.status(201).json({
            message: 'Collection created successfully',
            collection
        });
    } catch (error) {
        console.error('Create collection error:', error);
        res.status(500).json({ message: 'Server error while creating collection' });
    }
};

// Update collection
const updateCollection = async (req, res) => {
    try {
        const { name, description, isPublic, tags, recipes } = req.body;

        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        if (collection.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (name !== undefined) {
            if (!name || name.trim().length === 0) {
                return res.status(400).json({ message: 'Collection name is required' });
            }
            collection.name = name.trim();
        }

        if (description !== undefined) {
            collection.description = description ? description.trim() : '';
        }

        if (isPublic !== undefined) {
            collection.isPublic = isPublic;
        }

        if (tags !== undefined) {
            collection.tags = tags || [];
        }

        if (recipes !== undefined) {
            // Validate recipes exist
            if (recipes.length > 0) {
                const existingRecipes = await Recipe.find({
                    _id: { $in: recipes },
                    $or: [
                        { author: req.userId },
                        { 'reviews.0': { $exists: true } }
                    ]
                });

                const validRecipeIds = existingRecipes.map(r => r._id.toString());
                collection.recipes = recipes.filter(id => validRecipeIds.includes(id));
            } else {
                collection.recipes = [];
            }
        }

        await collection.save();
        await collection.populate('recipes', 'title image rating cuisine category');

        res.json({
            message: 'Collection updated successfully',
            collection
        });
    } catch (error) {
        console.error('Update collection error:', error);
        res.status(500).json({ message: 'Server error while updating collection' });
    }
};

// Delete collection
const deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        if (collection.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await Collection.findByIdAndDelete(req.params.id);

        res.json({ message: 'Collection deleted successfully' });
    } catch (error) {
        console.error('Delete collection error:', error);
        res.status(500).json({ message: 'Server error while deleting collection' });
    }
};

// Add recipe to collection
const addRecipeToCollection = async (req, res) => {
    try {
        const { recipeId } = req.body;

        const collection = await Collection.findById(req.params.id);
        const recipe = await Recipe.findById(recipeId);

        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (collection.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Check if recipe is already in collection
        if (collection.recipes.includes(recipeId)) {
            return res.status(400).json({ message: 'Recipe already in collection' });
        }

        collection.recipes.push(recipeId);
        await collection.save();

        res.json({ message: 'Recipe added to collection successfully' });
    } catch (error) {
        console.error('Add recipe to collection error:', error);
        res.status(500).json({ message: 'Server error while adding recipe to collection' });
    }
};

// Remove recipe from collection
const removeRecipeFromCollection = async (req, res) => {
    try {
        const { recipeId } = req.params;

        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        if (collection.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        collection.recipes = collection.recipes.filter(id => id.toString() !== recipeId);
        await collection.save();

        res.json({ message: 'Recipe removed from collection successfully' });
    } catch (error) {
        console.error('Remove recipe from collection error:', error);
        res.status(500).json({ message: 'Server error while removing recipe from collection' });
    }
};

module.exports = {
    getUserCollections,
    getPublicCollections,
    getCollectionById,
    createCollection,
    updateCollection,
    deleteCollection,
    addRecipeToCollection,
    removeRecipeFromCollection
};