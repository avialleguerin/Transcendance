import AbstractView from "./AbstractView.js";
export default class jouer extends AbstractView {
    constructor() {
        super();
        this.setTitle("Jouer");
    }
    async getHtml() {
        return `
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam91ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wdWJsaWMvc3RhdGljL2pzL3ZpZXdzL2pvdWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sWUFBWSxNQUFNLG1CQUFtQixDQUFDO0FBRTdDLE1BQU0sQ0FBQyxPQUFPLE9BQU8sS0FBTSxTQUFRLFlBQVk7SUFDOUM7UUFDQyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUdELEtBQUssQ0FBQyxPQUFPO1FBQ1osT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBNEdELENBQUM7SUFDUixDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gXCIuL0Fic3RyYWN0Vmlldy5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBqb3VlciBleHRlbmRzIEFic3RyYWN0VmlldyB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5zZXRUaXRsZShcIkpvdWVyXCIpO1xuXHR9XG5cblx0XG5cdGFzeW5jIGdldEh0bWwoKSB7XG5cdFx0cmV0dXJuIGBcblx0XHQ8c3R5bGU+XG5cdFx0LmNvbnRhaW5lciB7XG5cdFx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0XHR0b3A6IDAlO1xuXHRcdFx0bGVmdDogMDtcblx0XHRcdHdpZHRoOiAzNSU7XG5cdFx0XHRoZWlnaHQ6IDYwdmg7XG5cdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0XHRcdGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuXHRcdFx0cGFkZGluZy1sZWZ0OiAxNSU7XG5cdFx0XHR6LWluZGV4OiAxO1xuXHRcdFx0cG9pbnRlci1ldmVudHM6IGF1dG87XG5cdFx0fVxuXHRcblx0XHRoMSB7XG5cdFx0XHQvLyBtYXJnaW4tbGVmdDogMzAlO1xuXHRcdFx0bWFyZ2luLXRvcDogMTAlO1xuXHRcdFx0anVzdGlmeS1jb250ZW50OiBsZWZ0O1xuXHRcdFx0Y29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMSk7XG5cdFx0XHRmb250LXNpemU6IDIuNXZ3O1xuXHRcdFx0bWFyZ2luLWJvdHRvbTogMWVtO1xuXHRcdFx0dHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgMCUpO1xuXHRcdH1cblx0XG5cdFx0LmJ1dHRvbi1jb250YWluZXIge1xuXHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2Vlbjtcblx0XHRcdGdhcDogMjAlO1xuXHRcdFx0d2lkdGg6IDYwJTtcblx0XHR9XG5cdFxuXHRcdC5qb3VlciwgLnNldHRpbmdzIHtcblx0XHRcdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0XHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0XHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRcdFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdFx0XHR3aWR0aDogMTAwJTtcblx0XHR9XG5cdFxuXHRcdC8qIEltYWdlIHNvdXMgbGUgYm91dG9uICovXG5cdFx0Ly8gLmpvdWVyIC5idG4tYmcsIC5zZXR0aW5ncyAuYnRuLWJnIHtcblx0XHQvLyBcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcblx0XHQvLyBcdHRvcDogMDtcblx0XHQvLyBcdGxlZnQ6IDA7XG5cdFx0Ly8gXHR3aWR0aDogMTUwJTtcblx0XHQvLyBcdGhlaWdodDogMTUwJTtcblx0XHQvLyBcdGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG5cdFx0Ly8gXHRiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xuXHRcdC8vIFx0YmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xuXHRcdC8vIFx0ei1pbmRleDogLTE7IC8qIERlcnJpw6hyZSBsZSBib3V0b24gKi9cblx0XHQvLyB9XG5cdFxuXHRcdC8vIC5qb3VlciAuYnRuLWJnIHtcblx0XHQvLyBcdGJhY2tncm91bmQtaW1hZ2U6IHVybCgnL2ltYWdlL2JvdXR0b24uc3ZnJyk7XG5cdFx0Ly8gfVxuXHRcblx0XHQvLyAuc2V0dGluZ3MgLmJ0bi1iZyB7XG5cdFx0Ly8gXHRiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJy9pbWFnZS9ib3V0dG9uMi5zdmcnKTtcblx0XHQvLyB9XG5cdFxuXHRcdC8qIEJvdXRvbiBwcmluY2lwYWwgKi9cblx0XHQuYnRuIHtcblx0XHRcdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0XHRcdG1hcmdpbi10b3A6IDUwJTtcblx0XHRcdHotaW5kZXg6IDE7XG5cdFx0XHRmb250LXNpemU6IDF2dztcblx0XHRcdGNvbG9yOiBncmF5OyAvKiBDb3VsZXVyIHBhciBkw6lmYXV0IDogZ3JpcyAqL1xuXHRcdFx0Ym9yZGVyOiBub25lO1xuXHRcdFx0Y3Vyc29yOiBwb2ludGVyO1xuXHRcdFx0YmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG5cdFx0XHR0cmFuc2l0aW9uOiBjb2xvciAwLjNzIGVhc2U7IC8qIFRyYW5zaXRpb24gZG91Y2UgcG91ciBsZSBjaGFuZ2VtZW50IGRlIGNvdWxldXIgKi9cblx0XHR9XG5cdFx0XG5cdFx0LmJ0bjpob3ZlciB7XG5cdFx0XHRjb2xvcjogd2hpdGU7IC8qIERldmllbnQgYmxhbmMgYXUgc3Vydm9sICovXG5cdFx0fVxuXHRcblx0XHQvKiBJbWFnZSBhdS1kZXNzdXMgZHUgYm91dG9uICovXG5cdFx0LmpvdWVyIC5idG4tdG9wLCAuc2V0dGluZ3MgLmJ0bi10b3Age1xuXHRcdFx0cG9zaXRpb246IGFic29sdXRlO1xuXHRcdFx0dG9wOiA1MCU7XG5cdFx0XHRsZWZ0OiA1MCU7XG5cdFx0XHR0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAwJSk7XG5cdFx0XHR3aWR0aDogMTAwJTsgLyogVGFpbGxlIGRlIGwnaW1hZ2UgKi9cblx0XHRcdGhlaWdodDogYXV0bztcblx0XHRcdHotaW5kZXg6IDI7XG5cdFx0XHRwb2ludGVyLWV2ZW50czogbm9uZTtcblx0XHR9XG5cdDwvc3R5bGU+XG5cdFxuXHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0PGgxPlRyYW5zY2VuZGVuY2U8L2gxPlxuXHRcdDxkaXYgY2xhc3M9XCJidXR0b24tY29udGFpbmVyXCI+XG5cdFx0XHQ8IS0tIEJvdXRvbiBKb3VlciAtLT5cblx0XHRcdDxkaXYgY2xhc3M9XCJqb3VlclwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYnRuLWJnXCI+PC9kaXY+IDwhLS0gSW1hZ2UgYXJyacOocmUtcGxhbiAtLT5cblx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImJ0blwiIGRhdGEtbGluaz1cIi9nYW1lXCI+Sm91ZXI8L2J1dHRvbj5cblx0XHRcdFx0PGltZyBjbGFzcz1cImJ0bi10b3BcIiBzcmM9XCIvaW1hZ2UvYm91dHRvbi5zdmdcIiBhbHQ9XCJJY8O0bmUgSm91ZXJcIj4gPCEtLSBJbWFnZSBhdS1kZXNzdXMgLS0+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDwhLS0gQm91dG9uIFBhcmFtw6h0cmVzIC0tPlxuXHRcdFx0PGRpdiBjbGFzcz1cInNldHRpbmdzXCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJidG4tYmdcIj48L2Rpdj4gPCEtLSBJbWFnZSBhcnJpw6hyZS1wbGFuIC0tPlxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwiYnRuXCIgZGF0YS1saW5rPlBhcmFtw6h0cmVzPC9idXR0b24+XG5cdFx0XHRcdDxpbWcgY2xhc3M9XCJidG4tdG9wXCIgc3JjPVwiL2ltYWdlL2JvdXR0b24uc3ZnXCIgYWx0PVwiSWPDtG5lIFBhcmFtw6h0cmVzXCI+IDwhLS0gSW1hZ2UgYXUtZGVzc3VzIC0tPlxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+XG5cdDwvZGl2PmA7XG5cdH1cbn1cblxuIl19