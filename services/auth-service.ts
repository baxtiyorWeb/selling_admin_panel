import api from '@/lib/axios';
import { LoginResponse, RegisterRequest, TokenRefreshResponse } from '@/types';

export const AuthService = {
	login: async (username: string, password: string): Promise<LoginResponse> => {
		const response = await api.post<LoginResponse>('/accounts/login/', {
			username,
			password,
		});
		return response.data;
	},

	register: async (userData: RegisterRequest): Promise<any> => {
		const response = await api.post('/accounts/register/', userData);
		return response.data;
	},

	refreshToken: async (refreshToken: string): Promise<TokenRefreshResponse> => {
		const response = await api.post<TokenRefreshResponse>(
			'/accounts/token/refresh/',
			{ refresh: refreshToken }
		);
		return response.data;
	},
};
