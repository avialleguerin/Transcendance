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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG9tZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9zdGF0aWMvanMvdmlld3MvSG9tZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFlBQVksTUFBTSxtQkFBbUIsQ0FBQztBQUM3Qyx1RkFBdUY7QUFDdkYsMENBQTBDO0FBRTFDLE1BQU0sQ0FBQyxPQUFPLE9BQU8sSUFBSyxTQUFRLFlBQVk7SUFDN0M7UUFDQyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEIsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMxRCxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ2pCLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3RDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7Z0JBQ2hDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztnQkFDeEMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUN0QyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ2hELElBQUksZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2hDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUM5QixDQUFDO2dCQUNGLENBQUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7WUFDSCx5Q0FBeUM7UUFDMUMsQ0FBQztJQUNGLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTztRQUNWLE9BQU8sUUFBUSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQXdEZCxDQUFDO0lBQ0osQ0FBQztJQUVGLGFBQWE7UUFFWixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRTdCLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDMUQsTUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDdkUsTUFBTSxtQkFBbUIsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDdEUsTUFBTSx3QkFBd0IsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFFeEYsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDakMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN6QyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBc0IsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ3ZFLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQXNCLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUMzRSxRQUFRLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQTtRQUNoRSxDQUFDLENBQUMsQ0FBQztRQUVILHdCQUF3QixDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN6QixpQkFBaUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdDLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BDLFFBQVEsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFzQixDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDeEUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQXNCLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNyRSxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBc0IsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ3hFLFFBQVEsQ0FBQyxjQUFjLENBQUMsc0JBQXNCLENBQXNCLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNqRixRQUFRLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdFZpZXcgZnJvbSBcIi4vQWJzdHJhY3RWaWV3LmpzXCI7XG4vLyBpbXBvcnQgeyBoYW5kbGVWaWV3VHJhbnNpdGlvbnMgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3ZpZXdzL2NhbWVyYS5qc1wiO1xuLy8gaW1wb3J0IEdhbWVfbWVudSBmcm9tIFwiLi9HYW1lX21lbnUuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSG9tZSBleHRlbmRzIEFic3RyYWN0VmlldyB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5zZXRUaXRsZShcIkhvbWVcIik7XG5cdFx0Y29uc3QgYWNjZXNzVG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwiYWNjZXNzVG9rZW5cIik7XG5cdFx0aWYgKGFjY2Vzc1Rva2VuKSB7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgJycsICcvR2FtZV9tZW51Jyk7XG5cdFx0XHRpbXBvcnQoJy4vR2FtZV9tZW51LmpzJykudGhlbihtb2R1bGUgPT4ge1xuXHRcdFx0XHRjb25zdCBHYW1lTWVudSA9IG1vZHVsZS5kZWZhdWx0O1xuXHRcdFx0XHRjb25zdCBnYW1lTWVudUluc3RhbmNlID0gbmV3IEdhbWVNZW51KCk7XG5cdFx0XHRcdGdhbWVNZW51SW5zdGFuY2UuZ2V0SHRtbCgpLnRoZW4oaHRtbCA9PiB7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpLmlubmVySFRNTCA9IGh0bWw7XG5cdFx0XHRcdFx0aWYgKGdhbWVNZW51SW5zdGFuY2UuZ2FtZV9tZW51KSB7XG5cdFx0XHRcdFx0XHRnYW1lTWVudUluc3RhbmNlLmdhbWVfbWVudSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdC8vIGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInZ1ZTFcIiwgXCJ2dWUyXCIpO1xuXHRcdH1cblx0fVxuXG5cdGFzeW5jIGdldEh0bWwoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gLypodG1sKi9gXG4gICAgICA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIi4vc3RhdGljL2pzL2Nzcy9ob21lLmNzc1wiPlxuXHRcdFx0PGxpbmsgaHJlZj1cImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9QmxhY2srT3BzK09uZSZkaXNwbGF5PXN3YXBcIiByZWw9XCJzdHlsZXNoZWV0XCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ0aXRsZVwiPlxuXHRcdFx0XHRcdDxoMT4gVFJBTlNDRU5ERU5DRSA8L2gxPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImxvZ2luLWZvcm1cIiBpZD1cImxvZ2luZm9ybV9pZFwiPlxuXHRcdFx0XHRcdDxoMT5MT0dJTjwvaDE+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0XHRcdDxmb3JtIGlkPVwibG9naW5Gb3JtXCIgb25zdWJtaXQ9XCJsb2dpbihldmVudClcIj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJpbnB1dC1jb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0PGxhYmVsIGZvcj1cImVtYWlsXCI+RW1haWwgOjwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJlbWFpbFwiIGlkPVwibG9naW4tZW1haWxcIiBuYW1lPVwiZW1haWxcIiBwbGFjZWhvbGRlcj1cIllvdXIgZW1haWxcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJwYXNzd29yZFwiPlBhc3N3b3JkIDo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgaWQ9XCJsb2dpbi1wYXNzd29yZFwiIG5hbWU9XCJwYXNzd29yZFwiIHBsYWNlaG9sZGVyPVwiWW91ciBwYXNzd29yZFwiIHJlcXVpcmVkPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImNvbm5leGlvblwiPkxvZ2luPC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwiY3JlZXItY29tcHRlXCIgaWQ9XCJjcmVhdGUtQWNjb3VudFwiPkNyZWF0ZSBhbiBhY2NvdW50PC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cImxvZ2luLXJlc3VsdE1lc3NhZ2VcIiBzdHlsZT1cImNvbG9yOndoaXRlXCI+PC9wPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInJlZ2lzdGVyLWZvcm1cIiBpZD1cImNyZWF0ZV9hY2NvdW50X2lkXCI+XG5cdFx0XHRcdFx0PGgxPlNJR04gSU48L2gxPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHRcdFx0XHQ8Zm9ybSBpZD1cImFkZEZvcm1cIiBvbnN1Ym1pdD1cInJlZ2lzdGVyKGV2ZW50KVwiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwidXNlcm5hbWVcIj5Vc2VybmFtZSA6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJhZGQtdXNlcm5hbWVcIiBuYW1lPVwidXNlcm5hbWVcIiBwbGFjZWhvbGRlcj1cIllvdXIgdXNlcm5hbWVcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJlbWFpbFwiPkVtYWlsIDo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cImVtYWlsXCIgaWQ9XCJhZGQtZW1haWxcIiBuYW1lPVwiZW1haWxcIiBwbGFjZWhvbGRlcj1cIllvdXIgZW1haWxcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJwYXNzd29yZFwiPlBhc3N3b3JkIDo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgaWQ9XCJhZGQtcGFzc3dvcmRcIiBuYW1lPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIllvdXIgcGFzc3dvcmRcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJjb25maXJtLXBhc3N3b3JkXCI+Q29uZmlybSBwYXNzd29yZCA6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIGlkPVwiYWRkLWNvbmZpcm0tcGFzc3dvcmRcIiBuYW1lPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIkNvbmZpcm0geW91ciBwYXNzd29yZFwiIHJlcXVpcmVkPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImNvbm5leGlvblwiPlNpZ24gSW48L2J1dHRvbj5cblx0XHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwiY29ubmV4aW9uXCIgaWQ9XCJhbHJlYWR5SGF2ZUFjY291bnRCdXR0b25faWRcIj5BbHJlYWR5IGhhdmUgYW4gYWNjb3VudCA/PC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8cCBpZD1cImFkZC1yZXN1bHRNZXNzYWdlXCIgc3R5bGU9XCJjb2xvcjp3aGl0ZVwiPjwvcD5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cbiAgICBgO1xuICB9XG5cblx0Y3JlYXRlQWNjb3VudCgpIHtcblxuXHRcdGNvbnNvbGUubG9nKFwiY3JlYXRlQWNjb3VudFwiKTtcblxuXHRcdGNvbnN0IGxvZ2luRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW5mb3JtX2lkXCIpO1xuXHRcdGNvbnN0IGNyZWF0ZUFjY291bnRGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGVfYWNjb3VudF9pZFwiKTtcblx0XHRjb25zdCBjcmVhdGVBY2NvdW50QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGUtQWNjb3VudFwiKTtcblx0XHRjb25zdCBhbHJlYWR5SGF2ZUFjY291bnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFscmVhZHlIYXZlQWNjb3VudEJ1dHRvbl9pZFwiKTtcblxuXHRcdGNyZWF0ZUFjY291bnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiY3JlYXRlQWNjb3VudEZvcm1cIik7XG5cdFx0XHRsb2dpbkZvcm0uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblx0XHRcdGNyZWF0ZUFjY291bnRGb3JtLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG5cdFx0XHQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbi1lbWFpbFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IFwiXCI7XG5cdFx0XHQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbi1wYXNzd29yZFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IFwiXCI7XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luLXJlc3VsdE1lc3NhZ2VcIikudGV4dENvbnRlbnQgPSBcIlwiXG5cdFx0fSk7XG5cblx0XHRhbHJlYWR5SGF2ZUFjY291bnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwibG9naW5Gb3JtXCIpO1xuXHRcdFx0Y3JlYXRlQWNjb3VudEZvcm0uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHRcdGxvZ2luRm9ybS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdFx0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkLXVzZXJuYW1lXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gXCJcIjtcblx0XHRcdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZC1lbWFpbFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IFwiXCI7XG5cdFx0XHQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGQtcGFzc3dvcmRcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSBcIlwiO1xuXHRcdFx0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkLWNvbmZpcm0tcGFzc3dvcmRcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSBcIlwiO1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGQtcmVzdWx0TWVzc2FnZVwiKS50ZXh0Q29udGVudCA9IFwiXCI7XG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==