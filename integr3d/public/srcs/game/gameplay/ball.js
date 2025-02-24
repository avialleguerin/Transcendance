import { updateScore } from "./score.js";

const FIELD_LEFT = -40;
const FIELD_RIGHT = 25;
const FIELD_TOP = -14;
const FIELD_BOTTOM = -130;
const BALL_RADIUS = 1;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 1.5;

export function createBall(scene) {
	if (!scene) {
		console.error('Scene is not defined');
		return;
	}

	return new Promise((resolve, reject) => {
		BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/3d_object/", "soccer_ball__football (3).glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
			console.log("Modèle chargé avec succès !");

			let rootMesh = null;
			newMeshes.forEach(mesh => {
				if (!mesh.parent) {
					rootMesh = mesh;
				}
			});

			if (rootMesh) {
				let ball = rootMesh;
				ball.position = new BABYLON.Vector3(-7, 300.8, -72.5);
				ball.scaling = new BABYLON.Vector3(10, 10, 10);
				
				let ballCollisionBox = BABYLON.MeshBuilder.CreateBox("ballCollisionBox", {
					width: BALL_RADIUS * 2,
					height: BALL_RADIUS * 2,
					depth: BALL_RADIUS * 2
				}, scene);
				ballCollisionBox.isPickable = false;
				ballCollisionBox.visibility = 0;
				ballCollisionBox.parent = ball;

				resolve(ball);
			} else {
				reject("Impossible de trouver le root mesh de la balle.");
			}
		}, null, function (scene, message) {
			reject(`Erreur lors du chargement du modèle: ${message}`);
		});
	});
}

