const express = require('express');
const { processQuery } = require('../controllers/chatbotController');

const router = express.Router();

// POST /api/chatbot/query - Process chatbot query
router.post('/query', processQuery);

module.exports = router;
