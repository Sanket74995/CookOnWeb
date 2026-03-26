export const THEME_STORAGE_KEY = 'cookonweb-theme';

export const normalizeTheme = (value) => (value === 'dark' ? 'dark' : 'light');

export const getStoredTheme = () => normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY) || 'light');

export const applyTheme = (theme) => {
  const nextTheme = normalizeTheme(theme);
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  window.dispatchEvent(new CustomEvent('cookonweb-theme-change', { detail: nextTheme }));
  return nextTheme;
};
