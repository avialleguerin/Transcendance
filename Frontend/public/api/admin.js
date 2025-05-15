async function fetchUsers() {
	try {
		const response = await fetch('/request/admin/get-all-users', {
			method: 'GET',
		});
		const users = await response.json();
		document.getElementById('users-table').innerHTML = users.map(user => `
			<tr>
				<td class="border px-4 py-2">${user.userId}</td>
				<td class="border px-4 py-2"><img style="width: 100%; height: auto; max-height: 80px; object-fit: contain;" src="./uploads/${user.profile_picture}"></td>
				<td class="border px-4 py-2">${user.username}</td>
				<td class="border px-4 py-2">${user.email}</td>
				<td class="border px-4 py-2">********</td>
				<td class="border px-4 py-2">${user.doubleAuth_enabled === 0 ? "disabled" : "enabled" }</td>
				<td class="border px-4 py-2">${user.doubleAuth_secret}</td>
				<td class="border px-4 py-2"><button class="bg-gray-700 hover:bg-red-500 m-2 text-white px-2 py-1 rounded" onclick="delete_user(${user.userId})">Delete</button></td>
			</tr>
		`).join('');
	} catch (err) {
		console.error('Erreur lors de la récupération des utilisateurs :', err);
	}
}

async function register(event) {
	event.preventDefault();

	const username = document.getElementById("add-username").value;
	const email = document.getElementById("add-email").value;
	const password = document.getElementById("add-password").value;
	const confirmPassword = document.getElementById("add-confirm-password").value;
	const resultMessage = document.getElementById("add-resultMessage");

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
		document.getElementById("addForm").reset();
	} else {
		resultMessage.textContent = data.error
	}
	fetchUsers();
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
	fetchUsers();
}

window.addEventListener('DOMContentLoaded', () => {
	fetchUsers();
});