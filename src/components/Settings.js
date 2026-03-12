import React, { useEffect, useState } from 'react';
import '../styles/Account.scss';

const API_BASE = 'http://localhost:5000/api/auth';

const defaultSettings = {
  language: 'en',
  theme: 'light',
  emailNotifications: true,
  recipeUpdates: true,
  foodProfile: {
    goal: 'balanced',
    conditions: [],
    preferredCuisines: [],
    avoidIngredients: [],
    calorieTarget: 0,
  },
};

const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const loadSettings = async () => {
      try {
        const response = await fetch(`${API_BASE}/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setSettings({
            ...defaultSettings,
            ...data,
            foodProfile: {
              ...defaultSettings.foodProfile,
              ...(data.foodProfile || {}),
            },
          });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadSettings();
  }, []);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleFoodProfileChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      foodProfile: {
        ...prev.foodProfile,
        [name]: value,
      },
    }));
  };

  const handleCsvFoodField = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      foodProfile: {
        ...prev.foodProfile,
        [field]: value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settings }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save settings');
      }
      alert('Settings saved');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert(error.message || 'Unable to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="account-page account-page--full">
        <div className="account-card">
          <div className="account-header">
            <div>
              <h2 className="account-header__title">Settings</h2>
              <p className="account-header__subtitle">
                Customize your CookOnWeb experience and food plan.
              </p>
            </div>
          </div>

          <form className="account-form" onSubmit={handleSave}>
            <div className="form-row">
              <div className="form-group">
                <label>Language</label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>

              <div className="form-group">
                <label>Theme</label>
                <select
                  name="theme"
                  value={settings.theme}
                  onChange={handleChange}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>

            <div className="settings-toggle-group">
              <div className="toggle-row">
                <div>
                  <div className="label">Email notifications</div>
                  <div className="description">
                    Get important updates about your account and recipes.
                  </div>
                </div>
                <div
                  className={`toggle-switch ${settings.emailNotifications ? 'is-on' : ''}`}
                  onClick={() => handleToggle('emailNotifications')}
                />
              </div>

              <div className="toggle-row">
                <div>
                  <div className="label">Recipe suggestions</div>
                  <div className="description">
                    Receive personalized recipe ideas based on your food plan.
                  </div>
                </div>
                <div
                  className={`toggle-switch ${settings.recipeUpdates ? 'is-on' : ''}`}
                  onClick={() => handleToggle('recipeUpdates')}
                />
              </div>
            </div>

            <div className="dashboard-section">
              <div className="dashboard-header">
                <h3>Food Plan Profile</h3>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Primary goal</label>
                  <select
                    name="goal"
                    value={settings.foodProfile.goal}
                    onChange={handleFoodProfileChange}
                  >
                    <option value="balanced">Balanced</option>
                    <option value="gym">Gym / High Protein</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="diabetic">Diabetic Friendly</option>
                    <option value="heart-healthy">Heart Healthy</option>
                    <option value="pcos-friendly">PCOS Friendly</option>
                    <option value="low-sodium">Kidney / Low Sodium</option>
                    <option value="kids-lunchbox">Kids Lunchbox</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Daily calorie target</label>
                  <input
                    type="number"
                    name="calorieTarget"
                    value={settings.foodProfile.calorieTarget}
                    onChange={handleFoodProfileChange}
                    placeholder="e.g. 2200"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Health conditions</label>
                <input
                  value={settings.foodProfile.conditions.join(', ')}
                  onChange={(e) => handleCsvFoodField('conditions', e.target.value)}
                  placeholder="e.g. diabetic, vegetarian"
                />
                <div className="field-hint">Comma separated values.</div>
              </div>

              <div className="form-group">
                <label>Preferred cuisines</label>
                <input
                  value={settings.foodProfile.preferredCuisines.join(', ')}
                  onChange={(e) => handleCsvFoodField('preferredCuisines', e.target.value)}
                  placeholder="e.g. Indian, Mediterranean"
                />
              </div>

              <div className="form-group">
                <label>Avoid ingredients</label>
                <input
                  value={settings.foodProfile.avoidIngredients.join(', ')}
                  onChange={(e) => handleCsvFoodField('avoidIngredients', e.target.value)}
                  placeholder="e.g. sugar, butter, white bread"
                />
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
