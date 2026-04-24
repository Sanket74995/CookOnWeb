const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();
const connectDB = require('./DB');
const { getJwtSecret } = require('./utils/jwt');

// Routes
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const chatbotRoutes = require('./routes/chatbot');
const mealPlanRoutes = require('./routes/mealPlans');
const collectionRoutes = require('./routes/collections');
const nutritionRoutes = require('./routes/nutrition');
const collaborationRoutes = require('./routes/collaboration');

const app = express();
const PORT = process.env.PORT || 5000;
const uploadDir = path.join(__dirname, 'uploads');
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';
const allowedOrigins = String(
    process.env.FRONTEND_ORIGIN || 'http://localhost:3000,https://cook-on-web-97n8.vercel.app'
)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

// Logger
const logger = {
    info: (message, data) => {
        if (process.env.NODE_ENV !== 'test') console.info('[INFO]', message, data || '');
    },
    warn: (message, data) => console.warn('[WARN]', message, data || ''),
    error: (message, data) => console.error('[ERROR]', message, data || '')
};

// Keep production protected without throttling normal local development usage.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? Number(process.env.API_RATE_LIMIT_MAX || 1000) : Number(process.env.API_RATE_LIMIT_MAX || 5000),
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => !isProduction,
    handler: (req, res) => {
        logger.warn('Rate limit exceeded', {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip
        });
        res.status(429).json({ error: 'Too many requests; please try again later.' });
    }
});

let appReadyPromise = null;

const ensureAppReady = async () => {
    if (!appReadyPromise) {
        appReadyPromise = connectDB()
            .then(() => {
                getJwtSecret();
                logger.info('Connected to MongoDB');
            })
            .catch((error) => {
                appReadyPromise = null;
                throw error;
            });
    }

    return appReadyPromise;
};

app.use(helmet());

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use('/api', apiLimiter);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

if (isVercel) {
    app.use(async (req, res, next) => {
        try {
            await ensureAppReady();
            next();
        } catch (error) {
            logger.error('Failed to initialize application', error);
            res.status(500).json({ error: 'Server initialization failed.' });
        }
    });
}

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/chatbot/admin', require('./routes/chatbotAdmin'));
app.use('/uploads', express.static(uploadDir));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the CookOnWeb API!' });
});

const startServer = () => {
    const server = app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            logger.error(`Port ${PORT} is already in use. Stop the other backend process or start this one with a different PORT.`);
            process.exit(1);
        }

        logger.error('Server failed to start', error);
        process.exit(1);
    });
};

if (process.env.NODE_ENV !== 'test' && !isVercel) {
    ensureAppReady()
        .then(() => {
            startServer();
        })
        .catch((error) => {
            console.error('Full startup error:', error);
            process.exit(1);
        });
}

module.exports = app;
