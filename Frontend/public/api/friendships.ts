import { notif, fetchAPI, $, $input, $form, sanitizeInput, StorageKeys } from './utils.js';
import { Friendship, GameScore } from './types.js';

let historyIsActive = StorageKeys.HISTORY_IS_VISIBLE = true;
let currentHistoryType: 'user' | 'friend' | null = null; // Nouvelle variable pour tracker le type

if (typeof window !== 'undefined') {
	// window.addFriend = addFriend;
	window.accept_friendship = accept_friendship;
	window.delete_friendship = delete_friendship;
	// window.fetch_user_friendships = fetch_user_friendships;
	// window.fetch_user_games = fetch_user_games;
	// window.fetch_user_games_big = fetch_user_games_big;
	// window.fetch_friend_games_big = fetch_friend_games_big; //REVIEW
	// window.togglePanel = togglePanel;
}

export async function addFriend(event: Event): Promise<void> {
	event.preventDefault();
	const friend = $input("friend_name_input").value;
	
	try {
		await fetchAPI('/request/friendship/add-friend', 'POST', { friend });
		fetch_user_friendships();
		$input("friend_name_input").value = "";
	} catch (err) { notif("Failed to add '" + friend + "' as a friend", false); }
}

export async function accept_friendship(friendshipId: number): Promise<void> {
	try {
		await fetchAPI('/request/friendship/accept-friend', 'POST', { friendshipId });
		fetch_user_friendships();
	} catch (err) {
		notif("Failed to accept this friend", false);
	}
}

export async function delete_friendship(friendshipId: string | number): Promise<void> {
    try {
        // Vérifier si l'historique d'un ami est ouvert avant la suppression
        const gameHistory = document.getElementById('game_history');
        const exit_game_history_btn = document.getElementById('exit_game_history_btn');
        const isHistoryOpen = gameHistory?.classList.contains('active');
        const currentDisplayedUsername = document.getElementById("game_history_username")?.textContent;
        
        await fetchAPI('/request/friendship/delete-friend', 'DELETE', { friendshipId });
        
        // Si l'historique était ouvert ET c'était l'historique d'un ami (pas le user connecté)
        if (isHistoryOpen && currentHistoryType === 'friend' && currentDisplayedUsername !== StorageKeys.PLAYER1) {
            // Fermer l'historique immédiatement après suppression
            gameHistory.classList.remove('active');
            exit_game_history_btn.style.display = 'block';
            StorageKeys.HISTORY_IS_VISIBLE = false;
            historyIsActive = false;
            StorageKeys.BOOL = false;
            StorageKeys.HISTORY_VISIBLE = false;
            currentHistoryType = null;
            
            // Optionnel : afficher une notification
            notif("Friend removed and history closed", true);
        }
        
        fetch_user_friendships();
    } catch (err) {
        notif("Failed to delete this friend", false);
    }
}

