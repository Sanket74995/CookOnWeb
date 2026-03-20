import { API_BASE } from '../config';

export const fetchSubscriptionDetails = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
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

  return data.subscription || null;
};

export const isPremiumSubscription = (subscription) =>
  String(subscription?.plan || 'free') === 'premium';

export const getPremiumFeatureMessage = (feature) =>
  `${feature} is available only on the Premium plan. Upgrade your subscription to continue.`;
