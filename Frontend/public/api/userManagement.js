
async function changeProfilePicture(event) {
	event.preventDefault();
	const input = document.getElementById('profile_photo_input');
	const formData = new FormData();
	formData.append('profile-picture', input.files[0]);
	console.log("formData", formData);
	console.log("input", input.files[0]);
	const response = await fetch('/request/user/update-profile-picture', {
		method: 'POST',
		headers: {
			"Authorization": `Bearer ${accessToken}`
		},
		credentials: 'include',
		body: formData
	});

	const data = await response.json();
	if (data.success)
		document.getElementById("updateProfile-resultMessage").innerHTML = `${data.message}`;
	else
		document.getElementById("updateProfile-resultMessage").innerHTML = `${data.error}`;
	document.getElementById("profile_photo_input").value = "";
	fetchProfile();
}

async function accessProfileInfo(event) {
	event.preventDefault();
	const password = document.getElementById("password").value;

	try {
		const response = await fetch('/request/user/access-profile-infos', {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${accessToken}`
			},
			body: JSON.stringify({ password })
		});
		const data = await response.json();
		if (data.success) {
			modif_profil.classList.add('hidden');
			btn_back_home.classList.remove('active');
			profile_param_unlocked_id.classList.add('active');
			document.getElementById("password").value = "";
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

		const response = await fetch('/request/user/update-2fa', {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${accessToken}`
			},
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

async function delete_account() {
	if (confirm('Do you really want to delete your account ?')) {
		try {
			const response = await fetch('/request/user/delete-account', { 
				method: 'DELETE',
				headers: {
					"Authorization": `Bearer ${accessToken}`
				},
				credentials: 'include'
			},);
			const data = await response.json();
			sessionStorage.removeItem("accessToken");
			accessToken = null;
			if (data.success) {
				console.log('User deleted successfully');
				document.getElementById("updateProfile-resultMessage").innerHTML = `${data.message}`;
				history.pushState({}, '', '/');
				import('../static/js/views/Home.js').then(module => {
					const Home = module.default;
					const homeInstance = new Home();
					homeInstance.getHtml().then(html => {
						document.getElementById('app').innerHTML = html;
						if (homeInstance.createAccount) {
							homeInstance.createAccount();
						}
					});
				});
			}
		} catch (err) {
			console.error('Erreur lors de la suppression :', err);
		}
	}
}

async function fetchProfile() {
	try {
		if (accessToken) {
			const response = await fetch('/request/profile', {
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
				<img src="./${data.profile_picture}" alt="Profile Photo" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
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
		document.getElementById("updateProfile-resultMessage").innerHTML = 'Veuillez remplir au moins un champ !';
		return;
	}

	if (newPassword && (!confirmPassword || newPassword !== confirmPassword)) {
		document.getElementById("updateProfile-resultMessage").innerHTML = 'Les mots de passe ne correspondent pas !';
		return;
	}

	const response = await fetch('/request/user/update-profile', {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${accessToken}`
		},
		body: JSON.stringify({ newUsername, newEmail, newPassword }),
		credentials: 'include',
	});
	const data = await response.json();
	console.log("data", data);
	if (data.success) {
		console.log(data.message);
		document.getElementById("updateProfileForm").reset();
		document.getElementById("updateProfile-resultMessage").innerHTML = `${data.message}`;
	} else {
		console.log('Error : ' + data.error);
		document.getElementById("updateProfile-resultMessage").innerHTML = `${data.error}`;
	}
	fetchProfile();
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
// 				<button class="bg-gray-700 hover:bg-sky-500 m-2 text-white px-2 py-1 rounded" onclick="logout()">Logout</button>
// 					<button class="bg-gray-700 hover:bg-red-500 m-2 text-white px-2 py-1 rounded" onclick="unregister(${user.userId})">Delete account</button>
// 				</td>
// 			</tr>
// 		`;
// 	} else {
// 		console.log("❌ Aucun accessToken reçu !");
// 	}
// }