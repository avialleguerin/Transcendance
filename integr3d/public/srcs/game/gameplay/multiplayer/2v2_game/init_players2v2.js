let minX_player_1;
let maxX_player_1;

let minX_player_2;
let maxX_player_2;

let minX_player_3;
let maxX_player_3;

let minX_player_4;
let maxX_player_4;

function init_border()
{
	const borderTop = new BABYLON.MeshBuilder.CreateBox("border", {
		width: 115,
		height: 3,
		depth: 1
	}, scene);
	borderTop.position = new BABYLON.Vector3(25, 300, -72);
	borderTop.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
	borderTop.visibility = 0;
	
	const borderBottom = new BABYLON.MeshBuilder.CreateBox("border", {
		width: 115,
		height: 3,
		depth: 1
	}, scene);
	borderBottom.position = new BABYLON.Vector3(-40, 300, -72);
	borderBottom.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
	borderBottom.visibility = 0;

	minX_player_1 = borderBottom.position.x + (borderBottom.scaling.x / 2) + 24;
	maxX_player_1 = borderTop.position.x - (borderTop.scaling.x / 2) - 13;

	minX_player_2 = borderBottom.position.x + (borderBottom.scaling.x / 2) + 36;
	maxX_player_2 = borderTop.position.x - (borderTop.scaling.x / 2) + 0;

	minX_player_3 = borderBottom.position.x + (borderBottom.scaling.x / 2) + 36;
	maxX_player_3 = borderTop.position.x - (borderTop.scaling.x / 2) + 0;

	minX_player_4 = borderBottom.position.x + (borderBottom.scaling.x / 2) + 24;
	maxX_player_4 = borderTop.position.x - (borderTop.scaling.x / 2) - 13;
}

export function init_2v2_Players()
{
	init_border();
	const parent_player_1 = new BABYLON.TransformNode("parent", scene);

	const paddle_left_player_1 = new BABYLON.MeshBuilder.CreateBox("paddle_left", {
		width: 10,
		height: 1.5,
		depth: 1.5
	}, scene);

	paddle_left_player_1.position = new BABYLON.Vector3(-18, 301, -120);
	paddle_left_player_1.checkPaddleCollision = true;
	// paddle_left.visibility = 0;

	const paddle_right_player_1 = new BABYLON.MeshBuilder.CreateBox("paddle_right", {
		width: 10,
		height: 1.5,
		depth: 1.5
	}, scene);

	paddle_right_player_1.position = new BABYLON.Vector3(7, 301, -120);
	paddle_right_player_1.checkPaddleCollision = true;
	// paddle_right.visibility = 0;

	paddle_left_player_1.setParent(parent_player_1);
	paddle_right_player_1.setParent(parent_player_1);


	const parent_player_2 = new BABYLON.TransformNode("parent", scene);

	const paddle_left_player_2 = new BABYLON.MeshBuilder.CreateBox("paddle_left", {
		width: 10,
		height: 1.5,
		depth: 1.5
	}, scene);

	paddle_left_player_2.position = new BABYLON.Vector3(-30, 301, -108);
	paddle_left_player_2.checkPaddleCollision = true;
	// paddle_left.visibility = 0;

	const paddle_right_player_2 = new BABYLON.MeshBuilder.CreateBox("paddle_right", {
		width: 10,
		height: 1.5,
		depth: 1.5
	}, scene);

	paddle_right_player_2.position = new BABYLON.Vector3(-5, 301, -108);
	paddle_right_player_2.checkPaddleCollision = true;

	paddle_left_player_2.setParent(parent_player_2);
	paddle_right_player_2.setParent(parent_player_2);

	const parent_player_3 = new BABYLON.TransformNode("parent", scene);

	const paddle_left_player_3 = new BABYLON.MeshBuilder.CreateBox("paddle_left", {
		width: 10,
		height: 1.5,
		depth: 1.5
	}, scene);

	paddle_left_player_3.position = new BABYLON.Vector3(-30, 301, -36);
	paddle_left_player_3.checkPaddleCollision = true;

	const paddle_right_player_3 = new BABYLON.MeshBuilder.CreateBox("paddle_right", {
		width: 10,
		height: 1.5,
		depth: 1.5
	}, scene);

	paddle_right_player_3.position = new BABYLON.Vector3(-5, 301, -36);
	paddle_right_player_3.checkPaddleCollision = true;

	paddle_left_player_3.setParent(parent_player_3);
	paddle_right_player_3.setParent(parent_player_3);

	const parent_player_4 = new BABYLON.TransformNode("parent", scene);
	

	const paddle_left_player_4 = new BABYLON.MeshBuilder.CreateBox("paddle_left", {
		width: 10,
		height: 1.5,
		depth: 1.5
	}, scene);

	paddle_left_player_4.position = new BABYLON.Vector3(-18, 301, -24);
	paddle_left_player_4.checkPaddleCollision = true;

	const paddle_right_player_4 = new BABYLON.MeshBuilder.CreateBox("paddle_right", {
		width: 10,
		height: 1.5,
		depth: 1.5
	}, scene);

	paddle_right_player_4.position = new BABYLON.Vector3(7, 301, -24);
	paddle_right_player_4.checkPaddleCollision = true;

	paddle_left_player_4.setParent(parent_player_4);
	paddle_right_player_4.setParent(parent_player_4);


	return [parent_player_1, parent_player_2, parent_player_3, parent_player_4];
}

// export function init_2v2_Players() {
//     init_border();

//     // Player 1
//     const parent_player_1 = new BABYLON.TransformNode("parent", scene);
//     parent_player_1.position = new BABYLON.Vector3(-5.5, 301, -120);

