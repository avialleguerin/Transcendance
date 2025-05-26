async function create_1v1_game(event) {
	event.preventDefault();

	const user1 = localStorage.getItem("Player1");
	const user2 = localStorage.getItem("Player2");
	const score_left = localStorage.getItem("score_left");
	const score_right = localStorage.getItem("score_right");

	if (!user1 || !user2) {
		notif("Please select two players", false);
		return ;
	}

	const response = await fetch('/request/game/create-1v1-game', {
		method: 'POST',
		headers: { 
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ user1, user2, score_left, score_right }),
		credentials: 'include',
	});
	const data = await response.json();
	if (!data.success)
		notif(data.error, false);
};
