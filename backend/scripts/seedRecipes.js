const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const sampleRecipes = require('../data/sampleRecipes');

const shouldResetRecipes = () =>
    process.argv.includes('--reset') || String(process.env.RESET_RECIPES || '').toLowerCase() === 'true';

const seedRecipes = async () => {
    try {
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cookonweb';
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find or create a default user for recipes
        let user = await User.findOne();
        if (!user) {
            user = new User({
                username: 'chefadmin',
                email: 'admin@cookonweb.com',
                password: 'tempPassword123', // This should be hashed in production
                firstName: 'Chef',
                lastName: 'Admin'
            });
            await user.save();
            console.log('Created default user for recipes');
        }

        const resetRecipes = shouldResetRecipes();

        if (resetRecipes) {
            await Recipe.deleteMany({});
            console.log('Cleared existing recipes because reset mode is enabled');

            const recipesWithAuthor = sampleRecipes.map(recipe => ({
                ...recipe,
                author: user._id
            }));

            await Recipe.insertMany(recipesWithAuthor);
            console.log(`Added ${sampleRecipes.length} sample recipes`);
        } else {
            const sampleTitles = sampleRecipes.map((recipe) => recipe.title);
            const existingRecipes = await Recipe.find({ title: { $in: sampleTitles } }).select('title');
            const existingTitles = new Set(existingRecipes.map((recipe) => recipe.title));

            const recipesToInsert = sampleRecipes
                .filter((recipe) => !existingTitles.has(recipe.title))
                .map((recipe) => ({
                    ...recipe,
                    author: user._id
                }));

            if (recipesToInsert.length) {
                await Recipe.insertMany(recipesToInsert);
            }

            console.log(`Preserved existing recipes and added ${recipesToInsert.length} missing sample recipes`);
            console.log('Use --reset or RESET_RECIPES=true if you want to replace all recipes');
        }

        console.log('Recipe seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding recipes:', error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    seedRecipes();
}

module.exports = seedRecipes;
