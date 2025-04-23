// GameState.js
export const GameState = {
	MENU: "Menu",
	MAPMENU: "MapMenu",
	PLAY: "Play",
	OPTUIONS: "Options",
  };
  
  export class GameStateManager {
	constructor() {
	  this.current = GameState.MENU;
	  this.previous = null;
	}
  
	changeState(newState) {
	  if (Object.values(GameState).includes(newState)) {
		this.previous = this.current;
		this.current = newState;
	  }
	}
  
	getCurrentState() {
	  return this.current;
	}
  
	getPreviousState() {
	  return this.previous;
	}
  }