import { User, GameResult, PlatformerGame, Friendship } from './types.js';
// import { $, $input, $form } from './utils.js';

function $(id: string): HTMLElement | null { return document.getElementById(id); }
function $input(id: string): HTMLInputElement { return document.getElementById(id) as HTMLInputElement; }
function $form(id: string): HTMLFormElement { return document.getElementById(id) as HTMLFormElement; }

export function notif(message: string, success = true): void {
	const notification = document.getElementById('resultMessage');
	if (notification) {
		document.getElementById('notification-container').style.display = 'flex';
		notification.innerHTML = `<div style='display:flex; align-items:center;'><span>${message}</span></div>`;
		notification.className = `py-2 px-4 rounded shadow-lg ${success ? 'bg-green-500' : 'bg-red-500'} text-white font-medium`;

		setTimeout(() => {
			notification.classList.add('opacity-100');
		}, 10);

		setTimeout(() => {
			notification.classList.remove('opacity-100');
			notification.classList.add('opacity-0');
		}, 3000);
	}
}

export async function fetchAPI(url: string, method: string, body: any = null, showNotification = true, formData: boolean | FormData | null = null): Promise<any> {
	try {
		let accessToken = sessionStorage.getItem('accessToken');

		const headers: Record<string, string> = {
			"Authorization": `Bearer ${accessToken}`
		};

		if (body && !formData)
			headers["Content-Type"] = "application/json";

		const options: RequestInit = {
			method,
			headers,
			credentials: 'include'
		};

		if (body && !formData)
			options.body = JSON.stringify(body);
		else if (formData && formData instanceof FormData) // instanceof FormData)
			options.body = formData;

		const response = await fetch(url, options);
		const data = await response.json();
		if (data.accessToken)
			sessionStorage.setItem('accessToken', data.accessToken);

		if (data.success && showNotification)
			notif(data.message, true);
		else if (data.error && showNotification)
			notif(data.error, false);
		return data;
	} catch (err) {
		if (showNotification)
			notif("Une erreur s'est produite lors de la communication avec le serveur", false);
		throw err;
	}
}

export async function fetch_users(): Promise<void> {
	try {
		const response = await fetch('/request/admin/get-all-users', {
			method: 'GET',
		});
		const users = await response.json();
		document.getElementById('users-table').innerHTML = users.map((user: User) => /*html*/`
			<tr class="border-collapse text-sm hover:shadow-lg hover:rounded-xl hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer">
				<td class="bg-white px-6 py-2 rounded-l-xl border border-gray-100 border-r-0">${user.userId}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.name}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.google_id || "—"}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.games_won}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.games_lost}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">
					<span class="${user.doubleAuth_status === 0 ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'} px-3 py-1 rounded-full">
						${user.doubleAuth_status === 0 ? "Disabled" : "Enabled"}
					</span>
				</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.cgu_version || "—"}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">
					<span class="${user.online_status === 0 ? 'bg-gray-100 text-gray-600' : 'text-green-600 bg-green-100'} px-3 py-1 rounded-full">
						${user.online_status === 0 ? "Offline" : "Online"}
					</span>
				</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.last_activity}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.created_at}</td>
				<td class="bg-white px-6 py-2 rounded-r-xl border border-gray-100 border-l-0">
					<button class="bg-red-200 hover:bg-red-300 m-1 text-red-500 hover:text-red-600 px-3 py-1 rounded-full transition-colors duration-300 ease-in-out text-xs" onclick="delete_user(${user.userId})">Delete</button>
					<button class="bg-red-500 hover:bg-red-600 m-1 text-white px-3 py-1 rounded-full transition-colors duration-300 ease-in-out text-xs" onclick="force_delete_user(${user.userId})">Force Delete</button>
				</td>
			</tr>
		`).join('');
	} catch (err) {
		notif('Failed to fetch users', false);
	}
}

