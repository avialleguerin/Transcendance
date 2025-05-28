async function addFriend(event) {
	event.preventDefault();
	const friend = document.getElementById("friend_name_input").value;
	
	try {
		const data = await fetchAPI('/request/friendship/add-friend', 'POST', { friend });
		if (data.success)
			document.getElementById("code_validation_id").classList.remove('active');
	} catch (err) {
		console.log("Failed to add friend");
	}
	document.getElementById("friend_name_input").value = "";
	fetch_user_friendships();
}

async function accept_friendship(friendshipId) {
	try {
		const data = await fetchAPI('/request/friendship/accept-friend', 'POST', { friendshipId });
		if (data.success) {
			notif("Friendship status updated", true);
			fetch_user_friendships();
		} else {
			notif(data.error, false);
		}
	} catch (err) {
		console.log("Failed to accept friendship");
	}
}

async function delete_friendship(friendshipId) {
	try {
		const data = await fetchAPI('/request/friendship/delete-friend', 'DELETE', { friendshipId });
		if (data.success) {
			notif("Friendship status updated", true);
			fetch_user_friendships();
		} else {
			notif(data.error, false);
		}
	} catch (err) {
		console.log("Failed to accept friendship");
	}
}

// async function reject_friendship(friendshipId) {
// 	try {
// 		const data = await fetchAPI('/request/friendship/reject-friendship', 'POST', { friendshipId });
// 		if (data.success) {
// 			notif("Friendship accepted", true);
// 			fetch_user_friendships();
// 		} else {
// 			notif(data.error, false);
// 		}
// 	} catch (err) {
// 		console.log("Failed to accept friendship");
// 	}
// }

async function fetch_user_friendships() {
	try {
		const data = await fetchAPI('/request/friendship/get-user-friendships', 'GET', null, false);
		// sessionStorage.setItem('accessToken', data.accessToken);
		if (!data.success) {
			notif(data.error, false);
			return;
		}
		const friendships = data.friendships;
		const user = data.user;
		if (friendships && friendships.length > 0) {
			document.getElementById('friendships-table').innerHTML = friendships.map(friendship => /*html*/`
				<tr class="friend">
					<td>
						${friendship.status === 'accepted'
							? `<button onclick="fetch_user_games_big('${friendship.friend_username}')"><img src="/uploads/${friendship.friendProfilePicture}" class="friend_photo" alt="Profile"></button>`
							: '' }
					</td>
					<td class="friend_name" >${friendship.friend_username}</td>
					<td>
						${friendship.status === 'pending' && user.userId === friendship.friendId
						? `<button class="accept-btn" onclick="accept_friendship(${friendship.friendshipId})">Accept</button><button class="reject-btn" onclick="delete_friendship(${friendship.friendshipId})">Reject</button>`
						: `<span class="${friendship.status === 'accepted' ? 'text-green-500' : 
							(friendship.status === 'pending' ? 'text-yellow-500' : 'text-red-500')}">
							${friendship.status}
							</span>`
						}
					</td>
					<td>
						<button class="delete-btn" onclick="delete_friendship(${friendship.friendshipId})">Delete</button>
					</td>
				</tr>
			`).join('');
		} else {
			document.getElementById('friendships-table').innerHTML = `
				<tr><td colspan="4" class="text-center">No friends found</td></tr>
			`;
		}
	} catch (err) {
		console.error('Erreur lors de la récupération des Jeux :', err);
	}
}

