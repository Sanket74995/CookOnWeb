import React, { useEffect, useState } from 'react';
import '../styles/Account.scss';
import { applyTheme, getStoredTheme } from '../utils/theme';

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
  const [pantry, setPantry] = useState([]);
  const [pantryDraft, setPantryDraft] = useState({ name: '', quantity: '', unit: '', category: 'general' });
  const [familyGroups, setFamilyGroups] = useState([]);
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

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
          const nextSettings = {
            ...defaultSettings,
            ...data,
            foodProfile: {
              ...defaultSettings.foodProfile,
              ...(data.foodProfile || {}),
            },
          };
          setSettings(nextSettings);
          applyTheme(nextSettings.theme || getStoredTheme());
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    const loadPantry = async () => {
      try {
        const response = await fetch(`${API_BASE}/pantry`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setPantry(data);
        }
      } catch (error) {
        console.error('Failed to load pantry:', error);
      }
    };

    const loadFamilyGroups = async () => {
      try {
        const response = await fetch(`${API_BASE}/family-groups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setFamilyGroups(data);
        }
      } catch (error) {
        console.error('Failed to load family groups:', error);
      }
    };

    loadSettings();
    loadPantry();
    loadFamilyGroups();
  }, []);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const nextSettings = { ...settings, [e.target.name]: e.target.value };
    setSettings(nextSettings);

    if (e.target.name === 'theme') {
      applyTheme(e.target.value);
    }
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
      applyTheme(settings.theme);
      alert('Settings saved');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert(error.message || 'Unable to save settings');
    } finally {
      setSaving(false);
    }
  };

  const savePantry = async (nextPantry) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/pantry`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pantry: nextPantry }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save pantry');
      }
      setPantry(data.pantry || []);
    } catch (error) {
      console.error('Failed to save pantry:', error);
      alert(error.message || 'Unable to save pantry');
    }
  };

  const addPantryItem = async () => {
    if (!pantryDraft.name.trim()) return;
    const nextPantry = [...pantry, { ...pantryDraft, inStock: true }];
    await savePantry(nextPantry);
    setPantryDraft({ name: '', quantity: '', unit: '', category: 'general' });
  };

  const removePantryItem = async (index) => {
    const nextPantry = pantry.filter((_, itemIndex) => itemIndex !== index);
    await savePantry(nextPantry);
  };

  const createFamilyGroup = async () => {
    const token = localStorage.getItem('token');
    if (!token || !familyName.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/family-groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: familyName }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create family group');
      }
      setFamilyGroups((prev) => [...prev, data.group]);
      setFamilyName('');
    } catch (error) {
      console.error('Failed to create family group:', error);
      alert(error.message || 'Unable to create family group');
    }
  };

  const joinFamilyGroup = async () => {
    const token = localStorage.getItem('token');
    if (!token || !inviteCode.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/family-groups/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inviteCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to join family group');
      }
      setFamilyGroups((prev) => prev.some((group) => group._id === data.group._id) ? prev : [...prev, data.group]);
      setInviteCode('');
    } catch (error) {
      console.error('Failed to join family group:', error);
      alert(error.message || 'Unable to join family group');
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

          <div className="dashboard-section">
            <div className="dashboard-header">
              <h3>Pantry Inventory</h3>
            </div>
            <div className="form-row">
              <div className="form-group">
                <input
                  value={pantryDraft.name}
                  onChange={(e) => setPantryDraft((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ingredient name"
                />
              </div>
              <div className="form-group">
                <input
                  value={pantryDraft.quantity}
                  onChange={(e) => setPantryDraft((prev) => ({ ...prev, quantity: e.target.value }))}
                  placeholder="Quantity"
                />
              </div>
              <div className="form-group">
                <input
                  value={pantryDraft.unit}
                  onChange={(e) => setPantryDraft((prev) => ({ ...prev, unit: e.target.value }))}
                  placeholder="Unit"
                />
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: '0.5rem' }}>
              <button type="button" className="btn-primary" onClick={addPantryItem}>
                Add Pantry Item
              </button>
            </div>
            {pantry.length === 0 ? (
              <div className="dashboard-empty">No pantry items yet.</div>
            ) : (
              <div className="dashboard-recipes">
                {pantry.map((item, index) => (
                  <article key={`${item.name}-${index}`} className="dashboard-recipe-card">
                    <div className="dashboard-recipe-card__body">
                      <div>
                        <h4>{item.name}</h4>
                        <p>{item.quantity} {item.unit}</p>
                      </div>
                      <div className="dashboard-recipe-actions">
                        <button type="button" className="btn-ghost btn-ghost--danger" onClick={() => removePantryItem(index)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-section">
            <div className="dashboard-header">
              <h3>Family / Shared Planner</h3>
            </div>
            <div className="form-row">
              <div className="form-group">
                <input value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="Create family group" />
              </div>
              <div className="form-group">
                <button type="button" className="btn-primary" onClick={createFamilyGroup}>Create Group</button>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <input value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="Join with invite code" />
              </div>
              <div className="form-group">
                <button type="button" className="btn-outlined" onClick={joinFamilyGroup}>Join Group</button>
              </div>
            </div>
            {familyGroups.length === 0 ? (
              <div className="dashboard-empty">No family groups yet.</div>
            ) : (
              <div className="dashboard-recipes">
                {familyGroups.map((group) => (
                  <article key={group._id} className="dashboard-recipe-card">
                    <div className="dashboard-recipe-card__body">
                      <div>
                        <h4>{group.name}</h4>
                        <p>Invite code: {group.inviteCode}</p>
                        <div className="dashboard-recipe-meta">
                          <span>{group.members?.length || 0} members</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
