async function addFriend(event) {

	event.preventDefault();
	const friend = document.getElementById("friend_name_input").value;
	try {
		const response = await fetch('/request/friend/create-friendship', {
			method: "POST",
			headers: { 
				"Content-Type": "application/json",
				"Authorization": `Bearer ${accessToken}`
			 },
			body: JSON.stringify({ friend })
		});
		
		const data = await response.json();
		if (data.success) {
			notif(data.message, true);
			document.getElementById("code_validation_id").classList.remove('active');
		} else
			notif(data.error, false);
	} catch (err) {
		console.error("Error when validating 2FA :", err);
	}
}