class WebSocketManager {
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
			if (data.type === 'pong') {
				console.log('Heartbeat response received')
			}
		}
		
		this.socket.onclose = () => {
			console.log('WebSocket disconnected')
			this.stopHeartbeat()
			// Tentative de reconnexion après 3 secondes
			setTimeout(() => this.connect(), 3000)
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
			this.socket.close()
		}
		this.socket = null
	}
	
	getUserIdFromToken() {
		const token = sessionStorage.getItem('accessToken')
		if (!token) return null
		
		try {
			const payload = JSON.parse(atob(token.split('.')[1]))
			return parseInt(payload.userId) // Convertir ici
		} catch (error) {
			console.error('Error parsing token:', error)
			return null
		}
	}
}

// Instance globale du WebSocket
const wsManager = new WebSocketManager()

// Connexion automatique après login
function connectWebSocket() {
	wsManager.connect()
}

// Déconnexion lors du logout
function disconnectWebSocket() {
	if (typeof wsManager !== 'undefined' && wsManager) {
		wsManager.disconnect()
	}
}