export async function fetch_user_friendships(): Promise<void> {
    try {
        const data = await fetchAPI('/request/friendship/get-user-friendships', 'GET', null, false);
		if (!data.success) return;
		
		const friendships = data.friendships;
		const user = data.user;
		const accepted:	Friendship[] = friendships.filter((f: Friendship) => f.status === 'accepted');
		const pending:	Friendship[] = friendships.filter((f: Friendship) => f.status === 'pending');

		const hasReceivedRequests = pending.some(friend => user.userId === friend.friendId);

		$("notify_friend_demand").style.display = `${pending.length > 0 && hasReceivedRequests ? "block" : "none"}`;

		const renderFriend = (friendship: Friendship, showActions: boolean): string => {
			let statusClass: string = `${friendship.friendOnlineStatus ? 'friend_online_status online' : 'friend_online_status offline'}`;
			let statusTitle: string = `${friendship.friendOnlineStatus ? 'Online' : 'Offline'}`;
			let friendshipProfilePicture: string = friendship.status === 'accepted' ? friendship.friendProfilePicture : '/assets/image/default-profile-picture.png';
			return /*html*/`
				<div id="friendId-${friendship.friendId}" class="friend">
					<div class="friend-info">
						<div id="friendStatus-${friendship.friendId}" class="${friendship.status === 'accepted' ? statusClass : ''}" title="${statusTitle}"></div>
						<img src="${friendshipProfilePicture}" class="friend_photo" alt="Profile">
						<div class="friend-details">
							<p class="friend_name">${friendship.friend_username}</p>
							<div class="friend-status-actions">
								${
									showActions
									? /*html*/`
										<div class="friend-actions">
											<button class="friend-btn accept-btn" id="friend_btn_accept" onclick="accept_friendship(${friendship.friendshipId})">✓</button>
											<button class="friend-btn reject-btn" id="friend_btn_reject" onclick="delete_friendship(${friendship.friendshipId})">✖</button>
										</div>
									`
									: ``
								}
							</div>
						</div>
					</div>
					<button id="btn_delete_friend" class="friend-btn delete-btn" onclick="delete_friendship(${friendship.friendshipId})">
						<img src="/assets/image/trash.svg" alt="Delete Friend" class="delete-icon">
					</button>
				</div>
			`;
		};




		document.getElementById('friends-accepted').innerHTML =
			accepted.map(friend => renderFriend(friend, false)).join('') || `<div class="text-center">No Friends found</div>`;

		const gameHistory = document.getElementById('game_history');
		const exit_game_history_btn = document.getElementById('exit_game_history_btn');

		// Supprimer l'ancien event listener pour éviter les doublons
		if (handleDocumentClick) {
			document.removeEventListener('click', handleDocumentClick);
		}
		
		// Ajouter l'event listener global pour fermer l'historique
		handleDocumentClick = function(event: Event) {
			const target = event.target as HTMLElement;
			
			// Vérifier si l'historique est ouvert ET si c'est l'historique d'un ami
			if (gameHistory.classList.contains('active') && 
				StorageKeys.HISTORY_IS_VISIBLE && 
				currentHistoryType === 'friend' && 
				!target.closest('#game_history') && 
				!target.classList.contains('friend_photo')) {
				
				// Fermer l'historique
				gameHistory.classList.remove('active');
				exit_game_history_btn.style.display = 'block';
				StorageKeys.HISTORY_IS_VISIBLE = false;
				historyIsActive = false;
				StorageKeys.BOOL = false;
				StorageKeys.HISTORY_VISIBLE = false;
				currentHistoryType = null; // Reset le type
			}
		};
		
		document.addEventListener('click', handleDocumentClick);

		const friendPhotos = document.querySelectorAll('.friend_photo');

		friendPhotos.forEach(photo => {
			(photo as HTMLElement).onclick = function(event) {
				event.stopPropagation();
				
				if (!gameHistory.classList.contains('active')) {
					const friendName = (this as HTMLElement).nextElementSibling.querySelector('.friend_name').textContent
					if (!sanitizeInput(friendName, 'username').success)
					{
						notif("Invalid username", false);
						return fetch_user_friendships()
					}
					const friendExists = accepted.some(friend => friend.friend_username === friendName);
					if (!friendExists)
					{
						notif(`${friendName} is not your friend`, false);
						return fetch_user_friendships();
					}
					if (fetch_friend_games_big(friendName))
					{
						gameHistory.classList.add('active');
						exit_game_history_btn.style.display = 'none';
						StorageKeys.HISTORY_IS_VISIBLE = true;
						historyIsActive = true;
						StorageKeys.BOOL = true;
						StorageKeys.HISTORY_VISIBLE = true;
						// currentHistoryType est déjà défini dans fetch_friend_games_big
					}	
				}
				else if (StorageKeys.BOOL === true && gameHistory.classList.contains('active')) {
					gameHistory.classList.remove('active');
					exit_game_history_btn.style.display = 'block';
					StorageKeys.HISTORY_IS_VISIBLE = false;
					historyIsActive = false;
					StorageKeys.BOOL = false;
					StorageKeys.HISTORY_VISIBLE = false;
					currentHistoryType = null; // Reset le type
				}
			};
		});



		const deleteButtons = document.querySelectorAll('.delete-btn');

		if (deleteButtons && deleteButtons.length > 0) {
			deleteButtons.forEach(button => {
				button.addEventListener('click', function(event) {
					event.stopPropagation();
					
					// Récupérer le nom de l'ami qui va être supprimé
					const friendElement = this.closest('.friend');
					const friendNameElement = friendElement?.querySelector('.friend_name');
					const friendNameToDelete = friendNameElement?.textContent;
					const currentDisplayedUsername = document.getElementById("game_history_username")?.textContent;
					
					// Si l'historique est ouvert et c'est celui de l'ami qui va être supprimé
					if (gameHistory.classList.contains('active') && 
                        currentHistoryType === 'friend' && 
                        friendNameToDelete === currentDisplayedUsername) {
                        
                        // Fermer l'historique avant la suppression
                        gameHistory.classList.remove('active');
                        exit_game_history_btn.style.display = 'block';
                        StorageKeys.HISTORY_IS_VISIBLE = false;
                        StorageKeys.BOOL = false;
                        historyIsActive = false;
                        currentHistoryType = null;
                    }
					
					// Réafficher tous les boutons de suppression
					document.querySelectorAll('.delete-btn').forEach(btn => {
						(btn as HTMLElement).style.display = 'block';
					});
				});
			});
		}

		document.getElementById('friends-pending').innerHTML =
			pending.map(friend => {
				const isReceivedRequest = user.userId === friend.friendId;
				return renderFriend(friend, isReceivedRequest);
			}).join('') || `<div class="text-center">No Requests found</div>`;

	} catch (err) {
		console.error('Error retrieving friendships:', err);
	}
}

