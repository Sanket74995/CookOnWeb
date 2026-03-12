const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  sessionId: {
    type: String,
    default: ''
  },
  userMessage: String,
  botMessage: String,
  parsedQuery: Object,
  queryType: String,
  recipesReturned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  helpful: {
    type: Boolean,
    default: null
  },
  clickedRecipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    default: null
  },
  feedbackNote: {
    type: String,
    default: ''
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatLog', chatLogSchema);
