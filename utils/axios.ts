import axios from 'axios';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.VITE_API_URL ||
  process.env.NEXT_PUBLIC_VITE_API_URL ||
  'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let isRefreshing = false;

type FailedQueueItem = {
  resolve: (token: string | null) => void;
  reject: (reason?: unknown) => void;
};

let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

const getStoredAccessToken = () => {
  if (typeof window === 'undefined') return null;

  const rawToken = localStorage.getItem('accessToken');
  if (!rawToken) return null;

  try {
    const parsedToken = JSON.parse(rawToken);
    return typeof parsedToken === 'string' ? parsedToken : null;
  } catch {
    return rawToken;
  }
};

const redirectToSignIn = () => {
  if (typeof window === 'undefined') return;

  const currentPath = window.location.pathname;
  if (currentPath === '/sign-in' || currentPath === '/login') return;

  window.location.href = '/';
};

api.interceptors.request.use(
  (config) => {
    const accessToken = getStoredAccessToken();

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || '';
    const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh-token');
    const isUnauthorized = error.response?.status === 401 && !isAuthRequest;

    if (!isUnauthorized || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (!token) {
            return Promise.reject(new Error('Token refresh failed.'));
          }

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = response?.data?.accessToken;

      if (!newAccessToken) {
        throw new Error('Refresh token succeeded but no new access token was returned.');
      }

      localStorage.setItem('accessToken', JSON.stringify(newAccessToken));
      localStorage.setItem('login', 'true');

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      localStorage.removeItem('accessToken');
      localStorage.removeItem('login');

      const errorMessage =
        (refreshError as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Session expired. Please sign in again.';

      localStorage.setItem('error', errorMessage);
      redirectToSignIn();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;