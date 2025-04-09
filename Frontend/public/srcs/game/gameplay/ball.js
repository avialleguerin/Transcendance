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
		}, null, function (scene, message) {
			reject(`Erreur lors du chargement du modèle: ${message}`);
		});
	});
}

function resetBall(ball) { 
	ball.position = new BABYLON.Vector3(-7, 300.8, -72.5);
	ballSpeed = 0.7;
	ballDirection = getRandomDirection();
}

let ballSpeed = 0.7;

function getRandomDirection()
{
	let x = Math.random() * 2 - 1;
	let z = Math.random() * 2 - 1;
	
	const length = Math.sqrt(x * x + z * z);
	x /= length;
	z /= length;

	if (Math.abs(x) < 0.3) x = x > 0 ? 0.3 : -0.3;
	if (Math.abs(z) < 0.3) z = z > 0 ? 0.3 : -0.3;
	return { x, z };
}

let ballDirection = getRandomDirection();



export function MoveBall(player_1, player_2, ball, player_1_bonus, player_2_bonus) {

	if (!ball)
	{
		console.error('Ball is not created yeefwwwwwwwwwwwwwwwwwwwwwwwwwewwwwwwwwwwwwwwwwwwwwwwwwwt');
		return;
	}

	if (!player_1 || !player_2) {
		console.error('Players are not created yet');
		return;
	}

	const BALL_RADIUS = 1.5;

	ball.position.x += ballDirection.x * ballSpeed;
	console.log("ball direction", ballDirection.x * ballSpeed);
	ball.position.z += ballDirection.z * ballSpeed;
	console.log("ball direction", ballDirection.z * ballSpeed);

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
		
		// Inverser la direction x
		ballDirection.x *= -1; 
		
		// Calculer l'impact relatif (-1 à 1)
		const relativeImpact = (ball.position.z - player_1.position.z) / (PADDLE_HEIGHT / 2);
		
		// Appliquer un facteur d'angle MAX_ANGLE_FACTOR pour contrôler l'angle maximum
		const MAX_ANGLE_FACTOR = 0.8;
		ballDirection.z = relativeImpact * MAX_ANGLE_FACTOR;
		
		// Normaliser le vecteur pour maintenir une vitesse constante
		const length = Math.sqrt(ballDirection.x * ballDirection.x + ballDirection.z * ballDirection.z);
		ballDirection.x /= length;
		ballDirection.z /= length;
		
		// Augmenter légèrement la vitesse à chaque rebond
		ballSpeed += 0.05;
		
		// Éviter que la balle reste coincée
		ball.position.x += ballDirection.x * 0.1;
	}

	if (ball.position.x + BALL_RADIUS >= player_2.position.x - PADDLE_WIDTH / 2 &&
		ball.position.x - BALL_RADIUS <= player_2.position.x + PADDLE_WIDTH / 2 &&
		ball.position.z + BALL_RADIUS >= player_2.position.z - PADDLE_HEIGHT / 2 &&
		ball.position.z - BALL_RADIUS <= player_2.position.z + PADDLE_HEIGHT / 2) {
		ballDirection.x *= -1; // Inverser la direction x
		const relativeImpact = (ball.position.z - player_2.position.z) / (PADDLE_HEIGHT / 2);
		const MAX_ANGLE_FACTOR = 0.8;
		ballDirection.z = relativeImpact * MAX_ANGLE_FACTOR;
		
		// Normaliser le vecteur pour maintenir une vitesse constante
		const length = Math.sqrt(ballDirection.x * ballDirection.x + ballDirection.z * ballDirection.z);
		ballDirection.x /= length;
		ballDirection.z /= length;
		
		// Augmenter légèrement la vitesse à chaque rebond
		ballSpeed += 0.05;
		
		// Éviter que la balle reste coincée
		ball.position.x += ballDirection.x * 0.1;
	}

	if (player_1_bonus)
	{
		if (ball.position.x + BALL_RADIUS >= player_1_bonus.position.x - PADDLE_WIDTH / 2 &&
			ball.position.x - BALL_RADIUS <= player_1_bonus.position.x + PADDLE_WIDTH / 2 &&
			ball.position.z + BALL_RADIUS >= player_1_bonus.position.z - PADDLE_HEIGHT / 2 &&
			ball.position.z - BALL_RADIUS <= player_1_bonus.position.z + PADDLE_HEIGHT / 2) {
			const relativeImpact = (ball.position.z - player_1_bonus.position.z) / (PADDLE_HEIGHT / 2);
			ballDirection.z = relativeImpact * 1;
			ballSpeed += 0.01;
		}
	}

	if (player_2_bonus)
	{
		if (ball.position.x + BALL_RADIUS >= player_2_bonus.position.x - PADDLE_WIDTH / 2 &&
			ball.position.x - BALL_RADIUS <= player_2_bonus.position.x + PADDLE_WIDTH / 2 &&
			ball.position.z + BALL_RADIUS >= player_2_bonus.position.z - PADDLE_HEIGHT / 2 &&
			ball.position.z - BALL_RADIUS <= player_2_bonus.position.z + PADDLE_HEIGHT / 2) {
			const relativeImpact = (ball.position.z - player_2_bonus.position.z) / (PADDLE_HEIGHT / 2);
			ballDirection.z = relativeImpact * 1;
			ballSpeed += 0.01;
		}
	}
}