async function fetch_user_games() {
	try {
		console.log("fetch_user_games");
		const data = await fetchAPI('/request/game/get-user-games', 'GET', null, false);
		if (!data.success) {
			notif(data.error, false);
			return;
		}
		const games = data.games;
		const userId = data.user.userId;
		if (games && games.length > 0) {
			document.getElementById('games-table').innerHTML = games.map(game => {
				// Calcul initial du score
				let dispScoreLeft = game.score_left;
				let dispScoreRight = game.score_right;
				const leftWinOriginal = (game.score_left - game.score_right) > 0;

				// Si match 2v2
				const is2v2 = game.user3_id && game.user4_id;
				if (is2v2) {
					let leftTeam = [
					  { id: game.user1_id, username: game.user1_username, profilePicture: game.user1ProfilePicture },
					  { id: game.user2_id, username: game.user2_username, profilePicture: game.user2ProfilePicture }
					];
					let rightTeam = [
					  { id: game.user3_id, username: game.user3_username, profilePicture: game.user3ProfilePicture },
					  { id: game.user4_id, username: game.user4_username, profilePicture: game.user4ProfilePicture }
					];

					const leftHasCurrent = leftTeam.some(player => player.id == userId);
					const rightHasCurrent = rightTeam.some(player => player.id == userId);

					if (!leftHasCurrent && rightHasCurrent) {
					  const tempTeam = leftTeam;
					  leftTeam = rightTeam;
					  rightTeam = tempTeam;
					  dispScoreLeft = game.score_right;
					  dispScoreRight = game.score_left;
					}
					const result2v2 = (dispScoreLeft - dispScoreRight) > 0 ? 'win' : 'lose';

					return /*html*/`
					  <tr class="game_card_navBar ${result2v2}">
						<td class="profile_navBar team">
						  <div class="team-player">
							<img src="/uploads/${leftTeam[0].profilePicture}" alt="profile" />
							<img src="/uploads/${leftTeam[1].profilePicture}" alt="profile" />
						  </div>
						  <div class="team-player">
							<p class="username_navBar">${leftTeam[0].username}</p>
							<p class="username_navBar">${leftTeam[1].username}</p>
						  </div>
						</td>
						<td class="vs_info_navBar">
						  <p class="score_navBar">${dispScoreLeft} - ${dispScoreRight}</p>
						</td>
						<td class="opponent_navBar team">
						  <div class="team-player">
							<p class="username_navBar">${rightTeam[0].username}</p>
							<p class="username_navBar">${rightTeam[1].username}</p>
						  </div>
						  <div class="team-player">
							<img src="/uploads/${rightTeam[0].profilePicture}" alt="profile" />
							<img src="/uploads/${rightTeam[1].profilePicture}" alt="profile" />
						  </div>
						</td>
					  </tr>
					`;
				} else {
					let leftPlayer = { id: game.user1_id, username: game.user1_username, profilePicture: game.user1ProfilePicture };
					let rightPlayer = { id: game.user2_id, username: game.user2_username, profilePicture: game.user2ProfilePicture };

					if (rightPlayer.id == userId && leftPlayer.id != userId) {
					  const tempPlayer = leftPlayer;
					  leftPlayer = rightPlayer;
					  rightPlayer = tempPlayer;
					  dispScoreLeft = game.score_right;
					  dispScoreRight = game.score_left;
					}
					const result1v1 = (dispScoreLeft - dispScoreRight) > 0 ? 'win' : 'lose';

					return /*html*/`
					  <tr class="game_card_navBar ${result1v1}">
						<td class="profile_navBar">
						  <img src="/uploads/${leftPlayer.profilePicture}" alt="profile" />
						  <p class="username_navBar">${leftPlayer.username}</p>
						</td>
						<td class="vs_info_navBar">
						  <p class="score_navBar">${dispScoreLeft} - ${dispScoreRight}</p>
						</td>
						<td class="opponent_navBar">
						  <p class="username_navBar">${rightPlayer.username}</p>
						  <img src="/uploads/${rightPlayer.profilePicture}" alt="profile" />
						</td>
					  </tr>
					`;
				}
			}).join('');
		} else {
			document.getElementById('games-table').innerHTML = `
				<tr><td colspan="4" class="text-center">No Games found</td></tr>
			`;
		}
	} catch (err) {
		console.error('Erreur lors de la récupération des Jeux :', err);
	}
}

