const API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8000/api'
  : 'https://aitc-property-bpo-management-group.onrender.com/api';

const ACCESS_KEY = 'aitc_access_token';
const REFRESH_KEY = 'aitc_refresh_token';
const USER_KEY = 'aitc_user';

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.detail || body.non_field_errors?.[0] || Object.values(body).flat?.()[0] || 'Request failed';
    throw new Error(message);
  }
  return body;
}

export async function login(username, password) {
  const data = await request('/auth/token/', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  localStorage.setItem(ACCESS_KEY, data.access);
  localStorage.setItem(REFRESH_KEY, data.refresh);
  const user = await me(data.access);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export async function register({ username, email, password, first_name = '', last_name = '' }) {
  return request('/auth/register/', {
    method: 'POST',
    body: JSON.stringify({ username, email, password, first_name, last_name })
  });
}

export async function refreshToken() {
  const refresh = localStorage.getItem(REFRESH_KEY);
  if (!refresh) return null;
  try {
    const data = await request('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh })
    });
    localStorage.setItem(ACCESS_KEY, data.access);
    return data.access;
  } catch {
    logout();
    return null;
  }
}

export async function me(accessToken = localStorage.getItem(ACCESS_KEY)) {
  if (!accessToken) throw new Error('Not authenticated');
  return request('/auth/me/', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
}

export async function authenticatedFetch(path, options = {}) {
  let access = localStorage.getItem(ACCESS_KEY);
  const makeRequest = (token) => fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  let response = await makeRequest(access);
  if (response.status === 401) {
    access = await refreshToken();
    if (access) response = await makeRequest(access);
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || 'Request failed');
  }
  return response;
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function logout() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAdmin(user) {
  return Boolean(user?.is_superuser || user?.is_staff || user?.role === 'Admin');
}

export function isManager(user) {
  return isAdmin(user) || user?.role === 'Manager';
}
