export function notif(message, success = true) {
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

export async function fetchAPI(url, method, body = null, showNotification = true, formData = null) {
	try {
		let accessToken = sessionStorage.getItem('accessToken');
		
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

// export function changeView(url, viewPath, initMethod = null, delay = 0, transitionFrom = "default", transitionTo = "vue1") {
//     const loadView = async () => {
//         try {
//             handleViewTransitions(transitionFrom, transitionTo);
//             history.pushState({}, '', url);
            
//             const module = await import(viewPath);
//             const ViewClass = module.default;
//             const viewInstance = new ViewClass();
//             const html = await viewInstance.getHtml();
            
//             const appElement = document.getElementById('app');
//             if (appElement) {
//                 appElement.innerHTML = html;
                
//                 if (initMethod && viewInstance[initMethod] && typeof viewInstance[initMethod] === 'function') {
//                     viewInstance[initMethod]();
//                 }
//             }
//         } catch (error) {
//             console.error('Erreur lors du chargement de la vue:', error);
//         }
//     };

//     if (delay > 0) {
//         setTimeout(loadView, delay);
//     } else {
//         loadView();
//     }
// }

// export function changeView(targetView, targetUrl, viewModule, delay = 0) {
//     if (delay > 0) {
//         handleViewTransitions("vue1", "default");
//         history.pushState({}, '', targetUrl);
//         setTimeout(() => {
//             history.pushState({}, '', targetUrl);
//             import(viewModule).then(module => {
//                 const ViewClass = module.default;
//                 const viewInstance = new ViewClass();
//                 viewInstance.getHtml().then(html => {
//                     document.getElementById('app').innerHTML = html;
//                     if (viewInstance.game_menu) {
//                         viewInstance.game_menu();
//                     }
//                 });
//             });
//         }, delay);
//     } else {
//         handleViewTransitions("default", "vue1");
//         history.pushState({}, '', targetUrl);
//         import(viewModule).then((module) => {
//             const ViewClass = module.default;
//             const viewInstance = new ViewClass();
//             viewInstance.getHtml().then((html) => {
//                 const appElement = document.getElementById('app');
//                 if (appElement) {
//                     appElement.innerHTML = html;
//                     if (viewInstance.createAccount && typeof viewInstance.createAccount === 'function') {
//                         viewInstance.createAccount();
//                     }
//                 }
//             });
//         });
//     }
// }

export function homeView() {
	handleViewTransitions("default", "vue1");
	history.pushState({}, '', '/');
	import('../static/js/views/Home.js').then((module) => {
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


export function gameMenuView() {
	handleViewTransitions("vue1", "default");
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



// handleViewTransitions("vue1", "default");
// history.pushState({}, '', '/Game_menu');
// import('../static/js/views/Game_menu.js').then(module => {
// 	const GameMenu = module.default;
// 	const gameMenuInstance = new GameMenu();
// 	gameMenuInstance.getHtml().then(html => {
// 		document.getElementById('app').innerHTML = html;
// 		if (gameMenuInstance.game_menu) {
// 			gameMenuInstance.game_menu();
// 		}
// 	});
// });

// handleViewTransitions("default", "vue1");
// history.pushState({}, '', '/');
// import('../static/js/views/Home.js').then((module) => {
// 	const Home = module.default;
// 	const homeInstance = new Home();
// 	homeInstance.getHtml().then((html) => {
// 		const appElement = document.getElementById('app');
// 		if (appElement) {
// 			appElement.innerHTML = html;
// 			if (homeInstance.createAccount && typeof homeInstance.createAccount === 'function') {
// 				homeInstance.createAccount();
// 			}
// 		}
// 	});
// });