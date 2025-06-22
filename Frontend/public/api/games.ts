import { notif, fetchAPI, StorageKeys } from './utils.js';

if (typeof window !== 'undefined') {
	window.create_1v1_game = create_1v1_game;
	window.create_2v2_game = create_2v2_game;
	window.create_platformer = create_platformer;
	window.get_platformers = get_platformers;
}


export async function create_1v1_game(event: Event, player1: string, player2: string): Promise<void> {
	event.preventDefault();
	const score_left = StorageKeys.SCORE_LEFT;
	const score_right = StorageKeys.SCORE_RIGHT;
	if (!player1 || !player2) return notif("Please select two players", false);

	const data = await fetchAPI('/request/game/create-1v1-game', 'POST', { player1, player2, score_left, score_right }, false);
	if (!data.success) return notif(data.error, false);
	if (localStorage.getItem("tournamentStarted") !== "true")
		StorageKeys.PLAYER2 = null;
	else
		localStorage.setItem("tournamentCount", (parseInt(localStorage.getItem("tournamentCount")) + 1).toString());
	StorageKeys.SCORE_LEFT = 0;
	StorageKeys.SCORE_RIGHT = 0;
};

export async function create_2v2_game(event: Event): Promise<void> {
	event.preventDefault();

	const player1 = StorageKeys.PLAYER1;
	const player2 = StorageKeys.PLAYER2;
	const player3 = StorageKeys.PLAYER3;
	const player4 = StorageKeys.PLAYER4;
	const score_left = StorageKeys.SCORE_LEFT;
	const score_right = StorageKeys.SCORE_RIGHT;
	if (!player1 || !player2 || !player3 || !player4) {
		notif("Please select two players", false);
		return ;
	}

	const data = await fetchAPI('/request/game/create-2v2-game', 'POST', { player1, player2, player3, player4, score_left, score_right }, false);
	if (!data.success)
		notif(data.error, false);
	StorageKeys.PLAYER2 = null;
	StorageKeys.PLAYER3 = null;
	StorageKeys.PLAYER4 = null;
	StorageKeys.SCORE_LEFT = 0;
	StorageKeys.SCORE_RIGHT = 0;
};

export async function create_platformer(): Promise<void> {
	const player1 = StorageKeys.PLAYER1;
	const player2 = StorageKeys.PLAYER2;
	const score_player1 = StorageKeys.SCORE_PLAYER1;
	const score_player2 = StorageKeys.SCORE_PLAYER2;
	if (!player1 || !player2 || !score_player1 || !score_player2)
		return console.error("Missing paramters to create the game", false);

	const data = await fetchAPI('/request/platformer/create-platformer', 'POST', { player1, player2, score_player1, score_player2 }, false);
	if (!data.success)
		return notif(data.error, false);
	StorageKeys.SCORE_PLAYER1 = 0;
	StorageKeys.SCORE_PLAYER2 = 0;
};

export async function get_platformers(): Promise<any>
{
	const data = await fetchAPI('/request/platformer/get-user-platformers', 'GET', null, false);
	if (!data.success) {
		notif(data.error, false);
		return [];
	}
	return data.platformers;
}