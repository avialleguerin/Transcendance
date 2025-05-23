import { updateScore } from "./score.js";
import { init_Teammate_player_1 } from "./solo/1v1_player/init_powerUP_teammate.js";
import { init_Teammate_player_2 } from "./solo/1v1_player/init_powerUP_teammate.js";

const FIELD_LEFT = -40;
const FIELD_RIGHT = 25;
const FIELD_TOP = -14;
const FIELD_BOTTOM = -130;
const BALL_RADIUS = 1;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 1.5;
const PADDLE_DEPTH = 1.5;

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
		}, null, function (message) {
			reject(`Erreur lors du chargement du modèle: ${message}`);
		});
	});
}

function resetBall(ball) { 
	ball.position = new BABYLON.Vector3(-7, 300.8, -72.5);
	ballSpeed = 1;
	ballDirection = getRandomDirection();
}

let ballSpeed = 1;

function getRandomDirection()
{
	let x = Math.random() * 2 - 1;
	let z = Math.random() * 2 - 1;
	
	const length = Math.sqrt(x * x + z * z);
	x /= length;
	z /= length;

	if (Math.abs(x) < 0.5) x = x > 0 ? 0.5 : -0.5;
	if (Math.abs(z) < 0.5) z = z > 0 ? 0.5 : -0.5;
	return { x, z };
}

let ballDirection = getRandomDirection();



export function MoveBall(player_1, player_2, ball, player_1_bonus, player_2_bonus) {

	if (!ball)
	{
		return;
	}

	if (!player_1 || !player_2) {
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
		ballDirection.x *= -1;
		const relativeImpact = (ball.position.z - player_1.position.z) / (PADDLE_HEIGHT / 2);
		ballDirection.z = relativeImpact * 0.8;
		ballDirection.x = (ballDirection.x > 0) ? 0.7 : -0.7;
		const length = Math.sqrt(ballDirection.x * ballDirection.x + ballDirection.z * ballDirection.z);
		ballDirection.x /= length;
		ballDirection.z /= length;
		ballSpeed += 0.05;
		ball.position.x += ballDirection.x * 0.2;
	}

	if (ball.position.x + BALL_RADIUS >= player_2.position.x - PADDLE_WIDTH / 2 &&
		ball.position.x - BALL_RADIUS <= player_2.position.x + PADDLE_WIDTH / 2 &&
		ball.position.z + BALL_RADIUS >= player_2.position.z - PADDLE_HEIGHT / 2 &&
		ball.position.z - BALL_RADIUS <= player_2.position.z + PADDLE_HEIGHT / 2) {
		ballDirection.x *= -1;
		const relativeImpact = (ball.position.z - player_2.position.z) / (PADDLE_HEIGHT / 2);
		ballDirection.z = relativeImpact * 8.8;
		ballDirection.x = (ballDirection.x > 0) ? 0.7 : -0.7;
		const length = Math.sqrt(ballDirection.x * ballDirection.x + ballDirection.z * ballDirection.z);
		ballDirection.x /= length;
		ballDirection.z /= length;
		ballSpeed += 0.05;
		ball.position.x += ballDirection.x * 0.2;
	}

	if (player_1_bonus)
	{
		if (ball.position.x + BALL_RADIUS >= player_1_bonus.position.x - PADDLE_WIDTH / 2 &&
				ball.position.x - BALL_RADIUS <= player_1_bonus.position.x + PADDLE_WIDTH / 2 &&
				ball.position.z + BALL_RADIUS >= player_1_bonus.position.z - PADDLE_HEIGHT / 2 &&
				ball.position.z - BALL_RADIUS <= player_1_bonus.position.z + PADDLE_HEIGHT / 2)
		{
			ballDirection.x *= -1;
			const relativeImpact = (ball.position.z - player_1_bonus.position.z) / (PADDLE_HEIGHT / 2);
			ballDirection.z = relativeImpact * 8.8;
			ballDirection.x = (ballDirection.x > 0) ? 0.7 : -0.7;
			const length = Math.sqrt(ballDirection.x * ballDirection.x + ballDirection.z * ballDirection.z);
			ballDirection.x /= length;
			ballDirection.z /= length;
			ballSpeed += 0.05;
			ball.position.x += ballDirection.x * 0.2;
		}
	}

	if (player_2_bonus)
	{
		if (ball.position.x + BALL_RADIUS >= player_2_bonus.position.x - PADDLE_WIDTH / 2 &&
			ball.position.x - BALL_RADIUS <= player_2_bonus.position.x + PADDLE_WIDTH / 2 &&
			ball.position.z + BALL_RADIUS >= player_2_bonus.position.z - PADDLE_HEIGHT / 2 &&
			ball.position.z - BALL_RADIUS <= player_2_bonus.position.z + PADDLE_HEIGHT / 2) {
			ballDirection.x *= -1;
			const relativeImpact = (ball.position.z - player_2_bonus.position.z) / (PADDLE_HEIGHT / 2);
			ballDirection.z = relativeImpact * 8.8;
			ballDirection.x = (ballDirection.x > 0) ? 0.7 : -0.7;
			const length = Math.sqrt(ballDirection.x * ballDirection.x + ballDirection.z * ballDirection.z);
			ballDirection.x /= length;
			ballDirection.z /= length;
			ballSpeed += 0.05;
			ball.position.x += ballDirection.x * 0.2;
		}
	}
}


