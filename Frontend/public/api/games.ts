import { notif } from './utils.js';

if (typeof window !== 'undefined') {
	window.create_1v1_game = create_1v1_game;
	window.create_2v2_game = create_2v2_game;
}


export async function create_1v1_game(event: Event, player1: string, player2: string): Promise<void> {
	event.preventDefault();
	const score_left = localStorage.getItem("score_left");
	const score_right = localStorage.getItem("score_right");
	if (!player1 || !player2) return notif("Please select two players", false);

	const response = await fetch('/request/game/create-1v1-game', {
		method: 'POST',
		headers: { 
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ player1, player2, score_left, score_right }),
		credentials: 'include',
	});
	const data = await response.json();
	if (!data.success) return notif(data.error, false);
	if (localStorage.getItem("tournamentStarted") !== "true")
		localStorage.removeItem("Player2");
	else
		localStorage.setItem("tournamentCount", (parseInt(localStorage.getItem("tournamentCount")) + 1).toString());
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

	const response = await fetch('/request/game/create-2v2-game', {
		method: 'POST',
		headers: { 
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ player1, player2, player3, player4, score_left, score_right }),
		credentials: 'include',
	});
	const data = await response.json();
	if (!data.success)
		notif(data.error, false);
	localStorage.removeItem("Player2");
	localStorage.removeItem("Player3");
	localStorage.removeItem("Player4");
};