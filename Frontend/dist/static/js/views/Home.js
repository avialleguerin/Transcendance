import AbstractView from "./AbstractView.js";
export default class Home extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
    }
    async getHtml() {
        return `
      <link rel="stylesheet" href="./static/js/css/home.css">
			<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
			<div class="container">
				<div class="title">
					<h1> TRANSCENDENCE </h1>
				</div>
				<div class="login-form" id="loginform_id">
					<h1>LOGIN</h1>
					<form class="form-group" id="loginForm" onsubmit="login(event)">
						<div class="input-container">
							<label for="email">Email :</label>
							<input type="email" id="login-email" name="email" placeholder="email" required>
						</div>

						<div class="input-container">
							<label for="password">Password :</label>
							<input type="password" id="login-password" name="password" placeholder="Your password" required>
						</div>
						<button type="submit" class="connexion">Login</button>
						<button class="creer-compte" id="create-Account">Create an account</button>
						<p id="login-resultMessage"></p>
					</form>
				</div>
				<div class="register-form" id="create_account_id">
					<h1>SIGN IN</h1>
					<form class="form-group" id="addForm" onsubmit="register(event)">
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
						<button class="connexion" id="alreadyHaveAccountButton_id">Already have an account?</button>
						<p id="add-resultMessage"></p>
					</form>
				</div>
			</div>
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG9tZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9zdGF0aWMvanMvdmlld3MvSG9tZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFlBQVksTUFBTSxtQkFBbUIsQ0FBQztBQUU3QyxNQUFNLENBQUMsT0FBTyxPQUFPLElBQUssU0FBUSxZQUFZO0lBQzVDO1FBQ0UsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTztRQUNYLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FvRE4sQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdFZpZXcgZnJvbSBcIi4vQWJzdHJhY3RWaWV3LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhvbWUgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc2V0VGl0bGUoXCJIb21lXCIpO1xuICB9XG5cbiAgYXN5bmMgZ2V0SHRtbCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBgXG4gICAgICA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIi4vc3RhdGljL2pzL2Nzcy9ob21lLmNzc1wiPlxuXHRcdFx0PGxpbmsgaHJlZj1cImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9QmxhY2srT3BzK09uZSZkaXNwbGF5PXN3YXBcIiByZWw9XCJzdHlsZXNoZWV0XCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ0aXRsZVwiPlxuXHRcdFx0XHRcdDxoMT4gVFJBTlNDRU5ERU5DRSA8L2gxPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImxvZ2luLWZvcm1cIiBpZD1cImxvZ2luZm9ybV9pZFwiPlxuXHRcdFx0XHRcdDxoMT5MT0dJTjwvaDE+XG5cdFx0XHRcdFx0PGZvcm0gY2xhc3M9XCJmb3JtLWdyb3VwXCIgaWQ9XCJsb2dpbkZvcm1cIiBvbnN1Ym1pdD1cImxvZ2luKGV2ZW50KVwiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwiZW1haWxcIj5FbWFpbCA6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJlbWFpbFwiIGlkPVwibG9naW4tZW1haWxcIiBuYW1lPVwiZW1haWxcIiBwbGFjZWhvbGRlcj1cImVtYWlsXCIgcmVxdWlyZWQ+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwicGFzc3dvcmRcIj5QYXNzd29yZCA6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIGlkPVwibG9naW4tcGFzc3dvcmRcIiBuYW1lPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIllvdXIgcGFzc3dvcmRcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJjb25uZXhpb25cIj5Mb2dpbjwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImNyZWVyLWNvbXB0ZVwiIGlkPVwiY3JlYXRlLUFjY291bnRcIj5DcmVhdGUgYW4gYWNjb3VudDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJsb2dpbi1yZXN1bHRNZXNzYWdlXCI+PC9wPlxuXHRcdFx0XHRcdDwvZm9ybT5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJyZWdpc3Rlci1mb3JtXCIgaWQ9XCJjcmVhdGVfYWNjb3VudF9pZFwiPlxuXHRcdFx0XHRcdDxoMT5TSUdOIElOPC9oMT5cblx0XHRcdFx0XHQ8Zm9ybSBjbGFzcz1cImZvcm0tZ3JvdXBcIiBpZD1cImFkZEZvcm1cIiBvbnN1Ym1pdD1cInJlZ2lzdGVyKGV2ZW50KVwiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImlucHV0LWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwidXNlcm5hbWVcIj5Vc2VybmFtZSA6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJhZGQtdXNlcm5hbWVcIiBuYW1lPVwidXNlcm5hbWVcIiBwbGFjZWhvbGRlcj1cIllvdXIgdXNlcm5hbWVcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJlbWFpbFwiPkVtYWlsIDo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cImVtYWlsXCIgaWQ9XCJhZGQtZW1haWxcIiBuYW1lPVwiZW1haWxcIiBwbGFjZWhvbGRlcj1cIllvdXIgZW1haWxcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJwYXNzd29yZFwiPlBhc3N3b3JkIDo8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgaWQ9XCJhZGQtcGFzc3dvcmRcIiBuYW1lPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIllvdXIgcGFzc3dvcmRcIiByZXF1aXJlZD5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5wdXQtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBmb3I9XCJjb25maXJtLXBhc3N3b3JkXCI+Q29uZmlybSBwYXNzd29yZCA6PC9sYWJlbD5cblx0XHRcdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIGlkPVwiYWRkLWNvbmZpcm0tcGFzc3dvcmRcIiBuYW1lPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIkNvbmZpcm0geW91ciBwYXNzd29yZFwiIHJlcXVpcmVkPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImNvbm5leGlvblwiPlNpZ24gSW48L2J1dHRvbj5cblx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJjb25uZXhpb25cIiBpZD1cImFscmVhZHlIYXZlQWNjb3VudEJ1dHRvbl9pZFwiPkFscmVhZHkgaGF2ZSBhbiBhY2NvdW50PzwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PHAgaWQ9XCJhZGQtcmVzdWx0TWVzc2FnZVwiPjwvcD5cblx0XHRcdFx0XHQ8L2Zvcm0+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG4gICAgYDtcbiAgfVxufSJdfQ==