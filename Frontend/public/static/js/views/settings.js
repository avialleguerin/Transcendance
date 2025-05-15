import AbstractView from "./AbstractView.js";
export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Settings");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFlBQVksTUFBTSxtQkFBbUIsQ0FBQztBQUU3QyxNQUFNLENBQUMsT0FBTyxNQUFPLFNBQVEsWUFBWTtJQUN4QztRQUNDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBR0QsS0FBSyxDQUFDLE9BQU87UUFDWixPQUFPLFFBQVEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4RGQsQ0FBQztJQUNILENBQUM7Q0FDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdFZpZXcgZnJvbSBcIi4vQWJzdHJhY3RWaWV3LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnNldFRpdGxlKFwiU2V0dGluZ3NcIik7XG5cdH1cblxuXHRcblx0YXN5bmMgZ2V0SHRtbCgpIHtcblx0XHRyZXR1cm4gLypodG1sKi9gXG5cdFx0XHQ8c3R5bGU+XG5cdFx0XHQuY29udGFpbmVyIHtcblx0XHRcdFx0cG9zaXRpb246IGFic29sdXRlO1xuXHRcdFx0XHR0b3A6IDAlO1xuXHRcdFx0XHRsZWZ0OiAwO1xuXHRcdFx0XHR3aWR0aDogMzUlO1xuXHRcdFx0XHRoZWlnaHQ6IDYwdmg7XG5cdFx0XHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0XHRcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cdFx0XHRcdGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuXHRcdFx0XHRwYWRkaW5nLWxlZnQ6IDE1JTtcblx0XHRcdFx0ei1pbmRleDogMTtcblx0XHRcdFx0cG9pbnRlci1ldmVudHM6IGF1dG87XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGgxIHtcblx0XHRcdFx0bWFyZ2luLWxlZnQ6IDMwJTtcblx0XHRcdFx0bWFyZ2luLXRvcDogMTAlO1xuXHRcdFx0XHRjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAxKTtcblx0XHRcdFx0Zm9udC1zaXplOiA1ZW07XG5cdFx0XHRcdG1hcmdpbi1ib3R0b206IDFlbTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0LmJ1dHRvbi1jb250YWluZXIge1xuXHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0XHQvLyB3aWR0aDogJTtcblx0XHRcdFx0anVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuXHRcdFx0XHRwYWRpbmctcmlnaHQ6IDEwJTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0LmJ0biB7XG5cdFx0XHRcdHdpZHRoOiAxMDAlO1xuXHRcdFx0XHRwYWRkaW5nOiAwLjc1cmVtO1xuXHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XG5cdFx0XHRcdGNvbG9yOiB3aGl0ZTtcblx0XHRcdFx0Ym9yZGVyOiBub25lO1xuXHRcdFx0XHRib3JkZXItcmFkaXVzOiA0cHg7XG5cdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdFx0Zm9udC1zaXplOiAyLjVlbTtcblx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRcdFx0XHR0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgZWFzZTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0LmJ0bjpob3ZlciB7XG5cdFx0XHRcdGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKTtcblx0XHRcdH1cblxuXHRcdFx0PC9zdHlsZT5cblxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdFx0PGgxPm1lbnU8L2gxPlxuXHRcdFx0PGRpdiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImpvdWVyXCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImJ0blwiIGRhdGEtbGluaz1cIi9nYW1lXCI+Sm91ZXI8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJzZXR0aW5nc1wiPlxuXHRcdFx0XHRcdC8vIDxidXR0b24gY2xhc3M9XCJidG5cIiBjbGFzcz1cIm5hdi0tbGlua1wiIGRhdGEtbGluaz5QYXJhbcOodHJlczwvYnV0dG9uPlxuXHRcdFx0XHRcdDxidXR0b24gaHJlZj1cIi9zZXR0aW5nc1wiIGNsYXNzPVwibmF2LS1saW5rXCIgZGF0YS1saW5rPlBhcmFtw6h0cmVzPC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+XG5cdFx0YDtcblx0fVxufVxuXG4iXX0=