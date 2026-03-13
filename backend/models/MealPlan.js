const mongoose = require('mongoose');

const mealPlanEntrySchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    servings: {
        type: Number,
        min: 1,
        default: 1
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 200,
        default: ''
    }
}, { _id: true });

const mealPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    familyGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamilyGroup',
        default: null,
        index: true
    },
    weekStart: {
        type: String,
        required: true
    },
    entries: [mealPlanEntrySchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

mealPlanSchema.index(
    { user: 1, familyGroup: 1, weekStart: 1 },
    { unique: true }
);

mealPlanSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);
