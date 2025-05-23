import { handleViewTransitions } from "./srcs/game/gameplay/views/camera.js";

document.querySelectorAll("button[data-view]").forEach(button => {
	button.addEventListener("click", function () {
		const viewName = this.getAttribute("data-view");
		handleViewTransitions(viewName, window.currentView);
	});
});
