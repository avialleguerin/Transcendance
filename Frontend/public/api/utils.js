function notif(message, success = true) {
	const notification = document.getElementById('resultMessage');
	console.log("notif:", message, "success:", success);
	if (notification) {
		document.getElementById('notification-container').style.display = 'flex';
		notification.innerHTML = `<div style='display:flex; align-items:center;'><span>${message}</span></div>`;
		if (success)
			notification.className = `success_notif`
		else
			notification.className = `failure_notif`;

		setTimeout(() => {
			notification.style.opacity = '1';
		}, 10);

		setTimeout(() => {
			notification.style.opacity = '0';
			document.getElementById('notification-container').style.display = 'none';
		}, 3000);
	}
}

async function fetchAPI(url, method, body = null, showNotification = true, formData = null) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		
		const headers = {
			"Authorization": `Bearer ${accessToken}`
		};

		if (body && !formData)
			headers["Content-Type"] = "application/json";

		const options = { method, headers, credentials: 'include' };

		if (body && !formData)
			options.body = JSON.stringify(body);
		else if (formData)
			options.body = formData;

		const response = await fetch(url, options);
		const data = await response.json();
		if (data.accessToken)
			sessionStorage.setItem('accessToken', data.accessToken);

		if (data.success && showNotification)
			notif(data.message, true);
		else if (data.error && showNotification)
			notif(data.error, false);
		console.log("fetchAPI: data:", data.error ? data.error : data);
		return data;
	} catch (err) {
		if (showNotification)
			notif("Une erreur s'est produite lors de la communication avec le serveur", false);
		throw err;
	}
}

async function refreshInfos() {
	try {
		const data = await fetchAPI('/request/user/refresh-infos', 'POST', {}, true, false);

		if (!data.accessToken || data.deleted_account) {
			sessionStorage.clear();
			localStorage.clear();
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
			notif("Session expired, please log in again", false);
		} else if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("accessToken") !== "undefined") {
			// ✅ Utiliser window.connectWebSocket au lieu de l'import
			if (typeof window.connectWebSocket === 'function') {
				window.connectWebSocket();
			}
			localStorage.clear();
			localStorage.setItem("Player1", data.user.username);
			localStorage.setItem("profile_picture", data.user.profile_picture);
			history.pushState({}, '', '/Game_menu');
			import('../static/js/views/Game_menu.js').then(module => {
				const GameMenu = module.default;
				const gameMenuInstance = new GameMenu();
				gameMenuInstance.getHtml().then(html => {
					document.getElementById('app').innerHTML = html;
					if (gameMenuInstance.game_menu) {
						gameMenuInstance.game_menu();
					}
				});
			});
		}

		if (data.success) {
			console.log("Infos refreshed successfully");
		} else {
			console.error("❌ Error refreshing infos:", data.error);
		}
	} catch (err) {
		console.error("Erreur lors du rafraîchissement des informations :", err);
	}
}

// ✅ CORRECTION : Rendre la fonction accessible globalement
window.refreshInfos = refreshInfos;
window.fetchAPI = fetchAPI;
window.notif = notif;