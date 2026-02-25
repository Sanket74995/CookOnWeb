import React, { useState } from 'react';
import '../styles/Account.scss';

const Settings = () => {
  const [settings, setSettings] = useState({
    language: 'en',
    theme: 'light',
    emailNotifications: true,
    recipeUpdates: true,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // later you can POST/PUT to /api/auth/settings
    alert('Settings saved (you can now wire API here).');
  };

  return (
    <div className="page-container">
      <div className="account-page account-page--full">
        <div className="account-card">
          <div className="account-header">
            <div>
              <h2 className="account-header__title">Settings</h2>
              <p className="account-header__subtitle">
                Customize your CookOnWeb experience.
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
                  <option value="hi">हिंदी</option>
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
                  className={`toggle-switch ${
                    settings.emailNotifications ? 'is-on' : ''
                  }`}
                  onClick={() => handleToggle('emailNotifications')}
                />
              </div>

              <div className="toggle-row">
                <div>
                  <div className="label">Recipe suggestions</div>
                  <div className="description">
                    Receive personalized recipe ideas based on your activity.
                  </div>
                </div>
                <div
                  className={`toggle-switch ${
                    settings.recipeUpdates ? 'is-on' : ''
                  }`}
                  onClick={() => handleToggle('recipeUpdates')}
                />
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: '1rem' }}>
              <button type="submit" className="btn-primary">
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
