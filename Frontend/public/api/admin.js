{/* <td class="bg-white px-6 py-2 border border-gray-100 border-r-0">********</td> */}
{/* <td class="bg-white px-6 py-4 border border-gray-200 border-r-0 border-l-0"><img class="rounded-lg" style="width: 100%; height: auto; max-height: 50px; object-fit: contain;" src="/uploads/${user.profile_picture}"></td> */}


async function fetch_users() {
	try {
		const response = await fetch('/request/admin/get-all-users', {
			method: 'GET',
		});
		const users = await response.json();
		document.getElementById('users-table').innerHTML = users.map(user => /*html*/`
			<tr class="border-collapse text-sm hover:shadow-lg hover:rounded-xl hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer">
				<td class="bg-white px-6 py-2 rounded-l-xl border border-gray-100 border-r-0">${user.userId}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.username}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.doubleAuth_status === 0 ? "Disabled" : "Enabled" }</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.cgu_version || "—"}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.created_at}</td>
				<td class="bg-white px-6 py-2 rounded-r-xl border border-gray-100 border-l-0">
					<button class="bg-red-200 hover:bg-red-300 m-1 text-red-500 hover:text-red-600 px-3 py-1 rounded-full transition-colors duration-300 ease-in-out text-xs" onclick="delete_user(${user.userId})">Delete</button>
					<button class="bg-red-500 hover:bg-red-600 m-1 text-white px-3 py-1 rounded-full transition-colors duration-300 ease-in-out text-xs" onclick="force_delete_user(${user.userId})">Force Delete</button>
				</td>
			</tr>
		`).join('');
	} catch (err) {
		console.error('Error fetching users:', err);
	}
}

async function fetch_anonymized_users() {
	try {
		const response = await fetch('/request/admin/get-anonymized-users', {
			method: 'GET',
		});
		const data = await response.json();
		
		if (data.success) {
			document.getElementById('anonymized-users-table').innerHTML = data.users.map(user => /*html*/`
				<tr class="border-collapse text-sm hover:shadow-lg hover:rounded-xl hover:-translate-y-1 transition-all duration-200 ease-in-out">
					<td class="bg-gray-50 px-6 py-2 rounded-l-xl border border-gray-100 border-r-0">${user.userId}</td>
					<td class="bg-gray-50 px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.username}</td>
					<td class="bg-gray-50 px-6 py-2 rounded-r-xl border border-gray-100 border-l-0">${new Date(user.anonymized_at).toLocaleString()}</td>
				</tr>
			`).join('') || '<tr><td colspan="3" class="text-center py-4 text-gray-500">No anonymized users</td></tr>';
		}
	} catch (err) {
		console.error('Error fetching anonymized users:', err);
	}
}

//// async function fetch_games() {
//// 	try {
//// 		const response = await fetch('/request/admin/get-all-games', {
//// 			method: 'GET',
//// 		});
//// 		const games = await response.json();
//// 		document.getElementById('games-table').innerHTML = games.map(game => /*html*/`
//// 			<tr class="border-collapse text-sm hover:shadow-lg hover:rounded-xl hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer">
//// 				<td class="bg-white px-6 py-2 rounded-l-xl border border-gray-100 border-r-0">${game.gameId}</td>
//// 				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${game.user1_name}</td>
//// 				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${game.user2_name}</td>
//// 				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${game.user3_name ? `${game.user3_name}` : '—'}</td>
//// 				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${game.user4_name ? `${game.user4_name}` : '—'}</td>
//// 				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${game.score_left}</td>
//// 				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${game.score_right}</td>
//// 				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${game.created_at}</td>
//// 				<td class="bg-white px-6 py-2 rounded-r-xl border border-gray-100 border-l-0"><button class="bg-red-200 hover:bg-red-300 m-2 text-red-500 hover:text-red-600 px-4 py-1 rounded-full transition-colors duration-300 ease-in-out" onclick="delete_game(${game.gameId})">Delete</button></td>
//// 			</tr>
//// 		`).join('');
//// 	} catch (err) {
//// 		console.error('Erreur lors de la récupération des Jeux :', err);
//// 	}
//// }

