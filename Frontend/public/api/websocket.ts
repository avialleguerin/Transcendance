// import { WebSocketManager } from "./types"
import { notif } from './utils.js'
import { fetch_user_friendships } from './friendships.js'

export class WebSocketManager {
	private socket: WebSocket | null;
	private heartbeatInterval: ReturnType<typeof setInterval> | null;
	
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
			this.startHeartbeat()
		}
		
		this.socket.onmessage = (event) => {
			const data = JSON.parse(event.data)
			if (data.type === 'friend_request')
				this.handleFriendRequest(data.message)
			else if (data.type === 'friend_deleted' || data.type === 'account_deleted' || data.type === 'friend_status_update')
				this.handleFriendRequest("null")
		}
		
		this.socket.onclose = () => {
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
			this.socket.close(1000, 'User logout')
		}
		this.socket = null
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

	handleFriendRequest(message: string | null) {
		fetch_user_friendships()
		if (message !== "null")
			notif(`${message}`, true)
	}

}

// Instance globale du WebSocket
export const wsManager = new WebSocketManager()

// Connexion automatique après login
export function connectWebSocket(): void {
	wsManager.connect()
}

// Déconnexion lors du logout
export function disconnectWebSocket(): void {
	wsManager.disconnect()
}

// AJOUT : Rendre les fonctions accessibles globalement pour les fichiers non-modules
if (typeof window !== 'undefined') {
	window.connectWebSocket = connectWebSocket;
	window.disconnectWebSocket = disconnectWebSocket;
	window.wsManager = wsManager;
}

