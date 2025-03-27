import api from '@/lib/axios';
import { Category, CategoryFormData } from '@/types';

export const CategoryService = {
	createCategory: async (categoryData: CategoryFormData): Promise<Category> => {
		try {
			const response = await api.post<Category>(
				'/uy/create_category/',
				categoryData
			);
			return response.data;
		} catch (error) {
			console.error('Error creating category:', error);
			throw error;
		}
	},

	getAllCategories: async (): Promise<Category[]> => {
		try {
			const response = await api.get<Category[]>('/uy/get_all_category/');

			// Check if response.data exists and is an array
			if (response && response.data) {
				return Array.isArray(response.data) ? response.data : [];
			}
			return [];
		} catch (error) {
			console.error('Error fetching categories:', error);
			return []; // Return empty array on error
		}
	},

	getCategoryById: async (id: number | string): Promise<Category> => {
		try {
			const response = await api.get<Category>(`/uy/get_category_by_id/${id}/`);
			return response.data;
		} catch (error) {
			console.error(`Error fetching category ${id}:`, error);
			throw error;
		}
	},
};
