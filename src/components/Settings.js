import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Account.scss';
import { applyTheme, getStoredTheme } from '../utils/theme';
import { API_BASE } from '../config';
import {
  fetchSubscriptionDetails,
  getPremiumFeatureMessage,
  getStoredSubscriptionDetails,
  isPremiumSubscription,
  subscribeToSubscriptionChanges,
} from '../utils/subscription';

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

const createDefaultSettings = () => ({
  ...defaultSettings,
  theme: getStoredTheme(),
  foodProfile: {
    ...defaultSettings.foodProfile,
  },
});

const Settings = () => {
  const { i18n, t } = useTranslation();
  const [settings, setSettings] = useState(createDefaultSettings);
  const [saving, setSaving] = useState(false);
  const [pantry, setPantry] = useState([]);
  const [pantryDraft, setPantryDraft] = useState({ name: '', quantity: '', unit: '', category: 'general' });
  const [familyGroups, setFamilyGroups] = useState([]);
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [subscription, setSubscription] = useState(() => getStoredSubscriptionDetails());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const loadSettings = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          const storedTheme = getStoredTheme();
          const resolvedTheme = data.theme && data.theme !== defaultSettings.theme
            ? data.theme
            : storedTheme;
          const nextSettings = {
            ...createDefaultSettings(),
            ...data,
            theme: resolvedTheme,
            foodProfile: {
              ...defaultSettings.foodProfile,
              ...(data.foodProfile || {}),
            },
          };
          setSettings(nextSettings);
          if (nextSettings.language && nextSettings.language !== i18n.language) {
            await i18n.changeLanguage(nextSettings.language);
          }
          applyTheme(resolvedTheme);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    const loadPantry = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/pantry`, {
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
        const response = await fetch(`${API_BASE}/api/auth/family-groups`, {
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
      fetchSubscriptionDetails().then(setSubscription).catch(() => null);

      return subscribeToSubscriptionChanges(setSubscription);
	  }, [i18n]);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextSettings = { ...settings, [name]: value };
    setSettings(nextSettings);

    if (name === 'theme') {
      applyTheme(value);
    }

    if (name === 'language') {
      i18n.changeLanguage(value);
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
      alert(t('please_log_in_first', { defaultValue: 'Please log in first.' }));
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${API_BASE}/api/auth/settings`, {
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
      if (settings.language && settings.language !== i18n.language) {
        await i18n.changeLanguage(settings.language);
      }
      applyTheme(settings.theme);
      alert(t('settings_saved', { defaultValue: 'Settings saved' }));
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert(error.message || t('unable_save_settings', { defaultValue: 'Unable to save settings' }));
    } finally {
      setSaving(false);
    }
  };

  const savePantry = async (nextPantry) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/api/auth/pantry`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pantry: nextPantry }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || t('failed_save_pantry', { defaultValue: 'Failed to save pantry' }));
      }
      setPantry(data.pantry || []);
    } catch (error) {
      console.error('Failed to save pantry:', error);
      alert(error.message || t('unable_save_pantry', { defaultValue: 'Unable to save pantry' }));
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
    if (!isPremiumSubscription(subscription)) {
      alert(getPremiumFeatureMessage('Family groups'));
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/family-groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: familyName }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || t('failed_create_family_group', { defaultValue: 'Failed to create family group' }));
      }
      setFamilyGroups((prev) => [...prev, data.group]);
      setFamilyName('');
    } catch (error) {
      console.error('Failed to create family group:', error);
      alert(error.message || t('unable_create_family_group', { defaultValue: 'Unable to create family group' }));
    }
  };

  const joinFamilyGroup = async () => {
    const token = localStorage.getItem('token');
    if (!token || !inviteCode.trim()) return;
    if (!isPremiumSubscription(subscription)) {
      alert(getPremiumFeatureMessage('Family groups'));
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/family-groups/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inviteCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || t('failed_join_family_group', { defaultValue: 'Failed to join family group' }));
      }
      setFamilyGroups((prev) => prev.some((group) => group._id === data.group._id) ? prev : [...prev, data.group]);
      setInviteCode('');
    } catch (error) {
      console.error('Failed to join family group:', error);
      alert(error.message || t('unable_join_family_group', { defaultValue: 'Unable to join family group' }));
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
                {t('settings_subtitle', { defaultValue: 'Customize your CookOnWeb experience and food plan.' })}
              </p>
            </div>
          </div>

          <form className="account-form" onSubmit={handleSave}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('language', { defaultValue: 'Language' })}</label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                >
                  <option value="en">{t('language_english')}</option>
                  <option value="hi">{t('language_hindi')}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t('theme', { defaultValue: 'Theme' })}</label>
                <select
                  name="theme"
                  value={settings.theme}
                  onChange={handleChange}
                >
                  <option value="light">{t('theme_light', { defaultValue: 'Light' })}</option>
                  <option value="dark">{t('theme_dark', { defaultValue: 'Dark' })}</option>
                </select>
              </div>
            </div>

            <div className="settings-toggle-group">
              <div className="toggle-row">
                <div>
                  <div className="label">{t('email_notifications', { defaultValue: 'Email notifications' })}</div>
                  <div className="description">
                    {t('email_notifications_desc', { defaultValue: 'Get important updates about your account and recipes.' })}
                  </div>
                </div>
                <div
                  className={`toggle-switch ${settings.emailNotifications ? 'is-on' : ''}`}
                  onClick={() => handleToggle('emailNotifications')}
                />
              </div>

              <div className="toggle-row">
                <div>
                  <div className="label">{t('recipe_suggestions', { defaultValue: 'Recipe suggestions' })}</div>
                  <div className="description">
                    {t('recipe_suggestions_desc', { defaultValue: 'Receive personalized recipe ideas based on your food plan.' })}
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
                <h3>{t('food_plan_profile', { defaultValue: 'Food Plan Profile' })}</h3>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('primary_goal', { defaultValue: 'Primary goal' })}</label>
                  <select
                    name="goal"
                    value={settings.foodProfile.goal}
                    onChange={handleFoodProfileChange}
                  >
                    <option value="balanced">{t('goal_balanced', { defaultValue: 'Balanced' })}</option>
                    <option value="gym">{t('goal_gym', { defaultValue: 'Gym / High Protein' })}</option>
                    <option value="weight-loss">{t('goal_weight_loss', { defaultValue: 'Weight Loss' })}</option>
                    <option value="diabetic">{t('goal_diabetic', { defaultValue: 'Diabetic Friendly' })}</option>
                    <option value="heart-healthy">{t('goal_heart_healthy', { defaultValue: 'Heart Healthy' })}</option>
                    <option value="pcos-friendly">{t('goal_pcos', { defaultValue: 'PCOS Friendly' })}</option>
                    <option value="low-sodium">{t('goal_low_sodium', { defaultValue: 'Kidney / Low Sodium' })}</option>
                    <option value="kids-lunchbox">{t('goal_kids_lunchbox', { defaultValue: 'Kids Lunchbox' })}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{t('daily_calorie_target', { defaultValue: 'Daily calorie target' })}</label>
                  <input
                    type="number"
                    name="calorieTarget"
                    value={settings.foodProfile.calorieTarget}
                    onChange={handleFoodProfileChange}
                    placeholder={t('daily_calorie_target_placeholder', { defaultValue: 'e.g. 2200' })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t('health_conditions', { defaultValue: 'Health conditions' })}</label>
                <input
                  value={settings.foodProfile.conditions.join(', ')}
                  onChange={(e) => handleCsvFoodField('conditions', e.target.value)}
                  placeholder={t('health_conditions_placeholder', { defaultValue: 'e.g. diabetic, vegetarian' })}
                />
                <div className="field-hint">{t('comma_separated_values', { defaultValue: 'Comma separated values.' })}</div>
              </div>

              <div className="form-group">
                <label>{t('preferred_cuisines', { defaultValue: 'Preferred cuisines' })}</label>
                <input
                  value={settings.foodProfile.preferredCuisines.join(', ')}
                  onChange={(e) => handleCsvFoodField('preferredCuisines', e.target.value)}
                  placeholder={t('preferred_cuisines_placeholder', { defaultValue: 'e.g. Indian, Mediterranean' })}
                />
              </div>

              <div className="form-group">
                <label>{t('avoid_ingredients', { defaultValue: 'Avoid ingredients' })}</label>
                <input
                  value={settings.foodProfile.avoidIngredients.join(', ')}
                  onChange={(e) => handleCsvFoodField('avoidIngredients', e.target.value)}
                  placeholder={t('avoid_ingredients_placeholder', { defaultValue: 'e.g. sugar, butter, white bread' })}
                />
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? t('saving') : t('save_settings', { defaultValue: 'Save Settings' })}
              </button>
            </div>
          </form>

          <div className="dashboard-section">
            <div className="dashboard-header">
              <h3>{t('pantry_inventory', { defaultValue: 'Pantry Inventory' })}</h3>
            </div>
            <div className="form-row">
              <div className="form-group">
                <input
                  value={pantryDraft.name}
                  onChange={(e) => setPantryDraft((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder={t('ingredient_name', { defaultValue: 'Ingredient name' })}
                />
              </div>
              <div className="form-group">
                <input
                  value={pantryDraft.quantity}
                  onChange={(e) => setPantryDraft((prev) => ({ ...prev, quantity: e.target.value }))}
                  placeholder={t('quantity', { defaultValue: 'Quantity' })}
                />
              </div>
              <div className="form-group">
                <input
                  value={pantryDraft.unit}
                  onChange={(e) => setPantryDraft((prev) => ({ ...prev, unit: e.target.value }))}
                  placeholder={t('unit', { defaultValue: 'Unit' })}
                />
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: '0.5rem' }}>
              <button type="button" className="btn-primary" onClick={addPantryItem}>
                {t('add_pantry_item', { defaultValue: 'Add Pantry Item' })}
              </button>
            </div>
            {pantry.length === 0 ? (
              <div className="dashboard-empty">{t('no_pantry_items_yet', { defaultValue: 'No pantry items yet.' })}</div>
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
                          {t('remove', { defaultValue: 'Remove' })}
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
	              <h3>{t('family_shared_planner', { defaultValue: 'Family / Shared Planner' })}</h3>
	            </div>
              {!isPremiumSubscription(subscription) && (
                <div className="dashboard-empty">{t('premium_required_family_groups', { defaultValue: 'Premium plan required to create or join family groups.' })}</div>
              )}
	            <div className="form-row">
	              <div className="form-group">
	                <input value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder={t('create_family_group', { defaultValue: 'Create family group' })} />
	              </div>
	              <div className="form-group">
	                <button type="button" className="btn-primary" onClick={createFamilyGroup} disabled={!isPremiumSubscription(subscription)}>{t('create_group', { defaultValue: 'Create Group' })}</button>
	              </div>
	            </div>
	            <div className="form-row">
	              <div className="form-group">
	                <input value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder={t('join_with_invite_code', { defaultValue: 'Join with invite code' })} />
	              </div>
	              <div className="form-group">
	                <button type="button" className="btn-outlined" onClick={joinFamilyGroup} disabled={!isPremiumSubscription(subscription)}>{t('join_group', { defaultValue: 'Join Group' })}</button>
	              </div>
	            </div>
            {familyGroups.length === 0 ? (
              <div className="dashboard-empty">{t('no_family_groups_yet', { defaultValue: 'No family groups yet.' })}</div>
            ) : (
              <div className="dashboard-recipes">
                {familyGroups.map((group) => (
                  <article key={group._id} className="dashboard-recipe-card">
                    <div className="dashboard-recipe-card__body">
                      <div>
                        <h4>{group.name}</h4>
                        <p>{t('invite_code', { defaultValue: 'Invite code' })}: {group.inviteCode}</p>
                        <div className="dashboard-recipe-meta">
                          <span>{group.members?.length || 0} {t('members', { defaultValue: 'members' })}</span>
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