async function fetch_games() {
    try {
        const response = await fetch('/request/admin/get-all-games', {
            method: 'GET',
        });
        const games = await response.json();

        document.getElementById('games-table').innerHTML = games.map(game => {
            // Vérifier si c'est un 1v1 ou un 2v2
            const is1v1 = !game.user3_name || game.user3_name === '—' || !game.user4_name || game.user4_name === '—';
            
            let teamLeftDisplay, teamRightDisplay;
            
            if (is1v1) {
                // 1v1: user1 à gauche, user2 à droite
                teamLeftDisplay = game.user1_name || 'Utilisateur supprimé';
                teamRightDisplay = game.user2_name || 'Utilisateur supprimé';
            } else {
                // 2v2: (user1 & user3) vs (user2 & user4)
                const teamLeft = [game.user1_name, game.user2_name].filter(name => name && name !== '—');
                const teamRight = [game.user3_name, game.user4_name].filter(name => name && name !== '—');
                
                teamLeftDisplay = teamLeft.length > 0 ? teamLeft.join(' & ') : 'Équipe incomplète';
                teamRightDisplay = teamRight.length > 0 ? teamRight.join(' & ') : 'Équipe incomplète';
            }

            return /*html*/`
            <tr class="border-collapse text-sm hover:shadow-lg hover:rounded-xl hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer">
                <td class="bg-white px-6 py-2 rounded-l-xl border border-gray-100 border-r-0">${game.gameId}</td>
                <td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0 font-semibold text-gray-800">${teamLeftDisplay}</td>
                <td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0 text-center font-bold text-blue-600">${game.score_left}</td>
                <td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0 text-center font-bold text-red-600">${game.score_right}</td>
                <td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0 font-semibold text-gray-800">${teamRightDisplay}</td>
                <td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0 text-gray-500">${game.created_at}</td>
                <td class="bg-white px-6 py-2 rounded-r-xl border border-gray-100 border-l-0">
                    <button class="bg-red-200 hover:bg-red-300 m-2 text-red-500 hover:text-red-600 px-4 py-1 rounded-full transition-colors duration-300 ease-in-out" onclick="delete_game(${game.gameId})">Delete</button>
                </td>
            </tr>
            `;
        }).join('');
    } catch (err) {
        console.error('Erreur lors de la récupération des Jeux :', err);
    }
}

async function fetch_friendships() {
	try {
		const response = await fetch('/request/admin/get-all-friendships', {
			method: 'GET',
		});
		const friendships = await response.json();
		document.getElementById('friendships-table').innerHTML = friendships.map(friendship => /*html*/`
			<tr class="border-collapse text-sm hover:shadow-lg hover:rounded-xl hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer">
				<td class="bg-white px-6 py-2 rounded-l-xl border border-gray-100 border-r-0">${friendship.friendshipId}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${friendship.username}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${friendship.friend_username}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${friendship.status}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${friendship.created_at}</td>
				<td class="bg-white px-6 py-2 rounded-r-xl border border-gray-100 border-l-0"><button class="bg-red-200 hover:bg-red-300 m-2 text-red-500 hover:text-red-600 px-4 py-1 rounded-full" onclick="delete_friendship(${friendship.friendshipId})">Delete</button></td>
			</tr>
		`).join('');
	} catch (err) {
		console.error('Erreur lors de la récupération des Jeux :', err);
	}
}

async function create_user(event) {
	event.preventDefault();

	const username = document.getElementById("addUser-username").value;
	const password = document.getElementById("addUser-password").value;
	const confirmPassword = document.getElementById("addUser-confirm-password").value;

	if (password !== confirmPassword) {
		notif("Passwords are different", false);
		return ;
	}

	const response = await fetch('/request/user/create-user', {
		method: 'POST',
		headers: { 
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, password }),
		credentials: 'include',
	});
	const data = await response.json();
	if (data.success) {
		notif(`User added : ${data.username} `, true);
		resultMessage.textContent = `User added : ${data.username}`
		document.getElementById("addUserForm").reset();
		close_user_modal();
	} else {
		notif(data.error, false);
	}
	fetch_users();
};

async function create_game(event) {
	event.preventDefault();

	const user1 = document.getElementById("addGame-user1").value;
	const user2 = document.getElementById("addGame-user2").value;
	const user3 = document.getElementById("addGame-user3").value;
	const user4 = document.getElementById("addGame-user4").value;

	if (!user1 || !user2) {
		notif("Please select two users", false);
		return ;
	}

	const response = await fetch('/request/admin/create-game', {
		method: 'POST',
		headers: { 
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ user1, user2, user3, user4 }),
		credentials: 'include',
	});
	const data = await response.json();
	if (data.success) {
		notif(`Game added : ${data.user1} vs ${data.user2}`, true);
		close_game_modal();
	} else {
		notif(data.error, false);
	}
	document.getElementById("addGameForm").reset();
	fetch_games();
};

