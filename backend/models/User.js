const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    }],
    pantry: [{
        name: {
            type: String,
            trim: true,
            required: true
        },
        quantity: {
            type: String,
            trim: true,
            default: ''
        },
        unit: {
            type: String,
            trim: true,
            default: ''
        },
        category: {
            type: String,
            trim: true,
            default: 'general'
        },
        inStock: {
            type: Boolean,
            default: true
        }
    }],
    familyGroups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamilyGroup'
    }],
    settings: {
        language: {
            type: String,
            default: 'en'
        },
        theme: {
            type: String,
            default: 'light'
        },
        emailNotifications: {
            type: Boolean,
            default: true
        },
        recipeUpdates: {
            type: Boolean,
            default: true
        },
        foodProfile: {
            goal: {
                type: String,
                default: 'balanced'
            },
            conditions: [{
                type: String,
                trim: true
            }],
            preferredCuisines: [{
                type: String,
                trim: true
            }],
            avoidIngredients: [{
                type: String,
                trim: true
            }],
            calorieTarget: {
                type: Number,
                default: 0
            }
        },
        nutritionGoals: {
            calories: {
                type: Number,
                default: 2000
            },
            protein: {
                type: Number,
                default: 150
            },
            carbs: {
                type: Number,
                default: 250
            },
            fat: {
                type: Number,
                default: 67
            },
            fiber: {
                type: Number,
                default: 25
            }
        },
        recommendationProfile: {
            skillLevel: {
                type: String,
                default: 'intermediate'
            }
        }
    },
    subscription: {
        plan: {
            type: String,
            default: 'free'
        },
        status: {
            type: String,
            default: 'active'
        },
        startedAt: {
            type: Date,
            default: Date.now
        },
        billingCycle: {
            type: String,
            default: 'monthly'
        },
        renewalAt: {
            type: Date
        },
        cancelledAt: {
            type: Date
        },
        expiresAt: {
            type: Date
        }
    }
});

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);
