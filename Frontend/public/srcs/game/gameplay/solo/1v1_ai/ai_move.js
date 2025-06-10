// const FIELD_LEFT = -40;
// const FIELD_RIGHT = 25;
// const FIELD_TOP = -14;
// const FIELD_BOTTOM = -130;
const BALL_RADIUS = 1;
// const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 1.5;
// const PADDLE_DEPTH = 1.5;
// const PADDLE_SPEED = 1.1;

const SIMPLE_AI_SPEED = 1.1;

export function simple_ai_move(ai_player, ball, minX, maxX) {
	if (ball.position.x + BALL_RADIUS > ai_player.position.x + PADDLE_HEIGHT / 2 && ai_player.position.x < maxX) {
		ai_player.position.x += SIMPLE_AI_SPEED;
	}
	if (ball.position.x - BALL_RADIUS < ai_player.position.x - PADDLE_HEIGHT / 2 && ai_player.position.x > minX) {
		ai_player.position.x -= SIMPLE_AI_SPEED;
	}
}