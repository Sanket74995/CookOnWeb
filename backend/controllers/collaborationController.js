const CollaborationSession = require('../models/CollaborationSession');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const mongoose = require('mongoose');

const getDisplayName = (user) => {
    if (!user) return 'CookOnWeb User';
    return [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.username || user.email || 'CookOnWeb User';
};

const populateSession = (query) => query.populate('recipe', 'title instructions');

const serializeSession = (session, currentUserId) => ({
    _id: session._id,
    title: session.title,
    recipe: session.recipe,
    participants: session.participants.map((participant) => ({
        _id: participant.user?._id || participant.user,
        name: participant.name,
        isOnline: participant.isOnline
    })),
    messages: session.messages.map((message) => ({
        _id: message._id,
        type: message.type,
        content: message.content,
        timestamp: message.timestamp,
        sender: message.sender ? { _id: message.sender } : null,
        senderName: message.senderName
    })),
    isHost: String(session.host) === String(currentUserId)
});

const getSession = async (req, res) => {
    try {
        const session = await populateSession(CollaborationSession.findById(req.params.id));
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const existing = session.participants.find((participant) => String(participant.user) === String(req.userId));
        if (!existing) {
            return res.status(403).json({ message: 'Join the session first' });
        }

        return res.json(serializeSession(session, req.userId));
    } catch (error) {
        console.error('Get collaboration session error:', error);
        return res.status(500).json({ message: 'Server error while fetching collaboration session' });
    }
};

const createSession = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('firstName lastName username email');
        let recipe = null;

        if (req.body.recipeId && mongoose.Types.ObjectId.isValid(req.body.recipeId)) {
            recipe = await Recipe.findById(req.body.recipeId).select('_id title instructions');
        }

        if (!recipe) {
            recipe = await Recipe.findOne().sort({ createdAt: -1 }).select('_id title instructions');
        }

        const session = await CollaborationSession.create({
            title: String(req.body.title || recipe?.title || 'Collaborative Cooking Session').trim(),
            recipe: recipe?._id || null,
            host: req.userId,
            participants: [{
                user: req.userId,
                name: getDisplayName(user),
                isOnline: true
            }],
            messages: [{
                sender: null,
                senderName: 'CookOnWeb',
                content: 'Session created. Start cooking together.',
                type: 'system'
            }]
        });

        const populated = await populateSession(CollaborationSession.findById(session._id));
        return res.status(201).json(serializeSession(populated, req.userId));
    } catch (error) {
        console.error('Create collaboration session error:', error);
        return res.status(500).json({ message: 'Server error while creating collaboration session' });
    }
};

const joinSession = async (req, res) => {
    try {
        const session = await populateSession(CollaborationSession.findById(req.params.id));
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const user = await User.findById(req.userId).select('firstName lastName username email');
        const existing = session.participants.find((participant) => String(participant.user) === String(req.userId));

        if (existing) {
            existing.isOnline = true;
        } else {
            session.participants.push({
                user: req.userId,
                name: getDisplayName(user),
                isOnline: true
            });
            session.messages.push({
                sender: null,
                senderName: 'CookOnWeb',
                content: `${getDisplayName(user)} joined the session.`,
                type: 'system'
            });
        }

        await session.save();

        return res.json({
            session: {
                _id: session._id,
                title: session.title,
                recipe: session.recipe
            },
            participants: session.participants.map((participant) => ({
                _id: participant.user,
                name: participant.name,
                isOnline: participant.isOnline
            })),
            messages: session.messages.map((message) => ({
                _id: message._id,
                type: message.type,
                content: message.content,
                timestamp: message.timestamp,
                sender: message.sender ? { _id: message.sender, name: message.senderName } : null
            })),
            isHost: String(session.host) === String(req.userId)
        });
    } catch (error) {
        console.error('Join collaboration session error:', error);
        return res.status(500).json({ message: 'Server error while joining collaboration session' });
    }
};

const addMessage = async (req, res) => {
    try {
        const session = await CollaborationSession.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const participant = session.participants.find((item) => String(item.user) === String(req.userId));
        if (!participant) {
            return res.status(403).json({ message: 'Join the session first' });
        }

        const message = {
            sender: req.userId,
            senderName: participant.name,
            content: String(req.body.content || '').trim(),
            type: 'text',
            timestamp: new Date()
        };

        if (!message.content) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        session.messages.push(message);
        await session.save();

        const createdMessage = session.messages[session.messages.length - 1];
        return res.status(201).json({
            _id: createdMessage._id,
            type: createdMessage.type,
            content: createdMessage.content,
            timestamp: createdMessage.timestamp,
            sender: createdMessage.sender ? { _id: req.userId, name: participant.name } : null
        });
    } catch (error) {
        console.error('Add collaboration message error:', error);
        return res.status(500).json({ message: 'Server error while sending message' });
    }
};

module.exports = {
    getSession,
    createSession,
    joinSession,
    addMessage
};
