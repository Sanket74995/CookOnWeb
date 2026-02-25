// routes/chatbotAdmin.js
const express = require('express');
const ChatLog = require('../models/ChatLog');
const router = express.Router();

// Get unknown / failed queries
router.get('/unknown', async (req, res) => {
  try {
    const logs = await ChatLog.find({ queryType: 'unknown' })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching logs' });
  }
});

module.exports = router;
