import AbstractView from "./AbstractView";
import { startGame, startAI_Game } from "./../../../srcs/game/gameplay/babylon.js";
import { startMultiGame } from "../../../srcs/game/gameplay/babylon.js";
import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
import { init_nb_powerUP_grenadeFlash, reset_powerUP_grenade } from "../../../srcs/game/gameplay/solo/1v1_player/init_powerUP_GrenadeFlash.js";
import { init_nb_powerUP_teammate, reset_powerUP_teammate } from "../../../srcs/game/gameplay/solo/1v1_player/init_powerUP_teammate.js";
import { init_powerUP_inverse_player, reset_powerUP_inverse_player } from "../../../srcs/game/gameplay/solo/1v1_player/init_powerUP_inverse.js";
import { init_nb_powerUP_grenadeFlash_team_player } from "../../../srcs/game/gameplay/multiplayer/2v2_game/init_powerUP_GernadeFlash_multi.js";
import { init_powerUP_freeze_Team_player } from "../../../srcs/game/gameplay/multiplayer/2v2_game/init_power_up_freeze.js";
import { getValue_leave_game, setLeaveGameVar } from "../index.js";
let powerUP_nb = 0;
let powerUP_nb_multi = 0;
export default class Game_menu extends AbstractView {
    constructor() {
        super();
        this.setTitle("Game_menu");
    }
    async getHtml() {
        return `
		<link rel="stylesheet" href="./static/js/css/game_menu.css">
		<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
		<div class="view1" id="view1">
			<div class="view1-content">
				<button id="view1_btn" class="btn">MODE DE JEUX</button>
				<button id="settings_btn" class="btn">PARAMETRES</button>
			</div>
		</div>
		<div class="back-home" id="back-home">
			<button id="btn_back_home" class="btn">ACCUEIL</button>
		</div>
		<div id="container" class="container_menu">
			<button id="btn_jouer">
				<h1>JOUER</h1>
			</button>
			<div class="view2" id="view2">
				<div class="view2-content">
					<h1>CHOISIS TON MODE DE JEUX</h1>
					<div id="game_mode_btn" class="game_mode_btn">
						<button id="solo" class="btn">SOLO</button>
						<button id="multiplayer" class="btn">MULTIPLAYER</button>
					</div>
				</div>
			</div>
			<div class="view3" id="view3">
				<div class="view3-content">
					<h1>MODE DE JEUX EN SOLO</h1>
					<div id="game_mode_btn" class="game_mode_btn">
						<button id="prepar_game_1v1" class="btn">1v1</button>
						<button id="prepar_gane_ai" class="btn">ai</button>
					</div>
					<button id="back_to_menu_view3" class="btn">BACK TO MENU</button>
				</div>
			</div>
			<div class="view4" id="view4">
				<div class="view4-content">
					<h1>MODE DE JEUX MULTIPLAYER</h1>
					<div id="game_mode_btn" class="game_mode_btn">
						<button id="prepar_game_multi" class="btn">2v2</button>
					</div>
					<button id="back_to_menu_view4" class="btn">BACK TO MENU</button>
				</div>
			</div>
			<div class="view5" id="view5">
				<div class="view5-content">
					<h1>PARAMETRES</h1>
				</div>
			</div>
			<div class="view6" id="view6">
				<div class="view6-content">
					<h1>CUSTOMISE TA GAME</h1>
					<div class="powerUP">
						<p>PowerUP :<span id="powerUP" class="active_powerUP"></span></p>
						<div id="power_selector" class="power_selector">
							<div class="powerUP_number">
								<p>1</p>
								<span id="number_powerUP_1" class="number_powerUP"></span>
							</div>
							<div class="powerUP_number">
								<p>3</p>
								<span id="number_powerUP_3" class="number_powerUP"></span>
							</div>
							<div class="powerUP_number">
								<p>5</p>
								<span id="number_powerUP_5" class="number_powerUP"></span>
							</div>
						</div>
					</div>
					<div class="skin">
						<p>Skin Personnalise :<span id="skin_perso" class="skin_perso"</span></p>
					</div>
					<button id="solo_1v1_btn" class="btn">
						<a href="/solo_game_1v1" class="nav-link" data-link>Lancer la partie</a>
					</button>
				</div>
			</div>
			<div class="view7" id="view7">
				<div class="view7-content">
					<h1>CUSTOMISE TA GAME CONTRE L'IA</h1>
					<div class="powerUP">
						<p>PowerUP :<span id="powerUP" class="active_powerUP"></span></p>
						<div id="power_selector" class="power_selector">
							<div class="powerUP_number">
								<p>1</p>
								<span id="number_powerUP_1" class="number_powerUP"></span>
							</div>
							<div class="powerUP_number">
								<p>3</p>
								<span id="number_powerUP_3" class="number_powerUP"></span>
							</div>
							<div class="powerUP_number">
								<p>5</p>
								<span id="number_powerUP_5" class="number_powerUP"></span>
							</div>
						</div>
					</div>
					<div class="skin">
						<p>Skin Personnalise :<span id="skin_perso" class="skin_perso"</span></p>
					</div>
					<button id="solo_ai_btn" class="btn">
						<a href="/solo_game_ai" class="nav-link" data-link>Lancer la partie</a>
					</button>
				</div>
			</div>
			<div class="view8" id="view8">
				<div class="view8-content">
					<h1>CUSTOMISE TA GAME EN MULTI</h1>
					<div class="powerUP">
						<p>PowerUP :<span id="powerUP_multi" class="active_powerUP"></span></p>
						<div id="power_selector_game_multi" class="power_selector">
							<div class="powerUP_number">
								<p>1</p>
								<span id="number_powerUP_1_game_multi" class="number_powerUP"></span>
							</div>
							<div class="powerUP_number">
								<p>3</p>
								<span id="number_powerUP_3_game_multi" class="number_powerUP"></span>
							</div>
							<div class="powerUP_number">
								<p>5</p>
								<span id="number_powerUP_5_game_multi" class="number_powerUP"></span>
							</div>
						</div>
					</div>
					<div class="skin">
						<p>Skin Personnalise :<span id="skin_perso_game_multi" class="skin_perso"</span></p>
					</div>
					<button id="multiplayer_btn" class="btn">
						<a href="/multi_player_game" class="nav-link" data-link>Lancer la partie</a>
					</button>
				</div>
			</div>
		</div>
		<div class="back" id="back_to_select_mode_view6">
			<button id="back_to_menu_view6" class="btn_back">BACK</button>
		</div>
		<div class="back" id="back_to_select_mode_view7">
			<button id="back_to_menu_view7" class="btn_back">BACK</button>
		</div>
		<div class="back" id="back_to_select_mode_view8">
			<button id="back_to_menu_view8" class="btn_back">BACK</button>
		</div>
		</div>


		`;
    }
    init_solo_game() {
        document.getElementById("solo_1v1_btn").addEventListener("click", () => {
            console.log("Solo 1v1 game started");
            handleViewTransitions("vue3", "vue2");
            startGame();
        });
    }
    initEvents() {
        document.getElementById("multiplayer_btn").addEventListener("click", () => {
            console.log("Multiplayer 2v2 game started");
            handleViewTransitions("vue3", "vue2");
            startMultiGame();
        });
    }
    init_solo_game_ai() {
        document.getElementById("solo_ai_btn").addEventListener("click", () => {
            console.log("Solo AI game started");
            handleViewTransitions("vue3", "vue2");
            startAI_Game();
        });
    }
    game_menu() {
        const btn_jouer = document.getElementById('btn_jouer');
        const view1 = document.getElementById('view1');
        const view2 = document.getElementById('view2');
        const view3 = document.getElementById('view3');
        const view4 = document.getElementById('view4');
        const view1_btn = document.getElementById('view1_btn');
        const settings_btn = document.getElementById('settings_btn');
        const solo = document.getElementById('solo');
        const multiplayer = document.getElementById('multiplayer');
        const back_to_menu_view3 = document.getElementById('back_to_menu_view3');
        const back_to_menu_view4 = document.getElementById('back_to_menu_view4');
        const btn_back_home = document.getElementById('back-home');
        const view5 = document.getElementById('view5');
        const view6 = document.getElementById('view6');
        const view7 = document.getElementById('view7');
        const view8 = document.getElementById('view8');
        const prepar_game_1v1 = document.getElementById('prepar_game_1v1');
        const prepar_gane_ai = document.getElementById('prepar_gane_ai');
        const prepar_game_multi = document.getElementById('prepar_game_multi');
        const back_to_menu_view6 = document.getElementById('back_to_menu_view6');
        const back_to_menu_view7 = document.getElementById('back_to_menu_view7');
        const back_to_menu_view8 = document.getElementById('back_to_menu_view8');
        const powerUP = document.getElementById('powerUP');
        const number_powerUP_1 = document.getElementById('number_powerUP_1');
        const number_powerUP_3 = document.getElementById('number_powerUP_3');
        const number_powerUP_5 = document.getElementById('number_powerUP_5');
        const power_selector = document.getElementById('power_selector');
        const skin_perso = document.getElementById('skin_perso');
        const back_to_select_mode_view6 = document.getElementById('back_to_select_mode_view6');
        const back_to_select_mode_view7 = document.getElementById('back_to_select_mode_view7');
        const back_to_select_mode_view8 = document.getElementById('back_to_select_mode_view8');
        btn_jouer.addEventListener('click', () => {
            console.log('JOUER button clicked');
            view1.classList.add('active');
            view2.classList.add('active');
            btn_back_home.classList.add('active');
            btn_jouer.style.display = 'none';
        });
        view1_btn.addEventListener('click', () => {
            console.log('Mode de jeux button clicked');
            if (view5.classList.contains('active')) {
                view5.classList.remove('active');
                view2.classList.add('active');
            }
            else if (!view2.classList.contains('active')) {
                view2.classList.add('active');
            }
        });
        settings_btn.addEventListener('click', () => {
            view2.classList.remove('active');
            view5.classList.add('active');
        });
        solo.addEventListener('click', () => {
            view2.classList.remove('active');
            view3.classList.add('active');
            view1.classList.remove('active');
            btn_back_home.classList.remove('active');
        });
        multiplayer.addEventListener('click', () => {
            view2.classList.remove('active');
            view4.classList.add('active');
            view1.classList.remove('active');
            btn_back_home.classList.remove('active');
        });
        if (!view3.classList.contains('active')) {
            console.log('view3 is active');
            back_to_menu_view3.addEventListener('click', () => {
                view3.classList.remove('active');
                view2.classList.add('active');
                view1.classList.add('active');
                btn_back_home.classList.add('active');
            });
        }
        if (!view4.classList.contains('active')) {
            console.log('view4 is active');
            back_to_menu_view4.addEventListener('click', () => {
                view4.classList.remove('active');
                view2.classList.add('active');
                view1.classList.add('active');
                btn_back_home.classList.add('active');
            });
        }
        btn_back_home.addEventListener('click', () => {
            if (view2.classList.contains('active')) {
                view2.classList.remove('active');
                view1.classList.remove('active');
                btn_back_home.classList.remove('active');
                btn_jouer.style.display = 'block';
            }
            if (view5.classList.contains('active')) {
                view5.classList.remove('active');
                view1.classList.remove('active');
                btn_back_home.classList.remove('active');
                btn_jouer.style.display = 'block';
            }
        });
        prepar_game_1v1.addEventListener('click', () => {
            view3.classList.remove('active');
            view6.classList.add('active');
            back_to_select_mode_view6.classList.add('active');
        });
        prepar_gane_ai.addEventListener('click', () => {
            view3.classList.remove('active');
            view7.classList.add('active');
            back_to_select_mode_view7.classList.add('active');
        });
        prepar_game_multi.addEventListener('click', () => {
            view4.classList.remove('active');
            view8.classList.add('active');
            back_to_select_mode_view8.classList.add('active');
        });
        back_to_menu_view6.addEventListener('click', () => {
            view6.classList.remove('active');
            view3.classList.add('active');
            back_to_select_mode_view6.classList.remove('active');
        });
        back_to_menu_view7.addEventListener('click', () => {
            console.log('Back to menu view7 clicked');
            view3.classList.add('active');
            view7.classList.remove('active');
            back_to_select_mode_view7.classList.remove('active');
        });
        back_to_menu_view8.addEventListener('click', () => {
            view8.classList.remove('active');
            view4.classList.add('active');
            back_to_select_mode_view8.classList.remove('active');
        });
        powerUP.addEventListener('click', () => {
            powerUP.classList.toggle('checked');
            if (powerUP.classList.contains('checked')) {
                console.log('PowerUP is active');
                power_selector.classList.add('active');
            }
            else {
                console.log('PowerUP is inactive');
                power_selector.classList.remove('active');
                reset_powerUP_grenade();
                reset_powerUP_teammate();
                reset_powerUP_inverse_player();
                powerUP_nb = 0;
                powerUP_nb_multi = 0;
            }
        });
        number_powerUP_1.addEventListener('click', () => {
            number_powerUP_1.classList.toggle('checked');
            number_powerUP_3.classList.remove('checked');
            number_powerUP_5.classList.remove('checked');
            console.log('1 powerUP selected and 3 and 5 unselected');
            init_nb_powerUP_grenadeFlash(1);
            init_nb_powerUP_teammate(1);
            init_powerUP_inverse_player(1);
            powerUP_nb = 1;
        });
        number_powerUP_3.addEventListener('click', () => {
            number_powerUP_3.classList.toggle('checked');
            number_powerUP_1.classList.remove('checked');
            number_powerUP_5.classList.remove('checked');
            console.log('3 powerUP selected and 1 and 5 unselected');
            init_nb_powerUP_grenadeFlash(3);
            init_nb_powerUP_teammate(3);
            init_powerUP_inverse_player(3);
            powerUP_nb = 3;
        });
        number_powerUP_5.addEventListener('click', () => {
            number_powerUP_5.classList.toggle('checked');
            number_powerUP_1.classList.remove('checked');
            number_powerUP_3.classList.remove('checked');
            console.log('5 powerUP selected and 1 and 3 unselected');
            init_nb_powerUP_grenadeFlash(5);
            init_nb_powerUP_teammate(5);
            init_powerUP_inverse_player(5);
            powerUP_nb = 5;
        });
        skin_perso.addEventListener('click', () => {
            skin_perso.classList.toggle('checked');
            console.log('Skin perso selected');
        });
        const powerUP_multi = document.getElementById('powerUP_multi');
        const number_powerUP_1_game_multi = document.getElementById('number_powerUP_1_game_multi');
        const number_powerUP_3_game_multi = document.getElementById('number_powerUP_3_game_multi');
        const number_powerUP_5_game_multi = document.getElementById('number_powerUP_5_game_multi');
        const power_selector_game_multi = document.getElementById('power_selector_game_multi');
        powerUP_multi.addEventListener('click', () => {
            powerUP_multi.classList.toggle('checked');
            if (powerUP_multi.classList.contains('checked')) {
                console.log('PowerUP is active');
                power_selector_game_multi.classList.add('active');
            }
            else {
                console.log('PowerUP is inactive');
                power_selector_game_multi.classList.remove('active');
                reset_powerUP_grenade();
                reset_powerUP_teammate();
            }
        });
        number_powerUP_1_game_multi.addEventListener('click', () => {
            number_powerUP_1_game_multi.classList.toggle('checked');
            number_powerUP_3_game_multi.classList.remove('checked');
            number_powerUP_5_game_multi.classList.remove('checked');
            console.log('1 powerUP selected and 3 and 5 unselected');
            init_nb_powerUP_grenadeFlash_team_player(1);
            init_powerUP_freeze_Team_player(1);
            powerUP_nb_multi = 1;
        });
        number_powerUP_3_game_multi.addEventListener('click', () => {
            number_powerUP_3_game_multi.classList.toggle('checked');
            number_powerUP_1_game_multi.classList.remove('checked');
            number_powerUP_5_game_multi.classList.remove('checked');
            console.log('3 powerUP selected and 1 and 5 unselected');
            init_nb_powerUP_grenadeFlash_team_player(3);
            init_powerUP_freeze_Team_player(3);
            powerUP_nb_multi = 3;
        });
        number_powerUP_5_game_multi.addEventListener('click', () => {
            number_powerUP_5_game_multi.classList.toggle('checked');
            number_powerUP_1_game_multi.classList.remove('checked');
            number_powerUP_3_game_multi.classList.remove('checked');
            console.log('5 powerUP selected and 1 and 3 unselected');
            init_nb_powerUP_grenadeFlash_team_player(5);
            init_powerUP_freeze_Team_player(5);
            powerUP_nb_multi = 5;
        });
        if (getValue_leave_game() == true) {
            powerUP_nb = 0;
            setLeaveGameVar(false);
        }
    }
}
export function getPowerUP_value() {
    return powerUP_nb;
}
export function getPowerUP_value_multi() {
    return powerUP_nb_multi;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZV9tZW51LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHVibGljL3N0YXRpYy9qcy92aWV3cy9HYW1lX21lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxZQUFZLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNuRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDeEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDcEYsT0FBTyxFQUFFLDRCQUE0QixFQUFFLHFCQUFxQixFQUFFLE1BQU0sMEVBQTBFLENBQUM7QUFDL0ksT0FBTyxFQUFFLHdCQUF3QixFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0VBQXNFLENBQUM7QUFDeEksT0FBTyxFQUFFLDJCQUEyQixFQUFFLDRCQUE0QixFQUFFLE1BQU0scUVBQXFFLENBQUM7QUFDaEosT0FBTyxFQUFFLHdDQUF3QyxFQUFFLE1BQU0scUZBQXFGLENBQUM7QUFDL0ksT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sMEVBQTBFLENBQUM7QUFDM0gsT0FBTyxFQUFFLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVuRSxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDbkIsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7QUFLekIsTUFBTSxDQUFDLE9BQU8sT0FBTyxTQUFVLFNBQVEsWUFBWTtJQUNsRDtRQUNDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU87UUFDWixPQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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cmFjdFZpZXcgZnJvbSBcIi4vQWJzdHJhY3RWaWV3XCI7XG5pbXBvcnQgeyBzdGFydEdhbWUsIHN0YXJ0QUlfR2FtZSB9IGZyb20gXCIuLy4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9iYWJ5bG9uLmpzXCI7XG5pbXBvcnQgeyBzdGFydE11bHRpR2FtZSB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvYmFieWxvbi5qc1wiO1xuaW1wb3J0IHsgaGFuZGxlVmlld1RyYW5zaXRpb25zIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS92aWV3cy9jYW1lcmEuanNcIjtcbmltcG9ydCB7IGluaXRfbmJfcG93ZXJVUF9ncmVuYWRlRmxhc2gsIHJlc2V0X3Bvd2VyVVBfZ3JlbmFkZSB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvc29sby8xdjFfcGxheWVyL2luaXRfcG93ZXJVUF9HcmVuYWRlRmxhc2guanNcIjtcbmltcG9ydCB7IGluaXRfbmJfcG93ZXJVUF90ZWFtbWF0ZSwgcmVzZXRfcG93ZXJVUF90ZWFtbWF0ZSB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvc29sby8xdjFfcGxheWVyL2luaXRfcG93ZXJVUF90ZWFtbWF0ZS5qc1wiO1xuaW1wb3J0IHsgaW5pdF9wb3dlclVQX2ludmVyc2VfcGxheWVyLCByZXNldF9wb3dlclVQX2ludmVyc2VfcGxheWVyIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zb2xvLzF2MV9wbGF5ZXIvaW5pdF9wb3dlclVQX2ludmVyc2UuanNcIjtcbmltcG9ydCB7IGluaXRfbmJfcG93ZXJVUF9ncmVuYWRlRmxhc2hfdGVhbV9wbGF5ZXIgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L211bHRpcGxheWVyLzJ2Ml9nYW1lL2luaXRfcG93ZXJVUF9HZXJuYWRlRmxhc2hfbXVsdGkuanNcIjtcbmltcG9ydCB7IGluaXRfcG93ZXJVUF9mcmVlemVfVGVhbV9wbGF5ZXIgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L211bHRpcGxheWVyLzJ2Ml9nYW1lL2luaXRfcG93ZXJfdXBfZnJlZXplLmpzXCI7XG5pbXBvcnQgeyBnZXRWYWx1ZV9sZWF2ZV9nYW1lLCBzZXRMZWF2ZUdhbWVWYXIgfSBmcm9tIFwiLi4vaW5kZXguanNcIjtcblxubGV0IHBvd2VyVVBfbmIgPSAwO1xubGV0IHBvd2VyVVBfbmJfbXVsdGkgPSAwO1xuXG5cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lX21lbnUgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuc2V0VGl0bGUoXCJHYW1lX21lbnVcIik7XG5cdH1cblxuXHRhc3luYyBnZXRIdG1sKCk6IFByb21pc2U8c3RyaW5nPiB7XG5cdFx0cmV0dXJuIGBcblx0XHQ8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIi4vc3RhdGljL2pzL2Nzcy9nYW1lX21lbnUuY3NzXCI+XG5cdFx0PGxpbmsgaHJlZj1cImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9QmxhY2srT3BzK09uZSZkaXNwbGF5PXN3YXBcIiByZWw9XCJzdHlsZXNoZWV0XCI+XG5cdFx0PGRpdiBjbGFzcz1cInZpZXcxXCIgaWQ9XCJ2aWV3MVwiPlxuXHRcdFx0PGRpdiBjbGFzcz1cInZpZXcxLWNvbnRlbnRcIj5cblx0XHRcdFx0PGJ1dHRvbiBpZD1cInZpZXcxX2J0blwiIGNsYXNzPVwiYnRuXCI+TU9ERSBERSBKRVVYPC9idXR0b24+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJzZXR0aW5nc19idG5cIiBjbGFzcz1cImJ0blwiPlBBUkFNRVRSRVM8L2J1dHRvbj5cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2PlxuXHRcdDxkaXYgY2xhc3M9XCJiYWNrLWhvbWVcIiBpZD1cImJhY2staG9tZVwiPlxuXHRcdFx0PGJ1dHRvbiBpZD1cImJ0bl9iYWNrX2hvbWVcIiBjbGFzcz1cImJ0blwiPkFDQ1VFSUw8L2J1dHRvbj5cblx0XHQ8L2Rpdj5cblx0XHQ8ZGl2IGlkPVwiY29udGFpbmVyXCIgY2xhc3M9XCJjb250YWluZXJfbWVudVwiPlxuXHRcdFx0PGJ1dHRvbiBpZD1cImJ0bl9qb3VlclwiPlxuXHRcdFx0XHQ8aDE+Sk9VRVI8L2gxPlxuXHRcdFx0PC9idXR0b24+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzJcIiBpZD1cInZpZXcyXCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3Mi1jb250ZW50XCI+XG5cdFx0XHRcdFx0PGgxPkNIT0lTSVMgVE9OIE1PREUgREUgSkVVWDwvaDE+XG5cdFx0XHRcdFx0PGRpdiBpZD1cImdhbWVfbW9kZV9idG5cIiBjbGFzcz1cImdhbWVfbW9kZV9idG5cIj5cblx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJzb2xvXCIgY2xhc3M9XCJidG5cIj5TT0xPPC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwibXVsdGlwbGF5ZXJcIiBjbGFzcz1cImJ0blwiPk1VTFRJUExBWUVSPC9idXR0b24+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzNcIiBpZD1cInZpZXczXCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3My1jb250ZW50XCI+XG5cdFx0XHRcdFx0PGgxPk1PREUgREUgSkVVWCBFTiBTT0xPPC9oMT5cblx0XHRcdFx0XHQ8ZGl2IGlkPVwiZ2FtZV9tb2RlX2J0blwiIGNsYXNzPVwiZ2FtZV9tb2RlX2J0blwiPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cInByZXBhcl9nYW1lXzF2MVwiIGNsYXNzPVwiYnRuXCI+MXYxPC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwicHJlcGFyX2dhbmVfYWlcIiBjbGFzcz1cImJ0blwiPmFpPC9idXR0b24+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGJ1dHRvbiBpZD1cImJhY2tfdG9fbWVudV92aWV3M1wiIGNsYXNzPVwiYnRuXCI+QkFDSyBUTyBNRU5VPC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzRcIiBpZD1cInZpZXc0XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3NC1jb250ZW50XCI+XG5cdFx0XHRcdFx0PGgxPk1PREUgREUgSkVVWCBNVUxUSVBMQVlFUjwvaDE+XG5cdFx0XHRcdFx0PGRpdiBpZD1cImdhbWVfbW9kZV9idG5cIiBjbGFzcz1cImdhbWVfbW9kZV9idG5cIj5cblx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJwcmVwYXJfZ2FtZV9tdWx0aVwiIGNsYXNzPVwiYnRuXCI+MnYyPC9idXR0b24+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGJ1dHRvbiBpZD1cImJhY2tfdG9fbWVudV92aWV3NFwiIGNsYXNzPVwiYnRuXCI+QkFDSyBUTyBNRU5VPC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzVcIiBpZD1cInZpZXc1XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3NS1jb250ZW50XCI+XG5cdFx0XHRcdFx0PGgxPlBBUkFNRVRSRVM8L2gxPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cInZpZXc2XCIgaWQ9XCJ2aWV3NlwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzYtY29udGVudFwiPlxuXHRcdFx0XHRcdDxoMT5DVVNUT01JU0UgVEEgR0FNRTwvaDE+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBcIj5cblx0XHRcdFx0XHRcdDxwPlBvd2VyVVAgOjxzcGFuIGlkPVwicG93ZXJVUFwiIGNsYXNzPVwiYWN0aXZlX3Bvd2VyVVBcIj48L3NwYW4+PC9wPlxuXHRcdFx0XHRcdFx0PGRpdiBpZD1cInBvd2VyX3NlbGVjdG9yXCIgY2xhc3M9XCJwb3dlcl9zZWxlY3RvclwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUF9udW1iZXJcIj5cblx0XHRcdFx0XHRcdFx0XHQ8cD4xPC9wPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGlkPVwibnVtYmVyX3Bvd2VyVVBfMVwiIGNsYXNzPVwibnVtYmVyX3Bvd2VyVVBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUF9udW1iZXJcIj5cblx0XHRcdFx0XHRcdFx0XHQ8cD4zPC9wPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGlkPVwibnVtYmVyX3Bvd2VyVVBfM1wiIGNsYXNzPVwibnVtYmVyX3Bvd2VyVVBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUF9udW1iZXJcIj5cblx0XHRcdFx0XHRcdFx0XHQ8cD41PC9wPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGlkPVwibnVtYmVyX3Bvd2VyVVBfNVwiIGNsYXNzPVwibnVtYmVyX3Bvd2VyVVBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNraW5cIj5cblx0XHRcdFx0XHRcdDxwPlNraW4gUGVyc29ubmFsaXNlIDo8c3BhbiBpZD1cInNraW5fcGVyc29cIiBjbGFzcz1cInNraW5fcGVyc29cIjwvc3Bhbj48L3A+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGJ1dHRvbiBpZD1cInNvbG9fMXYxX2J0blwiIGNsYXNzPVwiYnRuXCI+XG5cdFx0XHRcdFx0XHQ8YSBocmVmPVwiL3NvbG9fZ2FtZV8xdjFcIiBjbGFzcz1cIm5hdi1saW5rXCIgZGF0YS1saW5rPkxhbmNlciBsYSBwYXJ0aWU8L2E+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzdcIiBpZD1cInZpZXc3XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3Ny1jb250ZW50XCI+XG5cdFx0XHRcdFx0PGgxPkNVU1RPTUlTRSBUQSBHQU1FIENPTlRSRSBMJ0lBPC9oMT5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUFwiPlxuXHRcdFx0XHRcdFx0PHA+UG93ZXJVUCA6PHNwYW4gaWQ9XCJwb3dlclVQXCIgY2xhc3M9XCJhY3RpdmVfcG93ZXJVUFwiPjwvc3Bhbj48L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGlkPVwicG93ZXJfc2VsZWN0b3JcIiBjbGFzcz1cInBvd2VyX3NlbGVjdG9yXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQX251bWJlclwiPlxuXHRcdFx0XHRcdFx0XHRcdDxwPjE8L3A+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gaWQ9XCJudW1iZXJfcG93ZXJVUF8xXCIgY2xhc3M9XCJudW1iZXJfcG93ZXJVUFwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQX251bWJlclwiPlxuXHRcdFx0XHRcdFx0XHRcdDxwPjM8L3A+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gaWQ9XCJudW1iZXJfcG93ZXJVUF8zXCIgY2xhc3M9XCJudW1iZXJfcG93ZXJVUFwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQX251bWJlclwiPlxuXHRcdFx0XHRcdFx0XHRcdDxwPjU8L3A+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gaWQ9XCJudW1iZXJfcG93ZXJVUF81XCIgY2xhc3M9XCJudW1iZXJfcG93ZXJVUFwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2tpblwiPlxuXHRcdFx0XHRcdFx0PHA+U2tpbiBQZXJzb25uYWxpc2UgOjxzcGFuIGlkPVwic2tpbl9wZXJzb1wiIGNsYXNzPVwic2tpbl9wZXJzb1wiPC9zcGFuPjwvcD5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwic29sb19haV9idG5cIiBjbGFzcz1cImJ0blwiPlxuXHRcdFx0XHRcdFx0PGEgaHJlZj1cIi9zb2xvX2dhbWVfYWlcIiBjbGFzcz1cIm5hdi1saW5rXCIgZGF0YS1saW5rPkxhbmNlciBsYSBwYXJ0aWU8L2E+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzhcIiBpZD1cInZpZXc4XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3OC1jb250ZW50XCI+XG5cdFx0XHRcdFx0PGgxPkNVU1RPTUlTRSBUQSBHQU1FIEVOIE1VTFRJPC9oMT5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUFwiPlxuXHRcdFx0XHRcdFx0PHA+UG93ZXJVUCA6PHNwYW4gaWQ9XCJwb3dlclVQX211bHRpXCIgY2xhc3M9XCJhY3RpdmVfcG93ZXJVUFwiPjwvc3Bhbj48L3A+XG5cdFx0XHRcdFx0XHQ8ZGl2IGlkPVwicG93ZXJfc2VsZWN0b3JfZ2FtZV9tdWx0aVwiIGNsYXNzPVwicG93ZXJfc2VsZWN0b3JcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBfbnVtYmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHA+MTwvcD5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBpZD1cIm51bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aVwiIGNsYXNzPVwibnVtYmVyX3Bvd2VyVVBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUF9udW1iZXJcIj5cblx0XHRcdFx0XHRcdFx0XHQ8cD4zPC9wPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGlkPVwibnVtYmVyX3Bvd2VyVVBfM19nYW1lX211bHRpXCIgY2xhc3M9XCJudW1iZXJfcG93ZXJVUFwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQX251bWJlclwiPlxuXHRcdFx0XHRcdFx0XHRcdDxwPjU8L3A+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gaWQ9XCJudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGlcIiBjbGFzcz1cIm51bWJlcl9wb3dlclVQXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJza2luXCI+XG5cdFx0XHRcdFx0XHQ8cD5Ta2luIFBlcnNvbm5hbGlzZSA6PHNwYW4gaWQ9XCJza2luX3BlcnNvX2dhbWVfbXVsdGlcIiBjbGFzcz1cInNraW5fcGVyc29cIjwvc3Bhbj48L3A+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGJ1dHRvbiBpZD1cIm11bHRpcGxheWVyX2J0blwiIGNsYXNzPVwiYnRuXCI+XG5cdFx0XHRcdFx0XHQ8YSBocmVmPVwiL211bHRpX3BsYXllcl9nYW1lXCIgY2xhc3M9XCJuYXYtbGlua1wiIGRhdGEtbGluaz5MYW5jZXIgbGEgcGFydGllPC9hPlxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2PlxuXHRcdDxkaXYgY2xhc3M9XCJiYWNrXCIgaWQ9XCJiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc2XCI+XG5cdFx0XHQ8YnV0dG9uIGlkPVwiYmFja190b19tZW51X3ZpZXc2XCIgY2xhc3M9XCJidG5fYmFja1wiPkJBQ0s8L2J1dHRvbj5cblx0XHQ8L2Rpdj5cblx0XHQ8ZGl2IGNsYXNzPVwiYmFja1wiIGlkPVwiYmFja190b19zZWxlY3RfbW9kZV92aWV3N1wiPlxuXHRcdFx0PGJ1dHRvbiBpZD1cImJhY2tfdG9fbWVudV92aWV3N1wiIGNsYXNzPVwiYnRuX2JhY2tcIj5CQUNLPC9idXR0b24+XG5cdFx0PC9kaXY+XG5cdFx0PGRpdiBjbGFzcz1cImJhY2tcIiBpZD1cImJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzhcIj5cblx0XHRcdDxidXR0b24gaWQ9XCJiYWNrX3RvX21lbnVfdmlldzhcIiBjbGFzcz1cImJ0bl9iYWNrXCI+QkFDSzwvYnV0dG9uPlxuXHRcdDwvZGl2PlxuXHRcdDwvZGl2PlxuXG5cblx0XHRgO1xuXHR9XG5cblx0aW5pdF9zb2xvX2dhbWUoKSB7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb2xvXzF2MV9idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiU29sbyAxdjEgZ2FtZSBzdGFydGVkXCIpO1xuXHRcdFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKFwidnVlM1wiLCBcInZ1ZTJcIik7XG5cdFx0XHRzdGFydEdhbWUoKTtcblx0XHR9KTtcblx0fVxuXG5cdGluaXRFdmVudHMoKSB7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtdWx0aXBsYXllcl9idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiTXVsdGlwbGF5ZXIgMnYyIGdhbWUgc3RhcnRlZFwiKTtcblx0XHRcdGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInZ1ZTNcIiwgXCJ2dWUyXCIpO1xuXHRcdFx0c3RhcnRNdWx0aUdhbWUoKTtcblx0XHR9KTtcblx0fVxuXG5cdGluaXRfc29sb19nYW1lX2FpKCkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29sb19haV9idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiU29sbyBBSSBnYW1lIHN0YXJ0ZWRcIik7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUzXCIsIFwidnVlMlwiKTtcblx0XHRcdHN0YXJ0QUlfR2FtZSgpO1xuXHRcdH0pO1xuXHR9XG5cblx0Z2FtZV9tZW51KClcblx0e1xuXHRcdGNvbnN0IGJ0bl9qb3VlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5fam91ZXInKTtcblx0XHRjb25zdCB2aWV3MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3MScpO1xuXHRcdGNvbnN0IHZpZXcyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZXcyJyk7XG5cdFx0Y29uc3QgdmlldzMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldzMnKTtcblx0XHRjb25zdCB2aWV3NCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3NCcpO1xuXHRcdGNvbnN0IHZpZXcxX2J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3MV9idG4nKTtcblx0XHRjb25zdCBzZXR0aW5nc19idG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0dGluZ3NfYnRuJyk7XG5cdFx0Y29uc3Qgc29sbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzb2xvJyk7XG5cdFx0Y29uc3QgbXVsdGlwbGF5ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXVsdGlwbGF5ZXInKTtcblx0XHRjb25zdCBiYWNrX3RvX21lbnVfdmlldzMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19tZW51X3ZpZXczJyk7XG5cdFx0Y29uc3QgYmFja190b19tZW51X3ZpZXc0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tfdG9fbWVudV92aWV3NCcpO1xuXHRcdGNvbnN0IGJ0bl9iYWNrX2hvbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFjay1ob21lJyk7XG5cdFx0Y29uc3QgdmlldzUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldzUnKTtcblx0XHRjb25zdCB2aWV3NiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3NicpO1xuXHRcdGNvbnN0IHZpZXc3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZXc3Jyk7XG5cdFx0Y29uc3QgdmlldzggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldzgnKTtcblx0XHRjb25zdCBwcmVwYXJfZ2FtZV8xdjEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJlcGFyX2dhbWVfMXYxJyk7XG5cdFx0Y29uc3QgcHJlcGFyX2dhbmVfYWkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJlcGFyX2dhbmVfYWknKTtcblx0XHRjb25zdCBwcmVwYXJfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcmVwYXJfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IGJhY2tfdG9fbWVudV92aWV3NiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX21lbnVfdmlldzYnKTtcblx0XHRjb25zdCBiYWNrX3RvX21lbnVfdmlldzcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19tZW51X3ZpZXc3Jyk7XG5cdFx0Y29uc3QgYmFja190b19tZW51X3ZpZXc4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tfdG9fbWVudV92aWV3OCcpO1xuXHRcdGNvbnN0IHBvd2VyVVAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG93ZXJVUCcpO1xuXHRcdGNvbnN0IG51bWJlcl9wb3dlclVQXzEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtYmVyX3Bvd2VyVVBfMScpO1xuXHRcdGNvbnN0IG51bWJlcl9wb3dlclVQXzMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtYmVyX3Bvd2VyVVBfMycpO1xuXHRcdGNvbnN0IG51bWJlcl9wb3dlclVQXzUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtYmVyX3Bvd2VyVVBfNScpO1xuXHRcdGNvbnN0IHBvd2VyX3NlbGVjdG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bvd2VyX3NlbGVjdG9yJyk7XG5cdFx0Y29uc3Qgc2tpbl9wZXJzbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdza2luX3BlcnNvJyk7XG5cdFx0Y29uc3QgYmFja190b19zZWxlY3RfbW9kZV92aWV3NiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc2Jyk7XG5cdFx0Y29uc3QgYmFja190b19zZWxlY3RfbW9kZV92aWV3NyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc3Jyk7XG5cdFx0Y29uc3QgYmFja190b19zZWxlY3RfbW9kZV92aWV3OCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc4Jyk7XG5cblx0XHRidG5fam91ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnSk9VRVIgYnV0dG9uIGNsaWNrZWQnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2pvdWVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0fSk7XG5cblx0XHR2aWV3MV9idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnTW9kZSBkZSBqZXV4IGJ1dHRvbiBjbGlja2VkJyk7XG5cdFx0XHRcblx0XHRcdGlmICh2aWV3NS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdHZpZXc1LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3Mi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdH0gXG5cdFx0XHRlbHNlIGlmICghdmlldzIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHR2aWV3Mi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXG5cblx0XHRzZXR0aW5nc19idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR2aWV3Mi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc1LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXG5cdFx0c29sby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHZpZXcyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3MS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHRtdWx0aXBsYXllci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHZpZXcyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3MS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHRpZiAoIXZpZXczLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdGNvbnNvbGUubG9nKCd2aWV3MyBpcyBhY3RpdmUnKTtcblx0XHRcdGJhY2tfdG9fbWVudV92aWV3My5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdFx0dmlldzMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3MS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmICghdmlldzQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ3ZpZXc0IGlzIGFjdGl2ZScpO1xuXHRcdFx0YmFja190b19tZW51X3ZpZXc0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0XHR2aWV3NC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0dmlldzIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0YnRuX2JhY2tfaG9tZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGlmICh2aWV3Mi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdHZpZXcyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3MS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0YnRuX2pvdWVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZpZXc1LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0dmlldzUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcxLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRidG5fam91ZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRwcmVwYXJfZ2FtZV8xdjEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR2aWV3My5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc2LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3Ni5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXG5cdFx0cHJlcGFyX2dhbmVfYWkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR2aWV3My5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc3LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3Ny5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXHRcdHByZXBhcl9nYW1lX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0dmlldzQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3OC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzguY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHRiYWNrX3RvX21lbnVfdmlldzYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR2aWV3Ni5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXczLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3Ni5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXHRcdGJhY2tfdG9fbWVudV92aWV3Ny5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdCYWNrIHRvIG1lbnUgdmlldzcgY2xpY2tlZCcpO1xuXHRcdFx0dmlldzMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3Ny5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHRiYWNrX3RvX21lbnVfdmlldzguYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR2aWV3OC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3OC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXHRcdHBvd2VyVVAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRwb3dlclVQLmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKTtcblxuXHRcdFx0aWYgKHBvd2VyVVAuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1Bvd2VyVVAgaXMgYWN0aXZlJyk7XG5cdFx0XHRcdHBvd2VyX3NlbGVjdG9yLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdQb3dlclVQIGlzIGluYWN0aXZlJyk7XG5cdFx0XHRcdHBvd2VyX3NlbGVjdG9yLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2dyZW5hZGUoKTtcblx0XHRcdFx0cmVzZXRfcG93ZXJVUF90ZWFtbWF0ZSgpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2ludmVyc2VfcGxheWVyKCk7XG5cdFx0XHRcdHBvd2VyVVBfbmIgPSAwO1xuXHRcdFx0XHRwb3dlclVQX25iX211bHRpID0gMDtcblx0XHRcdH1cblx0XHR9KTtcblxuXG5cdFx0bnVtYmVyX3Bvd2VyVVBfMS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdG51bWJlcl9wb3dlclVQXzEuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpXG5cdFx0XHRudW1iZXJfcG93ZXJVUF8zLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdG51bWJlcl9wb3dlclVQXzUuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0Y29uc29sZS5sb2coJzEgcG93ZXJVUCBzZWxlY3RlZCBhbmQgMyBhbmQgNSB1bnNlbGVjdGVkJyk7XG5cdFx0XHRpbml0X25iX3Bvd2VyVVBfZ3JlbmFkZUZsYXNoKDEpO1xuXHRcdFx0aW5pdF9uYl9wb3dlclVQX3RlYW1tYXRlKDEpO1xuXHRcdFx0aW5pdF9wb3dlclVQX2ludmVyc2VfcGxheWVyKDEpO1xuXHRcdFx0cG93ZXJVUF9uYiA9IDE7XG5cblx0XHR9KTtcblxuXHRcdG51bWJlcl9wb3dlclVQXzMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF8zLmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKVxuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfMS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF81LmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdGNvbnNvbGUubG9nKCczIHBvd2VyVVAgc2VsZWN0ZWQgYW5kIDEgYW5kIDUgdW5zZWxlY3RlZCcpO1xuXHRcdFx0aW5pdF9uYl9wb3dlclVQX2dyZW5hZGVGbGFzaCgzKTtcblx0XHRcdGluaXRfbmJfcG93ZXJVUF90ZWFtbWF0ZSgzKTtcblx0XHRcdGluaXRfcG93ZXJVUF9pbnZlcnNlX3BsYXllcigzKTtcblx0XHRcdHBvd2VyVVBfbmIgPSAzO1xuXHRcdH0pO1xuXG5cdFx0bnVtYmVyX3Bvd2VyVVBfNS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdG51bWJlcl9wb3dlclVQXzUuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpXG5cdFx0XHRudW1iZXJfcG93ZXJVUF8xLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdG51bWJlcl9wb3dlclVQXzMuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0Y29uc29sZS5sb2coJzUgcG93ZXJVUCBzZWxlY3RlZCBhbmQgMSBhbmQgMyB1bnNlbGVjdGVkJyk7XG5cdFx0XHRpbml0X25iX3Bvd2VyVVBfZ3JlbmFkZUZsYXNoKDUpO1xuXHRcdFx0aW5pdF9uYl9wb3dlclVQX3RlYW1tYXRlKDUpO1xuXHRcdFx0aW5pdF9wb3dlclVQX2ludmVyc2VfcGxheWVyKDUpO1xuXHRcdFx0cG93ZXJVUF9uYiA9IDU7XG5cdFx0fSk7XG5cblx0XHRza2luX3BlcnNvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0c2tpbl9wZXJzby5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJyk7XG5cdFx0XHRjb25zb2xlLmxvZygnU2tpbiBwZXJzbyBzZWxlY3RlZCcpO1xuXHRcdH0pO1xuXG5cdFx0Y29uc3QgcG93ZXJVUF9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3dlclVQX211bHRpJyk7XG5cdFx0Y29uc3QgbnVtYmVyX3Bvd2VyVVBfMV9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ251bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGknKTtcblx0XHRjb25zdCBudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpJyk7XG5cdFx0Y29uc3QgcG93ZXJfc2VsZWN0b3JfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3dlcl9zZWxlY3Rvcl9nYW1lX211bHRpJyk7XG5cblx0XHRwb3dlclVQX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0cG93ZXJVUF9tdWx0aS5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJyk7XG5cblx0XHRcdGlmIChwb3dlclVQX211bHRpLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdQb3dlclVQIGlzIGFjdGl2ZScpO1xuXHRcdFx0XHRwb3dlcl9zZWxlY3Rvcl9nYW1lX211bHRpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdQb3dlclVQIGlzIGluYWN0aXZlJyk7XG5cdFx0XHRcdHBvd2VyX3NlbGVjdG9yX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfZ3JlbmFkZSgpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX3RlYW1tYXRlKCk7XG5cdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cblx0XHRudW1iZXJfcG93ZXJVUF8xX2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF8xX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpXG5cdFx0XHRudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdGNvbnNvbGUubG9nKCcxIHBvd2VyVVAgc2VsZWN0ZWQgYW5kIDMgYW5kIDUgdW5zZWxlY3RlZCcpO1xuXHRcdFx0aW5pdF9uYl9wb3dlclVQX2dyZW5hZGVGbGFzaF90ZWFtX3BsYXllcigxKTtcblx0XHRcdGluaXRfcG93ZXJVUF9mcmVlemVfVGVhbV9wbGF5ZXIoMSk7XG5cdFx0XHRwb3dlclVQX25iX211bHRpID0gMTtcblx0XHR9KTtcblxuXHRcdG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJylcblx0XHRcdG51bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0Y29uc29sZS5sb2coJzMgcG93ZXJVUCBzZWxlY3RlZCBhbmQgMSBhbmQgNSB1bnNlbGVjdGVkJyk7XG5cdFx0XHRpbml0X25iX3Bvd2VyVVBfZ3JlbmFkZUZsYXNoX3RlYW1fcGxheWVyKDMpO1xuXHRcdFx0aW5pdF9wb3dlclVQX2ZyZWV6ZV9UZWFtX3BsYXllcigzKTtcblx0XHRcdHBvd2VyVVBfbmJfbXVsdGkgPSAzO1xuXHRcdH0pO1xuXG5cdFx0bnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpLmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKVxuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfMV9nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRjb25zb2xlLmxvZygnNSBwb3dlclVQIHNlbGVjdGVkIGFuZCAxIGFuZCAzIHVuc2VsZWN0ZWQnKTtcblx0XHRcdGluaXRfbmJfcG93ZXJVUF9ncmVuYWRlRmxhc2hfdGVhbV9wbGF5ZXIoNSk7XG5cdFx0XHRpbml0X3Bvd2VyVVBfZnJlZXplX1RlYW1fcGxheWVyKDUpO1xuXHRcdFx0cG93ZXJVUF9uYl9tdWx0aSA9IDU7XG5cdFx0fSk7XG5cblx0XHRpZiAoZ2V0VmFsdWVfbGVhdmVfZ2FtZSgpID09IHRydWUpXG5cdFx0e1xuXHRcdFx0cG93ZXJVUF9uYiA9IDA7XG5cdFx0XHRzZXRMZWF2ZUdhbWVWYXIoZmFsc2UpO1xuXHRcdH1cblx0fVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQb3dlclVQX3ZhbHVlKCkge1xuXHRyZXR1cm4gcG93ZXJVUF9uYjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBvd2VyVVBfdmFsdWVfbXVsdGkoKSB7XG5cdHJldHVybiBwb3dlclVQX25iX211bHRpO1xufSJdfQ==