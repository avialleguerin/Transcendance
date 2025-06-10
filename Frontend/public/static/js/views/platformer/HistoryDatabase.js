export default class HistoryDatabase {
	constructor() {
		this.history = [];
		this.maxHistory = 10; // Maximum number of games to keep in history
	}

	addGame(game, winner, score, time) {
		if (this.history.length >= this.maxHistory) {
			this.history.shift(); // Remove the oldest game
		}
		this.history.push({ game, winner, score, time });
	}
	getHistory() {
		return this.history;
	}
	clearHistory() {
		this.history = [];
	}
	saveToLocalStorage() {
		localStorage.setItem('gameHistory', JSON.stringify(this.history));
	}
	loadFromLocalStorage() {
		const savedHistory = localStorage.getItem('gameHistory');
		if (savedHistory) {
			this.history = JSON.parse(savedHistory);
		}
	}
}