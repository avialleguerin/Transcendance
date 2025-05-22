// async function addFriend(event) {

// 	event.preventDefault();
// 	const friend = document.getElementById("friend_name_input").value;
// 	try {
// 		const response = await fetch('/request/friendship/create-friendship', {
// 			method: "POST",
// 			headers: { 
// 				"Content-Type": "application/json",
// 				"Authorization": `Bearer ${accessToken}`
// 			 },
// 			body: JSON.stringify({ friend })
// 		});
		
// 		const data = await response.json();
// 		if (data.success) {
// 			notif(data.message, true);
// 			document.getElementById("code_validation_id").classList.remove('active');
// 		} else
// 			notif(data.error, false);
// 	} catch (err) {
// 		notif(err, false);
// 	}
// }

async function addFriend(event) {
	event.preventDefault();
	const friend = document.getElementById("friend_name_input").value;
	
	try {
		const data = await fetchAPI('/request/friendship/create-friendship', 'POST', { friend });
		if (data.success)
			document.getElementById("code_validation_id").classList.remove('active');
	} catch (err) {
		console.log("Failed to add friend");
	}
}

// async function fetch_friendships() {
// 	try {
// 		const response = await fetch('/request/friendship/get-user-friendships', {
// 			method: 'GET',
// 			headers: {
// 				"Authorization": `Bearer ${accessToken}`
// 			},
// 			credentials: 'include'
// 		});
// 		const data = await response.json();
// 		// sessionStorage.setItem('accessToken', data.accessToken);
// 		// accessToken = data.accessToken;
// 		if (!data.success) {
// 			notif(data.error, false);
// 			return;
// 		}
// 		const friendships = data.friendships;
// 		document.getElementById('friendships-table').innerHTML = friendships.map(friendship => /*html*/`
// 			<tr>
// 				<td class="bg-white px-6 py-2 rounded-l-xl border border-gray-100 border-r-0">${friendship.friendshipId}</td>
// 				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${friendship.username}</td>
// 				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${friendship.friend_username}</td>
// 				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${friendship.status}</td>
// 				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${friendship.created_at}</td>
// 				<td class="bg-white px-6 py-2 rounded-r-xl border border-gray-100 border-l-0"><button class="bg-red-200 hover:bg-red-300 m-2 text-red-500 hover:text-red-600 px-4 py-1 rounded-full" onclick="delete_friendship(${friendship.friendshipId})">Delete</button></td>
// 			</tr>
// 		`).join('');
// 	} catch (err) {
// 		console.error('Erreur lors de la récupération des Jeux :', err);
// 	}
// }

async function fetch_friendships() {
	try {
		const data = await fetchAPI('/request/friendship/get-user-friendships', 'GET', null, false);
		// sessionStorage.setItem('accessToken', data.accessToken);
		if (!data.success) {
			notif(data.error, false);
			return;
		}
		const friendships = data.friendships;
		console.log(friendships);
		document.getElementById('friendships-table').innerHTML = friendships.map(friendship => /*html*/`
			<tr>
				<td class="bg-white px-6 py-2 rounded-l-xl border border-gray-100 border-r-0">${friendship.friendshipId}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${friendship.username}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${friendship.friend_username}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${friendship.status}</td>
				<td class="bg-white px-6 py-2 border border-gray-100 border-r-0 border-l-0">${friendship.created_at}</td>
				<td class="bg-white px-6 py-2 rounded-r-xl border border-gray-100 border-l-0"><button class="bg-red-200 hover:bg-red-300 m-2 text-red-500 hover:text-red-600 px-4 py-1 rounded-full" onclick="delete_friendship(${friendship.friendshipId})">Delete</button></td>
			</tr>
		`).join('');
	} catch (err) {
		console.error('Erreur lors de la récupération des Jeux :', err);
	}
}

async function togglePanel(event)
{
	event.preventDefault();
	console.log("togglePanel");
	fetch_friendships();
	// fetch_games();
}