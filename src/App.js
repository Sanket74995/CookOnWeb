import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Import the i18n configuration
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Register from "./components/Register";
import Login from "./components/Login";
import Recipes from "./components/Recipes";
import RecipeDetail from "./components/RecipeDetail";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";
import Profile from './components/Profile';
import Subscription from './components/Subscription';
import ChangePassword from './components/ChangePassword';
import Settings from './components/Settings';
import Collections from './components/Collections';
import CollectionDetail from './components/CollectionDetail';
import Dashboard from './components/Dashboard';
import AddRecipe from './components/AddRecipe';
import MealPlanner from './components/MealPlanner';
function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/recipe/:id/edit" element={<AddRecipe />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/planner" element={<MealPlanner />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:id" element={<CollectionDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <Chatbot />
          <Footer />
        </div>
      </Router>
    </I18nextProvider>
  );
}

export default App;