//     const paddle_left_player_1 = new BABYLON.MeshBuilder.CreateBox("paddle_left", {
//         width: 10,
//         height: 1.5,
//         depth: 1.5
//     }, scene);
//     paddle_left_player_1.position = new BABYLON.Vector3(-12.5, 0, 0); // Position relative
//     paddle_left_player_1.checkPaddleCollision = true;

//     const paddle_right_player_1 = new BABYLON.MeshBuilder.CreateBox("paddle_right", {
//         width: 10,
//         height: 1.5,
//         depth: 1.5
//     }, scene);
//     paddle_right_player_1.position = new BABYLON.Vector3(12.5, 0, 0); // Position relative
//     paddle_right_player_1.checkPaddleCollision = true;

//     // Le parent se trouve à une position fixe, mais les paddles sont relatifs
//     paddle_left_player_1.setParent(parent_player_1);
//     paddle_right_player_1.setParent(parent_player_1);

//     // Player 2
//     const parent_player_2 = new BABYLON.TransformNode("parent", scene);
//     parent_player_2.position = new BABYLON.Vector3(-17.5, 301, -108);

//     const paddle_left_player_2 = new BABYLON.MeshBuilder.CreateBox("paddle_left", {
//         width: 10,
//         height: 1.5,
//         depth: 1.5
//     }, scene);
//     paddle_left_player_2.position = new BABYLON.Vector3(-12.5, 0, 0); // Position relative
//     paddle_left_player_2.checkPaddleCollision = true;

//     const paddle_right_player_2 = new BABYLON.MeshBuilder.CreateBox("paddle_right", {
//         width: 10,
//         height: 1.5,
//         depth: 1.5
//     }, scene);
//     paddle_right_player_2.position = new BABYLON.Vector3(12.5, 0, 0); // Position relative
//     paddle_right_player_2.checkPaddleCollision = true;

//     paddle_left_player_2.setParent(parent_player_2);
//     paddle_right_player_2.setParent(parent_player_2);

//     // Player 3
//     const parent_player_3 = new BABYLON.TransformNode("parent", scene);
//     parent_player_3.position = new BABYLON.Vector3(-17.5, 301, -36);

//     const paddle_left_player_3 = new BABYLON.MeshBuilder.CreateBox("paddle_left", {
//         width: 10,
//         height: 1.5,
//         depth: 1.5
//     }, scene);
//     paddle_left_player_3.position = new BABYLON.Vector3(-12.5, 0, 0); // Position relative
//     paddle_left_player_3.checkPaddleCollision = true;

//     const paddle_right_player_3 = new BABYLON.MeshBuilder.CreateBox("paddle_right", {
//         width: 10,
//         height: 1.5,
//         depth: 1.5
//     }, scene);
//     paddle_right_player_3.position = new BABYLON.Vector3(12.5, 0, 0); // Position relative
//     paddle_right_player_3.checkPaddleCollision = true;

//     paddle_left_player_3.setParent(parent_player_3);
//     paddle_right_player_3.setParent(parent_player_3);

//     // Player 4
//     const parent_player_4 = new BABYLON.TransformNode("parent", scene);
//     parent_player_4.position = new BABYLON.Vector3(-5.5, 301, -24);

//     const paddle_left_player_4 = new BABYLON.MeshBuilder.CreateBox("paddle_left", {
//         width: 10,
//         height: 1.5,
//         depth: 1.5
//     }, scene);
//     paddle_left_player_4.position = new BABYLON.Vector3(-12.5, 0, 0); // Position relative
//     paddle_left_player_4.checkPaddleCollision = true;

//     const paddle_right_player_4 = new BABYLON.MeshBuilder.CreateBox("paddle_right", {
//         width: 10,
//         height: 1.5,
//         depth: 1.5
//     }, scene);
//     paddle_right_player_4.position = new BABYLON.Vector3(12.5, 0, 0); // Position relative
//     paddle_right_player_4.checkPaddleCollision = true;

//     paddle_left_player_4.setParent(parent_player_4);
//     paddle_right_player_4.setParent(parent_player_4);

//     // Debugging: console log to check positions
//     console.log("Player 1 position:", parent_player_1.position);
//     console.log("Player 2 position:", parent_player_2.position);
//     console.log("Player 3 position:", parent_player_3.position);
//     console.log("Player 4 position:", parent_player_4.position);

//     return [parent_player_1, parent_player_2, parent_player_3, parent_player_4];
// }


const paddleSpeed = 1.1;
const keys = {};

addEventListener("keydown", (event) => keys[event.key] = true);
addEventListener("keyup", (event) => keys[event.key] = false);

export function UpdatePLayerPoseMulti(player_1, player_2, player_3, player_4)
{
	if (keys["w"] && player_1.position.x > minX_player_1) {
		player_1.position.x -= paddleSpeed;
	}
	if (keys["s"] && player_1.position.x < maxX_player_1) {
		player_1.position.x += paddleSpeed;
	}
	if (keys["e"] && player_2.position.x > minX_player_2) {
		player_2.position.x -= paddleSpeed;
	}
	if (keys["d"] && player_2.position.x < maxX_player_2) {
		player_2.position.x += paddleSpeed;
	}
	if (keys["i"] && player_3.position.x > minX_player_3) {
		player_3.position.x -= paddleSpeed;
	}
	if (keys["k"] && player_3.position.x < maxX_player_3) {
		player_3.position.x += paddleSpeed;
	}
	if (keys["o"] && player_4.position.x > minX_player_4) {
		player_4.position.x -= paddleSpeed;
	}
	if (keys["l"] && player_4.position.x < maxX_player_4) {
		player_4.position.x += paddleSpeed;
	}
}