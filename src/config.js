const getDefaultApiBase = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000';
  }

  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:5000`;
};

export const API_BASE = process.env.REACT_APP_API_BASE || getDefaultApiBase();
