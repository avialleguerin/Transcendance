import { notif, fetchAPI, $, $input, $form, updateUI, gameMenuView, homeView } from './utils.js';
import { disconnectWebSocket } from './websocket.js';

if (typeof window !== 'undefined') {
	window.accessProfileInfo = accessProfileInfo;
	window.changeProfilePicture = changeProfilePicture;
	window.activate2FA = activate2FA;
	window.enable_doubleAuth = enable_doubleAuth;
	window.disable_doubleAuth = disable_doubleAuth;
	window.export_data = export_data;
	window.anonymize_user = anonymize_user;
	window.delete_account = delete_account;
	window.fetchProfile = fetchProfile;
	window.updateProfileInfo = updateProfileInfo;
}

export async function changeProfilePicture(event: Event): Promise<void> {
	event.preventDefault();
	const input = $input('profile_photo_input');
	const formData = new FormData();
	formData.append('profile-picture', input.files[0]);
	
	try {
		const data = await fetchAPI('/request/user/update-profile-picture', 'POST', null, true, formData);

		if (data.success) {
			$form("uploadForm").reset();
			fetchProfile();
			localStorage.setItem("profile_picture", data.profile_picture);
			document.getElementById("profile_photo_circle_nav_bar").innerHTML = `
			<img src="./${data.profile_picture}" alt="Profile picture" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
			`;
		}
	} catch (err) { notif(`Error changing profile picture: ${err}`, false) }
}

export async function accessProfileInfo(event: Event): Promise<void> {
	event.preventDefault();
	const password = $input("password").value;

	try {
		const data = await fetchAPI('/request/user/access-profile-infos', 'PUT', { password }, false);
		if (!data.success)
			return notif(data.error, false);
		else {
			$("modif_profile").classList.add('hidden'); //todo: use updateUI
			$("btn_back_home").classList.remove('active');
			$("profile_param_unlocked_id").classList.add('active');
			$input("password").value = "";
			fetchProfile();
		}
	} catch (err) { console.error(`accessProfileInfo: ${err}`); }
}

export async function activate2FA(event: Event): Promise<void> {
	event.preventDefault();
	const code = $input("activate-2fa-code").value;
	
	try {
		const data = await fetchAPI('/request/user/activate-2fa', 'POST', { code });

		if (data.success)
			document.getElementById("code_validation_id").classList.remove('active');
	} catch (err) {
		console.error("activate2FA: ", err);
	}
}

export async function enable_doubleAuth(): Promise<void> {
	try {
		const data = await fetchAPI('/request/user/enable-2fa', 'PUT');

		if (data.success)
			$input('qrCode').src = data.qrCode;
	} catch (err) { console.error(`enable_doubleAuth: ${err}`); }
}

export async function disable_doubleAuth(): Promise<void> {
	try {
		await fetchAPI('/request/user/disable-2fa', 'PUT');
	} catch (err) { console.error(`disable_doubleAuth: ${err}`); }
}

export async function export_data(): Promise<void> {
	try {
		// notif("Preparing your data for download...", true);
		const data = await fetchAPI('/request/user/export-data', 'GET', null, false);

		const username = data.personal_information.username;
		const jsonString = JSON.stringify(data, null, 2);
		const blob = new Blob([jsonString], { type: 'application/json' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		const date = new Date().toISOString().split('T')[0];
		
		a.href = url;
		a.download = `transcendance-${username}-data-${date}.json`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
		
		// notif("Your data has been downloaded successfully!", true);
	} catch (err) { console.error(`export_data: ${err}`); }
}

export async function anonymize_user(): Promise<void> {
	if (confirm('Do you really want to anonymize your account ?')) {
		try {
			const data = await fetchAPI('/request/user/anonymize-account', 'PUT');
			fetchProfile();
		} catch (err) { console.error(`anonymize_user: ${err}`); }
	}
}

export async function delete_account(): Promise<void> {
	if (confirm('Do you really want to delete your account ?')) {
		try {
			const data = await fetchAPI('/request/user/delete-account', 'DELETE')

			if (data.success) {
				disconnectWebSocket()
				sessionStorage.clear()
				localStorage.clear()
				homeView()
			}
		} catch (err) { console.error(`delete_account: ${err}`) }
	}
}

export async function fetchProfile(): Promise<void> {
	try {
		const data = await fetchAPI('/request/profile', 'GET', null, false);

		if (data.user) {
			const user = data.user;
			document.getElementById("profile_photo_circle").innerHTML = `<img src="./${data.profile_picture}" alt="${user.username} profile picture" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
			$("player_name").textContent = user.username;
			localStorage.setItem("Player1", user.username);
			const username = $input("change_username");
			username.placeholder = user.username;
			const doubleAuth = $input("active_fa");
			if (user.doubleAuth_status)
				doubleAuth.checked = true;
			else {
				doubleAuth.checked = false;
				if (doubleAuth.classList.contains("checked"))
					doubleAuth.classList.remove("checked");
			}
		}
	} catch (err) { console.error(`fetchProfile: ${err}`); }
}

export async function updateProfileInfo(event: Event): Promise<void> {
	event.preventDefault();
	const newUsername = $input("change_username").value;
	const newPassword = $input("change_password").value;
	const confirmPassword = $input("confirm_change_password").value;
	if (newUsername === "" && newPassword === "") return notif("Please fill at least one field!", false);
	if (newPassword && (!confirmPassword || newPassword !== confirmPassword)) return notif("Passwords do not match!", false);

	try {
		await fetchAPI('/request/user/update-profile', 'PUT', { newUsername, newPassword });
		$form("updateProfileForm").reset();
		fetchProfile();
	} catch (err) { console.error(`updateProfileInfo: ${err}`); }
}