export async function fetch_user_games(): Promise<void> {
	try {
		const data = await fetchAPI('/request/game/get-user-games', 'GET', null, false);
		if (!data.success) {
			notif(data.error, false);
			return;
		}
		const games = data.games;
		const userId = data.user.userId;
		if (games && games.length > 0) {
			document.getElementById('games-table').innerHTML = games.map((game: GameScore) => {
				let dispScoreLeft = game.score_left;
				let dispScoreRight = game.score_right;
				const leftWinOriginal = (game.score_left - game.score_right) > 0;

				const is2v2 = game.user3_id && game.user4_id;
				if (is2v2) {
					let leftTeam = [
					  { id: game.user1_id, username: game.user1_username, profilePicture: game.user1ProfilePicture },
					  { id: game.user2_id, username: game.user2_username, profilePicture: game.user2ProfilePicture }
					];
					let rightTeam = [
					  { id: game.user3_id, username: game.user3_username, profilePicture: game.user3ProfilePicture },
					  { id: game.user4_id, username: game.user4_username, profilePicture: game.user4ProfilePicture }
					];

					const leftHasCurrent = leftTeam.some(player => player.id == userId);
					const rightHasCurrent = rightTeam.some(player => player.id == userId);

					if (!leftHasCurrent && rightHasCurrent) {
					  const tempTeam = leftTeam;
					  leftTeam = rightTeam;
					  rightTeam = tempTeam;
					  dispScoreLeft = game.score_right;
					  dispScoreRight = game.score_left;
					}
					const result2v2 = (dispScoreLeft - dispScoreRight) > 0 ? 'win' : 'lose';

					return /*html*/`
					  <tr class="game_card_navBar ${result2v2}">
						<td class="profile_navBar_team">
						  <div class="team-player">
							<img src="${leftTeam[0].profilePicture}" alt="profile" />
							<img src="${leftTeam[1].profilePicture}" alt="profile" />
						  </div>
						  <div class="team-player">
							<p class="username_navBar">${leftTeam[0].username}</p>
							<p class="username_navBar">${leftTeam[1].username}</p>
						  </div>
						</td>
						<td class="vs_info_navBar">
						  <p class="score_navBar">${dispScoreLeft} - ${dispScoreRight}</p>
						</td>
						<td class="opponent_navBar_team">
						  <div class="team-player">
							<p class="username_navBar">${rightTeam[0].username}</p>
							<p class="username_navBar">${rightTeam[1].username}</p>
						  </div>
						  <div class="team-player">
							<img src="${rightTeam[0].profilePicture}" alt="profile" />
							<img src="${rightTeam[1].profilePicture}" alt="profile" />
						  </div>
						</td>
					  </tr>
					`;
				} else {
					let leftPlayer = { id: game.user1_id, username: game.user1_username, profilePicture: game.user1ProfilePicture };
					let rightPlayer = { id: game.user2_id, username: game.user2_username, profilePicture: game.user2ProfilePicture };

					if (rightPlayer.id == userId && leftPlayer.id != userId) {
					  const tempPlayer = leftPlayer;
					  leftPlayer = rightPlayer;
					  rightPlayer = tempPlayer;
					  dispScoreLeft = game.score_right;
					  dispScoreRight = game.score_left;
					}
					const result1v1 = (dispScoreLeft - dispScoreRight) > 0 ? 'win' : 'lose';

					return /*html*/`
					  <tr class="game_card_navBar ${result1v1}">
						<td class="profile_navBar">
						  <img src="${leftPlayer.profilePicture}" alt="profile" />
						  <p class="username_navBar">${leftPlayer.username}</p>
						</td>
						<td class="vs_info_navBar">
						  <p class="score_navBar">${dispScoreLeft} - ${dispScoreRight}</p>
						</td>
						<td class="opponent_navBar">
						  <p class="username_navBar">${rightPlayer.username}</p>
						  <img src="${rightPlayer.profilePicture}" alt="profile" />
						</td>
					  </tr>
					`;
				}
			}).join('');
		} else {
			document.getElementById('games-table').innerHTML = `
				<tr><td colspan="4" class="text-center">No Games found</td></tr>
			`;
		}
	} catch (err) {
		console.error('Error retrieving games:', err);
	}
}

export async function fetch_friend_games_big(username: string): Promise<boolean> {
	try {
		let data: any = {};
		console.log("Fetching games for user:", username);
		if (username)
			data = await fetchAPI('/request/game/get-friend-games', 'POST', { username }, null, false);
		if (!data.success)
		{
			notif(data.error, false);
			return false;
		}
		const user = data.user;
		const userId = user.userId;
		const games = data.games;
		
		// Marquer que c'est l'historique d'un ami
		currentHistoryType = 'friend';
		
		document.getElementById("profile_photo_circle_Game_History").innerHTML = `<img src="${data.user.profile_picture}" alt="${data.username} profile picture" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;	
		document.getElementById("game_history_username").innerHTML = `${data.user.username}`;
		document.getElementById("games_won_history").innerHTML = `${user.games_won}`;
		document.getElementById("games_lost_history").innerHTML = `${user.games_lost}`;
		document.getElementById("games_played_history").innerHTML = `${user.games_lost + user.games_won}`;
		document.getElementById("win_rate_history").innerHTML = `${(user.games_won + user.games_lost) > 0 ? Math.round((user.games_won / (user.games_won + user.games_lost)) * 100) : 0} %`;
		if (games && games.length > 0) {
			document.getElementById('games-table-big').innerHTML = games.map((game: GameScore) => {
				let dispScoreLeft = game.score_left;
				let dispScoreRight = game.score_right;
				const leftWinOriginal = (game.score_left - game.score_right) > 0;

				const is2v2 = game.user3_id && game.user4_id;
				if (is2v2) {
					let leftTeam = [
					  { id: game.user1_id, username: game.user1_username, profilePicture: game.user1ProfilePicture },
					  { id: game.user2_id, username: game.user2_username, profilePicture: game.user2ProfilePicture }
					];
					let rightTeam = [
					  { id: game.user3_id, username: game.user3_username, profilePicture: game.user3ProfilePicture },
					  { id: game.user4_id, username: game.user4_username, profilePicture: game.user4ProfilePicture }
					];

					const leftHasCurrent = leftTeam.some(player => player.id == userId);
					const rightHasCurrent = rightTeam.some(player => player.id == userId);

					if (!leftHasCurrent && rightHasCurrent) {
					  const tempTeam = leftTeam;
					  leftTeam = rightTeam;
					  rightTeam = tempTeam;
					  dispScoreLeft = game.score_right;
					  dispScoreRight = game.score_left;
					}
					const result2v2 = (dispScoreLeft - dispScoreRight) > 0 ? 'win' : 'lose';

					return /*html*/`
					<tr class="game_card_navBar team ${result2v2}">
						<td class="profile_navBar_team">
							<div class="team-player">
								<img src="${leftTeam[0].profilePicture}" alt="profile" />
								<img src="${leftTeam[1].profilePicture}" alt="profile" />
							</div>
							<div class="team-player">
								<p class="username_navBar">${leftTeam[0].username}</p>
								<p class="username_navBar">${leftTeam[1].username}</p>
							</div>
						</td>
						<td class="vs_info_navBar">
							<p class="date_history">${game.created_at}</p>
							<p class="score_navBar">${dispScoreLeft} - ${dispScoreRight}</p>
						</td>
						<td class="opponent_navBar_team">
							<div class="team-player">
								<p class="username_navBar">${rightTeam[0].username}</p>
								<p class="username_navBar">${rightTeam[1].username}</p>
							</div>
							<div class="team-player">
								<img src="${rightTeam[0].profilePicture}" alt="profile" />
								<img src="${rightTeam[1].profilePicture}" alt="profile" />
							</div>
						</td>
					</tr>
					`;
				} else {
					let leftPlayer = { id: game.user1_id, username: game.user1_username, profilePicture: game.user1ProfilePicture };
					let rightPlayer = { id: game.user2_id, username: game.user2_username, profilePicture: game.user2ProfilePicture };

					if (rightPlayer.id == userId && leftPlayer.id != userId) {
						const tempPlayer = leftPlayer;
						leftPlayer = rightPlayer;
						rightPlayer = tempPlayer;
						dispScoreLeft = game.score_right;
						dispScoreRight = game.score_left;
					}
					const result1v1 = (dispScoreLeft - dispScoreRight) > 0 ? 'win' : 'lose';

					return /*html*/`
					<tr class="game_card_navBar ${result1v1}">
						<td class="profile_navBar">
							<img src="${leftPlayer.profilePicture}" alt="profile" />
							<p class="username_navBar">${leftPlayer.username}</p>
						</td>
						<td class="vs_info_navBar">
							<p class="date_history">${game.created_at}</p>
							<p class="score_navBar">${dispScoreLeft} - ${dispScoreRight}</p>
						</td>
						<td class="opponent_navBar">
							<p class="username_navBar">${rightPlayer.username}</p>
							<img src="${rightPlayer.profilePicture}" alt="profile" />
						</td>
					</tr>
					`;
				}
			}).join('');
		} else {
			document.getElementById('games-table-big').innerHTML = `
				<tr><td colspan="4" class="text-center-big">No Games found</td></tr>
			`;
		}
		return true
	} catch (err) {
		console.error('Error retrieving games:', err);
	}
}

export async function fetch_user_games_big(): Promise<boolean> {
	try {
		let data: any = {};
		data = await fetchAPI('/request/game/get-user-games', 'GET', null, null, false);
		if (!data.success)
		{
			notif(data.error, false);
			return false;
		}
		const user = data.user;
		const userId = user.userId;
		const games = data.games;
		
		// Marquer que c'est l'historique de l'utilisateur connecté
		currentHistoryType = 'user';
		
		document.getElementById("profile_photo_circle_Game_History").innerHTML = `<img src="${data.user.profile_picture}" alt="${data.username} profile picture" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;	
		document.getElementById("game_history_username").innerHTML = `${data.user.username}`;
		document.getElementById("games_won_history").innerHTML = `${user.games_won}`;
		document.getElementById("games_lost_history").innerHTML = `${user.games_lost}`;
		document.getElementById("games_played_history").innerHTML = `${user.games_lost + user.games_won}`;
		document.getElementById("win_rate_history").innerHTML = `${(user.games_won + user.games_lost) > 0 ? Math.round((user.games_won / (user.games_won + user.games_lost)) * 100) : 0} %`;
		if (games && games.length > 0) {
			document.getElementById('games-table-big').innerHTML = games.map((game: GameScore) => {
				let dispScoreLeft = game.score_left;
				let dispScoreRight = game.score_right;
				const leftWinOriginal = (game.score_left - game.score_right) > 0;

				const is2v2 = game.user3_id && game.user4_id;
				if (is2v2) {
					let leftTeam = [
					  { id: game.user1_id, username: game.user1_username, profilePicture: game.user1ProfilePicture },
					  { id: game.user2_id, username: game.user2_username, profilePicture: game.user2ProfilePicture }
					];
					let rightTeam = [
					  { id: game.user3_id, username: game.user3_username, profilePicture: game.user3ProfilePicture },
					  { id: game.user4_id, username: game.user4_username, profilePicture: game.user4ProfilePicture }
					];

					const leftHasCurrent = leftTeam.some(player => player.id == userId);
					const rightHasCurrent = rightTeam.some(player => player.id == userId);

					if (!leftHasCurrent && rightHasCurrent) {
					  const tempTeam = leftTeam;
					  leftTeam = rightTeam;
					  rightTeam = tempTeam;
					  dispScoreLeft = game.score_right;
					  dispScoreRight = game.score_left;
					}
					const result2v2 = (dispScoreLeft - dispScoreRight) > 0 ? 'win' : 'lose';

					return /*html*/`
					<tr class="game_card_navBar team ${result2v2}">
						<td class="profile_navBar_team">
							<div class="team-player">
								<img src="${leftTeam[0].profilePicture}" alt="profile" />
								<img src="${leftTeam[1].profilePicture}" alt="profile" />
							</div>
							<div class="team-player">
								<p class="username_navBar">${leftTeam[0].username}</p>
								<p class="username_navBar">${leftTeam[1].username}</p>
							</div>
						</td>
						<td class="vs_info_navBar">
							<p class="date_history">${game.created_at}</p>
							<p class="score_navBar">${dispScoreLeft} - ${dispScoreRight}</p>
						</td>
						<td class="opponent_navBar_team">
							<div class="team-player">
								<p class="username_navBar">${rightTeam[0].username}</p>
								<p class="username_navBar">${rightTeam[1].username}</p>
							</div>
							<div class="team-player">
								<img src="${rightTeam[0].profilePicture}" alt="profile" />
								<img src="${rightTeam[1].profilePicture}" alt="profile" />
							</div>
						</td>
					</tr>
					`;
				} else {
					let leftPlayer = { id: game.user1_id, username: game.user1_username, profilePicture: game.user1ProfilePicture };
					let rightPlayer = { id: game.user2_id, username: game.user2_username, profilePicture: game.user2ProfilePicture };

					if (rightPlayer.id == userId && leftPlayer.id != userId) {
						const tempPlayer = leftPlayer;
						leftPlayer = rightPlayer;
						rightPlayer = tempPlayer;
						dispScoreLeft = game.score_right;
						dispScoreRight = game.score_left;
					}
					const result1v1 = (dispScoreLeft - dispScoreRight) > 0 ? 'win' : 'lose';

					return /*html*/`
					<tr class="game_card_navBar ${result1v1}">
						<td class="profile_navBar">
							<img src="${leftPlayer.profilePicture}" alt="profile" />
							<p class="username_navBar">${leftPlayer.username}</p>
						</td>
						<td class="vs_info_navBar">
							<p class="date_history">${game.created_at}</p>
							<p class="score_navBar">${dispScoreLeft} - ${dispScoreRight}</p>
						</td>
						<td class="opponent_navBar">
							<p class="username_navBar">${rightPlayer.username}</p>
							<img src="${rightPlayer.profilePicture}" alt="profile" />
						</td>
					</tr>
					`;
				}
			}).join('');
		} else {
			document.getElementById('games-table-big').innerHTML = `
				<tr><td colspan="4" class="text-center-big">No Games found</td></tr>
			`;
		}
		return true
	} catch (err) {
		console.error('Error retrieving games:', err);
	}
}

export async function togglePanel(event: Event): Promise<void> {
	event.preventDefault();
	await fetch_user_friendships(); //REVIEW - i add await
	await fetch_user_games();
}

// Variable globale pour stocker la fonction
let handleDocumentClick: ((event: Event) => void) | null = null;

// Fonction pour nettoyer l'event listener
export function cleanupGameHistoryListeners(): void {
	if (handleDocumentClick) {
		document.removeEventListener('click', handleDocumentClick);
		handleDocumentClick = null;
	}
	currentHistoryType = null;
}
