import React, { useEffect, useMemo, useState } from 'react';
import '../styles/Account.scss';
import Loader from './Loader';
import { API_BASE } from '../config';
import {
  getStoredSubscriptionDetails,
  storeSubscriptionDetails,
  subscribeToSubscriptionChanges,
} from '../utils/subscription';

const SUBSCRIPTION_API = `${API_BASE}/api/auth/subscription`;

const formatDate = (value) => {
  if (!value) return 'Not scheduled';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Not scheduled';
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getStatusLabel = (status) => {
  if (status === 'cancelled') return 'Cancels at period end';
  if (status === 'active') return 'Active';
  return status || 'Unknown';
};

const Subscription = () => {
  const [subscription, setSubscription] = useState(() => getStoredSubscriptionDetails());
  const [plans, setPlans] = useState([]);
  const [premiumModules, setPremiumModules] = useState([]);
  const [retention, setRetention] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch(SUBSCRIPTION_API, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to load subscription');
        }

        storeSubscriptionDetails(data.subscription || null);
        setSubscription(data.subscription || null);
        setPlans(data.plans || []);
        setPremiumModules(data.premiumModules || []);
        setRetention(data.retention || null);
      } catch (err) {
        console.error('Fetch subscription error:', err);
        alert(err.message || 'Unable to load subscription details');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();

    return subscribeToSubscriptionChanges(setSubscription);
  }, []);

  const runSubscriptionAction = async (path, successMessage) => {
    try {
      setActionLoading(path);
      const token = localStorage.getItem('token');
      const res = await fetch(`${SUBSCRIPTION_API}/${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Subscription action failed');
      }

      storeSubscriptionDetails(data.subscription || null);
      setSubscription(data.subscription || null);
      setPlans(data.plans || []);
      setPremiumModules(data.premiumModules || []);
      setRetention(data.retention || null);
      alert(data.message || successMessage);
    } catch (err) {
      console.error(`${path} subscription error:`, err);
      alert(err.message || 'Something went wrong');
    } finally {
      setActionLoading('');
    }
  };

  const currentPlan = subscription?.plan || 'free';
  const status = subscription?.status || 'active';

  const comparisonPlans = useMemo(() => {
    if (plans.length) return plans;
    return [
      { id: 'free', name: 'Free', priceMonthly: 0, description: 'Good for exploring recipes.', features: [], highlights: [], modules: [] },
      { id: 'premium', name: 'Premium', priceMonthly: 199, description: 'Best for power users.', features: [], highlights: [], modules: [] }
    ];
  }, [plans]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="account-page account-page--full">
          <div className="account-card">
            <Loader label="Loading subscription..." variant="card" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="account-page account-page--full">
        <div className="account-card account-card--highlight">
          <div className="account-header">
            <div>
              <h2 className="account-header__title">Subscription</h2>
              <p className="account-header__subtitle">
                Manage your current plan, premium access, and mock billing state.
              </p>
            </div>
          </div>

          <div className="subscription-hero">
            <div>
              <div className="account-meta">
                Current plan: <span>{subscription?.planName || 'Free'}</span>
              </div>
              {subscription?.badge && <div className="subscription-badge-line">{subscription.badge}</div>}
              <h3 className="subscription-plan-title">
                {subscription?.planName || 'Free'} {currentPlan === 'premium' ? 'Membership' : 'Plan'}
              </h3>
              <p className="subscription-plan-copy">
                {subscription?.description || 'Basic access to CookOnWeb essentials.'}
              </p>
              {subscription?.spotlight && (
                <p className="subscription-spotlight">{subscription.spotlight}</p>
              )}
            </div>
            <div className="subscription-price-pill">
              {subscription?.priceMonthly ? `Rs ${subscription.priceMonthly}/mo` : 'Free'}
            </div>
          </div>

          <ul className="account-list">
            <li>
              <span>Status</span>
              <span className={`status-pill ${status === 'cancelled' ? 'status-pill--warning' : ''}`}>
                {getStatusLabel(status)}
              </span>
            </li>
            <li>
              <span>Billing cycle</span>
              <span className="value">{subscription?.billingCycle || 'monthly'}</span>
            </li>
            <li>
              <span>Started on</span>
              <span className="value">{formatDate(subscription?.startedAt)}</span>
            </li>
            <li>
              <span>Next renewal</span>
              <span className="value">{formatDate(subscription?.renewalAt)}</span>
            </li>
            <li>
              <span>Access until</span>
              <span className="value">{formatDate(subscription?.expiresAt)}</span>
            </li>
            <li>
              <span>AI access</span>
              <span className="value">{subscription?.limits?.aiChats || 'Limited'}</span>
            </li>
            <li>
              <span>Recipe publishing</span>
              <span className="value">{subscription?.limits?.recipePublishing ? 'Enabled' : 'Locked'}</span>
            </li>
            <li>
              <span>Collections</span>
              <span className="value">{subscription?.limits?.collections || 'Locked'}</span>
            </li>
            <li>
              <span>Family groups</span>
              <span className="value">{subscription?.limits?.familyGroups || 'Locked'}</span>
            </li>
            <li>
              <span>Support level</span>
              <span className="value">{subscription?.limits?.support || 'Standard'}</span>
            </li>
          </ul>

          {subscription?.features?.length > 0 && (
            <div className="subscription-badges">
              {subscription.features.map((feature) => (
                <span key={feature} className="badge">
                  {feature}
                </span>
              ))}
            </div>
          )}

          {Array.isArray(subscription?.highlights) && subscription.highlights.length > 0 && (
            <div className="subscription-section">
              <div className="dashboard-header">
                <h3>What this plan unlocks</h3>
              </div>
              <div className="subscription-highlight-grid">
                {subscription.highlights.map((item) => (
                  <article key={item} className="subscription-highlight-card">
                    <strong>{item}</strong>
                  </article>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(subscription?.modules) && subscription.modules.length > 0 && (
            <div className="subscription-section">
              <div className="dashboard-header">
                <h3>Feature access</h3>
              </div>
              <div className="subscription-module-list">
                {subscription.modules.map((module) => (
                  <div key={module.key} className="subscription-module-row">
                    <span>{module.label}</span>
                    <span className="value">{module.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-actions" style={{ marginTop: '1.2rem' }}>
            {currentPlan === 'free' && (
              <button
                className="btn-primary"
                onClick={() => runSubscriptionAction('upgrade', 'Upgraded successfully')}
                disabled={actionLoading === 'upgrade'}
              >
                {actionLoading === 'upgrade' ? 'Upgrading...' : 'Upgrade to Premium'}
              </button>
            )}

            {currentPlan === 'premium' && status === 'active' && (
              <button
                className="btn-outlined"
                onClick={() => runSubscriptionAction('cancel', 'Subscription cancelled')}
                disabled={actionLoading === 'cancel'}
              >
                {actionLoading === 'cancel' ? 'Cancelling...' : 'Cancel Premium'}
              </button>
            )}

            {currentPlan === 'premium' && status === 'cancelled' && (
              <button
                className="btn-primary"
                onClick={() => runSubscriptionAction('reactivate', 'Subscription reactivated')}
                disabled={actionLoading === 'reactivate'}
              >
                {actionLoading === 'reactivate' ? 'Reactivating...' : 'Reactivate Premium'}
              </button>
            )}
          </div>
        </div>

        <div className="account-card account-card--muted">
          <div className="dashboard-header">
            <h3>Available Plans</h3>
          </div>
          {retention && (
            <div className="subscription-note">
              <strong>Why upgrade:</strong> Save Rs {retention.annualSavings} on yearly billing. {retention.promise}
            </div>
          )}
          <div className="subscription-plan-grid">
            {comparisonPlans.map((plan) => {
              const isCurrent = plan.id === currentPlan;

              return (
                <article
                  key={plan.id}
                  className={`subscription-plan-card ${isCurrent ? 'subscription-plan-card--current' : ''}`}
                >
                  <div className="subscription-plan-card__top">
                    <div>
                      <h4>{plan.name}</h4>
                      <p>{plan.description}</p>
                      {plan.audience && <div className="subscription-card-note">{plan.audience}</div>}
                    </div>
                    <div className="subscription-plan-card__price">
                      {plan.priceMonthly ? `Rs ${plan.priceMonthly}/mo` : 'Free'}
                    </div>
                  </div>

                  {plan.badge && (
                    <div className="subscription-card-badge">
                      <span className="badge badge--primary">{plan.badge}</span>
                    </div>
                  )}

                  {Array.isArray(plan.features) && plan.features.length > 0 && (
                    <ul className="subscription-feature-list">
                      {plan.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  )}

                  {Array.isArray(plan.modules) && plan.modules.length > 0 && (
                    <div className="subscription-plan-modules">
                      {plan.modules.map((module) => (
                        <div key={`${plan.id}-${module.key}`} className="subscription-module-row">
                          <span>{module.label}</span>
                          <span className="value">{module.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="subscription-plan-card__footer">
                    <span className={`badge ${isCurrent ? 'badge--primary' : ''}`}>
                      {isCurrent ? 'Current plan' : 'Available'}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {premiumModules.length > 0 && (
          <div className="account-card account-card--muted">
            <div className="dashboard-header">
              <h3>Premium modules</h3>
            </div>
            <div className="subscription-highlight-grid">
              {premiumModules.map((module) => (
                <article key={module.id} className="subscription-highlight-card">
                  <strong>{module.title}</strong>
                  <p>{module.summary}</p>
                </article>
              ))}
            </div>
            {retention?.trialMessage && (
              <div className="subscription-note">{retention.trialMessage}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;
