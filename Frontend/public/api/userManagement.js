
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
		notif(data.message, true);
	else
		notif(data.error, false);
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

async function activate2FA(event) {

	event.preventDefault();
	const code = document.getElementById("activate-2fa-code").value;
	try {
		const response = await fetch('/request/user/activate-2fa', {
			method: "POST",
			headers: { 
				"Content-Type": "application/json",
				"Authorization": `Bearer ${accessToken}`
			 },
			body: JSON.stringify({ code })
		});
		
		const data = await response.json();
		if (data.success) {
			sessionStorage.setItem("accessToken", data.accessToken);
			accessToken = sessionStorage.getItem("accessToken");
			notif(data.message, true);
			document.getElementById("code_validation_id").classList.remove('active');
		} else
			notif(data.error, false);
	} catch (err) {
		console.error("Error when validating 2FA :", err);
	}
}


async function update_doubleAuth() {
	try {
		// const accessToken = sessionStorage.getItem("accessToken");
		// document.getElementById('code_validation_id').classList.remove('hidden');
		const response = await fetch('/request/user/update-2fa', {
			method: "PUT",
			headers: {
				"Authorization": `Bearer ${accessToken}`
			},
		});

		const data = await response.json();
		if (data.success) {
			if (data.doubleAuth_status)
				document.getElementById('qrCode').src = data.qrCode;
			else
				notif(data.message, true);
		} else
			notif(data.error, false);
	} catch (err) {
		console.error('Error :', err);
	}
}

// async function disable_doubleAuth() {
// 	try {
// 		const response = await fetch('/request/user/disable-2fa', {
// 			method: "PUT",
// 			headers: {
// 				"Authorization": `Bearer ${accessToken}`
// 			},
// 		});
// 		const data = await response.json();
// 		if (data.success) {
// 			// fetchUsers()
// 			if (data.doubleAuth_status)
// 			{
// 				document.getElementById('qrCode').src = data.qrCode;
// 			}
// 		} else
// 			alert('Error : ' + data.message);
// 	} catch (err) {
// 		console.error('Error :', err);
// 	}
// }

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
			if (data.success) {
				sessionStorage.removeItem("accessToken");
				accessToken = null;
				console.log('User deleted successfully');
				notif(data.message, true);
				history.pushState({}, '', '/');
				import('../static/js/views/Home.js').then((module) => {
					console.log("Home module loaded");
					const Home = module.default;
					const homeInstance = new Home();
					homeInstance.getHtml().then((html) => {
						const appElement = document.getElementById('app');
						if (appElement) {
							appElement.innerHTML = html;
							if (homeInstance.createAccount && typeof homeInstance.createAccount === 'function') {
								homeInstance.createAccount();
							}
						}
					});
				});
			}
		} catch (err) {
			notif("Erreur lors de la suppression : " + err, false);
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
			console.log("user", user);
			document.getElementById("profile_photo_circle").innerHTML = `
				<img src="./${data.profile_picture}" alt="Profile Photo" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
			`;
			const username = document.getElementById("change_username");
			username.placeholder = user.username;
			const email = document.getElementById("change_email");
			email.placeholder = user.email;
			const doubleAuth = document.getElementById("active_fa");
			console.log("doubleAuth", user.doubleAuth_status);
			if (user.doubleAuth_status)
				doubleAuth.checked = true;
			else
			{
				doubleAuth.checked = false;
				if (doubleAuth.classList.contains("checked"))
					doubleAuth.classList.remove("checked");
			}
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
		notif("Veuillez remplir au moins un champ !", false);
		return;
	}

	if (newPassword && (!confirmPassword || newPassword !== confirmPassword)) {
		notif("Les mots de passe ne correspondent pas !", false);
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
		notif(data.message, true);
	} else
		notif(data.error, false);
	fetchProfile();
}
