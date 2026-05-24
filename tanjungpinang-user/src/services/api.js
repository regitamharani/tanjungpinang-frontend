const BASE_URL = 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('token');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setToken = (token) => localStorage.setItem('token', token);

const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

const request = async (path, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const { data } = await refreshRes.json();
        setToken(data.token);
        headers['Authorization'] = `Bearer ${data.token}`;
        res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
      } else {
        clearAuth();
        window.location.href = '/login';
        return null;
      }
    }
  }

  return res;
};

export const get = (path) => request(path);
export const post = (path, body) =>
  request(path, { method: 'POST', body: JSON.stringify(body) });
export const put = (path, body) =>
  request(path, { method: 'PUT', body: JSON.stringify(body) });
export const del = (path) => request(path, { method: 'DELETE' });

export const isLoggedIn = () => !!localStorage.getItem('token');
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};
export { clearAuth };
