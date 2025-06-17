import { notif, fetchAPI } from './utils.js';

if (typeof window !== 'undefined') {
	window.create_1v1_game = create_1v1_game;
	window.create_2v2_game = create_2v2_game;
	window.create_platformer = create_platformer;
	window.get_platformers = get_platformers;
}


export async function create_1v1_game(event: Event, player1: string, player2: string): Promise<void> {
	event.preventDefault();
	const score_left = localStorage.getItem("score_left");
	const score_right = localStorage.getItem("score_right");
	if (!player1 || !player2) return notif("Please select two players", false);

	const data = await fetchAPI('/request/game/create-1v1-game', 'POST', { player1, player2, score_left, score_right }, false);
	if (!data.success) return notif(data.error, false);
	if (localStorage.getItem("tournamentStarted") !== "true")
		localStorage.removeItem("Player2");
	else
		localStorage.setItem("tournamentCount", (parseInt(localStorage.getItem("tournamentCount")) + 1).toString());
	localStorage.removeItem("score_left");
	localStorage.removeItem("score_right");
};

export async function create_2v2_game(event: Event): Promise<void> {
	event.preventDefault();

	const player1 = localStorage.getItem("Player1");
	const player2 = localStorage.getItem("Player2");
	const player3 = localStorage.getItem("Player3");
	const player4 = localStorage.getItem("Player4");
	const score_left = localStorage.getItem("score_left");
	const score_right = localStorage.getItem("score_right");

	if (!player1 || !player2 || !player3 || !player4) {
		notif("Please select two players", false);
		return ;
	}

	const data = await fetchAPI('/request/game/create-2v2-game', 'POST', { player1, player2, player3, player4, score_left, score_right }, false);
	if (!data.success)
		notif(data.error, false);
	localStorage.removeItem("Player2");
	localStorage.removeItem("Player3");
	localStorage.removeItem("Player4");
	localStorage.removeItem("score_left");
	localStorage.removeItem("score_right");
};

export async function create_platformer(): Promise<void> {
	// localStorage.setItem("platformer_game_created", "true");
	const player1 = localStorage.getItem("Player1");
	const player2 = localStorage.getItem("Player2");
	const score_player1 = localStorage.getItem("score_player1");
	const score_player2 = localStorage.getItem("score_player2");
	console.log("Creating platformer game with", player1, player2, score_player1, score_player2);
	if (!player1 || !player2 || !score_player1 || !score_player2)
		return console.error("Missing paramters to create the game", false);

	const data = await fetchAPI('/request/platformer/create-platformer', 'POST', { player1, player2, score_player1, score_player2 }, false);
	if (!data.success)
		return notif(data.error, false);
	localStorage.removeItem("Player2");
	localStorage.removeItem("score_player1");
	localStorage.removeItem("score_player2");
};

export async function get_platformers(): Promise<any>
{
	const data = await fetchAPI('/request/platformer/get-user-platformers', 'GET', null, false);
	console.log("Platformers:", data.platformers);
	if (!data.success) {
		notif(data.error, false);
		return [];
	}
	return data.platformers;
}