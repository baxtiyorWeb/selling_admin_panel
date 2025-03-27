import api from '@/lib/axios';
import { SavedProperty } from '@/types';

export const SavedScheduleService = {
	createSavedSchedule: async (
		scheduleId: number | string
	): Promise<SavedProperty> => {
		const response = await api.post<SavedProperty>(
			'/uy/create_saved_schedule/',
			{ schedule: scheduleId }
		);
		return response.data;
	},

	getSavedSchedules: async (): Promise<SavedProperty[]> => {
		try {
			const response = await api.get<SavedProperty[]>(
				'/uy/get_saved_schedule/'
			);

			// Check if response.data exists and is an array
			if (response && response.data) {
				return Array.isArray(response.data) ? response.data : [];
			}
			return [];
		} catch (error) {
			console.error('Error fetching saved schedules:', error);
			return []; // Return empty array on error
		}
	},

	deleteSavedSchedule: async (id: number | string): Promise<void> => {
		try {
			await api.delete(`/uy/delete_saved_schedule/${id}/`);
		} catch (error) {
			console.error(`Error deleting saved schedule ${id}:`, error);
			throw error;
		}
	},
};
