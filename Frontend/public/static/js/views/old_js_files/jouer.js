import AbstractView from "./AbstractView.js";
export default class jouer extends AbstractView {
    constructor() {
        super();
        this.setTitle("Jouer");
    }
    async getHtml() {
        return /*html*/ `
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
			// margin-left: 30%;
			margin-top: 10%;
			justify-content: left;
			color: rgba(255, 255, 255, 1);
			font-size: 2.5vw;
			margin-bottom: 1em;
			transform: translate(-50%, 0%);
		}
	
		.button-container {
			display: flex;
			justify-content: space-between;
			gap: 20%;
			width: 60%;
		}
	
		.jouer, .settings {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
		}
	
		/* Image sous le bouton */
		// .jouer .btn-bg, .settings .btn-bg {
		// 	position: absolute;
		// 	top: 0;
		// 	left: 0;
		// 	width: 150%;
		// 	height: 150%;
		// 	background-size: cover;
		// 	background-repeat: no-repeat;
		// 	background-position: center;
		// 	z-index: -1; /* Derrière le bouton */
		// }
	
		// .jouer .btn-bg {
		// 	background-image: url('/image/boutton.svg');
		// }
	
		// .settings .btn-bg {
		// 	background-image: url('/image/boutton2.svg');
		// }
	
		/* Bouton principal */
		.btn {
			position: relative;
			margin-top: 50%;
			z-index: 1;
			font-size: 1vw;
			color: gray; /* Couleur par défaut : gris */
			border: none;
			cursor: pointer;
			background-color: transparent;
			transition: color 0.3s ease; /* Transition douce pour le changement de couleur */
		}
		
		.btn:hover {
			color: white; /* Devient blanc au survol */
		}
	
		/* Image au-dessus du bouton */
		.jouer .btn-top, .settings .btn-top {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, 0%);
			width: 100%; /* Taille de l'image */
			height: auto;
			z-index: 2;
			pointer-events: none;
		}
	</style>
	
	<div class="container">
		<h1>Transcendence</h1>
		<div class="button-container">
			<!-- Bouton Jouer -->
			<div class="jouer">
				<div class="btn-bg"></div> <!-- Image arrière-plan -->
				<button class="btn" data-link="/game">Jouer</button>
				<img class="btn-top" src="/image/boutton.svg" alt="Icône Jouer"> <!-- Image au-dessus -->
			</div>
			<!-- Bouton Paramètres -->
			<div class="settings">
				<div class="btn-bg"></div> <!-- Image arrière-plan -->
				<button class="btn" data-link>Paramètres</button>
				<img class="btn-top" src="/image/boutton.svg" alt="Icône Paramètres"> <!-- Image au-dessus -->
			</div>
		</div>
	</div>`;
    }
}