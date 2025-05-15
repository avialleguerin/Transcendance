import AbstractView from "./AbstractView.js";
// import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
// import Game_menu from "./Game_menu.js";
export default class Home extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
        const accessToken = sessionStorage.getItem("accessToken");
        if (accessToken) {
            history.pushState({}, '', '/Game_menu');
            import('./Game_menu.js').then(module => {
                const GameMenu = module.default;
                const gameMenuInstance = new GameMenu();
                gameMenuInstance.getHtml().then(html => {
                    document.getElementById('app').innerHTML = html;
                    if (gameMenuInstance.game_menu) {
                        gameMenuInstance.game_menu();
                    }
                });
            });
            // handleViewTransitions("vue1", "vue2");
        }
    }
    async getHtml() {
        return /*html*/ `
    	<link rel="stylesheet" href="./static/js/css/home.css">
			<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
			<div class="container">
				<div class="title">
					<h1> TRANSCENDENCE </h1>
				</div>
				<div class="login-form" id="loginform_id">
					<h1>LOGIN</h1>
					<div class="form-group">
						<form id="loginForm" onsubmit="login(event)">
						<div class="input-container">
							<label for="email">Email :</label>
								<input type="email" id="login-email" name="email" placeholder="Your email" required>
						</div>

						<div class="input-container">
							<label for="password">Password :</label>
							<input type="password" id="login-password" name="password" placeholder="Your password" required>
						</div>
						<button type="submit" class="connexion">Login</button>
						</form>
						<button class="creer-compte" id="create-Account">Create an account</button>
						<p id="login-resultMessage" style="color:white"></p>
					</div>
				</div>
				<div class="register-form" id="create_account_id">
					<h1>SIGN IN</h1>
					<div class="form-group">
						<form id="addForm" onsubmit="register(event)">
						<div class="input-container">
							<label for="username">Username :</label>
							<input type="text" id="add-username" name="username" placeholder="Your username" required>
						</div>

						<div class="input-container">
							<label for="email">Email :</label>
							<input type="email" id="add-email" name="email" placeholder="Your email" required>
						</div>

						<div class="input-container">
							<label for="password">Password :</label>
							<input type="password" id="add-password" name="password" placeholder="Your password" required>
						</div>

						<div class="input-container">
							<label for="confirm-password">Confirm password :</label>
							<input type="password" id="add-confirm-password" name="password" placeholder="Confirm your password" required>
						</div>
						<button type="submit" class="connexion">Sign In</button>
					</form>
						<button class="connexion" id="alreadyHaveAccountButton_id">Already have an account ?</button>
						<p id="add-resultMessage" style="color:white"></p>
					</div>
				</div>
			</div>
    `;
    }
    createAccount() {
        console.log("createAccount");
        const loginForm = document.getElementById("loginform_id");
        const createAccountForm = document.getElementById("create_account_id");
        const createAccountButton = document.getElementById("create-Account");
        const alreadyHaveAccountButton = document.getElementById("alreadyHaveAccountButton_id");
        createAccountButton.addEventListener("click", () => {
            console.log("createAccountForm");
            loginForm.classList.add("active");
            createAccountForm.classList.add("active");
            document.getElementById("login-email").value = "";
            document.getElementById("login-password").value = "";
            document.getElementById("login-resultMessage").textContent = "";
        });
        alreadyHaveAccountButton.addEventListener("click", () => {
            console.log("loginForm");
            createAccountForm.classList.remove("active");
            loginForm.classList.remove("active");
            document.getElementById("add-username").value = "";
            document.getElementById("add-email").value = "";
            document.getElementById("add-password").value = "";
            document.getElementById("add-confirm-password").value = "";
            document.getElementById("add-resultMessage").textContent = "";
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG9tZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkhvbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxZQUFZLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsdUZBQXVGO0FBQ3ZGLDBDQUEwQztBQUUxQyxNQUFNLENBQUMsT0FBTyxPQUFPLElBQUssU0FBUSxZQUFZO0lBQzdDO1FBQ0MsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDMUQsSUFBSSxXQUFXLEVBQUUsQ0FBQztZQUNqQixPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDeEMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN0QyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO2dCQUNoQyxNQUFNLGdCQUFnQixHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQ3hDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDdEMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUNoRCxJQUFJLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNoQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDOUIsQ0FBQztnQkFDRixDQUFDLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1lBQ0gseUNBQXlDO1FBQzFDLENBQUM7SUFDRixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU87UUFDVixPQUFPLFFBQVEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0F3RGQsQ0FBQztJQUNKLENBQUM7SUFFRixhQUFhO1FBRVosT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUU3QixNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzFELE1BQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sbUJBQW1CLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sd0JBQXdCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBRXhGLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ2pDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQXNCLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUN2RSxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFzQixDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDM0UsUUFBUSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUE7UUFDaEUsQ0FBQyxDQUFDLENBQUM7UUFFSCx3QkFBd0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ3ZELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDekIsaUJBQWlCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3QyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwQyxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBc0IsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ3hFLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFzQixDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDckUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQXNCLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUN4RSxRQUFRLENBQUMsY0FBYyxDQUFDLHNCQUFzQixDQUFzQixDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDakYsUUFBUSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDL0QsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gXCIuL0Fic3RyYWN0Vmlldy5qc1wiO1xuLy8gaW1wb3J0IHsgaGFuZGxlVmlld1RyYW5zaXRpb25zIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS92aWV3cy9jYW1lcmEuanNcIjtcbi8vIGltcG9ydCBHYW1lX21lbnUgZnJvbSBcIi4vR2FtZV9tZW51LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhvbWUgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuc2V0VGl0bGUoXCJIb21lXCIpO1xuXHRcdGNvbnN0IGFjY2Vzc1Rva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcImFjY2Vzc1Rva2VuXCIpO1xuXHRcdGlmIChhY2Nlc3NUb2tlbikge1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoe30sICcnLCAnL0dhbWVfbWVudScpO1xuXHRcdFx0aW1wb3J0KCcuL0dhbWVfbWVudS5qcycpLnRoZW4obW9kdWxlID0+IHtcblx0XHRcdFx0Y29uc3QgR2FtZU1lbnUgPSBtb2R1bGUuZGVmYXVsdDtcblx0XHRcdFx0Y29uc3QgZ2FtZU1lbnVJbnN0YW5jZSA9IG5ldyBHYW1lTWVudSgpO1xuXHRcdFx0XHRnYW1lTWVudUluc3RhbmNlLmdldEh0bWwoKS50aGVuKGh0bWwgPT4ge1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKS5pbm5lckhUTUwgPSBodG1sO1xuXHRcdFx0XHRcdGlmIChnYW1lTWVudUluc3RhbmNlLmdhbWVfbWVudSkge1xuXHRcdFx0XHRcdFx0Z2FtZU1lbnVJbnN0YW5jZS5nYW1lX21lbnUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHQvLyBoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUxXCIsIFwidnVlMlwiKTtcblx0XHR9XG5cdH1cblxuXHRhc3luYyBnZXRIdG1sKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIC8qaHRtbCovYFxuICAgIFx0PGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIuL3N0YXRpYy9qcy9jc3MvaG9tZS5jc3NcIj5cblx0XHRcdDxsaW5rIGhyZWY9XCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUJsYWNrK09wcytPbmUmZGlzcGxheT1zd2FwXCIgcmVsPVwic3R5bGVzaGVldFwiPlxuXHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidGl0bGVcIj5cblx0XHRcdFx0XHQ8aDE+IFRSQU5TQ0VOREVOQ0UgPC9oMT5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJsb2dpbi1mb3JtXCIgaWQ9XCJsb2dpbmZvcm1faWRcIj5cblx0XHRcdFx0XHQ8aDE+TE9HSU48L2gxPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHRcdFx0XHQ8Zm9ybSBpZD1cImxvZ2luRm9ybVwiIG9uc3VibWl0PVwibG9naW4oZXZlbnQpXCI+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJlbWFpbFwiPkVtYWlsIDo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwiZW1haWxcIiBpZD1cImxvZ2luLWVtYWlsXCIgbmFtZT1cImVtYWlsXCIgcGxhY2Vob2xkZXI9XCJZb3VyIGVtYWlsXCIgcmVxdWlyZWQ+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwicGFzc3dvcmRcIj5QYXNzd29yZCA6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIGlkPVwibG9naW4tcGFzc3dvcmRcIiBuYW1lPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIllvdXIgcGFzc3dvcmRcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJjb25uZXhpb25cIj5Mb2dpbjwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImNyZWVyLWNvbXB0ZVwiIGlkPVwiY3JlYXRlLUFjY291bnRcIj5DcmVhdGUgYW4gYWNjb3VudDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJsb2dpbi1yZXN1bHRNZXNzYWdlXCIgc3R5bGU9XCJjb2xvcjp3aGl0ZVwiPjwvcD5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJyZWdpc3Rlci1mb3JtXCIgaWQ9XCJjcmVhdGVfYWNjb3VudF9pZFwiPlxuXHRcdFx0XHRcdDxoMT5TSUdOIElOPC9oMT5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHRcdFx0PGZvcm0gaWQ9XCJhZGRGb3JtXCIgb25zdWJtaXQ9XCJyZWdpc3RlcihldmVudClcIj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dC1jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cInVzZXJuYW1lXCI+VXNlcm5hbWUgOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiYWRkLXVzZXJuYW1lXCIgbmFtZT1cInVzZXJuYW1lXCIgcGxhY2Vob2xkZXI9XCJZb3VyIHVzZXJuYW1lXCIgcmVxdWlyZWQ+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwiZW1haWxcIj5FbWFpbCA6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJlbWFpbFwiIGlkPVwiYWRkLWVtYWlsXCIgbmFtZT1cImVtYWlsXCIgcGxhY2Vob2xkZXI9XCJZb3VyIGVtYWlsXCIgcmVxdWlyZWQ+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwicGFzc3dvcmRcIj5QYXNzd29yZCA6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIGlkPVwiYWRkLXBhc3N3b3JkXCIgbmFtZT1cInBhc3N3b3JkXCIgcGxhY2Vob2xkZXI9XCJZb3VyIHBhc3N3b3JkXCIgcmVxdWlyZWQ+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwiY29uZmlybS1wYXNzd29yZFwiPkNvbmZpcm0gcGFzc3dvcmQgOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBpZD1cImFkZC1jb25maXJtLXBhc3N3b3JkXCIgbmFtZT1cInBhc3N3b3JkXCIgcGxhY2Vob2xkZXI9XCJDb25maXJtIHlvdXIgcGFzc3dvcmRcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJjb25uZXhpb25cIj5TaWduIEluPC9idXR0b24+XG5cdFx0XHRcdFx0PC9mb3JtPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImNvbm5leGlvblwiIGlkPVwiYWxyZWFkeUhhdmVBY2NvdW50QnV0dG9uX2lkXCI+QWxyZWFkeSBoYXZlIGFuIGFjY291bnQgPzwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJhZGQtcmVzdWx0TWVzc2FnZVwiIHN0eWxlPVwiY29sb3I6d2hpdGVcIj48L3A+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG4gICAgYDtcbiAgfVxuXG5cdGNyZWF0ZUFjY291bnQoKSB7XG5cblx0XHRjb25zb2xlLmxvZyhcImNyZWF0ZUFjY291bnRcIik7XG5cblx0XHRjb25zdCBsb2dpbkZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luZm9ybV9pZFwiKTtcblx0XHRjb25zdCBjcmVhdGVBY2NvdW50Rm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlX2FjY291bnRfaWRcIik7XG5cdFx0Y29uc3QgY3JlYXRlQWNjb3VudEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlLUFjY291bnRcIik7XG5cdFx0Y29uc3QgYWxyZWFkeUhhdmVBY2NvdW50QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbHJlYWR5SGF2ZUFjY291bnRCdXR0b25faWRcIik7XG5cblx0XHRjcmVhdGVBY2NvdW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcImNyZWF0ZUFjY291bnRGb3JtXCIpO1xuXHRcdFx0bG9naW5Gb3JtLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHRjcmVhdGVBY2NvdW50Rm9ybS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHRcdFx0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW4tZW1haWxcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSBcIlwiO1xuXHRcdFx0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW4tcGFzc3dvcmRcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSBcIlwiO1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbi1yZXN1bHRNZXNzYWdlXCIpLnRleHRDb250ZW50ID0gXCJcIlxuXHRcdH0pO1xuXG5cdFx0YWxyZWFkeUhhdmVBY2NvdW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcImxvZ2luRm9ybVwiKTtcblx0XHRcdGNyZWF0ZUFjY291bnRGb3JtLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG5cdFx0XHRsb2dpbkZvcm0uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHRcdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZC11c2VybmFtZVwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IFwiXCI7XG5cdFx0XHQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGQtZW1haWxcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSBcIlwiO1xuXHRcdFx0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkLXBhc3N3b3JkXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gXCJcIjtcblx0XHRcdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZC1jb25maXJtLXBhc3N3b3JkXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gXCJcIjtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkLXJlc3VsdE1lc3NhZ2VcIikudGV4dENvbnRlbnQgPSBcIlwiO1xuXHRcdH0pO1xuXHR9XG59XG4iXX0=