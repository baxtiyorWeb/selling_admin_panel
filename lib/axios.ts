import axios, {
	type AxiosInstance,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from 'axios';

// Create an Axios instance with default config
const api: AxiosInstance = axios.create({
	baseURL: 'http://127.0.0.1:8000', // Replace with your actual API base URL
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor for adding auth token
api.interceptors.request.use(
	(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers = config.headers || {};
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: any) => Promise.reject(error)
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
	(response: AxiosResponse): AxiosResponse => response,
	async (error: any) => {
		const originalRequest = error.config;

		// If error is 401 and we haven't tried to refresh token yet
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Get refresh token from storage
				const refreshToken = localStorage.getItem('refreshToken');

				if (!refreshToken) {
					// Redirect to login if no refresh token
					window.location.href = '/login';
					return Promise.reject(error);
				}

				// Call token refresh endpoint
				const response = await axios.post('/accounts/token/refresh/', {
					refresh: refreshToken,
				});

				// Save new tokens
				const { access } = response.data;
				localStorage.setItem('token', access);

				// Retry original request with new token
				originalRequest.headers.Authorization = `Bearer ${access}`;
				return api(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login
				localStorage.removeItem('token');
				localStorage.removeItem('refreshToken');
				window.location.href = '/login';
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default api;
