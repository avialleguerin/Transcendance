export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface User {
	id: number;
	username: string;
	email?: string;
	profile_picture?: string;
	online_status?: number;
	last_activity?: string;
}

export interface GameResult {
	id: number;
	user1_name: string;
	user2_name: string;
	user3_name?: string;
	user4_name?: string;
	score_left: number;
	score_right: number;
	created_at: string;
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface RegisterRequest extends LoginRequest {
	confirmPassword: string;
}

export interface Friendship {
	friendshipId: number;
	user1_name: string;
	user2_name: string;
	status: string;
	created_at: string;
}

export interface PlatformerGame {
	platformerId: number;
	user1_name: string;
	user2_name: string;
	created_at: string;
}

export interface WebSocketMessage {
	type: string;
	data?: any;
}

export interface GameModeData {
	player1?: string;
	player2?: string;
	player3?: string;
	player4?: string;
}

// Déclarations globales pour les fonctions disponibles dans window
declare global {
	interface Window {
		notif: (message: string, success: boolean) => void;
		initGoogleSignIn: () => void;
		// tokenClient: any;
		handleViewTransitions: (viewName: string, previousView?: string) => void;
	}
}