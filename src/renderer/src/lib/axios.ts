import axios from 'axios';

let resolvedURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.faithcore.org';

// Safety safeguard: In production builds, never allow localhost/127.0.0.1 to be bundled
if (process.env.NODE_ENV === 'production' && (resolvedURL.includes('localhost') || resolvedURL.includes('127.0.0.1'))) {
  resolvedURL = 'https://api.faithcore.org';
}

const baseURL = resolvedURL;

const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => {
    // Allow 403 Forbidden to resolve normally to prevent Next.js React Dev Overlay from popping up during development
    return (status >= 200 && status < 300) || status === 403;
  }
});

// Add a request interceptor to inject Token and Tenant ID
api.interceptors.request.use(
  (config) => {
    // 1. Attach Sanctum API Bearer Token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // 2. Attach ChurchScope X-Tenant-ID
    const tenantId = localStorage.getItem('tenantId');
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and dispatch event for AppContext to handle
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
