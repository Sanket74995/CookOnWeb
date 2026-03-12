const express = require('express');
const { processQuery, submitFeedback } = require('../controllers/chatbotController');

const router = express.Router();

// POST /api/chatbot/query - Process chatbot query
router.post('/query', processQuery);
router.post('/feedback', submitFeedback);

module.exports = router;
