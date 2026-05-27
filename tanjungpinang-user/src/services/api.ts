const BASE_URL = '/api';

const getToken = () => localStorage.getItem('token');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setToken = (token: string) => localStorage.setItem('token', token);

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

const request = async (path: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string> || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (res.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }) });
      if (refreshRes.ok) {
        const { data } = await refreshRes.json();
        setToken(data.token);
        headers['Authorization'] = `Bearer ${data.token}`;
        res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
      } else {
        clearAuth();
        window.location.href = '/login';
        return null as unknown as Response; // Added cast to avoid null return type issue
      }
    }
  }
  return res;
};

export const get = (path: string) => request(path);
export const post = (path: string, body: unknown) => request(path, { method: 'POST', body: JSON.stringify(body) });
export const put = (path: string, body: unknown) => request(path, { method: 'PUT', body: JSON.stringify(body) });
export const del = (path: string) => request(path, { method: 'DELETE' });
export const isLoggedIn = () => !!localStorage.getItem('token');
export const getUser = () => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } };
