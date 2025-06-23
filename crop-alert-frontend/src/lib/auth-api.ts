import axios from 'axios';

const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';


export const authApi = axios.create({
  baseURL: backendUrl, // Dynamically use env variable
});

// Request interceptor — still works like before
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — NEW (Handle expired token)
authApi.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(`${backendUrl}/auth/refresh`, {
          refresh_token: refreshToken
        });

        const newAccessToken = res.data.access_token;
        localStorage.setItem('token', newAccessToken);

        // Update and retry failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        console.error("Refresh failed", refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
