import { clearStoredSubscriptionDetails } from './subscription';

export const AUTH_EXPIRED_EVENT = 'cookonweb-auth-expired';

const DEFAULT_AUTH_MESSAGE = 'Your session has expired. Please log in again.';

let authExpiryHandled = false;

const decodeJwtPayload = (token) => {
  try {
    const [, payload] = String(token || '').split('.');
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(window.atob(padded));
  } catch (error) {
    return null;
  }
};

export const getSessionExpiredMessage = () => DEFAULT_AUTH_MESSAGE;

export const isTokenExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
};

export const clearAuthSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  clearStoredSubscriptionDetails();
};

export const resetAuthExpiryState = () => {
  authExpiryHandled = false;
};

export const getAuthFailureMessage = (payload = {}) => {
  if (payload?.code === 'TOKEN_EXPIRED') {
    return payload.message || DEFAULT_AUTH_MESSAGE;
  }

  if (payload?.code === 'TOKEN_INVALID') {
    return 'Your login session is no longer valid. Please log in again.';
  }

  if (/token|authorization|log in again/i.test(String(payload?.message || ''))) {
    return String(payload.message);
  }

  return DEFAULT_AUTH_MESSAGE;
};

export const notifyAuthExpired = (message = DEFAULT_AUTH_MESSAGE) => {
  if (authExpiryHandled) {
    return;
  }

  authExpiryHandled = true;
  clearAuthSession();
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT, {
    detail: { message }
  }));
};