async function fetch_user_games_big(username) {
	try {
		console.log("fetch_user_games");
		const data = await fetchAPI('/request/game/get-friend-games', 'POST', { username }, null, false);
		if (!data.success) {
			notif(data.error, false);
			return;
		}
		document.getElementById("game_history").classList.add('active');
		document.getElementById("view1").classList.remove('active');
		document.getElementById("btn_back_home").classList.remove('active');
		document.getElementById("view5").classList.remove('active');
		document.getElementById("profile_photo_circle_Game_History").innerHTML = `<img src="/uploads/${data.user.profile_picture}" alt="${data.username} profile picture" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
		document.getElementById("game_history_username").innerHTML = `${data.user.username}`;
		const games = data.games;
		const userId = data.user.userId;
		if (games && games.length > 0) {
			document.getElementById('games-table-big').innerHTML = games.map(game => {
				// Calcul initial du score
				let dispScoreLeft = game.score_left;
				let dispScoreRight = game.score_right;
				const leftWinOriginal = (game.score_left - game.score_right) > 0;

				// Si match 2v2
				const is2v2 = game.user3_id && game.user4_id;
				if (is2v2) {
					let leftTeam = [
					  { id: game.user1_id, username: game.user1_username, profilePicture: game.user1ProfilePicture },
					  { id: game.user2_id, username: game.user2_username, profilePicture: game.user2ProfilePicture }
					];
					let rightTeam = [
					  { id: game.user3_id, username: game.user3_username, profilePicture: game.user3ProfilePicture },
					  { id: game.user4_id, username: game.user4_username, profilePicture: game.user4ProfilePicture }
					];

					const leftHasCurrent = leftTeam.some(player => player.id == userId);
					const rightHasCurrent = rightTeam.some(player => player.id == userId);

					if (!leftHasCurrent && rightHasCurrent) {
					  const tempTeam = leftTeam;
					  leftTeam = rightTeam;
					  rightTeam = tempTeam;
					  dispScoreLeft = game.score_right;
					  dispScoreRight = game.score_left;
					}
					const result2v2 = (dispScoreLeft - dispScoreRight) > 0 ? 'win' : 'lose';

					return /*html*/`
					  <tr class="game_card_navBar ${result2v2}">
						<td class="profile_navBar team">
						  <div class="team-player">
							<img src="/uploads/${leftTeam[0].profilePicture}" alt="profile" />
							<img src="/uploads/${leftTeam[1].profilePicture}" alt="profile" />
						  </div>
						  <div class="team-player">
							<p class="username_navBar">${leftTeam[0].username}</p>
							<p class="username_navBar">${leftTeam[1].username}</p>
						  </div>
						</td>
						<td class="vs_info_navBar">
						  <p class="score_navBar">${dispScoreLeft} - ${dispScoreRight}</p>
						</td>
						<td class="opponent_navBar team">
						  <div class="team-player">
							<p class="username_navBar">${rightTeam[0].username}</p>
							<p class="username_navBar">${rightTeam[1].username}</p>
						  </div>
						  <div class="team-player">
							<img src="/uploads/${rightTeam[0].profilePicture}" alt="profile" />
							<img src="/uploads/${rightTeam[1].profilePicture}" alt="profile" />
						  </div>
						</td>
					  </tr>
					`;
				} else {
					let leftPlayer = { id: game.user1_id, username: game.user1_username, profilePicture: game.user1ProfilePicture };
					let rightPlayer = { id: game.user2_id, username: game.user2_username, profilePicture: game.user2ProfilePicture };

					if (rightPlayer.id == userId && leftPlayer.id != userId) {
					  const tempPlayer = leftPlayer;
					  leftPlayer = rightPlayer;
					  rightPlayer = tempPlayer;
					  dispScoreLeft = game.score_right;
					  dispScoreRight = game.score_left;
					}
					const result1v1 = (dispScoreLeft - dispScoreRight) > 0 ? 'win' : 'lose';

					return /*html*/`
					  <tr class="game_card_navBar ${result1v1}">
						<td class="profile_navBar">
						  <img src="/uploads/${leftPlayer.profilePicture}" alt="profile" />
						  <p class="username_navBar">${leftPlayer.username}</p>
						</td>
						<td class="vs_info_navBar">
						  <p class="score_navBar">${dispScoreLeft} - ${dispScoreRight}</p>
						</td>
						<td class="opponent_navBar">
						  <p class="username_navBar">${rightPlayer.username}</p>
						  <img src="/uploads/${rightPlayer.profilePicture}" alt="profile" />
						</td>
					  </tr>
					`;
				}
			}).join('');
		} else {
			document.getElementById('games-table').innerHTML = `
				<tr><td colspan="4" class="text-center">No Games found</td></tr>
			`;
		}
	} catch (err) {
		console.error('Erreur lors de la récupération des Jeux :', err);
	}
}

async function togglePanel(event)
{
	event.preventDefault();
	console.log("togglePanel");
	fetch_user_friendships();
	fetch_user_games();
}