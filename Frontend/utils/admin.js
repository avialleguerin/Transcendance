async function fetchUsers() {
	try {
		const response = await fetch('/api/users');
		const users = await response.json();

		document.getElementById('users-table').innerHTML = users.map(user => `
			<tr>
				<td class="border px-4 py-2">${user.id}</td>
				<td class="border px-4 py-2">${user.username}</td>
				<td class="border px-4 py-2">${user.email}</td>
				<td class="border px-4 py-2">********</td>
				<td class="border px-4 py-2">${user.connected === 1 ? "Yes" : "No"}</td>
				<td class="border px-4 py-2">${user.role}</td>
				<td class="border px-4 py-2 flex">
					<button class="bg-gray-700 hover:bg-sky-500 m-2 text-white px-2 py-1 rounded" onclick="logout(${user.id})">Logout</button>
					<button class="bg-gray-700 hover:bg-orange-500 m-2 text-white px-2 py-1 rounded" onclick="changeRole(${user.id})">Change Role</button>
					<button class="bg-gray-700 hover:bg-red-500 m-2 text-white px-2 py-1 rounded" onclick="unregister(${user.id})">Delete</button>
				</td>
			</tr>
		`).join('');
	} catch (err) {
		console.error('Erreur lors de la récupération des utilisateurs :', err);
	}
}

async function fetchUserProfile() {
	const accessToken = sessionStorage.getItem("accessToken")
	if (!accessToken) {
		console.error("❌ Aucun accessToken disponible !");
		return;
	}
	try {
		console.log("🔹 Envoi de la requête à /api/profile...");
		console.log("🔹 Token actuel :", accessToken);
		const response = await fetch('/api/profile', {
			headers: { Authorization: `Bearer ${accessToken}` }
		});

		if (!response.ok) {
			throw new Error(`Erreur HTTP ${response.status}`);
		}

		const data = await response.json();
		// console.log("✅ Réponse reçue :", data);

		if (!data.user) {
			console.error("Aucun utilisateur dans la réponse !");
			return;
		}

		const user = data.user;

		document.getElementById('user-table').innerHTML = `
			<tr>
				<td class="border px-4 py-2">${user.id}</td>
				<td class="border px-4 py-2">${user.username}</td>
				<td class="border px-4 py-2">${user.email}</td>
				<td class="border px-4 py-2">********</td>
				<td class="border px-4 py-2">${user.role}</td>
			</tr>
		`;
	} catch (err) {
		console.error('\x1b[31m%s\x1b[0m', 'Erreur lors de la récupération du profil :', err);
	}
}

async function changeRole(id) {
	try {
		const response = await fetch(`/api/users/role/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id })
		});
		if (response.ok)
			fetchUsers();
		else {
			const error = await response.json();
			alert('Error : ' + error.error);
		}
	} catch (err) {
		console.error('Error :', err);
	}
}

async function unregister(id) {
	if (confirm('Do you really want to delete this user ?')) {
		try {
			const response = await fetch(`/api/users/delete/${id}`, { method: 'DELETE' });
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

window.addEventListener('DOMContentLoaded', () => {
	const accessToken = sessionStorage.getItem("accessToken");
	if (accessToken) {
		console.log("✅ Access Token récupéré depuis sessionStorage :", accessToken);
		fetchUserProfile(accessToken);
	} else {
		console.warn("⚠️ Aucun accessToken trouvé, l'utilisateur doit se reconnecter.");
	}
	fetchUsers();
});

document.getElementById("addForm").addEventListener("submit", async function (event) {
	event.preventDefault(); // Empêche le rechargement de la page

	const username = document.getElementById("add-username").value;
	const email = document.getElementById("add-email").value;
	const password = document.getElementById("add-password").value;
	const confirmPassword = document.getElementById("add-confirm-password").value;
	const resultMessage = document.getElementById("add-resultMessage");
	console.log("Username: ", username)
	console.log("Email: ", email)
	console.log("Password: ", password)
	if (password !== confirmPassword)
	{
		resultMessage.textContent = "Error : Fields Password and confirm Password are different";
		resultMessage.classList.add("text-red-500");
		return ;
	}

	const response = await fetch("/api/users/add", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, email, password })
	});

	const result = await response.json();
	
	if (result.success) {
		resultMessage.textContent = `User added : ${result.username} (${result.email})`;
		resultMessage.classList.add("text-green-500");
		
		setTimeout(() => {
			location.reload(); // Rafraîchit la page après 1 seconde
		}, 300);
	} else {
		resultMessage.textContent = "Error : " + result.error;
		resultMessage.classList.add("text-red-500");
	}
});