async function create_friendship(event) {
	event.preventDefault();

	const user_username = document.getElementById("addFriendship-user").value;
	const friend_username = document.getElementById("addFriendship-friend").value;
	console.log(user_username, friend_username)
	if (!user_username || !friend_username) {
		notif("Please select two users", false);
		return ;
	}

	const response = await fetch('/request/admin/create-friendship', {
		method: 'POST',
		headers: { 
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ user_username, friend_username }),
		credentials: 'include',
	});
	const data = await response.json();
	if (data.success) {
		notif(`Frienship added : ${user_username} with ${friend_username}`, true);
		close_friendship_modal();
	} else {
		notif(data.error, false);
	}
	document.getElementById("addFriendshipForm").reset();
	fetch_friendships();
};

async function delete_user(userId) {
	if (confirm('Do you really want to delete this account ?')) {
		try {
			console.log('Try to delete user with ID:', userId);
			const response = await fetch('/request/admin/delete-user', { 
				method: 'DELETE',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId }),
				credentials: 'include'
			},);
			const data = await response.json();
			console.log('Response from server:', data);
			if (data.success) {
				console.log('User deleted successfully');
			} else {
                console.error('Delete failed:', data.error);
                notif(data.error || 'Failed to delete user', false);
            }
		} catch (err) {
			console.error('Erreur lors de la suppression :', err.message);
			notif('Failed to delete user' + err.message, false);
		}
	}
	fetch_users();
	fetch_games();
	fetch_friendships();
	fetch_anonymized_users();
}

async function force_delete_user(userId) {
	if (confirm('⚠️ PERMANENT DELETION WARNING ⚠️\n\nThis will PERMANENTLY DELETE the user and BREAK all game references!\nThis action cannot be undone.\n\nAre you absolutely sure?')) {
		try {
			console.log('Try to force delete user with ID:', userId);
			const response = await fetch('/request/admin/force-delete-user', { 
				method: 'DELETE',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId }),
				credentials: 'include'
			},);
			const data = await response.json();
			console.log('Response from server:', data);
			if (data.success) {
				console.log('User permanently deleted');
				notif('User permanently deleted', true);
			} else {
                console.error('Force delete failed:', data.error);
                notif(data.error || 'Failed to permanently delete user', false);
            }
		} catch (err) {
			console.error('Erreur lors de la suppression forcée :', err.message);
			notif('Failed to force delete user' + err.message, false);
		}
	}
	fetch_users();
	fetch_games();
	fetch_friendships();
	fetch_anonymized_users();
}

async function delete_game(gameId) {
	if (confirm('Do you really want to delete this game ?')) {
		try {
			const response = await fetch('/request/admin/delete-game', { 
				method: 'DELETE',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ gameId }),
				credentials: 'include'
			},);
			const data = await response.json();
			if (data.success) {
				console.log('Game deleted successfully');
			}
		} catch (err) {
			console.error('Erreur lors de la suppression :', err);
		}
	}
	fetch_games();
}

async function delete_friendship(friendshipId) {
	if (confirm('Do you really want to delete this friendship ?')) {
		try {
			const response = await fetch('/request/admin/delete-friendship', { 
				method: 'DELETE',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ friendshipId }),
				credentials: 'include'
			},);
			const data = await response.json();
			if (data.success) {
				notif(data.message, true);
			}
			else {
				notif(data.error, false);
			}
		} catch (err) {
			console.error('Erreur lors de la suppression :', err);
		}
	}
	fetch_friendships();
}


async function add_user_modal() {
	if (!document.getElementById("addGameModal").classList.contains("hidden"))
		document.getElementById("addGameModal").classList.add("hidden")
	document.getElementById("addUserModal").classList.remove("hidden");
}

async function add_game_modal() {
	if (!document.getElementById("addUserModal").classList.contains("hidden"))
		document.getElementById("addUserModal").classList.add("hidden")
	document.getElementById("addGameModal").classList.remove("hidden");
}

async function add_friendship_modal() {
	if (!document.getElementById("addFriendshipModal").classList.contains("hidden"))
		document.getElementById("addFriendshipModal").classList.add("hidden")
	document.getElementById("addFriendshipModal").classList.remove("hidden");
}

async function close_user_modal() {
	document.getElementById("addUserForm").reset();
	document.getElementById("addUserModal").classList.add("hidden");
}

async function close_game_modal() {
	document.getElementById("addGameForm").reset();
	document.getElementById("addGameModal").classList.add("hidden");
}

async function close_friendship_modal() {
	document.getElementById("addFriendshipForm").reset();
	document.getElementById("addFriendshipModal").classList.add("hidden");
}

window.addEventListener('DOMContentLoaded', () => {
	fetch_users();
	fetch_games();
	fetch_friendships();
	fetch_anonymized_users();
});