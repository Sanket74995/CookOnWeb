import React, { useState } from 'react';
import '../styles/Account.scss';

const API_BASE = 'http://localhost:5000/api/auth';

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmNewPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage({ type: 'success', text: 'Password changed successfully.' });
      setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } else {
      setMessage({ type: 'error', text: data.message || 'Error changing password.' });
    }
  };

  const getStrengthLabel = () => {
    const pwd = form.newPassword;
    if (!pwd) return null;
    if (pwd.length < 6) return { label: 'Weak', className: 'password-strength--weak' };
    if (pwd.length < 10) return { label: 'Medium', className: 'password-strength--medium' };
    return { label: 'Strong', className: 'password-strength--strong' };
  };

  const strength = getStrengthLabel();

  return (
    <div className="page-container">
      <div className="account-page account-page--full">
        <div className="account-card">
          <div className="account-header">
            <div>
              <h2 className="account-header__title">Change Password</h2>
              <p className="account-header__subtitle">
                Keep your account secure by using a strong, unique password.
              </p>
            </div>
          </div>

          <form className="account-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                placeholder="Enter current password"
                value={form.currentPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={form.newPassword}
                  onChange={handleChange}
                />
                {strength && (
                  <div className={`password-strength ${strength.className}`}>
                    Strength: {strength.label}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  placeholder="Re-enter new password"
                  value={form.confirmNewPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {message && (
              <div
                className={`account-alert ${
                  message.type === 'error'
                    ? 'account-alert--danger'
                    : 'account-alert--success'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="account-alert">
              Tip: Use at least 10 characters, with a mix of letters, numbers and symbols.
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
