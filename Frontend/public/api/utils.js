function notif(message, success = true) {
	const notification = document.getElementById('resultMessage');
	
	if (notification) {
		if (success) {
			notification.innerHTML = "<div style='display:flex; align-items:center;'><img src='../srcs/game/assets/image/success.png' style='width:20px; height:20px; margin-right:5px;'><span>" + message + "</span></div>";
			notification.className = "py-2 px-4 rounded shadow-lg bg-green-500 text-white font-medium"
		} else {
			notification.innerHTML = "<div style='display:flex; align-items:center;'><img src='../srcs/game/assets/image/failure.png' style='width:20px; height:20px; margin-right:5px;'><span>" + message + "</span></div>";
			notification.className = "py-2 px-4 rounded shadow-lg bg-red-500 text-white font-medium";
		}

		setTimeout(() => {
			notification.classList.add('opacity-100');
		}, 10);

		setTimeout(() => {
			notification.classList.remove('opacity-100');
			notification.classList.add('opacity-0');
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

		sessionStorage.setItem('accessToken', data.accessToken);

		if (data.success)
			notif(data.message, true);
		else if (data.error)
			notif(data.error, false);
		console.log("data", data);
		return data;
	} catch (err) {
		console.error(`Error in API call to ${url}:`, err);
		if (showNotification)
			notif("Une erreur s'est produite lors de la communication avec le serveur", false);
		throw err;
	}
}