export function MoveBall2v2(player_1, player_2, player_3, player_4, ball)
{
	if (!ball)
		return;

	if (!player_1 || !player_2 || !player_3 || !player_4)
		return;

	const BALL_RADIUS = 1.5;
	const PADDLE_WIDTH = 10;
	const PADDLE_HEIGHT = 1.5;
	const PADDLE_DEPTH = 1.5;

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

	checkPaddleCollision_2v2(player_1.leftPaddle, ball, BALL_RADIUS, PADDLE_WIDTH);
	checkPaddleCollision_2v2(player_1.rightPaddle, ball, BALL_RADIUS, PADDLE_WIDTH);
	
	checkPaddleCollision_2v2(player_2.leftPaddle, ball, BALL_RADIUS, PADDLE_WIDTH);
	checkPaddleCollision_2v2(player_2.rightPaddle, ball, BALL_RADIUS, PADDLE_WIDTH);
	
	checkPaddleCollision_2v2(player_3.leftPaddle, ball, BALL_RADIUS, PADDLE_WIDTH);
	checkPaddleCollision_2v2(player_3.rightPaddle, ball, BALL_RADIUS, PADDLE_WIDTH);
	
	checkPaddleCollision_2v2(player_4.leftPaddle, ball, BALL_RADIUS, PADDLE_WIDTH);
	checkPaddleCollision_2v2(player_4.rightPaddle, ball, BALL_RADIUS, PADDLE_WIDTH);
}

function checkPaddleCollision_2v2(paddle, ball, BALL_RADIUS, PADDLE_WIDTH)
{
	if (!paddle)
		return;

	const paddleWorldPosition = paddle.getAbsolutePosition();

	if (ball.position.x + BALL_RADIUS >= paddleWorldPosition.position.x - PADDLE_WIDTH / 2 &&
		ball.position.x - BALL_RADIUS <= paddleWorldPosition.position.x + PADDLE_WIDTH / 2 &&
		ball.position.z + BALL_RADIUS >= paddleWorldPosition.position.z - PADDLE_HEIGHT / 2 &&
		ball.position.z - BALL_RADIUS <= paddleWorldPosition.position.z + PADDLE_HEIGHT / 2) {
		ballDirection.x *= -1;
		const relativeImpact = (ball.position.z - paddleWorldPosition.position.z) / (PADDLE_HEIGHT / 2);
		ballDirection.z = relativeImpact * 8.8;
		ballDirection.x = (ballDirection.x > 0) ? 0.7 : -0.7;
		const length = Math.sqrt(ballDirection.x * ballDirection.x + ballDirection.z * ballDirection.z);
		ballDirection.x /= length;
		ballDirection.z /= length;
		ballSpeed += 0.05;
		ball.position.x += ballDirection.x * 0.2;
	}
}

export function destroy_ball(ball)
{
	if (!ball)
		return;
	if (ball)
		ball.setEnabled(false);
	ball = null;
}

export function init_ball(ball)
{
	if (ball)
		ball.setEnabled(true);
}