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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam91ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJqb3Vlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFlBQVksTUFBTSxtQkFBbUIsQ0FBQztBQUU3QyxNQUFNLENBQUMsT0FBTyxPQUFPLEtBQU0sU0FBUSxZQUFZO0lBQzlDO1FBQ0MsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFHRCxLQUFLLENBQUMsT0FBTztRQUNaLE9BQU8sUUFBUSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUE0R1QsQ0FBQztJQUNSLENBQUM7Q0FDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdFZpZXcgZnJvbSBcIi4vQWJzdHJhY3RWaWV3LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGpvdWVyIGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnNldFRpdGxlKFwiSm91ZXJcIik7XG5cdH1cblxuXHRcblx0YXN5bmMgZ2V0SHRtbCgpIHtcblx0XHRyZXR1cm4gLypodG1sKi9gXG5cdFx0PHN0eWxlPlxuXHRcdC5jb250YWluZXIge1xuXHRcdFx0cG9zaXRpb246IGFic29sdXRlO1xuXHRcdFx0dG9wOiAwJTtcblx0XHRcdGxlZnQ6IDA7XG5cdFx0XHR3aWR0aDogMzUlO1xuXHRcdFx0aGVpZ2h0OiA2MHZoO1xuXHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cdFx0XHRhbGlnbi1pdGVtczogZmxleC1zdGFydDtcblx0XHRcdHBhZGRpbmctbGVmdDogMTUlO1xuXHRcdFx0ei1pbmRleDogMTtcblx0XHRcdHBvaW50ZXItZXZlbnRzOiBhdXRvO1xuXHRcdH1cblx0XG5cdFx0aDEge1xuXHRcdFx0Ly8gbWFyZ2luLWxlZnQ6IDMwJTtcblx0XHRcdG1hcmdpbi10b3A6IDEwJTtcblx0XHRcdGp1c3RpZnktY29udGVudDogbGVmdDtcblx0XHRcdGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDEpO1xuXHRcdFx0Zm9udC1zaXplOiAyLjV2dztcblx0XHRcdG1hcmdpbi1ib3R0b206IDFlbTtcblx0XHRcdHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIDAlKTtcblx0XHR9XG5cdFxuXHRcdC5idXR0b24tY29udGFpbmVyIHtcblx0XHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0XHRqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cdFx0XHRnYXA6IDIwJTtcblx0XHRcdHdpZHRoOiA2MCU7XG5cdFx0fVxuXHRcblx0XHQuam91ZXIsIC5zZXR0aW5ncyB7XG5cdFx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XG5cdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0XHRcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHRcdFx0d2lkdGg6IDEwMCU7XG5cdFx0fVxuXHRcblx0XHQvKiBJbWFnZSBzb3VzIGxlIGJvdXRvbiAqL1xuXHRcdC8vIC5qb3VlciAuYnRuLWJnLCAuc2V0dGluZ3MgLmJ0bi1iZyB7XG5cdFx0Ly8gXHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0Ly8gXHR0b3A6IDA7XG5cdFx0Ly8gXHRsZWZ0OiAwO1xuXHRcdC8vIFx0d2lkdGg6IDE1MCU7XG5cdFx0Ly8gXHRoZWlnaHQ6IDE1MCU7XG5cdFx0Ly8gXHRiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuXHRcdC8vIFx0YmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcblx0XHQvLyBcdGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcblx0XHQvLyBcdHotaW5kZXg6IC0xOyAvKiBEZXJyacOocmUgbGUgYm91dG9uICovXG5cdFx0Ly8gfVxuXHRcblx0XHQvLyAuam91ZXIgLmJ0bi1iZyB7XG5cdFx0Ly8gXHRiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJy9pbWFnZS9ib3V0dG9uLnN2ZycpO1xuXHRcdC8vIH1cblx0XG5cdFx0Ly8gLnNldHRpbmdzIC5idG4tYmcge1xuXHRcdC8vIFx0YmFja2dyb3VuZC1pbWFnZTogdXJsKCcvaW1hZ2UvYm91dHRvbjIuc3ZnJyk7XG5cdFx0Ly8gfVxuXHRcblx0XHQvKiBCb3V0b24gcHJpbmNpcGFsICovXG5cdFx0LmJ0biB7XG5cdFx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XG5cdFx0XHRtYXJnaW4tdG9wOiA1MCU7XG5cdFx0XHR6LWluZGV4OiAxO1xuXHRcdFx0Zm9udC1zaXplOiAxdnc7XG5cdFx0XHRjb2xvcjogZ3JheTsgLyogQ291bGV1ciBwYXIgZMOpZmF1dCA6IGdyaXMgKi9cblx0XHRcdGJvcmRlcjogbm9uZTtcblx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuXHRcdFx0dHJhbnNpdGlvbjogY29sb3IgMC4zcyBlYXNlOyAvKiBUcmFuc2l0aW9uIGRvdWNlIHBvdXIgbGUgY2hhbmdlbWVudCBkZSBjb3VsZXVyICovXG5cdFx0fVxuXHRcdFxuXHRcdC5idG46aG92ZXIge1xuXHRcdFx0Y29sb3I6IHdoaXRlOyAvKiBEZXZpZW50IGJsYW5jIGF1IHN1cnZvbCAqL1xuXHRcdH1cblx0XG5cdFx0LyogSW1hZ2UgYXUtZGVzc3VzIGR1IGJvdXRvbiAqL1xuXHRcdC5qb3VlciAuYnRuLXRvcCwgLnNldHRpbmdzIC5idG4tdG9wIHtcblx0XHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcblx0XHRcdHRvcDogNTAlO1xuXHRcdFx0bGVmdDogNTAlO1xuXHRcdFx0dHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgMCUpO1xuXHRcdFx0d2lkdGg6IDEwMCU7IC8qIFRhaWxsZSBkZSBsJ2ltYWdlICovXG5cdFx0XHRoZWlnaHQ6IGF1dG87XG5cdFx0XHR6LWluZGV4OiAyO1xuXHRcdFx0cG9pbnRlci1ldmVudHM6IG5vbmU7XG5cdFx0fVxuXHQ8L3N0eWxlPlxuXHRcblx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdDxoMT5UcmFuc2NlbmRlbmNlPC9oMT5cblx0XHQ8ZGl2IGNsYXNzPVwiYnV0dG9uLWNvbnRhaW5lclwiPlxuXHRcdFx0PCEtLSBCb3V0b24gSm91ZXIgLS0+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiam91ZXJcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImJ0bi1iZ1wiPjwvZGl2PiA8IS0tIEltYWdlIGFycmnDqHJlLXBsYW4gLS0+XG5cdFx0XHRcdDxidXR0b24gY2xhc3M9XCJidG5cIiBkYXRhLWxpbms9XCIvZ2FtZVwiPkpvdWVyPC9idXR0b24+XG5cdFx0XHRcdDxpbWcgY2xhc3M9XCJidG4tdG9wXCIgc3JjPVwiL2ltYWdlL2JvdXR0b24uc3ZnXCIgYWx0PVwiSWPDtG5lIEpvdWVyXCI+IDwhLS0gSW1hZ2UgYXUtZGVzc3VzIC0tPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8IS0tIEJvdXRvbiBQYXJhbcOodHJlcyAtLT5cblx0XHRcdDxkaXYgY2xhc3M9XCJzZXR0aW5nc1wiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYnRuLWJnXCI+PC9kaXY+IDwhLS0gSW1hZ2UgYXJyacOocmUtcGxhbiAtLT5cblx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImJ0blwiIGRhdGEtbGluaz5QYXJhbcOodHJlczwvYnV0dG9uPlxuXHRcdFx0XHQ8aW1nIGNsYXNzPVwiYnRuLXRvcFwiIHNyYz1cIi9pbWFnZS9ib3V0dG9uLnN2Z1wiIGFsdD1cIkljw7RuZSBQYXJhbcOodHJlc1wiPiA8IS0tIEltYWdlIGF1LWRlc3N1cyAtLT5cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2PlxuXHQ8L2Rpdj5gO1xuXHR9XG59XG5cbiJdfQ==