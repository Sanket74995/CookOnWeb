import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
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
import PWAInstall from './components/PWAInstall';
import VoiceAssistant from './components/VoiceAssistant';
import BarcodeScanner from './components/BarcodeScanner';
import AIRecommendations from './components/AIRecommendations';
import CollaborativeCooking from './components/CollaborativeCooking';
import NutritionAnalytics from './components/NutritionAnalytics';
import { applyTheme, getStoredTheme } from './utils/theme';
import {
  AUTH_EXPIRED_EVENT,
  clearAuthSession,
  getAuthFailureMessage,
  getSessionExpiredMessage,
  isTokenExpired,
  notifyAuthExpired,
} from './utils/auth';
import { API_BASE } from './config';

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (token && isTokenExpired(token)) {
    clearAuthSession();
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: getSessionExpiredMessage(), from: location.pathname }}
      />
    );
  }

  return token ? children : <Navigate to="/login" replace />;
};

function AppContent({ showBarcodeScanner, setShowBarcodeScanner, handleBarcodeScan, handleVoiceCommand }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isRecipeDetailPage = /^\/recipe\/[^/]+$/.test(location.pathname);

  useEffect(() => {
    const handleAuthExpired = (event) => {
      const message = event.detail?.message || getSessionExpiredMessage();
      alert(message);
      navigate('/login', {
        replace: true,
        state: {
          message,
          from: location.pathname
        }
      });
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, [location.pathname, navigate]);

  return (
    <div className="App">
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recipes" element={<RequireAuth><Recipes /></RequireAuth>} />
          <Route path="/recipe/:id" element={<RequireAuth><RecipeDetail /></RequireAuth>} />
          <Route path="/recipe/:id/edit" element={<RequireAuth><AddRecipe /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/subscription" element={<RequireAuth><Subscription /></RequireAuth>} />
          <Route path="/change-password" element={<RequireAuth><ChangePassword /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="/add-recipe" element={<RequireAuth><AddRecipe /></RequireAuth>} />
          <Route path="/planner" element={<RequireAuth><MealPlanner /></RequireAuth>} />
          <Route path="/collections" element={<RequireAuth><Collections /></RequireAuth>} />
          <Route path="/collections/:id" element={<RequireAuth><CollectionDetail /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/recommendations" element={<RequireAuth><AIRecommendations /></RequireAuth>} />
          <Route path="/collaborate/:sessionId" element={<RequireAuth><CollaborativeCooking /></RequireAuth>} />
          <Route path="/collaborate" element={<RequireAuth><CollaborativeCooking /></RequireAuth>} />
          <Route path="/nutrition" element={<RequireAuth><NutritionAnalytics /></RequireAuth>} />
        </Routes>
        <Chatbot />
        <Footer />
        <PWAInstall />
        {!isRecipeDetailPage && <VoiceAssistant onCommand={handleVoiceCommand} />}
        {showBarcodeScanner && (
          <BarcodeScanner
            onScan={handleBarcodeScan}
            onClose={() => setShowBarcodeScanner(false)}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  useEffect(() => {
    applyTheme(getStoredTheme());

    const handleThemeChange = (event) => {
      applyTheme(event.detail || getStoredTheme());
    };

    const handleStorage = (event) => {
      if (event.key === 'cookonweb-theme') {
        applyTheme(event.newValue || 'light');
      }
    };

    window.addEventListener('cookonweb-theme-change', handleThemeChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('cookonweb-theme-change', handleThemeChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      if (response.status === 401 && localStorage.getItem('token')) {
        try {
          const payload = await response.clone().json();
          notifyAuthExpired(getAuthFailureMessage(payload));
        } catch (error) {
          notifyAuthExpired(getSessionExpiredMessage());
        }
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const handleBarcodeScan = async (result) => {
    if (result?.destination !== 'pantry' || !result?.product?.name) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to save pantry items.');
      return;
    }

    try {
      const pantryResponse = await fetch(`${API_BASE}/api/auth/pantry`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const currentPantry = pantryResponse.ok ? await pantryResponse.json() : [];
      const nextPantry = [
        ...currentPantry,
        {
          name: result.product.name,
          quantity: '1',
          unit: 'pack',
          category: result.product.category || 'general',
          inStock: true
        }
      ];

      const response = await fetch(`${API_BASE}/api/auth/pantry`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ pantry: nextPantry })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to save pantry item');
      }

      alert(`${result.product.name} added to your pantry.`);
      setShowBarcodeScanner(false);
    } catch (error) {
      console.error('Failed to save barcode scan:', error);
      alert(error.message || 'Unable to save pantry item');
    }
  };

  const handleVoiceCommand = (command) => {
    if (command.includes('scan') || command.includes('barcode') || command.includes('camera')) {
      setShowBarcodeScanner(true);
      return true;
    }

    return false;
  };

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <AppContent
          showBarcodeScanner={showBarcodeScanner}
          setShowBarcodeScanner={setShowBarcodeScanner}
          handleBarcodeScan={handleBarcodeScan}
          handleVoiceCommand={handleVoiceCommand}
        />
      </Router>
    </I18nextProvider>
  );
}

export default App;
