// document.getElementById("profile_photo_input").addEventListener("change", function(e) {
// 	const file = e.target.files[0];
// 	if (file) {
// 		const reader = new FileReader();
// 		reader.onload = function(event) {
// 			// Affiche l'image uploadée en fond de la div
// 			const circle = document.getElementById("profile_photo_circle");
// 			circle.style.backgroundImage = `url(${event.target.result})`;
// 			circle.style.backgroundSize = "cover";
// 			circle.style.backgroundPosition = "center";
// 		};
// 		reader.readAsDataURL(file);
// 	}
// });

async function changeProfilePicture() {
	const profilePhotoInput = document.getElementById("profile_photo_input");
	if (profilePhotoInput) {
		profilePhotoInput.addEventListener("change", async (e) => {
			const file = e.target.files[0];
			if (file) {
				console.log("File selected:", file.name);
				
				// Create FormData object to send the file
				const formData = new FormData();
				formData.append("profilePicture", file);
				formData.append("userId", userId);
				
				try {
					// Get the accessToken from sessionStorage
					const accessToken = sessionStorage.getItem("accessToken");
					if (!accessToken) {
						console.error("No access token available");
						return;
					}
					
					// Send the file to the server
					const response = await fetch("/api/users/update-profile-picture", {
						method: "POST",
						body: formData,
						contentType: "multipart/form-data",
						headers: {
							"Authorization": `Bearer ${accessToken}`
						}
					});
					
					const data = await response.json();
					
					if (response.ok) {
						console.log("Profile picture updated successfully:", data);
						
						// Update the profile picture in the UI
						const circle = document.getElementById("profile_photo_circle");
						
						// Read the file and display it
						const reader = new FileReader();
						reader.onload = (event) => {
							circle.style.backgroundImage = `url(${event.target.result})`;
							circle.style.backgroundSize = "cover";
							circle.style.backgroundPosition = "center";
						};
						reader.readAsDataURL(file);
						
						// Show success message
						alert("Profile picture updated successfully!");
					} else {
						console.error("Error updating profile picture:", data.error || data.message);
						alert("Failed to update profile picture: " + (data.error || data.message));
					}
				} catch (err) {
					console.error("Error uploading profile picture:", err);
					alert("An error occurred while uploading the profile picture");
				}
			}
		});
	}
}

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

// function openProfilePictureModal(userId) {
// document.getElementById('profile-picture-modal').classList.remove('hidden');
// // Store userId for later use during upload
// document.getElementById('profile-picture-modal').dataset.userId = userId;
// }

// function closeProfilePictureModal() {
// 	document.getElementById('profile-picture-modal').classList.add('hidden');
// 	document.getElementById('profile-picture-input').value = '';
// 	document.getElementById('upload-status').textContent = '';
// 	document.getElementById('profile-preview').src = 'https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Image-Transparent-Background.png';
// }

// Show preview of selected image
// document.getElementById('profile-picture-input').addEventListener('change', function(event) {
// 	const file = event.target.files[0];
// 	if (file) {
// 		const reader = new FileReader();
// 		reader.onload = function(e) {
// 		document.getElementById('profile-preview').src = e.target.result;
// 		}
// 		reader.readAsDataURL(file);
// }
// });

// async function uploadProfilePicture() {
// 	const fileInput = document.getElementById('profile-picture-input');
// 	const userId = document.getElementById('profile-picture-modal').dataset.userId;
// 	const statusElement = document.getElementById('upload-status');

// 	if (!fileInput.files || fileInput.files.length === 0) {
// 		statusElement.textContent = "Please select an image first";
// 		statusElement.classList.add("text-red-500");
// 		return;
// 	}

// 	const file = fileInput.files[0];
// 	const formData = new FormData();
// 	formData.append('profilePicture', file);
// 	formData.append('userId', userId);

// 	try {
// 		statusElement.textContent = "Uploading...";
// 		statusElement.classList.remove("text-red-500");
// 		statusElement.classList.add("text-blue-500");
		
// 		const response = await fetch(`/api/users/update-profile-picture/:${userId}`, {
// 			method: 'POST',
// 			body: formData,
// 			// No Content-Type header needed, browser sets it with boundary for FormData
// 			headers: {
// 				'Authorization': `Bearer ${accessToken}`
// 			}
// 		});
		
// 		const result = await response.json();
		
// 		if (result.success) {
// 			statusElement.textContent = "Profile picture updated successfully!";
// 			statusElement.classList.remove("text-blue-500");
// 			statusElement.classList.add("text-green-500");
			
// 			setTimeout(() => {
// 				closeProfilePictureModal();
// 				location.reload(); // Refresh to show new picture
// 			}, 1000);
// 		} else {
// 			statusElement.textContent = "Error: " + result.error;
// 			statusElement.classList.remove("text-blue-500");
// 			statusElement.classList.add("text-red-500");
// 		}
// 	} catch (err) {
// 		statusElement.textContent = "Error uploading image";
// 		statusElement.classList.remove("text-blue-500");
// 		statusElement.classList.add("text-red-500");
// 		console.error("Error uploading profile picture:", err);
// 	}
// }

