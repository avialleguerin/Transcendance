async function fetchUsers() {
	try {
		// const response = await fetch('/api/users');
		// const users = await response.json();
		const users = await apiRequest("users", "GET");

		document.getElementById('users-table').innerHTML = users.map(user => `
			<tr>
				<td class="border px-4 py-2">${user.userId}</td>
				<td class="border px-4 py-2">${user.username}</td>
				<td class="border px-4 py-2">${user.email}</td>
				<td class="border px-4 py-2">********</td>
				<td class="border px-4 py-2">${user.role}</td>
				<td class="border px-4 py-2 flex">
					<button class="bg-gray-700 hover:bg-sky-500 m-2 text-white px-2 py-1 rounded" onclick="logout(${user.userId})">Logout</button>
					<button class="bg-gray-700 hover:bg-orange-500 m-2 text-white px-2 py-1 rounded" onclick="changeRole(${user.userId})">Change Role</button>
					<button class="bg-gray-700 hover:bg-red-500 m-2 text-white px-2 py-1 rounded" onclick="unregister(${user.userId})">Delete</button>
				</td>
			</tr>
		`).join('');
	} catch (err) {
		console.error('Erreur lors de la récupération des utilisateurs :', err);
	}
}


async function fetchUserProfile() {
	try {
		const response = await fetch('/api/profile', {
			headers: { Authorization: `Bearer ${accessToken}` }
		});

		if (!response.ok) {
			throw new Error(`Erreur HTTP ${response.status}`);
		}

		const data = await response.json();

		if (!data.user) {
			console.error("Aucun utilisateur dans la réponse !");
			return;
		}

		const user = data.user;

		document.getElementById('user-table').innerHTML = `
			<tr>
				<td class="border px-4 py-2">${user.userId}</td>
				<td class="border px-4 py-2">${user.username}</td>
				<td class="border px-4 py-2">${user.email}</td>
				<td class="border px-4 py-2">********</td> <!-- Masquer le mot de passe -->
				<td class="border px-4 py-2">${user.admin === 1 ? "Yes" : "No"}</td>
			</tr>
		`;
	} catch (err) {
		console.error('\x1b[31m%s\x1b[0m', 'Erreur lors de la récupération du profil :', err);
	}
}

async function changeRole(userId) {
	try {
		const accessToken = sessionStorage.getItem("accessToken");
		console.log("🔑 Access Token envoyé :", accessToken);

		const response = await fetch(`/api/users/role/${userId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${accessToken}`
			},
			body: JSON.stringify({ userId })
		});
		if (response.ok) {
			fetchUsers();
		} else {
			const error = await response.json();
			alert('Error : ' + error.error);
		}
	} catch (err) {
		console.error('Error :', err);
	}
}

async function unregister(userId) {
	if (confirm('Do you really want to delete this user ?')) {
		try {
			const response = await fetch(`/api/users/delete/${userId}`, { method: 'DELETE' });
			if (response.ok)
				fetchUsers();
			else {
				const error = await response.json();
				alert('Erreur : ' + error.error);
			}
		} catch (err) {
			console.error('Erreur lors de la suppression :', err);
		}
	}
}




