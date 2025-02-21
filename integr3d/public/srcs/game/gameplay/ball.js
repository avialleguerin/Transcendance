import { updateScore } from "./score.js";
import { getPlayerRef } from "./player.js";

let ball = null;
let ballCollisionBox = null;
const FIELD_LEFT = -40;
const FIELD_RIGHT = 25;
const FIELD_TOP = -14;
const FIELD_BOTTOM = -130;
const BALL_RADIUS = 1;
const PADDLE_WIDTH = 10;    // Largeur du paddle
const PADDLE_HEIGHT = 1.5;  // Hauteur du paddle

export function createBall(scene) {
	if (!scene) {
		console.error('Scene is not defined');
		return;
	}

	BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/3d_object/", "soccer_ball__football (3).glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
		console.log("Modèle chargé avec succès !");

		if (ballCollisionBox) {
			ballCollisionBox.dispose();
		}

		let rootMesh = null;
		newMeshes.forEach(mesh =>
		{
			if (!mesh.parent)
			{
				rootMesh = mesh;
			}
		});

		if (rootMesh)
		{
			ball = rootMesh;
			ball.position = new BABYLON.Vector3(-7, 300.8, -72.5);
			ball.scaling = new BABYLON.Vector3(10, 10, 10);
			ballCollisionBox = BABYLON.MeshBuilder.CreateBox("ballCollisionBox", {
				width: BALL_RADIUS * 2,
				height: BALL_RADIUS * 2,
				depth: BALL_RADIUS * 2
			}, scene);
			ballCollisionBox.isPickable = false;
			ballCollisionBox.visibility = 0;
			ballCollisionBox.parent = ball;
		}
		console.log(ball);
	});
	return ball;
}


function resetBall() { 
	ball.position = new BABYLON.Vector3(-7, 300.8, -72.5);
	ballSpeed = 0.35;
	ballDirection = {
		x: 1,
		z: 1
	};
}

let ballSpeed = 0.35;

let ballDirection =
{
	x: 1,
	z: 1
};

let iscreateBall = false;

// let { player_1, player_2 } = getPlayerRef();


export function MoveBall(scene, player_1, player_2) {
	if (!iscreateBall) {
		createBall(scene);
		iscreateBall = true;
		console.log("Ball created");
		return;
	}

	if (!ball)
	{
		return;
	}

	if (!player_1 || !player_2) {
		// Players are not created yet, so we return early
		console.error('Players are not created yet');
		return;
	}

	const BALL_RADIUS = 1.5;

	// Déplacer la balle
	ball.position.x += ballDirection.x * ballSpeed;
	ball.position.z += ballDirection.z * ballSpeed;

	// Rotation de la balle
	ball.rotate(BABYLON.Axis.X, 0.1 * ballSpeed);
	ball.rotate(BABYLON.Axis.Z, 0.1 * ballDirection.x * ballSpeed);

	// Collision avec le bord inférieur
	if (ball.position.z <= FIELD_BOTTOM + BALL_RADIUS) {
		ball.position.z = FIELD_BOTTOM + BALL_RADIUS;
		resetBall();
		updateScore('right');
	}

	// Collision avec le bord supérieur
	if (ball.position.z >= FIELD_TOP - BALL_RADIUS) {
		ball.position.z = FIELD_TOP - BALL_RADIUS;
		resetBall();
		updateScore('left');
	}

	// Collision avec le bord gauche
	if (ball.position.x <= FIELD_LEFT + BALL_RADIUS) {
		ball.position.x = FIELD_LEFT + BALL_RADIUS;
		ballDirection.x *= -1;
	}

	// Collision avec le bord droit
	if (ball.position.x >= FIELD_RIGHT - BALL_RADIUS) {
		ball.position.x = FIELD_RIGHT - BALL_RADIUS;
		ballDirection.x *= -1;
	}

	// Collision avec le joueur 1
	if (ball.position.x + BALL_RADIUS >= player_1.position.x - PADDLE_WIDTH / 2 &&
		ball.position.x - BALL_RADIUS <= player_1.position.x + PADDLE_WIDTH / 2 &&
		ball.position.z + BALL_RADIUS >= player_1.position.z - PADDLE_HEIGHT / 2 &&
		ball.position.z - BALL_RADIUS <= player_1.position.z + PADDLE_HEIGHT / 2) {
		const relativeImpact = (ball.position.z - player_1.position.z) / (PADDLE_HEIGHT / 2);
		ballDirection.z = relativeImpact * 1;
		ballSpeed += 0.05;
	}

	// Collision avec le joueur 2
	if (ball.position.x + BALL_RADIUS >= player_2.position.x - PADDLE_WIDTH / 2 &&
		ball.position.x - BALL_RADIUS <= player_2.position.x + PADDLE_WIDTH / 2 &&
		ball.position.z + BALL_RADIUS >= player_2.position.z - PADDLE_HEIGHT / 2 &&
		ball.position.z - BALL_RADIUS <= player_2.position.z + PADDLE_HEIGHT / 2) {
		const relativeImpact = (ball.position.z - player_2.position.z) / (PADDLE_HEIGHT / 2);
		ballDirection.z = relativeImpact * 1;
		ballSpeed += 0.05;
	}
}