async function accessProfileInfo(event) {
	event.preventDefault();
	const password = document.getElementById("password").value;
	// const userId = getUserIdFromToken();

	try {
		const response = await fetch(`/api/users/access-profile-infos/:${userId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${accessToken}`
			},
			body: JSON.stringify({ userId, password })
		});
		const data = await response.json();
		if (data.success) {
			modif_profil.classList.add('hidden');
			btn_back_home.classList.remove('active');
			profile_param_unlocked_id.classList.add('active');
			fetchProfile();
		} else {
			alert('Error : ' + data.error);
		}
	} catch (err) {
		console.error('Error :', err);
	}
}

async function enable_doubleAuth(userId) {
	try {
		const accessToken = sessionStorage.getItem("accessToken");

		const response = await fetch(`/api/users/update-2fa/${userId}`, {
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
			// else fetchUsers();-1  | 📡 Requête reçue : [POST] /api/users/refresh-infos/:1
		} catch (err) {
			console.error('Erreur lors de la suppression :', err);
		}
	}
}

async function fetchProfile() {
	try {
		if (accessToken) {
			const response = await fetch(`/api/profile`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${accessToken}`
				},
			});
			const data = await response.json();
			if (!data.user) {
				console.log("Error:", data.error);
				return;
			}
		
			const user = data.user;
			document.getElementById("profile_photo_circle").innerHTML = `
				<img src="./uploads/${user.profile_picture}" alt="Profile Photo" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
			`;
			const username = document.getElementById("change_username");
			username.placeholder = user.username;
			const email = document.getElementById("change_email");
			email.placeholder = user.email;
			const doubleAuth = document.getElementById("fa_selector");
			if (user.enable_doubleAuth)
				doubleAuth.classList.add("checked");
			else
				if (doubleAuth.classList.contains("checked"))
					doubleAuth.classList.remove("checked");
		}
		else {
			console.log("❌ Aucun accessToken reçu !");
		}
	} catch (err) {
		console.log("Error: ", err);
	}
	
}

async function updateProfileInfo(event) {
	event.preventDefault();
	const newUsername = document.getElementById("change_username").value;
	const newEmail = document.getElementById("change_email").value;
	const newPassword = document.getElementById("change_password").value;
	const confirmPassword = document.getElementById("confirm_change_password").value;

	console.log("newUsername", newUsername);
	console.log("newEmail", newEmail);
	console.log("newPassword", newPassword);
	console.log("confirmPassword", confirmPassword);

	if (newUsername === "" && newEmail === "" && newPassword === "") {
		console.log("Veuillez remplir au moins un champ !");
		return;
	}

	if (newPassword && (!confirmPassword || newPassword !== confirmPassword)) {
		console.log("Les mots de passe ne correspondent pas !");
		return;
	}

	const response = await fetch(`/api/users/update-profile/:${userId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${accessToken}`
		},
		body: JSON.stringify({ userId, newUsername, newEmail, newPassword })
	});
	const data = await response.json();
	console.log("data", data);
	if (data.success) {
		console.log(data.message);
		sessionStorage.removeItem("accessToken")
		accessToken = null
	} else {
		console.log('Error : ' + data.error);
	}
}



// async function fetchProfile() {
// 	if (accessToken) {
// 		const profileData = await apiRequest("profile", "GET", null, {})
// 		if (!profileData.user) {
// 			console.error("Aucun utilisateur dans la réponse !");
// 			return;
// 		}
	
// 		const user = profileData.user;
// 		document.getElementById("user-div").classList.remove("hidden");
// 		document.getElementById('user-table').innerHTML = `
// 			<tr>
// 				<td class="border px-4 py-2">${user.userId}</td>
// 				<td class="border px-4 py-2"><img style="width: 100%; height: auto; max-height: 80px; object-fit: contain;"  src="${user.profile_picture}"></td>
// 				<td class="border px-4 py-2">${user.username}</td>
// 				<td class="border px-4 py-2">${user.email}</td>
// 				<td class="border px-4 py-2">********</td> <!-- Masquer le mot de passe -->
// 				<td class="border px-4 py-2">${user.role}</td>
// 				<td class="border px-4 py-2">${user.doubleAuth_enabled === 0 ? "disabled" : "enabled"}</td>
// 				<td class="border px-4 py-2">${user.doubleAuth_secret}</td>
// 				<td>
// 				<button class="bg-gray-700 hover:bg-sky-500 m-2 text-white px-2 py-1 rounded" onclick="openProfilePictureModal(${user.userId})">change ProfilePicture</button>
// 				<button class="bg-gray-700 hover:bg-sky-500 m-2 text-white px-2 py-1 rounded" onclick="enable_doubleAuth(${user.userId})">2FA</button>
// 				<button class="bg-gray-700 hover:bg-sky-500 m-2 text-white px-2 py-1 rounded" onclick="logout(${user.userId})">Logout</button>
// 					<button class="bg-gray-700 hover:bg-red-500 m-2 text-white px-2 py-1 rounded" onclick="unregister(${user.userId})">Delete account</button>
// 				</td>
// 			</tr>
// 		`;
// 	} else {
// 		console.log("❌ Aucun accessToken reçu !");
// 	}
// }