const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const connectDB = require('./DB');

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const chatbotRoutes = require('./routes/chatbot');
const mealPlanRoutes = require('./routes/mealPlans');
const collectionRoutes = require('./routes/collections');
const nutritionRoutes = require('./routes/nutrition');
const collaborationRoutes = require('./routes/collaboration');

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests; please try again later.' }
});

const logger = {
    info: (message, data) => {
        if (process.env.NODE_ENV !== 'test') console.info('[INFO]', message, data || '');
    },
    warn: (message, data) => console.warn('[WARN]', message, data || ''),
    error: (message, data) => console.error('[ERROR]', message, data || '')
};

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000' }));
app.use(limiter);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/chatbot/admin', require('./routes/chatbotAdmin'));
app.use('/uploads', express.static('uploads'));

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the CookOnWeb API!' });
});

// Start server unless running tests
if (process.env.NODE_ENV !== 'test') {
    connectDB()
        .then(() => {
            logger.info('Connected to MongoDB');
            app.listen(PORT, () => {
                logger.info(`Server is running on http://localhost:${PORT}`);
            });
        })
        .catch((error) => {
            logger.error('MongoDB connection error', error);
            process.exit(1);
        });
}

module.exports = app;
