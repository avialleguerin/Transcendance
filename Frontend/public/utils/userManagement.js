// async function changeProfilePicture(userId) {
// 	try {
// 		const accessToken = sessionStorage.getItem("accessToken");
// 		console.log("🔑 Access Token envoyé :", accessToken);

// 		const response = await fetch(`/api/users/profile_picture/${userId}`, {
// 			method: "PUT",
// 			headers: {
// 				"Content-Type": "application/json",
// 				"Authorization": `Bearer ${accessToken}`
// 			},
// 			body: JSON.stringify({ userId, profilePicture })
// 		});
// 		if (response.ok) {
// 			fetchUsers();
// 		} else {
// 			const error = await response.json();
// 			alert('Error : ' + error.error);
// 		}
// 	} catch (err) {
// 		console.error('Error :', err);
// 	}
// }


function openProfilePictureModal(userId) {
	document.getElementById('profile-picture-modal').classList.remove('hidden');
	// Store userId for later use during upload
	document.getElementById('profile-picture-modal').dataset.userId = userId;
	}

	function closeProfilePictureModal() {
		document.getElementById('profile-picture-modal').classList.add('hidden');
		document.getElementById('profile-picture-input').value = '';
		document.getElementById('upload-status').textContent = '';
		document.getElementById('profile-preview').src = 'https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Image-Transparent-Background.png';
	}

	// Show preview of selected image
	document.getElementById('profile-picture-input').addEventListener('change', function(event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function(e) {
			document.getElementById('profile-preview').src = e.target.result;
			}
			reader.readAsDataURL(file);
	}
});

async function uploadProfilePicture() {
	const fileInput = document.getElementById('profile-picture-input');
	const userId = document.getElementById('profile-picture-modal').dataset.userId;
	const statusElement = document.getElementById('upload-status');

	if (!fileInput.files || fileInput.files.length === 0) {
		statusElement.textContent = "Please select an image first";
		statusElement.classList.add("text-red-500");
		return;
	}

	const file = fileInput.files[0];
	const formData = new FormData();
	formData.append('profilePicture', file);
	formData.append('userId', userId);

	try {
		statusElement.textContent = "Uploading...";
		statusElement.classList.remove("text-red-500");
		statusElement.classList.add("text-blue-500");
		
		const response = await fetch(`/api/users/update-profile-picture/:${userId}`, {
			method: 'POST',
			body: formData,
			// No Content-Type header needed, browser sets it with boundary for FormData
			headers: {
				'Authorization': `Bearer ${accessToken}`
			}
		});
		
		const result = await response.json();
		
		if (result.success) {
			statusElement.textContent = "Profile picture updated successfully!";
			statusElement.classList.remove("text-blue-500");
			statusElement.classList.add("text-green-500");
			
			setTimeout(() => {
				closeProfilePictureModal();
				location.reload(); // Refresh to show new picture
			}, 1000);
		} else {
			statusElement.textContent = "Error: " + result.error;
			statusElement.classList.remove("text-blue-500");
			statusElement.classList.add("text-red-500");
		}
	} catch (err) {
		statusElement.textContent = "Error uploading image";
		statusElement.classList.remove("text-blue-500");
		statusElement.classList.add("text-red-500");
		console.error("Error uploading profile picture:", err);
	}
}

async function enable_doubleAuth(userId) {
	try {
		const accessToken = sessionStorage.getItem("accessToken");

		const response = await fetch(`/api/users/doubleAuth/${userId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${accessToken}`
			},
			body: JSON.stringify({ userId })
		});
		const data = await response.json();
		if (response.ok) {
			// fetchUsers()
			if (data.enable_doubleAuth)
			{
				sessionStorage.setItem("userId", userId);
				document.getElementById('qrCode').src = data.qrCode;
				document.getElementById("activateDoubleAuth").classList.remove("hidden");
			}
		} else
			alert('Error : ' + data.message);
	} catch (err) {
		console.error('Error :', err);
	}
}

async function unregister(userId) {
	if (confirm('Do you really want to delete this user ?')) {
		try {
			const response = await fetch(`/api/users/delete/${userId}`, { method: 'DELETE' });
			if (!response.ok) {
				const error = await response.json();
				alert('Erreur : ' + error.error);
			}
			// else fetchUsers();
		} catch (err) {
			console.error('Erreur lors de la suppression :', err);
		}
	}
}

async function fetchProfile() {
	if (accessToken) {
		const profileData = await apiRequest("profile", "GET", null, {})
		if (!profileData.user) {
			console.error("Aucun utilisateur dans la réponse !");
			return;
		}
	
		const user = profileData.user;
		document.getElementById("user-div").classList.remove("hidden");
		document.getElementById('user-table').innerHTML = `
			<tr>
				<td class="border px-4 py-2">${user.userId}</td>
				<td class="border px-4 py-2"><img style="width: 100%; height: auto; max-height: 80px; object-fit: contain;"  src="${user.profile_picture}"></td>
				<td class="border px-4 py-2">${user.username}</td>
				<td class="border px-4 py-2">${user.email}</td>
				<td class="border px-4 py-2">********</td> <!-- Masquer le mot de passe -->
				<td class="border px-4 py-2">${user.role}</td>
				<td class="border px-4 py-2">${user.doubleAuth_enabled === 0 ? "disabled" : "enabled"}</td>
				<td class="border px-4 py-2">${user.doubleAuth_secret}</td>
				<td>
				<button class="bg-gray-700 hover:bg-sky-500 m-2 text-white px-2 py-1 rounded" onclick="openProfilePictureModal(${user.userId})">change ProfilePicture</button>
				<button class="bg-gray-700 hover:bg-sky-500 m-2 text-white px-2 py-1 rounded" onclick="enable_doubleAuth(${user.userId})">2FA</button>
				<button class="bg-gray-700 hover:bg-sky-500 m-2 text-white px-2 py-1 rounded" onclick="logout(${user.userId})">Logout</button>
					<button class="bg-gray-700 hover:bg-red-500 m-2 text-white px-2 py-1 rounded" onclick="unregister(${user.userId})">Delete account</button>
				</td>
			</tr>
		`;
	} else {
		console.log("❌ Aucun accessToken reçu !");
	}
}