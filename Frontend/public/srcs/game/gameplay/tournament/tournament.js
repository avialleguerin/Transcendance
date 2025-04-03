import { create_environment_view3, create_game , destroy_environement_view3, destroy_game} from "../init_game.js";
import { init_players } from "../player.js";
import { loadScoreModel, destroy_score } from "../score.js";
import { createBall, destroy_ball } from "../ball.js";

let ball = null;
let player_1, player_2;

let nb_vie_player1 = 2;
let nb_vie_player2 = 2;
let nb_vie_player3 = 2;
let nb_vie_player4 = 2;

let is_FirstMatch_finish = false;
let is_SecondMatch_finish = false;
let is_ThirdMatch_finish = false;
let is_FourthMatch_finish = false;
let is_FifthMatch_finish = false;
let is_SixthMatch_finish = false;
let is_SeventhMatch_finish = false;
let is_EighthMatch_finish = false;


export async function init_game_tournament(scene)
{
    create_environment_view3(scene);
    create_game(scene);
    
    ({ player_1, player_2 } = init_players(scene));

    ball = await createBall(scene).catch(error => {
        console.error(error);
        return null;
    });

    if (ball) {
        console.log("Balle chargée avec position :", ball.position);
    }

    loadScoreModel(0, "left", true);
    loadScoreModel(0, "right", false);
    
    return { player_1, player_2, ball };
}

export async function destroy_game_solo(scene)
{
    destroy_all_by_metadata(scene, "isPlayerRepere");
    destroy_all_by_metadata(scene, "isPlayer_paddle");
    destroy_all_by_metadata(scene, "isPlayer");
    destroy_environement_view3(scene);
    destroy_game(scene);
    destroy_ball(ball);
    destroy_score();
}

function destroy_all_by_metadata(scene, metadataKey) {
	scene.meshes
		.filter(mesh => mesh.metadata && mesh.metadata[metadataKey])
		.forEach(mesh => mesh.dispose());
}

export function start_tournament_game()
{
	console.log('Start tournament game');
}