import { StorageKeys } from "../../../../api/utils.js";

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
		StorageKeys.GAME_HISTORY = JSON.stringify(this.history);
	}
	loadFromLocalStorage() {
		const savedHistory = StorageKeys.GAME_HISTORY;localStorage
		if (savedHistory) {
			this.history = JSON.parse(savedHistory);
		}
	}
}