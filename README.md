# CookOnWeb

A full-stack cooking application with recipe management, meal planning, AI recommendations, and collaborative cooking features.

## Features

- User authentication and profiles
- Recipe creation and management
- Meal planning
- AI-powered recipe recommendations
- Collaborative cooking sessions
- Nutrition analytics
- Voice assistant
- Barcode scanner for ingredients
- Collections for organizing recipes
- Multi-language support (English and Hindi)

## Tech Stack

- **Frontend**: React.js, Sass, i18next for internationalization
- **Backend**: Node.js, Express.js, MongoDB with Mongoose
- **AI**: DeepSeek API integration
- **Authentication**: JWT
- **Deployment**: Ready for static hosting (frontend) and server hosting (backend)

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/cookonweb
   JWT_SECRET=your_jwt_secret_here
   FRONTEND_ORIGIN=http://localhost:3000
   DEEPSEEK_API_KEY=your_deepseek_api_key
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the root directory:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The app will be available at `http://localhost:3000`.

## Building for Production

### Frontend Build

```bash
npm run build
```

This creates a `build` folder with the production-ready files.

### Backend Production

Set `NODE_ENV=production` in your environment variables.

## Deployment

### Frontend Deployment

The built frontend can be deployed to any static hosting service like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Backend Deployment

Deploy the backend to a server or cloud platform like:
- Heroku
- DigitalOcean
- AWS EC2
- Railway

Make sure to set the `FRONTEND_ORIGIN` environment variable to your frontend's URL in production.

### Database

Use MongoDB Atlas for cloud database or set up MongoDB on your server.

## API Endpoints

- `/api/auth` - Authentication
- `/api/recipes` - Recipe management
- `/api/meal-plans` - Meal planning
- `/api/chatbot` - AI chatbot
- `/api/collections` - Recipe collections
- `/api/nutrition` - Nutrition analytics
- `/api/collaboration` - Collaborative cooking

## Testing

Run backend tests:
```bash
cd backend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

ISC
