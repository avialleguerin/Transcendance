import { notif, fetchAPI } from './utils.js';

if (typeof window !== 'undefined') {
	window.create_1v1_game = create_1v1_game;
	window.create_2v2_game = create_2v2_game;
	window.create_platformer = create_platformer;
	window.get_platformers = get_platformers;
}


export async function create_1v1_game(event: Event, name1: string, name2: string): Promise<void> {
	event.preventDefault();
	const score_left = localStorage.getItem("score_left");
	const score_right = localStorage.getItem("score_right");
	if (!name1 || !name2) return notif("Please select two players", false);

	const data = await fetchAPI('/request/game/create-1v1-game', 'POST', { name1, name2, score_left, score_right }, false);
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

	const name1 = localStorage.getItem("Player1");
	const name2 = localStorage.getItem("Player2");
	const name3 = localStorage.getItem("Player3");
	const name4 = localStorage.getItem("Player4");
	const score_left = localStorage.getItem("score_left");
	const score_right = localStorage.getItem("score_right");

	if (!name1 || !name2 || !name3 || !name4) {
		notif("Please select two players", false);
		return ;
	}

	const data = await fetchAPI('/request/game/create-2v2-game', 'POST', { name1, name2, name3, name4, score_left, score_right }, false);
	if (!data.success)
		notif(data.error, false);
	localStorage.removeItem("Player2");
	localStorage.removeItem("Player3");
	localStorage.removeItem("Player4");
	localStorage.removeItem("score_left");
	localStorage.removeItem("score_right");
};

export async function create_platformer(): Promise<void> {
	const name1 = localStorage.getItem("name1");
	const name2 = localStorage.getItem("Player2");
	const score_left = localStorage.getItem("score1");
	const score_right = localStorage.getItem("score2");
	if (!name1 || !name2 || !score_left || !score_right)
		return console.error("Missing paramters to create the game", false);

	const data = await fetchAPI('/request/platformer/create-platformer', 'POST', { name1, name2, score_left, score_right }, false);
	if (!data.success)
		return notif(data.error, false);
	localStorage.removeItem("score1");
	localStorage.removeItem("score2");
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