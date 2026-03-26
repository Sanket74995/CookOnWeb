import { API_BASE } from '../config';

const STORAGE_KEY = 'cookonweb-subscription';
const EVENT_NAME = 'cookonweb-subscription-change';

export const getStoredSubscriptionDetails = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to read stored subscription:', error);
    return null;
  }
};

export const storeSubscriptionDetails = (subscription) => {
  try {
    if (!subscription) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription));
    }

    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: subscription || null }));
  } catch (error) {
    console.error('Failed to store subscription:', error);
  }
};

export const subscribeToSubscriptionChanges = (listener) => {
  const handler = (event) => listener(event.detail || null);
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
};

export const fetchSubscriptionDetails = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    storeSubscriptionDetails(null);
    return null;
  }

  const response = await fetch(`${API_BASE}/api/auth/subscription`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to load subscription');
  }

  storeSubscriptionDetails(data.subscription || null);
  return data.subscription || null;
};

export const isPremiumSubscription = (subscription) =>
  String(subscription?.plan || 'free') === 'premium';

export const getPremiumFeatureMessage = (feature) =>
  `${feature} is available only on the Premium plan. Upgrade your subscription to continue.`;

export const clearStoredSubscriptionDetails = () => {
  storeSubscriptionDetails(null);
};