export async function fetch_deleted_users(): Promise<void> {
	try {
		const response = await fetch('/request/admin/get-deleted-users', {
			method: 'GET',
		});
		const data = await response.json();
		
		if (data.success) {
			document.getElementById('deleted-users-table').innerHTML = data.users.map((user: User) => /*html*/`
				<tr class="border-collapse text-sm hover:shadow-lg hover:rounded-xl hover:-translate-y-1 transition-all duration-200 ease-in-out">
					<td class="bg-gray-50 px-6 py-2 rounded-l-xl border border-gray-100 border-r-0">${user.userId}</td>
					<td class="bg-gray-50 px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.name}</td>
					<td class="bg-gray-50 px-6 py-2 border border-gray-100 border-r-0 border-l-0">${user.google_id || "—"}</td>
					<td class="bg-gray-50 px-6 py-2 border border-gray-100 border-l-0">${new Date(user.deleted_at).toLocaleString()}</td>
					<td class="bg-gray-50 px-6 py-2 rounded-r-xl border border-gray-100 border-l-0">
						<button class="bg-red-500 hover:bg-red-600 m-1 text-white px-3 py-1 rounded-full transition-colors duration-300 ease-in-out text-xs" onclick="force_delete_user(${user.userId})">Force Delete</button>
					</td>
					</tr>
			`).join('') || '<tr><td colspan="3" class="text-center py-4 text-gray-500">No deleted users</td></tr>';
		}
	} catch (err) {
		notif('Failed to fetch deleted users', false);
	}
}

