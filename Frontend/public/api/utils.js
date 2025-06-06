function notif(message, success = true) {
	const notification = document.getElementById('resultMessage');
	console.log("notif:", message, "success:", success);
	if (notification) {
		document.getElementById('notification-container').style.display = 'flex';
		const icon = success ?
			`<img src='/srcs/game/assets/image/success.png' style='width:20px; height:20px; margin-right:5px;'>` :
			`<img src='/srcs/game/assets/image/failure.png' style='width:20px; height:20px; margin-right:5px;'>`;

		notification.innerHTML = `<div style='display:flex; align-items:center;'>${icon}<span>${message}</span></div>`;
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
		accessToken = sessionStorage.getItem('accessToken');
		
		const headers = {
			"Authorization": `Bearer ${accessToken}`
		};

		if (body && !formData)
			headers["Content-Type"] = "application/json";

		const options = {
			method,
			headers,
			credentials: 'include'
		};

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
		console.error(`Error in API call to ${url}:`, err.message);
		if (showNotification)
			notif("Une erreur s'est produite lors de la communication avec le serveur", false);
		throw err;
	}
}

