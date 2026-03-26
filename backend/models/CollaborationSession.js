const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    isOnline: {
        type: Boolean,
        default: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    senderName: {
        type: String,
        trim: true,
        default: 'CookOnWeb'
    },
    content: {
        type: String,
        trim: true,
        required: true,
        maxlength: 1000
    },
    type: {
        type: String,
        enum: ['text', 'system'],
        default: 'text'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const collaborationSessionSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        maxlength: 150
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        default: null
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [participantSchema],
    messages: [messageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

collaborationSessionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('CollaborationSession', collaborationSessionSchema);
