async function fetch_users() {
	try {
		const response = await fetch('/request/admin/get-all-users', {
			method: 'GET',
		});
		const users = await response.json();
		document.getElementById('users-table').innerHTML = users.map(user => `
			<tr>
				<td class="border px-4 py-2">${user.userId}</td>
				<td class="border px-4 py-2"><img class="rounded-lg" style="width: 100%; height: auto; max-height: 80px; object-fit: contain;" src="/uploads/${user.profile_picture}"></td>
				<td class="border px-4 py-2">${user.username}</td>
				<td class="border px-4 py-2">${user.email}</td>
				<td class="border px-4 py-2">********</td>
				<td class="border px-4 py-2">${user.doubleAuth_status === 0 ? "disabled" : "enabled"}</td>
				<td class="border px-4 py-2">${user.doubleAuth_secret}</td>
				<td class="border px-4 py-2">${user.created_at}</td>
				<td class="border px-4 py-2"><button class="bg-gray-700 hover:bg-red-500 m-2 text-white px-2 py-1 rounded" onclick="delete_user(${user.userId})">Delete</button></td>
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
		document.getElementById('games-table').innerHTML = games.map(game => `
			<tr>
				<td class="border px-4 py-2">${game.gameId}</td>
				<td class="border px-4 py-2">${game.user1}</td>
				<td class="border px-4 py-2">${game.user2}</td>
				<td class="border px-4 py-2">${game.winner}</td>
				<td class="border px-4 py-2">${game.created_at}</td>
				<td class="border px-4 py-2"><button class="bg-gray-700 hover:bg-red-500 m-2 text-white px-2 py-1 rounded" onclick="delete_game(${game.gameId})">Delete</button></td>
			</tr>
		`).join('');
	} catch (err) {
		console.error('Erreur lors de la récupération des Jeux :', err);
	}
}

async function register(event) {
	event.preventDefault();

	const username = document.getElementById("addUser-username").value;
	const email = document.getElementById("addUser-email").value;
	const password = document.getElementById("addUser-password").value;
	const confirmPassword = document.getElementById("addUser-confirm-password").value;
	let resultMessage = document.getElementById("addUser-resultMessage");

	if (password !== confirmPassword) {
		resultMessage.textContent = "❌ Passwords are different";
		return ;
	}

	const response = await fetch('/request/user/register', {
		method: 'POST',
		headers: { 
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, email, password }),
		credentials: 'include',
	});
	const data = await response.json();
	if (data.success) {
		resultMessage.textContent = `User added : ${data.username} (${data.email})`
		document.getElementById("addUserForm").reset();
		resultMessage.textContent = "";
		close_user_modal();
	} else {
		resultMessage.textContent = data.error
	}
	fetch_users();
};

async function add_game(event) {
	event.preventDefault();

	const user1 = document.getElementById("addGame-user1").value;
	const user2 = document.getElementById("addGame-user2").value;
	let resultMessage = document.getElementById("addGame-resultMessage");

	if (!user1 || !user2) {
		resultMessage.textContent = "❌ Please select two users";
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
		resultMessage.textContent = `User added : ${data.username} (${data.email})`
		resultMessage = "";
		close_game_modal();
	} else {
		resultMessage.textContent = data.error
	}
	document.getElementById("addGameForm").reset();
	fetch_games();
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

async function close_user_modal() {
	document.getElementById("addUserForm").reset();
	document.getElementById("addUser-resultMessage").textContent = "";
	document.getElementById("addUserModal").classList.add("hidden");
}

async function close_game_modal() {
	document.getElementById("addGameForm").reset();
	document.getElementById("addGame-resultMessage").textContent = "";
	document.getElementById("addGameModal").classList.add("hidden");
}

window.addEventListener('DOMContentLoaded', () => {
	fetch_users();
	fetch_games();
});