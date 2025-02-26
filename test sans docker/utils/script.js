console.log("Le script admin.js est bien chargé !");

async function fetchUsers() {
	try {
		const response = await fetch('/users');
		const users = await response.json();

		// const tbody = document.getElementById('users-table');
		// tbody.innerHTML = '';
		// users.forEach(user => {
		// 	const tr = document.createElement('tr');
		// 	tr.innerHTML = `
		// 		<td class="border px-4 py-2">${user.id}</td>
		// 		<td class="border px-4 py-2">${user.name}</td>
		// 		<td class="border px-4 py-2">${user.email}</td>
		// 		<td class="border px-4 py-2">
		// 			<button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteUser(${user.id})">Supprimer</button>
		// 		</td>
		// 	`;
		// 	tbody.appendChild(tr);
		// });

		document.getElementById('users-table').innerHTML = users.map(user => `
			<tr>
				<td class="border px-4 py-2">${user.id}</td>
				<td class="border px-4 py-2">${user.name}</td>
				<td class="border px-4 py-2">${user.email}</td>
				<td class="border px-4 py-2">${user.connected === 0 ? "No" : "Yes"}</td>
				<td class="border px-4 py-2">
					<button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteUser(${user.id})">
						Supprimer
					</button>
				</td>
			</tr>
		`).join('');
	} catch (err) {
		console.error('Erreur lors de la récupération des utilisateurs :', err);
	}
}

async function deleteUser(id) {
	if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
		try {
			const response = await fetch(`/users/${id}`, { method: 'DELETE' });
			if (response.ok) {
				alert('Utilisateur supprimé avec succès.');
				fetchUsers();
			} else {
				const error = await response.json();
				alert('Erreur : ' + error.error);
			}
		} catch (err) {
			console.error('Erreur lors de la suppression :', err);
		}
	}
}

// Charger la liste des utilisateurs lors du chargement de la page
window.addEventListener('DOMContentLoaded', fetchUsers);


document.getElementById("addForm").addEventListener("submit", async function (event) {
	event.preventDefault(); // Empêche le rechargement de la page

	const name = document.getElementById("add-name").value;
	const email = document.getElementById("add-email").value;
	console.log("Name: ", name)
	console.log("Email: ", email)
	const response = await fetch("/users/add", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email })
	});

	const result = await response.json();
	const resultMessage = document.getElementById("add-resultMessage");
	
	if (result.success) {
		resultMessage.textContent = `User added : ${result.name} (${result.email})`;
		resultMessage.classList.add("text-green-500");
		
		setTimeout(() => {
			location.reload(); // Rafraîchit la page après 1 seconde
		}, 300);
	} else {
		resultMessage.textContent = "Error : " + result.message;
		resultMessage.classList.add("text-red-500");
	}
});

document.getElementById("loginForm").addEventListener("submit", async function (event) {
	event.preventDefault();
	console.log("Form submitted")
	const name = document.getElementById("login-name").value;
	const email = document.getElementById("login-email").value;

	console.log("Name: ", name)
	console.log("Email: ", email)
	const response = await fetch("/users/login", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name, email })
	});

	const result = await response.json();
	const resultMessage = document.getElementById("login-resultMessage");
	if (result.success) {
		resultMessage.textContent = `User Connected : ${result.name} (${result.email})`;
		resultMessage.classList.add("text-green-500");
		
		setTimeout(() => {
			location.reload();
		}, 300);
	} else {
		resultMessage.textContent = "Error : " + result.message;
		resultMessage.classList.add("text-red-500");
	}
});