{/* <td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">********</td> */}
{/* <td class="bg-white px-6 py-4 border border-gray-200 border-r-0 border-l-0"><img class="rounded-lg" style="width: 100%; height: auto; max-height: 50px; object-fit: contain;" src="/uploads/${user.profile_picture}"></td> */}

// <td class="bg-white px-6 py-4 border border-gray-200 border-r-0 border-l-0">${user.email}</td>

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
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.email.substring(0, 2)}***@${user.email.split('@')[1]}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.doubleAuth_status === 0 ? "Disabled" : "Enabled" }</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.created_at}</td>
				<td class="bg-white px-6 py-2 rounded-r-xl border border-gray-100 border-l-0"><button class="bg-red-200 hover:bg-red-300 m-2 text-red-500 hover:text-red-600 px-4 py-1 rounded-full transition-colors duration-300 ease-in-out" onclick="delete_user(${user.userId})">Delete</button></td>
			</tr>
		`).join('');
	} catch (err) {
		console.error('Erreur lors de la récupération des utilisateurs :', err);
	}
}

async function fetch_games() {
	try {
		const response = await fetch('/request/admin/get-all-games', {
			method: 'GET',
		});
		const games = await response.json();
		document.getElementById('games-table').innerHTML = games.map(game => /*html*/`
			<tr class="border-collapse text-sm hover:shadow-lg hover:rounded-xl hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer">
				<td class="bg-white px-6 py-2 rounded-l-xl border border-gray-100 border-r-0">${game.gameId}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${game.user1_name}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${game.user2_name}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${game.winner_name ? `${game.winner_name}` : 'N/A'}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${game.created_at}</td>
				<td class="bg-white px-6 py-2 rounded-r-xl border border-gray-100 border-l-0"><button class="bg-red-200 hover:bg-red-300 m-2 text-red-500 hover:text-red-600 px-4 py-1 rounded-full transition-colors duration-300 ease-in-out" onclick="delete_game(${game.gameId})">Delete</button></td>
			</tr>
		`).join('');
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
	const email = document.getElementById("addUser-email").value;
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
		body: JSON.stringify({ username, email, password }),
		credentials: 'include',
	});
	const data = await response.json();
	if (data.success) {
		notif(`User added : ${data.username} (${data.email})`, true);
		resultMessage.textContent = `User added : ${data.username} (${data.email})`
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

	if (!user1 || !user2) {
		notif("Please select two users", false);
		return ;
	}

	const response = await fetch('/request/game/create-game', {
		method: 'POST',
		headers: { 
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ user1, user2 }),
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
			const response = await fetch('/request/admin/delete-user', { 
				method: 'DELETE',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId }),
				credentials: 'include'
			},);
			const data = await response.json();
			if (data.success) {
				console.log('User deleted successfully');
			}
		} catch (err) {
			console.error('Erreur lors de la suppression :', err);
		}
	}
	fetch_users();
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
});