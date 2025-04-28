// async function fetchUsers() {
// 	try {
// 		const users = await apiRequest("users", "GET");

// 		document.getElementById('users-table').innerHTML = users.map(user => `
// 			<tr>
// 				<td class="border px-4 py-2">${user.userId}</td>
// 				<td class="border px-4 py-2"><img style="width: 100%; height: auto; max-height: 80px; object-fit: contain;" src="${user.profile_picture}"></td>
// 				<td class="border px-4 py-2">${user.username}</td>
// 				<td class="border px-4 py-2">${user.email}</td>
// 				<td class="border px-4 py-2">********</td>
// 				<td class="border px-4 py-2">${user.role}</td>
// 				<td class="border px-4 py-2">${user.doubleAuth_enabled === 0 ? "disabled" : "enabled" }</td>
// 				<td class="border px-4 py-2">${user.doubleAuth_secret}</td>
// 				<td class="border px-4 py-2">${user.connection_status}</td>
// 				<td>
// 				<button class="bg-gray-700 hover:bg-orange-500 m-2 text-white px-2 py-1 rounded" onclick="changeRole(${user.userId})">Change Role</button>
// 				<button class="bg-gray-700 hover:bg-sky-500 m-2 text-white px-2 py-1 rounded" onclick="logout(${user.userId})">Disconnect</button>
// 					<button class="bg-gray-700 hover:bg-red-500 m-2 text-white px-2 py-1 rounded" onclick="unregister(${user.userId})">Delete</button>
// 				</td>
// 			</tr>
// 		`).join('');
// 	} catch (err) {
// 		console.error('Erreur lors de la récupération des utilisateurs :', err);
// 	}
// }

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
		// if (response.ok) {
		// 	// fetchUsers();
		// } else {
		// 	const error = await response.json();
		// 	alert('Error : ' + error.error);
		// }
		response.ok 
			? null // fetchUsers();
			: alert('Error : ' + (await response.json()).error);
	} catch (err) {
		console.error('Error :', err);
	}
}



