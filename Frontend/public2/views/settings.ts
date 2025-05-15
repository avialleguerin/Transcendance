import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Settings");
	}

	
	async getHtml() {
		return /*html*/`
			<style>
			.container {
				position: absolute;
				top: 0%;
				left: 0;
				width: 35%;
				height: 60vh;
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				padding-left: 15%;
				z-index: 1;
				pointer-events: auto;
			}
			
			h1 {
				margin-left: 30%;
				margin-top: 10%;
				color: rgba(255, 255, 255, 1);
				font-size: 5em;
				margin-bottom: 1em;
			}
			
			.button-container {
				display: flex;
				// width: %;
				justify-content: space-between;
				pading-right: 10%;
			}
			
			.btn {
				width: 100%;
				padding: 0.75rem;
				background-color: rgba(255, 255, 255, 0.1);
				color: white;
				border: none;
				border-radius: 4px;
				cursor: pointer;
				font-size: 2.5em;
				text-align: center;
				transition: background-color 0.3s ease;
			}
			
			.btn:hover {
				background-color: rgba(255, 255, 255, 0.2);
			}

			</style>

			<div class="container">
			<h1>menu</h1>
			<div class="button-container">
				<div class="jouer">
					<button class="btn" data-link="/game">Jouer</button>
				</div>
				<div class="settings">
					// <button class="btn" class="nav--link" data-link>Paramètres</button>
					<button href="/settings" class="nav--link" data-link>Paramètres</button>
				</div>
			</div>
		</div>
		`;
	}
}

