const express = require('express');
const auth = require('../middleware/auth');
const {
    createSession,
    joinSession,
    addMessage
} = require('../controllers/collaborationController');

const router = express.Router();

router.post('/sessions', auth, createSession);
router.post('/sessions/:id/join', auth, joinSession);
router.post('/sessions/:id/messages', auth, addMessage);

module.exports = router;
