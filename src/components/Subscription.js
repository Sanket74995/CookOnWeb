// src/components/Subscription.js
import React, { useEffect, useState } from 'react';
import '../styles/Account.scss';

const API_BASE = 'http://localhost:5000/api/auth';

const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/subscription`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setSubscription(data);
        } else {
          // fallback if anything fails
          setSubscription({ plan: 'free', status: 'active' });
        }
      } catch (err) {
        console.error('Fetch subscription error:', err);
        setSubscription({ plan: 'free', status: 'active' });
      } finally {
        setLoading(false);
      }
    };

    fetchSub();
  }, []);

  const handleUpgrade = async () => {
    try {
      setUpgrading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/subscription/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert('Upgraded to premium successfully!');
        setSubscription(data.subscription);
      } else {
        alert(data.message || 'Failed to upgrade');
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      alert('Something went wrong while upgrading.');
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="account-page account-page--full">
          <div className="account-card">
            <p>Loading subscription...</p>
          </div>
        </div>
      </div>
    );
  }

  const plan = subscription?.plan || 'free';
  const status = subscription?.status || 'active';

  return (
    <div className="page-container">
      <div className="account-page account-page--full">
        <div className="account-card account-card--highlight">
          <div className="account-header">
            <div>
              <h2 className="account-header__title">Subscription</h2>
              <p className="account-header__subtitle">
                Manage your CookOnWeb subscription and access premium features.
              </p>
            </div>
          </div>

          <div className="account-meta">
            Current plan:&nbsp;
            <span>{plan === 'free' ? 'Free Plan' : 'Premium Plan'}</span>
          </div>

          <ul className="account-list">
            <li>
              <span>Status</span>
              <span
                className={`status-pill ${
                  status === 'active' ? '' : 'status-pill--warning'
                }`}
              >
                {status === 'active' ? 'Active' : status}
              </span>
            </li>
            <li>
              <span>Recipes Access</span>
              <span className="value">
                {plan === 'free' ? 'Basic recipes' : 'Basic + premium recipes or Add Recipes'}
              </span>
            </li>
            
            <li>
              <span>AI Chatbot</span>
              <span className="value">
                {plan === 'free' ? 'Limited conversations' : 'Unlimited chats'}
              </span>
            </li>
          </ul>

          <div className="subscription-badges">
            <span className="badge badge--primary">
              Ad-free cooking experience
            </span>
            <span className="badge">Priority support</span>
            <span className="badge">Early access to new features</span>
          </div>

          <div className="form-actions" style={{ marginTop: '1.2rem' }}>
            {plan === 'free' ? (
              <button
                className="btn-primary"
                onClick={handleUpgrade}
                disabled={upgrading}
              >
                {upgrading ? 'Upgrading...' : 'Upgrade to Premium'}
              </button>
            ) : (
              <button className="btn-primary" disabled>
                You are Premium
              </button>
            )}
            <button className="btn-ghost">View all plans</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
