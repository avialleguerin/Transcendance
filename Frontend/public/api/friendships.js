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

async function update_friendship(friendshipId, change_status) {
	try {
		console.log("update_friendship: ", change_status);
		const data = await fetchAPI('/request/friendship/update-status', 'POST', { friendshipId, change_status });
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
						<img src="/upload/${friendship.friendProfilePicture}" class="friend_photo" alt="Profile">
					</td>
					<td class="friend_name" >${friendship.friend_username}</td>
					<td>
						${friendship.status === 'pending' && user.userId === friendship.friendId
						? `<button class="accept-btn" onclick="update_friendship(${friendship.friendshipId}, 'accept')">Accept</button><button class="reject-btn" onclick="update_friendship(${friendship.friendshipId}, 'reject')">Reject</button>`
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
		const data = await fetchAPI('/request/game/get-user-games', 'GET', null, false);
		// sessionStorage.setItem('accessToken', data.accessToken);
		if (!data.success) {
			notif(data.error, false);
			return;
		}
		const games = data.games;
		if (games && games.length > 0) {
			document.getElementById('games-table').innerHTML = games.map(game => /*html*/`
				<tr class="game_card_navBar win">
					<td class="profile_navBar">
						<img src="./upload/${game.user1ProfilePicture}" alt="profile" />
						<p class="username_navBar">${game.user1_username}</p>
					</td>
					<td class="vs_info_navBar">
						<p class="score_navBar">5 - 2</p>
						<p class="result_navBar">${game.winner_username}</p>
					</td>
					<td class="opponent_navBar">
						<p class="username_navBar">${game.user2_username}</p>
						<img src="./upload/${game.user2ProfilePicture}" alt="profile" />
					</td>
				</tr>
			`).join('');
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