export async function fetch_games(): Promise<void> {
	try {
		const response = await fetch('/request/admin/get-all-games', {
			method: 'GET',
		});
		const games = await response.json();

		document.getElementById('games-table').innerHTML = games.map((game: GameResult) => {
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
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0 text-center font-bold ${game.score_left > game.score_right ? 'text-green-600' : 'text-red-600'}">${game.score_left}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0 text-center font-bold ${game.score_right > game.score_left ? 'text-green-600' : 'text-red-600'}">${game.score_right}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0 font-semibold text-gray-800">${teamRightDisplay}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0 text-gray-500">${game.created_at}</td>
				<td class="bg-white px-6 py-2 rounded-r-xl border border-gray-100 border-l-0">
					<button class="bg-red-200 hover:bg-red-300 m-2 text-red-500 hover:text-red-600 px-4 py-1 rounded-full transition-colors duration-300 ease-in-out" onclick="delete_game(${game.gameId})">Delete</button>
				</td>
			</tr>
			`;
		}).join('');
	} catch (err) {
		notif('Failed to fetch games', false);
	}
}

export async function fetch_platformers(): Promise<void> { 
	try {
		const response = await fetch('/request/admin/get-all-platformers', {
			method: 'GET',
		});
		const platformers = await response.json();
		document.getElementById('platformers-table').innerHTML = platformers.map((platformer: PlatformerGame) => /*html*/`
			<tr class="border-collapse text-sm hover:shadow-lg hover:rounded-xl hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer">
				<td class="bg-white px-6 py-2 rounded-l-xl border border-gray-100 border-r-0">${platformer.platformerId}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${platformer.user1_name}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${platformer.score1} - ${platformer.score2}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${platformer.user2_name}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${platformer.created_at}</td>
				<td class="bg-white px-6 py-2 rounded-r-xl border border-gray-100 border-l-0"><button class="bg-red-200 hover:bg-red-300 m-2 text-red-500 hover:text-red-600 px-4 py-1 rounded-full transition-colors duration-300 ease-in-out" onclick="delete_platformer(${platformer.platformerId})">Delete</button></td>
			</tr>
		`).join('');
	} catch (err) {
		notif('Failed to fetch platformers', false);
	}
}

export async function fetch_friendships(): Promise<void> {
	try {
		const response = await fetch('/request/admin/get-all-friendships', {
			method: 'GET',
		});
		const friendships = await response.json();
		document.getElementById('friendships-table').innerHTML = friendships.map((friendship: Friendship) => /*html*/`
			<tr class="border-collapse text-sm hover:shadow-lg hover:rounded-xl hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer">
				<td class="bg-white px-6 py-2 rounded-l-xl border border-gray-100 border-r-0">${friendship.friendshipId}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${friendship.name}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${friendship.friend_name}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${friendship.status}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${friendship.created_at}</td>
				<td class="bg-white px-6 py-2 rounded-r-xl border border-gray-100 border-l-0"><button class="bg-red-200 hover:bg-red-300 m-2 text-red-500 hover:text-red-600 px-4 py-1 rounded-full" onclick="delete_friendship(${friendship.friendshipId})">Delete</button></td>
			</tr>
		`).join('');
	} catch (err) {
		notif('Failed to fetch friendships', false);
	}
}

export async function create_user(event: Event): Promise<void> {
	event.preventDefault();

	const name = $input("addUser-name").value;
	const password = $input("addUser-password").value;
	const confirmPassword = $input("addUser-confirm-password").value;

	if (password !== confirmPassword)
		return notif("Passwords are different", false);

	const response = await fetch('/request/admin/create-user', {
		method: 'POST',
		headers: { 
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name, password }),
		credentials: 'include',
	});
	const data = await response.json();
	if (data.success) {
		notif(`User '${name}' added successfully`, true);
		$form("addUserForm").reset();
		close_user_modal();
	} else
		notif(data.error, false);
	fetch_users();
};

export async function create_game(event: Event): Promise<void> {
	event.preventDefault();

	const name1 = $input("addGame-name1").value;
	const name2 = $input("addGame-name2").value;
	const name3 = $input("addGame-name3").value;
	const name4 = $input("addGame-name4").value;

	if (!name1 || !name2)
		return notif("Please select two users", false);

	const response = await fetch('/request/admin/create-game', {
		method: 'POST',
		headers: { 
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name1, name2, name3, name4 }),
		credentials: 'include',
	});
	const data = await response.json();
	if (data.success) {
		notif(`Game added : ${name1} vs ${name2}`, true);
		close_game_modal();
	} else
		notif(data.error, false);
	$form("addGameForm").reset();
	fetch_games();
};

export async function create_platformer(event: Event): Promise<void> {
	event.preventDefault();

	const name1 = $input("addPlatformer-name1").value;
	const name2 = $input("addPlatformer-name2").value;
	const score1 = $input("addPlatformer-score1").value;
	const score2 = $input("addPlatformer-score2").value;

	if (!name1 || !name2 || !score1 || !score2)
		return notif("Please select the users and their scores", false);

	const response = await fetch('/request/admin/create-platformer', {
		method: 'POST',
		headers: { 
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name1, name2, score1, score2 }),
		credentials: 'include',
	});
	const data = await response.json();
	if (data.success) {
		notif(`Platformer added : ${data.name} in ${data.chrono}s`, true);
		close_platformer_modal();
	} else
		notif(data.error, false);
	$form("addPlatformerForm").reset();
	fetch_platformers();
};


export async function create_friendship(event: Event): Promise<void> {
	event.preventDefault();

	const user_name = $input("addFriendship-user").value;
	const friend_name = $input("addFriendship-friend").value;
	if (!user_name || !friend_name)
		return notif("Please select two users", false);

	const response = await fetch('/request/admin/create-friendship', {
		method: 'POST',
		headers: { 
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ user_name, friend_name }),
		credentials: 'include',
	});
	const data = await response.json();
	if (data.success) {
		notif(`Frienship added : ${user_name} with ${friend_name}`, true);
		close_friendship_modal();
	} else
		notif(data.error, false);
	$form("addFriendshipForm").reset();
	fetch_friendships();
};

export async function delete_user(userId: string): Promise<void> {
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
			if (!data.success)
				notif(data.error || 'Failed to delete user', false);
		} catch (err) {
			notif('Failed to delete user' + err, false);
		}
	}
	fetch_users();
	fetch_games();
	fetch_friendships();
	fetch_deleted_users();
}

export async function force_delete_user(userId: string): Promise<void> {
	if (confirm('⚠️ PERMANENT DELETION WARNING ⚠️\n\nThis will PERMANENTLY DELETE the user and BREAK all game references!\nThis action cannot be undone.\n\nAre you absolutely sure?')) {
		try {
			const response = await fetch('/request/admin/force-delete-user', { 
				method: 'DELETE',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId }),
				credentials: 'include'
			},);
			const data = await response.json();
			if (data.success)
				notif('User permanently deleted', true);
			else
				notif(data.error || 'Failed to permanently delete user', false);
		} catch (err) {
			notif('Failed to force delete user' + err, false);
		}
	}
	fetch_users();
	fetch_games();
	fetch_friendships();
	fetch_deleted_users();
}

export async function delete_game(gameId: string): Promise<void> {
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
			await response.json();
		} catch (err) {
			notif('Failed to delete game', false);
		}
	}
	fetch_games();
}

export async function delete_platformer(platformerId: string): Promise<void> {
	if (confirm('Do you really want to delete this platformer ?')) {
		try {
			const response = await fetch('/request/admin/delete-platformer', { 
				method: 'DELETE',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ platformerId }),
				credentials: 'include'
			},);
			await response.json();
		} catch (err) {
			notif('Failed to delete platformer', false);
		}
	}
	fetch_platformers();
}

export async function delete_friendship(friendshipId: string | number): Promise<void> {
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
			notif('Failed to delete friendship', false);
		}
	}
	fetch_friendships();
}


export async function add_user_modal() {
	if (!$input("addGameModal").classList.contains("hidden"))
		$input("addGameModal").classList.add("hidden")
	$input("addUserModal").classList.remove("hidden");
}

export async function add_game_modal() {
	if (!$input("addUserModal").classList.contains("hidden"))
		$input("addUserModal").classList.add("hidden")
	$input("addGameModal").classList.remove("hidden");
}

export async function add_platformer_modal() {
	if (!$input("addPlatformerModal").classList.contains("hidden"))
		$input("addPlatformerModal").classList.add("hidden")
	$input("addPlatformerModal").classList.remove("hidden");
}

export async function add_friendship_modal() {
	if (!$input("addFriendshipModal").classList.contains("hidden"))
		$input("addFriendshipModal").classList.add("hidden")
	$input("addFriendshipModal").classList.remove("hidden");
}

export async function close_user_modal() {
	$form("addUserForm").reset();
	$input("addUserModal").classList.add("hidden");
}

export async function close_game_modal() {
	$form("addGameForm").reset();
	$input("addGameModal").classList.add("hidden");
}

export async function close_platformer_modal() {
	$form("addPlatformerForm").reset();
	$input("addPlatformerModal").classList.add("hidden");
}

export async function close_friendship_modal() {
	$form("addFriendshipForm").reset();
	$input("addFriendshipModal").classList.add("hidden");
}

window.addEventListener('DOMContentLoaded', () => {
	fetch_users();
	fetch_games();
	fetch_platformers();
	fetch_friendships();
	fetch_deleted_users();
});

window.addEventListener('DOMContentLoaded', () => {
	if (typeof window !== 'undefined') {
		// functions to be accessible globally
		window.fetchAPI = fetchAPI;
		window.fetch_users = fetch_users;
		window.fetch_games = fetch_games;
		window.fetch_platformers = fetch_platformers;
		window.fetch_friendships = fetch_friendships;
		window.fetch_deleted_users = fetch_deleted_users;
		window.notif = notif;
		window.create_user = create_user;
		window.create_game = create_game;
		window.create_platformer = create_platformer;
		window.create_friendship = create_friendship;
		window.delete_user = delete_user;
		window.force_delete_user = force_delete_user;
		window.delete_game = delete_game;
		window.delete_platformer = delete_platformer;
		window.delete_friendship = delete_friendship;
		//modal functions
		window.add_user_modal = add_user_modal;
		window.add_game_modal = add_game_modal;
		window.add_platformer_modal = add_platformer_modal;
		window.add_friendship_modal = add_friendship_modal;
		window.close_user_modal = close_user_modal;
		window.close_game_modal = close_game_modal;
		window.close_platformer_modal = close_platformer_modal;
		window.close_friendship_modal = close_friendship_modal;
	}
});
