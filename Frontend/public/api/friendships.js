
let bool = localStorage.getItem("bool", "true");

async function addFriend(event) {
	event.preventDefault();
	const friend = document.getElementById("friend_name_input").value;
	
	try {
		const data = await fetchAPI('/request/friendship/add-friend', 'POST', { friend });
		if (data.success)
			fetch_user_friendships();
		document.getElementById("friend_name_input").value = "";
	} catch (err) {
		notif("Failed to add '" + friend + "' as a friend", false);
	}
}

async function accept_friendship(friendshipId) {
	try {
		const data = await fetchAPI('/request/friendship/accept-friend', 'POST', { friendshipId });
		if (data.success)
			fetch_user_friendships();
	} catch (err) {
		notif("Failed to accept this friend", false);
	}
}

async function delete_friendship(friendshipId) {
	try {
		const data = await fetchAPI('/request/friendship/delete-friend', 'DELETE', { friendshipId });
		if (data.success)
			fetch_user_friendships();
	} catch (err) {
		notif("Failed to accept this friend", false);
	}
}

async function fetch_user_friendships() {
	try {
		const data = await fetchAPI('/request/friendship/get-user-friendships', 'GET', null, false);
		if (!data.success) {
			notif(data.error, false);
			return;
		}

		const friendships = data.friendships;
		const user = data.user;

		const accepted = friendships.filter(f => f.status === 'accepted');
		const pending = friendships.filter(f => f.status === 'pending');

		const renderFriend = (friendship, showActions) => {
			let statusClass = `${friendship.friendOnlineStatus ? 'friend_online_status status-online' : 'friend_online_status status-offline'}`;
			let statusTitle = `${friendship.friendOnlineStatus ? 'Online' : 'Offline'}`;
			let friendshipProfilePicture = friendship.status === 'accepted' ? friendship.friendProfilePicture : 'default-profile-picture.png';
			return `
				<div class="friend">
					<div class="friend-info">
						<div class="${friendship.status === 'accepted'? statusClass : ''}" title="${statusTitle}"></div>
						<img src="/uploads/${friendshipProfilePicture}" class="friend_photo" alt="Profile">
						<div class="friend-details">
							<p class="friend_name">${friendship.friend_username}</p>
							<div class="friend-status-actions">
								${
									showActions
									? `
										<div class="friend-actions">
											<button class="friend-btn accept-btn" onclick="accept_friendship(${friendship.friendshipId})">✓</button>
											<button class="friend-btn reject-btn" onclick="delete_friendship(${friendship.friendshipId})">✖</button>
										</div>
									`
									: ``
								}
							</div>
						</div>
					</div>
					<button id="btn_delete_friend" class="friend-btn delete-btn" onclick="delete_friendship(${friendship.friendshipId})">
						<img src="/srcs/game/assets/image/trash.svg" alt="Delete Friend" class="delete-icon">
					</button>
				</div>
			`;
		};

		document.getElementById('friends-accepted').innerHTML =
			accepted.map(friend => renderFriend(friend, false)).join('') || `<div class="text-center">No Friends found</div>`;

		const gameHistory = document.getElementById('game_history');
		const exit_game_history_btn = document.getElementById('exit_game_history_btn');

		const friendPhotos = document.querySelectorAll('.friend_photo');
		const friendDeleteBtns = document.getElementById('btn_delete_friend');

		friendPhotos.forEach(photo => {
			photo.onclick = function() {
				if (!gameHistory.classList.contains('active')) {
					console.log("Opening game history view");
					fetch_user_games_big(this.nextElementSibling.querySelector('.friend_name').textContent);
					gameHistory.classList.add('active');
					exit_game_history_btn.style.display = 'none';
					localStorage.setItem('historyIsVisible', 'true');
					historyIsActive = true;
					localStorage.setItem("bool", "true");
					localStorage.setItem('historyVisible', 'true');
					friendDeleteBtns.style.display = 'none';
				}
				else if (localStorage.getItem('bool') === "true" && gameHistory.classList.contains('active')) {
					console.log("Closing game history view");
					gameHistory.classList.remove('active');
					exit_game_history_btn.style.display = 'block';
					localStorage.setItem('historyIsVisible', 'false');
					historyIsActive = false;
					localStorage.setItem("bool", "false");
					friendDeleteBtns.style.display = 'block';
					localStorage.setItem('historyVisible', 'true');
					console.log("bool =", localStorage.getItem("bool"));
				}
			};
		});

		const deleteButtons = document.querySelectorAll('.delete-btn');

		if (deleteButtons && deleteButtons.length > 0) {
			deleteButtons.forEach(button => {
				button.addEventListener('click', function(event) {
					event.stopPropagation();
					if (gameHistory.classList.contains('active')) {
						console.log("Fermeture de l'historique des jeux avant suppression");
						gameHistory.classList.remove('active');
						exit_game_history_btn.style.display = 'block';
						localStorage.setItem('historyIsVisible', 'false');
						localStorage.setItem('bool', 'false');
						historyIsActive = false;
						document.querySelectorAll('.delete-btn').forEach(btn => {
							btn.style.display = 'block';
						});
					}
				});
			});
		}


	
		document.getElementById('friends-pending').innerHTML =
			pending.map(friend => {
				const isReceivedRequest = user.userId === friend.friendId;
				return renderFriend(friend, isReceivedRequest);
			}).join('') || `<div class="text-center">No Requests found</div>`;

	} catch (err) {
		console.error('Erreur lors de la récupération des amis :', err);
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
				let dispScoreLeft = game.score_left;
				let dispScoreRight = game.score_right;
				const leftWinOriginal = (game.score_left - game.score_right) > 0;

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
						<td class="profile_navBar_team">
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
						<td class="opponent_navBar_team">
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
		const user = data.user;
		const userId = user.userId;
		const games = data.games;
		document.getElementById("profile_photo_circle_Game_History").innerHTML = `<img src="/uploads/${data.user.profile_picture}" alt="${data.username} profile picture" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
		document.getElementById("profile_photo_circle_Game_History").classList.add(`${data.user.online_status ? 'online' : 'offline'}`);
		document.getElementById("game_history_username").innerHTML = `${data.user.username}`;
		document.getElementById("games_won_history").innerHTML = `${user.games_won}`;
		document.getElementById("games_lost_history").innerHTML = `${user.games_lost}`;
		document.getElementById("games_played_history").innerHTML = `${user.games_lost + user.games_won}`;
		document.getElementById("win_rate_history").innerHTML = `${(user.games_won + user.games_lost) > 0 ? Math.round((user.games_won / (user.games_won + user.games_lost)) * 100) : 0} %`;
		if (games && games.length > 0) {
			document.getElementById('games-table-big').innerHTML = games.map(game => {
				let dispScoreLeft = game.score_left;
				let dispScoreRight = game.score_right;
				const leftWinOriginal = (game.score_left - game.score_right) > 0;

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
					<tr class="game_card_navBar team ${result2v2}">
						<td class="profile_navBar_team">
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
						<td class="opponent_navBar_team">
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
			document.getElementById('games-table-big').innerHTML = `
				<tr><td colspan="4" class="text-center-big">No Games found</td></tr>
			`;
		}
	} catch (err) {
		console.error('Erreur lors de la récupération des Jeux :', err);
	}
}

async function togglePanel(event)
{
	event.preventDefault();
	fetch_user_friendships();
	fetch_user_games();
}