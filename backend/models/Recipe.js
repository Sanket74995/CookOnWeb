const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    translations: {
        en: {
            title: { type: String, trim: true, maxlength: 100 },
            description: { type: String, maxlength: 500 },
            ingredients: [{
                name: { type: String, trim: true },
                quantity: { type: String, trim: true },
                unit: { type: String, trim: true }
            }],
            instructions: [{
                step: { type: Number, min: 1 },
                description: { type: String, maxlength: 500 }
            }]
        },
        hi: {
            title: { type: String, trim: true, maxlength: 100 },
            description: { type: String, maxlength: 500 },
            ingredients: [{
                name: { type: String, trim: true },
                quantity: { type: String, trim: true },
                unit: { type: String, trim: true }
            }],
            instructions: [{
                step: { type: Number, min: 1 },
                description: { type: String, maxlength: 500 }
            }]
        }
    },
    image: {
        type: String,
        required: true
    },
    video: {
        type: String,
        default: ''
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    cuisine: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    category: {
        type: String,
        required: true,
        enum: ['appetizer', 'breakfast', 'lunch', 'dinner', 'main course', 'dessert', 'beverage', 'snack', 'salad', 'soup', 'bread'],
        trim: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    prepTime: {
        type: Number,
        required: true,
        min: 0
    },
    cookTime: {
        type: Number,
        required: true,
        min: 0
    },
    servings: {
        type: Number,
        required: true,
        min: 1
    },
    ingredients: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: String,
            required: true,
            trim: true
        },
        unit: {
            type: String,
            trim: true
        }
    }],
    instructions: [{
        step: {
            type: Number,
            required: true,
            min: 1
        },
        description: {
            type: String,
            required: true,
            maxlength: 500
        }
    }],
    nutrition: {
        calories: {
            type: Number,
            min: 0
        },
        protein: {
            type: Number,
            min: 0
        },
        carbs: {
            type: Number,
            min: 0
        },
        fat: {
            type: Number,
            min: 0
        }
    },
    tags: [{
        type: String,
        trim: true
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    reviews: [reviewSchema]
});

// Update the updatedAt field before saving
recipeSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Index for better search performance
recipeSchema.index({ title: 'text', description: 'text', cuisine: 'text', tags: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
