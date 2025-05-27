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
		if (!data.success) {
			notif(data.error, false);
			return;
		}

		const friendships = data.friendships;
		const user = data.user;

		const accepted = friendships.filter(f => f.status === 'accepted');
		const pending = friendships.filter(f => f.status === 'pending');

		const renderFriend = (friendship, showActions) => `
			<div class="friend">
				<div class="friend-info">
					<img src="/uploads/${friendship.friendProfilePicture}" class="friend_photo" alt="Profile">
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
								: `
								`
							}
						</div>
					</div>
				</div>
				<button class="friend-btn delete-btn" onclick="delete_friendship(${friendship.friendshipId})">🗑️</button>
			</div>
		`;

		document.getElementById('friends-accepted').innerHTML =
			accepted.map(friend => renderFriend(friend, false)).join('') || `<div class="text-center">No friend found</div>`;

		document.getElementById('friends-pending').innerHTML =
			pending.map(friend => {
				const isReceivedRequest = user.userId === friend.friendId;
				return renderFriend(friend, isReceivedRequest);
			}).join('') || `<div class="text-center">No request found</div>`;

	} catch (err) {
		console.error('Erreur lors de la récupération des amis :', err);
	}
}

async function fetch_user_games() {
	try {
		const data = await fetchAPI('/request/game/get-user-games', 'GET', null, false);
		// sessionStorage.setItem('accessToken', data.accessToken);
		if (!data.success) {
			notif(data.error, false);
			return;
		}
		const games = data.games;
		const userId = data.user.userId;
		if (games && games.length > 0) {
			document.getElementById('games-table').innerHTML = games.map(game => {
				// Vérifier si c'est un match 2v2 (si user3_id existe)
				const is2v2 = game.user3_id && game.user4_id;
				const leftWin = (game.score_left - game.score_right) > 0;
				const result1v1 = leftWin && userId == game.user1_id ? 'win' : 'lose';
				const result2v2 = leftWin && (userId == game.user1_id || userId == game.user2_id) ? 'win' : 'lose';

				console.log("user3_id", game.user3_id);
				if (is2v2) {
					// Format d'affichage pour les matchs 2v2
					return /*html*/`
					<tr class="game_card_navBar ${result2v2}">
						<td class="profile_navBar team">
							<div class="team-player">
								<img src="/uploads/${game.user1ProfilePicture}" alt="profile" />
								<img src="/uploads/${game.user2ProfilePicture}" alt="profile" />
							</div>
							<div class="team-player">
								<p class="username_navBar">${game.user1_username}</p>
								<p class="username_navBar">${game.user2_username}</p>
							</div>
						</td>
						<td class="vs_info_navBar">
							<p class="score_navBar">${game.score_left} - ${game.score_right}</p>
						</td>
						<td class="opponent_navBar team">
							<div class="team-player">
								<p class="username_navBar">${game.user3_username}</p>
								<p class="username_navBar">${game.user4_username}</p>
							</div>
							<div class="team-player">
								<img src="/uploads/${game.user3ProfilePicture}" alt="profile" />
								<img src="/uploads/${game.user4ProfilePicture}" alt="profile" />
							</div>
						</td>
					</tr>`;
				} else {
				  // Format d'affichage pour les matchs 1v1 (existant)
				  return /*html*/`
					<tr class="game_card_navBar ${result1v1}">
					  <td class="profile_navBar">
						<img src="/uploads/${game.user1ProfilePicture}" alt="profile" />
						<p class="username_navBar">${game.user1_username}</p>
					  </td>
					  <td class="vs_info_navBar">
						<p class="score_navBar">${game.score_left} - ${game.score_right}</p>
					  </td>
					  <td class="opponent_navBar">
						<p class="username_navBar">${game.user2_username}</p>
						<img src="/uploads/${game.user2ProfilePicture}" alt="profile" />
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