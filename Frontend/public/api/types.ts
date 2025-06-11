import { delete_friendship } from "./friendships";

export interface ApiResponse<T = any> {
	success: boolean;
	accessToken?: string;
	connection_status?: string;
	user?: User;
	player2?: User;
	player3?: User;
	player4?: User;
	//// data?: T;
	// for error handling
	error?: string;
	message?: string;
	function?: string;
}

export interface Err {
	error: string;
	message?: string;
	function?: string;
}

export interface User {
	id: number;
	username: string;
	userId?: string;
	email?: string;
	doubleAuth_status?: boolean;
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
	friendId: number;
	friend_username: string;
	status: string; // or 'accepted' | 'pending';
	created_at: string;
	friendshipId: number;
	user1_name: string;
	user2_name: string;
	friendOnlineStatus?: boolean;
	friendProfilePicture?: string;
}

export interface PlatformerGame {
	platformerId?: number;
	user1_name?: string;
	user2_name?: string;
	created_at?: string;
}

export interface PlatformerInstance extends PlatformerGame {
	createAccount?: boolean;
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

export interface GameScore {
	score_left: number;
	score_right: number;
	user1_id: number; user1_username: string; user1ProfilePicture?: string;
	user2_id: number; user2_username: string; user2ProfilePicture?: string;
	user3_id?: number; user3_username?: string; user3ProfilePicture?: string;
	user4_id?: number; user4_username?: string; user4ProfilePicture?: string;
	// created_at: string;
}

export interface GoogleTokenClient {
	requestAccessToken(): void;
}

export interface GoogleSignInResponse {
	access_token: string;
	error?: string;
}


//* UTILS
export interface ClassModification {
	id: string;
	className?: string;
}

export interface UIConfig {
	removeClass?: (string | ClassModification)[];
	addClass?: (string | ClassModification)[];
	setContent?: Record<string, string>;
	resetForms?: string[];
}
 
declare global {
	const google: Window['google'];
	interface Window {
		google: {
			accounts: {
				oauth2: {
					initTokenClient(config: any): GoogleTokenClient;
				}
			}
		};
		//* auth.ts
		login: (event: Event) => Promise<void>;
		login_1v1: (event: Event) => Promise<void>;
		login_2v2: (event: Event) => Promise<void>;
		login_tournament: (event: Event) => Promise<void>;
		login_platformer: (event: Event) => Promise<void>;
		logout: (event: Event) => Promise<void>;
		verify2FA: (event: Event) => Promise<void>;
		register: (event: Event) => Promise<void>;
		refreshInfos: (event: Event) => Promise<void>;
		initGoogleSignIn: () => void;
		handleGoogleSignIn: (response: GoogleSignInResponse) => Promise<void>;
		tokenClient: GoogleTokenClient | null;

		//* friendship.ts
		addFriend: (event: Event) => Promise<void>;
		accept_friendship: (friendshipId: number) => Promise<void>;
		delete_friendship: (friendshipId: number) => Promise<void>;
		fetch_user_friendships: () => Promise<void>;
		fetch_user_games: () => Promise<void>;
		fetch_user_games_big: (username: string) => Promise<void>;
		togglePanel: (event: Event) => void;

		//* userManagement.ts
		accessProfileInfo: (event: Event) => Promise<void>;
		changeProfilePicture: (event: Event) => Promise<void>;
		activate2FA: (event: Event) => Promise<void>;
		update_doubleAuth: () => Promise<void>;
		export_data: () => Promise<void>;
		anonymize_user: () => Promise<void>;
		delete_account: () => Promise<void>;
		fetchProfile: () => Promise<void>;
		updateProfileInfo: (event: Event) => Promise<void>;

		//* utils.ts
		notif: (message: string, success: boolean) => void;
		handleViewTransitions: (viewName: string, previousView?: string) => void;
	}
}