function resetBall(ball) { 
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


export function MoveBall(player_1, player_2, ball) {

	if (!ball)
	{
		console.error('Ball is not created yet');
		return;
	}

	if (!player_1 || !player_2) {
		console.error('Players are not created yet');
		return;
	}

	console.log("Ball moving");
	console.log(ball.position);
	if (ball)
	{
		console.log("Ball existe");
	}
	const BALL_RADIUS = 1.5;

	ball.position.x += ballDirection.x * ballSpeed;
	ball.position.z += ballDirection.z * ballSpeed;

	ball.rotate(BABYLON.Axis.X, 0.1 * ballSpeed);
	ball.rotate(BABYLON.Axis.Z, 0.1 * ballDirection.x * ballSpeed);

	if (ball.position.z <= FIELD_BOTTOM + BALL_RADIUS) {
		ball.position.z = FIELD_BOTTOM + BALL_RADIUS;
		resetBall(ball);
		updateScore('right');
	}

	if (ball.position.z >= FIELD_TOP - BALL_RADIUS) {
		ball.position.z = FIELD_TOP - BALL_RADIUS;
		resetBall(ball);
		updateScore('left');
	}

	if (ball.position.x <= FIELD_LEFT + BALL_RADIUS) {
		ball.position.x = FIELD_LEFT + BALL_RADIUS;
		ballDirection.x *= -1;
	}

	if (ball.position.x >= FIELD_RIGHT - BALL_RADIUS) {
		ball.position.x = FIELD_RIGHT - BALL_RADIUS;
		ballDirection.x *= -1;
	}

	if (ball.position.x + BALL_RADIUS >= player_1.position.x - PADDLE_WIDTH / 2 &&
		ball.position.x - BALL_RADIUS <= player_1.position.x + PADDLE_WIDTH / 2 &&
		ball.position.z + BALL_RADIUS >= player_1.position.z - PADDLE_HEIGHT / 2 &&
		ball.position.z - BALL_RADIUS <= player_1.position.z + PADDLE_HEIGHT / 2) {
		const relativeImpact = (ball.position.z - player_1.position.z) / (PADDLE_HEIGHT / 2);
		ballDirection.z = relativeImpact * 1;
		ballSpeed += 0.05;
	}

	if (ball.position.x + BALL_RADIUS >= player_2.position.x - PADDLE_WIDTH / 2 &&
		ball.position.x - BALL_RADIUS <= player_2.position.x + PADDLE_WIDTH / 2 &&
		ball.position.z + BALL_RADIUS >= player_2.position.z - PADDLE_HEIGHT / 2 &&
		ball.position.z - BALL_RADIUS <= player_2.position.z + PADDLE_HEIGHT / 2) {
		const relativeImpact = (ball.position.z - player_2.position.z) / (PADDLE_HEIGHT / 2);
		ballDirection.z = relativeImpact * 1;
		ballSpeed += 0.05;
	}
}

export function MoveBall2v2(player_1, player_2, player_3, player_4, ball) {
	
	if (!ball)
	{
		console.error('Ball is not created yet');
		return;
	}

	if (!player_1 || !player_2 || !player_3 || !player_4) {
		console.error('Players are not created yet');
		return;
	}

	const BALL_RADIUS = 1.5;

	ball.position.x += ballDirection.x * ballSpeed;
	ball.position.z += ballDirection.z * ballSpeed;

	ball.rotate(BABYLON.Axis.X, 0.1 * ballSpeed);
	ball.rotate(BABYLON.Axis.Z, 0.1 * ballDirection.x * ballSpeed);

	if (ball.position.z <= FIELD_BOTTOM + BALL_RADIUS) {
		ball.position.z = FIELD_BOTTOM + BALL_RADIUS;
		resetBall(ball);
		updateScore('right');
	}

	if (ball.position.z >= FIELD_TOP - BALL_RADIUS) {
		ball.position.z = FIELD_TOP - BALL_RADIUS;
		resetBall(ball);
		updateScore('left');
	}

	if (ball.position.x <= FIELD_LEFT + BALL_RADIUS) {
		ball.position.x = FIELD_LEFT + BALL_RADIUS;
		ballDirection.x *= -1;
	}

	if (ball.position.x >= FIELD_RIGHT - BALL_RADIUS) {
		ball.position.x = FIELD_RIGHT - BALL_RADIUS;
		ballDirection.x *= -1;
	}

	if (ball.position.x + BALL_RADIUS >= player_1.position.x - PADDLE_WIDTH / 2 &&
		ball.position.x - BALL_RADIUS <= player_1.position.x + PADDLE_WIDTH / 2 &&
		ball.position.z + BALL_RADIUS >= player_1.position.z - PADDLE_HEIGHT / 2 &&
		ball.position.z - BALL_RADIUS <= player_1.position.z + PADDLE_HEIGHT / 2) {
		const relativeImpact = (ball.position.z - player_1.position.z) / (PADDLE_HEIGHT / 2);
		ballDirection.z = relativeImpact * 1;
		ballSpeed += 0.05;
	}

	if (ball.position.x + BALL_RADIUS >= player_2.position.x - PADDLE_WIDTH / 2 &&
		ball.position.x - BALL_RADIUS <= player_2.position.x + PADDLE_WIDTH / 2 &&
		ball.position.z + BALL_RADIUS >= player_2.position.z - PADDLE_HEIGHT / 2 &&
		ball.position.z - BALL_RADIUS <= player_2.position.z + PADDLE_HEIGHT / 2) {
		const relativeImpact = (ball.position.z - player_2.position.z) / (PADDLE_HEIGHT / 2);
		ballDirection.z = relativeImpact * 1;
		ballSpeed += 0.05;
	}

	if (ball.position.x + BALL_RADIUS >= player_3.position.x - PADDLE_WIDTH / 2 &&
		ball.position.x - BALL_RADIUS <= player_3.position.x + PADDLE_WIDTH / 2 &&
		ball.position.z + BALL_RADIUS >= player_3.position.z - PADDLE_HEIGHT / 2 &&
		ball.position.z - BALL_RADIUS <= player_3.position.z + PADDLE_HEIGHT / 2) {
		const relativeImpact = (ball.position.z - player_3.position.z) / (PADDLE_HEIGHT / 2);
		ballDirection.z = relativeImpact * 1;
		ballSpeed += 0.05;
	}

	if (ball.position.x + BALL_RADIUS >= player_4.position.x - PADDLE_WIDTH / 2 &&
		ball.position.x - BALL_RADIUS <= player_4.position.x + PADDLE_WIDTH / 2 &&
		ball.position.z + BALL_RADIUS >= player_4.position.z - PADDLE_HEIGHT / 2 &&
		ball.position.z - BALL_RADIUS <= player_4.position.z + PADDLE_HEIGHT / 2) {
		const relativeImpact = (ball.position.z - player_4.position.z) / (PADDLE_HEIGHT / 2);
		ballDirection.z = relativeImpact * 1;
		ballSpeed += 0.05;
	}
}