import React, { useEffect, useState } from 'react';
import '../styles/Account.scss';

const API_BASE = 'http://localhost:5000/api/auth'; // adjust if different

const Profile = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok)
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
        });
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      alert('Profile updated');
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      alert(data.message || 'Failed');
    }
  };

  const initials =
    (form.firstName?.[0] || '').toUpperCase() ||
    (form.lastName?.[0] || '').toUpperCase() ||
    'U';

  return (
    <div className="page-container">
      <div className="account-page">
        {/* Left: main form */}
        <div className="account-card account-card--highlight">
          <div className="account-header">
            <div>
              <h2 className="account-header__title">Edit Profile</h2>
              <p className="account-header__subtitle">
                Update your name and email used across CookOnWeb.
              </p>
            </div>
          </div>

          <form className="account-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <div className="field-hint">
                This email is used for login and important account updates.
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button type="button" className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Right: summary card */}
        <div className="account-side">
          <div className="account-card account-card--muted">
            <div className="account-summary">
              <div className="account-summary__avatar">{initials}</div>
              <div className="account-summary__info">
                <div className="name">
                  {form.firstName || 'User'} {form.lastName}
                </div>
                <div className="email">{form.email || 'no-email@cookonweb.app'}</div>
              </div>
            </div>

            <ul className="account-list">
              <li>
                <span>Account Type</span>
                <span className="value">CookOnWeb User</span>
              </li>
              <li>
                <span>Status</span>
                <span className="status-pill">Active</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
