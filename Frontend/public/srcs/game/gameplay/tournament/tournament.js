import { create_environment_view3, create_game , destroy_environement_view3, destroy_game} from "../init_game.js";
import { loadScoreModel, destroy_score } from "../score.js";
import { createBall, destroy_ball } from "../ball.js";
import { init_players_tournament } from "./init_player_tournament.js";

let ball = null;
let player_1_tournament, player_2_tournament;

export async function init_game_tournament(scene)
{
    create_environment_view3(scene);
    create_game(scene);
    
    ({ player_1_tournament, player_2_tournament } = init_players_tournament(scene));

    if (!player_1_tournament || !player_2_tournament) {
        console.error("Erreur lors de l'initialisation des joueurs");
        return null;
    }

    ball = await createBall(scene).catch(error => {
        console.error(error);
        return null;
    });

    if (!ball) {
        console.error("Erreur lors de la création de la balle");
        return null;
    }
    if (ball) {
        console.log("Balle chargée avec position :", ball.position);
    }

    loadScoreModel(0, "left", true);
    loadScoreModel(0, "right", false);
    
    return { player_1_tournament, player_2_tournament, ball };
}

export async function destroy_game_solo_tournament(scene)
{
    console.log("Destruction de l'environnement et des objets du jeu");
    destroy_all_by_metadata(scene, "isPlayerRepere");
    destroy_all_by_metadata(scene, "isPlayer_paddle");
    destroy_all_by_metadata(scene, "isPlayer");
    destroy_ball(ball);
    destroy_score();
    destroy_game(scene);
    destroy_environement_view3(scene);
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