export function MoveBall2v2(player_1, player_2, player_3, player_4, ball) {
	if (!ball) {
		console.error('Ball is not created yet');
		return;
	}

	if (!player_1 || !player_2 || !player_3 || !player_4) {
		console.error('Players are not created yet');
		return;
	}

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

	checkPaddleCollision(player_1.leftPaddle, ball, BALL_RADIUS, PADDLE_WIDTH, PADDLE_HEIGHT);
	checkPaddleCollision(player_1.rightPaddle, ball, BALL_RADIUS, PADDLE_WIDTH, PADDLE_HEIGHT);
	
	checkPaddleCollision(player_2.leftPaddle, ball, BALL_RADIUS, PADDLE_WIDTH, PADDLE_HEIGHT);
	checkPaddleCollision(player_2.rightPaddle, ball, BALL_RADIUS, PADDLE_WIDTH, PADDLE_HEIGHT);
	
	checkPaddleCollision(player_3.leftPaddle, ball, BALL_RADIUS, PADDLE_WIDTH, PADDLE_HEIGHT);
	checkPaddleCollision(player_3.rightPaddle, ball, BALL_RADIUS, PADDLE_WIDTH, PADDLE_HEIGHT);
	
	checkPaddleCollision(player_4.leftPaddle, ball, BALL_RADIUS, PADDLE_WIDTH, PADDLE_HEIGHT);
	checkPaddleCollision(player_4.rightPaddle, ball, BALL_RADIUS, PADDLE_WIDTH, PADDLE_HEIGHT);
}

function checkPaddleCollision(paddle, ball, BALL_RADIUS, PADDLE_WIDTH, PADDLE_HEIGHT) {
	if (!paddle) return;

	const paddleWorldPosition = paddle.getAbsolutePosition();
	
	if (ball.position.x + BALL_RADIUS >= paddleWorldPosition.x - PADDLE_WIDTH / 2 &&
		ball.position.x - BALL_RADIUS <= paddleWorldPosition.x + PADDLE_WIDTH / 2 &&
		ball.position.z + BALL_RADIUS >= paddleWorldPosition.z - PADDLE_DEPTH / 2 &&
		ball.position.z - BALL_RADIUS <= paddleWorldPosition.z + PADDLE_DEPTH / 2) {

		const relativeImpact = (ball.position.z - paddleWorldPosition.z) / (PADDLE_DEPTH / 2);

		ballDirection.x *= -1;
		ballDirection.z = relativeImpact * 1;

		ballSpeed += 0.01;
	}
}

export function destroy_ball(ball) {

	if (!ball) {
		console.error('Ball is not created yet');
		return;
	}

	if (ball) {
		console.log("Destruction de la balle");
		ball.dispose();
	}

	ball = null;
}