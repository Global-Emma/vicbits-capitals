import axios from 'axios';

// Detect environment variable for Next.js, Vite, or local fallback
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.VITE_API_URL ||
  process.env.NEXT_PUBLIC_VITE_API_URL ||
  "http://localhost:3001";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for HTTP-Only refresh cookies
});

// Variables to handle concurrent request queuing during token refresh
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

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================
api.interceptors.request.use(
  (config) => {
    const rawToken = localStorage.getItem('accessToken');
    let accessToken = null;

    if (rawToken) {
      try {
        accessToken = JSON.parse(rawToken);
      } catch {
        accessToken = rawToken; // Safe fallback if stored as unquoted string
      }
    }

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR (Auto Token Refresh)
// ==========================================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized (and not from auth endpoints themselves)
    const isUnauthorized =
      error.response?.status === 401 &&
      !originalRequest.url?.includes('/auth/refresh-token') &&
      !originalRequest.url?.includes('/auth/login');

    if (isUnauthorized && !originalRequest._retry) {
      // 1. If a refresh request is ALREADY in progress, queue subsequent calls
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 2. Perform token refresh call using bare axios to avoid interceptor recursion
        const response = await axios.post(
          `${API_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.accessToken;

        // Save new token to local storage
        localStorage.setItem("accessToken", JSON.stringify(newAccessToken));
        localStorage.setItem("login", "true");

        // Update Authorization header for original failed request
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 3. Resolve all queued requests with the new token
        processQueue(null, newAccessToken);

        // 4. Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Reject all queued requests if refresh fails
        processQueue(refreshError, null);

        // Clean up invalid session data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("login");

        const errorMessage =
          (refreshError as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Session expired. Please log in again.";
        localStorage.setItem("error", errorMessage);

        // Optional: Trigger global redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;