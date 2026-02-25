// models/ChatLog.js
const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
  userMessage: String,
  botMessage: String,
  parsedQuery: Object,
  queryType: String,
  recipesReturned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatLog', chatLogSchema);
