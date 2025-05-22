async function updateProfileInfo(event) {
	event.preventDefault();
	const newUsername = document.getElementById("change_username").value;
	const newEmail = document.getElementById("change_email").value;
	const newPassword = document.getElementById("change_password").value;
	
	if (newUsername === "" && newEmail === "" && newPassword === "")
		return notif("Please fill at least one field !", false);
	
	try {
		const data = await fetchAPI('/request/user/update-profile', 'PUT', { newUsername, newEmail, newPassword });

		if (data.success) {
			document.getElementById("updateProfileForm").reset();
			fetchProfile();
		}
	} catch (err) {
		console.log("Failed to update profile");
	}
}


async function changeProfilePicture(event) {
	event.preventDefault();
	const input = document.getElementById('profile_photo_input');
	const formData = new FormData();
	formData.append('profile-picture', input.files[0]);
	
	try {
		const data = await fetchAPI('/request/user/update-profile-picture', 'POST', null, true, formData);

		if (data.success) {
			document.getElementById("uploadForm").reset();
			fetchProfile();
		}
	} catch (err) {
		console.log("Failed to update profile picture");
	}
}

async function accessProfileInfo(event) {
	event.preventDefault();
	const password = document.getElementById("password").value;

	try {
		const data = await fetchAPI('/request/user/access-profile-infos', 'PUT', { password }, false);

		if (data.success) {
			modif_profil.classList.add('hidden');
			btn_back_home.classList.remove('active');
			profile_param_unlocked_id.classList.add('active');
			document.getElementById("password").value = "";
			fetchProfile();
		} else
		alert('Error : ' + data.error);
	} catch (err) {
		console.error('Error :', err);
	}
}

async function activate2FA(event) {
	event.preventDefault();
	const code = document.getElementById("activate-2fa-code").value;
	
	try {
		const data = await fetchAPI('/request/user/activate-2fa', 'POST', { code });

		if (data.success)
			document.getElementById("code_validation_id").classList.remove('active');
	} catch (err) {
		console.error("Error when validating 2FA :", err);
	}
}

async function update_doubleAuth() {
	try {
		const data = await fetchAPI('/request/user/update-2fa', 'PUT');

		if (data.success)
			if (data.doubleAuth_status)
				document.getElementById('qrCode').src = data.qrCode;

	} catch (err) {
		console.error('Error :', err);
	}
}

// async function delete_account() {
// 	if (confirm('Do you really want to delete your account ?')) {
// 		try {
// 			const response = await fetch('/request/user/delete-account', { 
// 				method: 'DELETE',
// 				headers: {
// 					"Authorization": `Bearer ${accessToken}`
// 				},
// 				credentials: 'include'
// 			},);
// 			const data = await response.json();
// 			if (data.success) {
// 				sessionStorage.removeItem("accessToken");
// 				accessToken = null;
// 				console.log('User deleted successfully');
// 				notif(data.message, true);
// 				history.pushState({}, '', '/');
// 				import('../static/js/views/Home.js').then((module) => {
// 					console.log("Home module loaded");
// 					const Home = module.default;
// 					const homeInstance = new Home();
// 					homeInstance.getHtml().then((html) => {
// 						const appElement = document.getElementById('app');
// 						if (appElement) {
// 							appElement.innerHTML = html;
// 							if (homeInstance.createAccount && typeof homeInstance.createAccount === 'function') {
// 								homeInstance.createAccount();
// 							}
// 						}
// 					});
// 				});
// 			}
// 		} catch (err) {
// 			notif("Erreur lors de la suppression : " + err, false);
// 		}
// 	}
// }

async function delete_account() {
	if (confirm('Do you really want to delete your account ?')) {
		try {
			const data = await fetchAPI('/request/user/delete-account', 'DELETE');
			console.log("data", data);
			if (data.success) {
				sessionStorage.removeItem("accessToken");
				console.log('User deleted successfully');
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
		const data = await fetchAPI('/request/profile', 'GET', null, false);

		if (data.user) {
			const user = data.user;
			console.log("user", user);
			document.getElementById("profile_photo_circle").innerHTML = `
			<img src="./${data.profile_picture}" alt="${user.username} profile picture" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
			`;
			const username = document.getElementById("change_username");
			username.placeholder = user.username;
			const email = document.getElementById("change_email");
			email.placeholder = user.email;
			const doubleAuth = document.getElementById("active_fa");
			console.log("doubleAuth", user.doubleAuth_status);
			if (user.doubleAuth_status)
				doubleAuth.checked = true;
			else {
				doubleAuth.checked = false;
				if (doubleAuth.classList.contains("checked"))
					doubleAuth.classList.remove("checked");
			}
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

	if (newUsername === "" && newEmail === "" && newPassword === "")
		return notif("Veuillez remplir au moins un champ !", false);

	if (newPassword && (!confirmPassword || newPassword !== confirmPassword))
		return notif("Les mots de passe ne correspondent pas !", false);

	try {
		const data = await fetchAPI('/request/user/update-profile', 'PUT', { newUsername, newEmail, newPassword });
	
		if (data.success) {
			document.getElementById("updateProfileForm").reset();
			fetchProfile();
		}
	} catch (err) {
		console.log("Failed to update profile");
	}
}
