const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./DB');

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const chatbotRoutes = require('./routes/chatbot');
const mealPlanRoutes = require('./routes/mealPlans');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/chatbot/admin', require('./routes/chatbotAdmin'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/uploads', express.static('uploads'));



// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the CookOnWeb API!');
});

connectDB()
    .then(() => {
        console.log('Connected to MongoDB');

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });
