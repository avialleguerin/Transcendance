export class WebSocketManager {
	constructor() {
		this.socket = null
		this.heartbeatInterval = null
	}
	
	connect() {
		const userId = this.getUserIdFromToken()
		const token = sessionStorage.getItem('accessToken')
		
		if (!userId || !token) {
			console.error('Missing userId or token for WebSocket connection')
			return
		}
		
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
		const wsUrl = `${protocol}//${window.location.host}/ws?userId=${userId}&token=${token}`
		
		this.socket = new WebSocket(wsUrl)
		
		this.socket.onopen = () => {
			console.log('WebSocket connected')
			this.startHeartbeat()
		}
		
		this.socket.onmessage = (event) => {
			const data = JSON.parse(event.data)
			if (data.type === 'pong')
				console.log('Heartbeat response received')
			else if (data.type === 'friend_request')
				this.handleFriendRequest(data.message)
			else if (data.type === 'friend_deleted')
				this.handleFriendRequest()
			else if (data.type === 'friend_status_update')
				this.handleFriendRequest()
		}
		
		this.socket.onclose = () => {
			console.log('WebSocket disconnected')
			this.stopHeartbeat()
			// Tentative de reconnexion après 3 secondes si on a toujours un token
			setTimeout(() => {
				if (sessionStorage.getItem('accessToken')) {
					this.connect()
				}
			}, 3000)
		}
		
		this.socket.onerror = (error) => {
			console.error('WebSocket error:', error)
		}
	}
	
	startHeartbeat() {
		this.heartbeatInterval = setInterval(() => {
			if (this.socket && this.socket.readyState === WebSocket.OPEN) {
				this.socket.send(JSON.stringify({ type: 'heartbeat' }))
			}
		}, 30000) // Heartbeat toutes les 30 secondes
	}
	
	stopHeartbeat() {
		if (this.heartbeatInterval) {
			clearInterval(this.heartbeatInterval)
			this.heartbeatInterval = null
		}
	}
	
	disconnect() {
		this.stopHeartbeat()
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			console.log('Closing WebSocket connection...')
			// Forcer la fermeture immédiate
			this.socket.close(1000, 'User logout')
		}
		this.socket = null
		console.log('WebSocket disconnected and cleaned up')
	}
	
	getUserIdFromToken() {
		const token = sessionStorage.getItem('accessToken')
		if (!token) return null
		
		try {
			const payload = JSON.parse(atob(token.split('.')[1]))
			return parseInt(payload.userId)
		} catch (error) {
			console.error('Error parsing token:', error)
			return null
		}
	}

	handleFriendRequest(message) {
		fetch_user_friendships()
		if (message)
			notif(`${message}`, true)
	}

}

// Instance globale du WebSocket
export const wsManager = new WebSocketManager()

export function connectWebSocket() {
	wsManager.connect()
}

export function disconnectWebSocket() {
	wsManager.disconnect()
}

// AJOUT : Rendre les fonctions accessibles globalement pour les fichiers non-modules
window.connectWebSocket = connectWebSocket;
window.disconnectWebSocket = disconnectWebSocket;
window.wsManager = wsManager;