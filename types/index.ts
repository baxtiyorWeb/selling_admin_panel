// User types
export interface User {
	username: string;
	email: string;
	role: string;
	phone: string;
}

// Property types
export interface Property {
	id: number;
	user_id: User;
	title: string;
	description: string;
	price: string;
	location: string;
	image1: string | null;
	image2: string | null;
	created_at: string;
	status: 'active' | 'inactive';
	category: number;
}

// Category types
export interface Category {
	id: number;
	name: string;
	description?: string;
	user_id?: User;
}

// Saved property types
export interface SavedProperty {
	id: number;
	user_id: User;
	schedule: Property;
	saved_at: string;
}

// Auth types
export interface LoginRequest {
	username: string;
	password: string;
}

export interface LoginResponse {
	access: string;
	refresh: string;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
}

export interface TokenRefreshRequest {
	refresh: string;
}

export interface TokenRefreshResponse {
	access: string;
}

// Form data types
export interface PropertyFormData {
	title: string;
	description: string;
	price: string;
	location: string;
	category: string;
	status: 'active' | 'inactive';
	image1: File | null;
	image2?: File | null;
}

export interface CategoryFormData {
	name: string;
	description: string;
}

// API response types
export interface ApiResponse<T> {
	data: T;
	status: number;
	message?: string;
}
