import AbstractView from "./AbstractView.js";
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
        return /*html*/ `
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZV9tZW51LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHVibGljL3N0YXRpYy9qcy92aWV3cy9HYW1lX21lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxZQUFZLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNuRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDeEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDcEYsT0FBTyxFQUFFLDRCQUE0QixFQUFFLHFCQUFxQixFQUFFLE1BQU0sMEVBQTBFLENBQUM7QUFDL0ksT0FBTyxFQUFFLHdCQUF3QixFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0VBQXNFLENBQUM7QUFDeEksT0FBTyxFQUFFLDJCQUEyQixFQUFFLDRCQUE0QixFQUFFLE1BQU0scUVBQXFFLENBQUM7QUFDaEosT0FBTyxFQUFFLHdDQUF3QyxFQUFFLE1BQU0scUZBQXFGLENBQUM7QUFDL0ksT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sMEVBQTBFLENBQUM7QUFDM0gsT0FBTyxFQUFFLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVuRSxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDbkIsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7QUFLekIsTUFBTSxDQUFDLE9BQU8sT0FBTyxTQUFVLFNBQVEsWUFBWTtJQUNsRDtRQUNDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU87UUFDWixPQUFPLFFBQVEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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b3J0IEFic3RyYWN0VmlldyBmcm9tIFwiLi9BYnN0cmFjdFZpZXcuanNcIjtcbmltcG9ydCB7IHN0YXJ0R2FtZSwgc3RhcnRBSV9HYW1lIH0gZnJvbSBcIi4vLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L2JhYnlsb24uanNcIjtcbmltcG9ydCB7IHN0YXJ0TXVsdGlHYW1lIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9iYWJ5bG9uLmpzXCI7XG5pbXBvcnQgeyBoYW5kbGVWaWV3VHJhbnNpdGlvbnMgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3ZpZXdzL2NhbWVyYS5qc1wiO1xuaW1wb3J0IHsgaW5pdF9uYl9wb3dlclVQX2dyZW5hZGVGbGFzaCwgcmVzZXRfcG93ZXJVUF9ncmVuYWRlIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zb2xvLzF2MV9wbGF5ZXIvaW5pdF9wb3dlclVQX0dyZW5hZGVGbGFzaC5qc1wiO1xuaW1wb3J0IHsgaW5pdF9uYl9wb3dlclVQX3RlYW1tYXRlLCByZXNldF9wb3dlclVQX3RlYW1tYXRlIH0gZnJvbSBcIi4uLy4uLy4uL3NyY3MvZ2FtZS9nYW1lcGxheS9zb2xvLzF2MV9wbGF5ZXIvaW5pdF9wb3dlclVQX3RlYW1tYXRlLmpzXCI7XG5pbXBvcnQgeyBpbml0X3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIsIHJlc2V0X3Bvd2VyVVBfaW52ZXJzZV9wbGF5ZXIgfSBmcm9tIFwiLi4vLi4vLi4vc3Jjcy9nYW1lL2dhbWVwbGF5L3NvbG8vMXYxX3BsYXllci9pbml0X3Bvd2VyVVBfaW52ZXJzZS5qc1wiO1xuaW1wb3J0IHsgaW5pdF9uYl9wb3dlclVQX2dyZW5hZGVGbGFzaF90ZWFtX3BsYXllciB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvbXVsdGlwbGF5ZXIvMnYyX2dhbWUvaW5pdF9wb3dlclVQX0dlcm5hZGVGbGFzaF9tdWx0aS5qc1wiO1xuaW1wb3J0IHsgaW5pdF9wb3dlclVQX2ZyZWV6ZV9UZWFtX3BsYXllciB9IGZyb20gXCIuLi8uLi8uLi9zcmNzL2dhbWUvZ2FtZXBsYXkvbXVsdGlwbGF5ZXIvMnYyX2dhbWUvaW5pdF9wb3dlcl91cF9mcmVlemUuanNcIjtcbmltcG9ydCB7IGdldFZhbHVlX2xlYXZlX2dhbWUsIHNldExlYXZlR2FtZVZhciB9IGZyb20gXCIuLi9pbmRleC5qc1wiO1xuXG5sZXQgcG93ZXJVUF9uYiA9IDA7XG5sZXQgcG93ZXJVUF9uYl9tdWx0aSA9IDA7XG5cblxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVfbWVudSBleHRlbmRzIEFic3RyYWN0VmlldyB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5zZXRUaXRsZShcIkdhbWVfbWVudVwiKTtcblx0fVxuXG5cdGFzeW5jIGdldEh0bWwoKTogUHJvbWlzZTxzdHJpbmc+IHtcblx0XHRyZXR1cm4gLypodG1sKi9gXG5cdFx0PGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIuL3N0YXRpYy9qcy9jc3MvZ2FtZV9tZW51LmNzc1wiPlxuXHRcdDxsaW5rIGhyZWY9XCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUJsYWNrK09wcytPbmUmZGlzcGxheT1zd2FwXCIgcmVsPVwic3R5bGVzaGVldFwiPlxuXHRcdDxkaXYgY2xhc3M9XCJ2aWV3MVwiIGlkPVwidmlldzFcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3MS1jb250ZW50XCI+XG5cdFx0XHRcdDxidXR0b24gaWQ9XCJ2aWV3MV9idG5cIiBjbGFzcz1cImJ0blwiPk1PREUgREUgSkVVWDwvYnV0dG9uPlxuXHRcdFx0XHQ8YnV0dG9uIGlkPVwic2V0dGluZ3NfYnRuXCIgY2xhc3M9XCJidG5cIj5QQVJBTUVUUkVTPC9idXR0b24+XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L2Rpdj5cblx0XHQ8ZGl2IGNsYXNzPVwiYmFjay1ob21lXCIgaWQ9XCJiYWNrLWhvbWVcIj5cblx0XHRcdDxidXR0b24gaWQ9XCJidG5fYmFja19ob21lXCIgY2xhc3M9XCJidG5cIj5BQ0NVRUlMPC9idXR0b24+XG5cdFx0PC9kaXY+XG5cdFx0PGRpdiBpZD1cImNvbnRhaW5lclwiIGNsYXNzPVwiY29udGFpbmVyX21lbnVcIj5cblx0XHRcdDxidXR0b24gaWQ9XCJidG5fam91ZXJcIj5cblx0XHRcdFx0PGgxPkpPVUVSPC9oMT5cblx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0PGRpdiBjbGFzcz1cInZpZXcyXCIgaWQ9XCJ2aWV3MlwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzItY29udGVudFwiPlxuXHRcdFx0XHRcdDxoMT5DSE9JU0lTIFRPTiBNT0RFIERFIEpFVVg8L2gxPlxuXHRcdFx0XHRcdDxkaXYgaWQ9XCJnYW1lX21vZGVfYnRuXCIgY2xhc3M9XCJnYW1lX21vZGVfYnRuXCI+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwic29sb1wiIGNsYXNzPVwiYnRuXCI+U09MTzwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cIm11bHRpcGxheWVyXCIgY2xhc3M9XCJidG5cIj5NVUxUSVBMQVlFUjwvYnV0dG9uPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cInZpZXczXCIgaWQ9XCJ2aWV3M1wiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzMtY29udGVudFwiPlxuXHRcdFx0XHRcdDxoMT5NT0RFIERFIEpFVVggRU4gU09MTzwvaDE+XG5cdFx0XHRcdFx0PGRpdiBpZD1cImdhbWVfbW9kZV9idG5cIiBjbGFzcz1cImdhbWVfbW9kZV9idG5cIj5cblx0XHRcdFx0XHRcdDxidXR0b24gaWQ9XCJwcmVwYXJfZ2FtZV8xdjFcIiBjbGFzcz1cImJ0blwiPjF2MTwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBpZD1cInByZXBhcl9nYW5lX2FpXCIgY2xhc3M9XCJidG5cIj5haTwvYnV0dG9uPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxidXR0b24gaWQ9XCJiYWNrX3RvX21lbnVfdmlldzNcIiBjbGFzcz1cImJ0blwiPkJBQ0sgVE8gTUVOVTwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cInZpZXc0XCIgaWQ9XCJ2aWV3NFwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzQtY29udGVudFwiPlxuXHRcdFx0XHRcdDxoMT5NT0RFIERFIEpFVVggTVVMVElQTEFZRVI8L2gxPlxuXHRcdFx0XHRcdDxkaXYgaWQ9XCJnYW1lX21vZGVfYnRuXCIgY2xhc3M9XCJnYW1lX21vZGVfYnRuXCI+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGlkPVwicHJlcGFyX2dhbWVfbXVsdGlcIiBjbGFzcz1cImJ0blwiPjJ2MjwvYnV0dG9uPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxidXR0b24gaWQ9XCJiYWNrX3RvX21lbnVfdmlldzRcIiBjbGFzcz1cImJ0blwiPkJBQ0sgVE8gTUVOVTwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cInZpZXc1XCIgaWQ9XCJ2aWV3NVwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzUtY29udGVudFwiPlxuXHRcdFx0XHRcdDxoMT5QQVJBTUVUUkVTPC9oMT5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3NlwiIGlkPVwidmlldzZcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInZpZXc2LWNvbnRlbnRcIj5cblx0XHRcdFx0XHQ8aDE+Q1VTVE9NSVNFIFRBIEdBTUU8L2gxPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQXCI+XG5cdFx0XHRcdFx0XHQ8cD5Qb3dlclVQIDo8c3BhbiBpZD1cInBvd2VyVVBcIiBjbGFzcz1cImFjdGl2ZV9wb3dlclVQXCI+PC9zcGFuPjwvcD5cblx0XHRcdFx0XHRcdDxkaXYgaWQ9XCJwb3dlcl9zZWxlY3RvclwiIGNsYXNzPVwicG93ZXJfc2VsZWN0b3JcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBfbnVtYmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHA+MTwvcD5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBpZD1cIm51bWJlcl9wb3dlclVQXzFcIiBjbGFzcz1cIm51bWJlcl9wb3dlclVQXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBfbnVtYmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHA+MzwvcD5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBpZD1cIm51bWJlcl9wb3dlclVQXzNcIiBjbGFzcz1cIm51bWJlcl9wb3dlclVQXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBfbnVtYmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHA+NTwvcD5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBpZD1cIm51bWJlcl9wb3dlclVQXzVcIiBjbGFzcz1cIm51bWJlcl9wb3dlclVQXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJza2luXCI+XG5cdFx0XHRcdFx0XHQ8cD5Ta2luIFBlcnNvbm5hbGlzZSA6PHNwYW4gaWQ9XCJza2luX3BlcnNvXCIgY2xhc3M9XCJza2luX3BlcnNvXCI8L3NwYW4+PC9wPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxidXR0b24gaWQ9XCJzb2xvXzF2MV9idG5cIiBjbGFzcz1cImJ0blwiPlxuXHRcdFx0XHRcdFx0PGEgaHJlZj1cIi9zb2xvX2dhbWVfMXYxXCIgY2xhc3M9XCJuYXYtbGlua1wiIGRhdGEtbGluaz5MYW5jZXIgbGEgcGFydGllPC9hPlxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cInZpZXc3XCIgaWQ9XCJ2aWV3N1wiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzctY29udGVudFwiPlxuXHRcdFx0XHRcdDxoMT5DVVNUT01JU0UgVEEgR0FNRSBDT05UUkUgTCdJQTwvaDE+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBcIj5cblx0XHRcdFx0XHRcdDxwPlBvd2VyVVAgOjxzcGFuIGlkPVwicG93ZXJVUFwiIGNsYXNzPVwiYWN0aXZlX3Bvd2VyVVBcIj48L3NwYW4+PC9wPlxuXHRcdFx0XHRcdFx0PGRpdiBpZD1cInBvd2VyX3NlbGVjdG9yXCIgY2xhc3M9XCJwb3dlcl9zZWxlY3RvclwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUF9udW1iZXJcIj5cblx0XHRcdFx0XHRcdFx0XHQ8cD4xPC9wPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGlkPVwibnVtYmVyX3Bvd2VyVVBfMVwiIGNsYXNzPVwibnVtYmVyX3Bvd2VyVVBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUF9udW1iZXJcIj5cblx0XHRcdFx0XHRcdFx0XHQ8cD4zPC9wPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGlkPVwibnVtYmVyX3Bvd2VyVVBfM1wiIGNsYXNzPVwibnVtYmVyX3Bvd2VyVVBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUF9udW1iZXJcIj5cblx0XHRcdFx0XHRcdFx0XHQ8cD41PC9wPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGlkPVwibnVtYmVyX3Bvd2VyVVBfNVwiIGNsYXNzPVwibnVtYmVyX3Bvd2VyVVBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNraW5cIj5cblx0XHRcdFx0XHRcdDxwPlNraW4gUGVyc29ubmFsaXNlIDo8c3BhbiBpZD1cInNraW5fcGVyc29cIiBjbGFzcz1cInNraW5fcGVyc29cIjwvc3Bhbj48L3A+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGJ1dHRvbiBpZD1cInNvbG9fYWlfYnRuXCIgY2xhc3M9XCJidG5cIj5cblx0XHRcdFx0XHRcdDxhIGhyZWY9XCIvc29sb19nYW1lX2FpXCIgY2xhc3M9XCJuYXYtbGlua1wiIGRhdGEtbGluaz5MYW5jZXIgbGEgcGFydGllPC9hPlxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cInZpZXc4XCIgaWQ9XCJ2aWV3OFwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlldzgtY29udGVudFwiPlxuXHRcdFx0XHRcdDxoMT5DVVNUT01JU0UgVEEgR0FNRSBFTiBNVUxUSTwvaDE+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBcIj5cblx0XHRcdFx0XHRcdDxwPlBvd2VyVVAgOjxzcGFuIGlkPVwicG93ZXJVUF9tdWx0aVwiIGNsYXNzPVwiYWN0aXZlX3Bvd2VyVVBcIj48L3NwYW4+PC9wPlxuXHRcdFx0XHRcdFx0PGRpdiBpZD1cInBvd2VyX3NlbGVjdG9yX2dhbWVfbXVsdGlcIiBjbGFzcz1cInBvd2VyX3NlbGVjdG9yXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3dlclVQX251bWJlclwiPlxuXHRcdFx0XHRcdFx0XHRcdDxwPjE8L3A+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gaWQ9XCJudW1iZXJfcG93ZXJVUF8xX2dhbWVfbXVsdGlcIiBjbGFzcz1cIm51bWJlcl9wb3dlclVQXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvd2VyVVBfbnVtYmVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHA+MzwvcD5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBpZD1cIm51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aVwiIGNsYXNzPVwibnVtYmVyX3Bvd2VyVVBcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG93ZXJVUF9udW1iZXJcIj5cblx0XHRcdFx0XHRcdFx0XHQ8cD41PC9wPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGlkPVwibnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpXCIgY2xhc3M9XCJudW1iZXJfcG93ZXJVUFwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2tpblwiPlxuXHRcdFx0XHRcdFx0PHA+U2tpbiBQZXJzb25uYWxpc2UgOjxzcGFuIGlkPVwic2tpbl9wZXJzb19nYW1lX211bHRpXCIgY2xhc3M9XCJza2luX3BlcnNvXCI8L3NwYW4+PC9wPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxidXR0b24gaWQ9XCJtdWx0aXBsYXllcl9idG5cIiBjbGFzcz1cImJ0blwiPlxuXHRcdFx0XHRcdFx0PGEgaHJlZj1cIi9tdWx0aV9wbGF5ZXJfZ2FtZVwiIGNsYXNzPVwibmF2LWxpbmtcIiBkYXRhLWxpbms+TGFuY2VyIGxhIHBhcnRpZTwvYT5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L2Rpdj5cblx0XHQ8ZGl2IGNsYXNzPVwiYmFja1wiIGlkPVwiYmFja190b19zZWxlY3RfbW9kZV92aWV3NlwiPlxuXHRcdFx0PGJ1dHRvbiBpZD1cImJhY2tfdG9fbWVudV92aWV3NlwiIGNsYXNzPVwiYnRuX2JhY2tcIj5CQUNLPC9idXR0b24+XG5cdFx0PC9kaXY+XG5cdFx0PGRpdiBjbGFzcz1cImJhY2tcIiBpZD1cImJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzdcIj5cblx0XHRcdDxidXR0b24gaWQ9XCJiYWNrX3RvX21lbnVfdmlldzdcIiBjbGFzcz1cImJ0bl9iYWNrXCI+QkFDSzwvYnV0dG9uPlxuXHRcdDwvZGl2PlxuXHRcdDxkaXYgY2xhc3M9XCJiYWNrXCIgaWQ9XCJiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc4XCI+XG5cdFx0XHQ8YnV0dG9uIGlkPVwiYmFja190b19tZW51X3ZpZXc4XCIgY2xhc3M9XCJidG5fYmFja1wiPkJBQ0s8L2J1dHRvbj5cblx0XHQ8L2Rpdj5cblx0XHQ8L2Rpdj5cblx0XHRgO1xuXHR9XG5cblx0aW5pdF9zb2xvX2dhbWUoKSB7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb2xvXzF2MV9idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiU29sbyAxdjEgZ2FtZSBzdGFydGVkXCIpO1xuXHRcdFx0aGFuZGxlVmlld1RyYW5zaXRpb25zKFwidnVlM1wiLCBcInZ1ZTJcIik7XG5cdFx0XHRzdGFydEdhbWUoKTtcblx0XHR9KTtcblx0fVxuXG5cdGluaXRFdmVudHMoKSB7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtdWx0aXBsYXllcl9idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiTXVsdGlwbGF5ZXIgMnYyIGdhbWUgc3RhcnRlZFwiKTtcblx0XHRcdGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInZ1ZTNcIiwgXCJ2dWUyXCIpO1xuXHRcdFx0c3RhcnRNdWx0aUdhbWUoKTtcblx0XHR9KTtcblx0fVxuXG5cdGluaXRfc29sb19nYW1lX2FpKCkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29sb19haV9idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiU29sbyBBSSBnYW1lIHN0YXJ0ZWRcIik7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUzXCIsIFwidnVlMlwiKTtcblx0XHRcdHN0YXJ0QUlfR2FtZSgpO1xuXHRcdH0pO1xuXHR9XG5cblx0Z2FtZV9tZW51KClcblx0e1xuXHRcdGNvbnN0IGJ0bl9qb3VlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5fam91ZXInKTtcblx0XHRjb25zdCB2aWV3MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3MScpO1xuXHRcdGNvbnN0IHZpZXcyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZXcyJyk7XG5cdFx0Y29uc3QgdmlldzMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldzMnKTtcblx0XHRjb25zdCB2aWV3NCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3NCcpO1xuXHRcdGNvbnN0IHZpZXcxX2J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3MV9idG4nKTtcblx0XHRjb25zdCBzZXR0aW5nc19idG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0dGluZ3NfYnRuJyk7XG5cdFx0Y29uc3Qgc29sbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzb2xvJyk7XG5cdFx0Y29uc3QgbXVsdGlwbGF5ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXVsdGlwbGF5ZXInKTtcblx0XHRjb25zdCBiYWNrX3RvX21lbnVfdmlldzMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19tZW51X3ZpZXczJyk7XG5cdFx0Y29uc3QgYmFja190b19tZW51X3ZpZXc0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tfdG9fbWVudV92aWV3NCcpO1xuXHRcdGNvbnN0IGJ0bl9iYWNrX2hvbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFjay1ob21lJyk7XG5cdFx0Y29uc3QgdmlldzUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldzUnKTtcblx0XHRjb25zdCB2aWV3NiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3NicpO1xuXHRcdGNvbnN0IHZpZXc3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZXc3Jyk7XG5cdFx0Y29uc3QgdmlldzggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldzgnKTtcblx0XHRjb25zdCBwcmVwYXJfZ2FtZV8xdjEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJlcGFyX2dhbWVfMXYxJyk7XG5cdFx0Y29uc3QgcHJlcGFyX2dhbmVfYWkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJlcGFyX2dhbmVfYWknKTtcblx0XHRjb25zdCBwcmVwYXJfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcmVwYXJfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IGJhY2tfdG9fbWVudV92aWV3NiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX21lbnVfdmlldzYnKTtcblx0XHRjb25zdCBiYWNrX3RvX21lbnVfdmlldzcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja190b19tZW51X3ZpZXc3Jyk7XG5cdFx0Y29uc3QgYmFja190b19tZW51X3ZpZXc4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tfdG9fbWVudV92aWV3OCcpO1xuXHRcdGNvbnN0IHBvd2VyVVAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG93ZXJVUCcpO1xuXHRcdGNvbnN0IG51bWJlcl9wb3dlclVQXzEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtYmVyX3Bvd2VyVVBfMScpO1xuXHRcdGNvbnN0IG51bWJlcl9wb3dlclVQXzMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtYmVyX3Bvd2VyVVBfMycpO1xuXHRcdGNvbnN0IG51bWJlcl9wb3dlclVQXzUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtYmVyX3Bvd2VyVVBfNScpO1xuXHRcdGNvbnN0IHBvd2VyX3NlbGVjdG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bvd2VyX3NlbGVjdG9yJyk7XG5cdFx0Y29uc3Qgc2tpbl9wZXJzbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdza2luX3BlcnNvJyk7XG5cdFx0Y29uc3QgYmFja190b19zZWxlY3RfbW9kZV92aWV3NiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc2Jyk7XG5cdFx0Y29uc3QgYmFja190b19zZWxlY3RfbW9kZV92aWV3NyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc3Jyk7XG5cdFx0Y29uc3QgYmFja190b19zZWxlY3RfbW9kZV92aWV3OCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrX3RvX3NlbGVjdF9tb2RlX3ZpZXc4Jyk7XG5cblx0XHRidG5fam91ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnSk9VRVIgYnV0dG9uIGNsaWNrZWQnKTtcblx0XHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YnRuX2pvdWVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0fSk7XG5cblx0XHR2aWV3MV9idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnTW9kZSBkZSBqZXV4IGJ1dHRvbiBjbGlja2VkJyk7XG5cdFx0XHRcblx0XHRcdGlmICh2aWV3NS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdHZpZXc1LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3Mi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdH0gXG5cdFx0XHRlbHNlIGlmICghdmlldzIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHR2aWV3Mi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXG5cblx0XHRzZXR0aW5nc19idG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR2aWV3Mi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc1LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXG5cdFx0c29sby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHZpZXcyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3MS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHRtdWx0aXBsYXllci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHZpZXcyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dmlldzQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3MS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGJ0bl9iYWNrX2hvbWUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHRpZiAoIXZpZXczLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdGNvbnNvbGUubG9nKCd2aWV3MyBpcyBhY3RpdmUnKTtcblx0XHRcdGJhY2tfdG9fbWVudV92aWV3My5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdFx0dmlldzMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3MS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmICghdmlldzQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ3ZpZXc0IGlzIGFjdGl2ZScpO1xuXHRcdFx0YmFja190b19tZW51X3ZpZXc0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0XHR2aWV3NC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0dmlldzIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcxLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0YnRuX2JhY2tfaG9tZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGlmICh2aWV3Mi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdHZpZXcyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHR2aWV3MS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0YnRuX2JhY2tfaG9tZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdFx0YnRuX2pvdWVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZpZXc1LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0dmlldzUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHZpZXcxLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRidG5fYmFja19ob21lLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRidG5fam91ZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRwcmVwYXJfZ2FtZV8xdjEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR2aWV3My5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc2LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3Ni5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXG5cdFx0cHJlcGFyX2dhbmVfYWkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR2aWV3My5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc3LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3Ny5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXHRcdHByZXBhcl9nYW1lX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0dmlldzQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3OC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzguY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHRiYWNrX3RvX21lbnVfdmlldzYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR2aWV3Ni5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXczLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3Ni5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXHRcdGJhY2tfdG9fbWVudV92aWV3Ny5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdCYWNrIHRvIG1lbnUgdmlldzcgY2xpY2tlZCcpO1xuXHRcdFx0dmlldzMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHR2aWV3Ny5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdGJhY2tfdG9fc2VsZWN0X21vZGVfdmlldzcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHRiYWNrX3RvX21lbnVfdmlldzguYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR2aWV3OC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHZpZXc0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0YmFja190b19zZWxlY3RfbW9kZV92aWV3OC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR9KTtcblxuXHRcdHBvd2VyVVAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRwb3dlclVQLmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKTtcblxuXHRcdFx0aWYgKHBvd2VyVVAuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaGVja2VkJykpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1Bvd2VyVVAgaXMgYWN0aXZlJyk7XG5cdFx0XHRcdHBvd2VyX3NlbGVjdG9yLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdQb3dlclVQIGlzIGluYWN0aXZlJyk7XG5cdFx0XHRcdHBvd2VyX3NlbGVjdG9yLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2dyZW5hZGUoKTtcblx0XHRcdFx0cmVzZXRfcG93ZXJVUF90ZWFtbWF0ZSgpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX2ludmVyc2VfcGxheWVyKCk7XG5cdFx0XHRcdHBvd2VyVVBfbmIgPSAwO1xuXHRcdFx0XHRwb3dlclVQX25iX211bHRpID0gMDtcblx0XHRcdH1cblx0XHR9KTtcblxuXG5cdFx0bnVtYmVyX3Bvd2VyVVBfMS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdG51bWJlcl9wb3dlclVQXzEuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpXG5cdFx0XHRudW1iZXJfcG93ZXJVUF8zLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdG51bWJlcl9wb3dlclVQXzUuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0Y29uc29sZS5sb2coJzEgcG93ZXJVUCBzZWxlY3RlZCBhbmQgMyBhbmQgNSB1bnNlbGVjdGVkJyk7XG5cdFx0XHRpbml0X25iX3Bvd2VyVVBfZ3JlbmFkZUZsYXNoKDEpO1xuXHRcdFx0aW5pdF9uYl9wb3dlclVQX3RlYW1tYXRlKDEpO1xuXHRcdFx0aW5pdF9wb3dlclVQX2ludmVyc2VfcGxheWVyKDEpO1xuXHRcdFx0cG93ZXJVUF9uYiA9IDE7XG5cblx0XHR9KTtcblxuXHRcdG51bWJlcl9wb3dlclVQXzMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF8zLmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKVxuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfMS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF81LmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdGNvbnNvbGUubG9nKCczIHBvd2VyVVAgc2VsZWN0ZWQgYW5kIDEgYW5kIDUgdW5zZWxlY3RlZCcpO1xuXHRcdFx0aW5pdF9uYl9wb3dlclVQX2dyZW5hZGVGbGFzaCgzKTtcblx0XHRcdGluaXRfbmJfcG93ZXJVUF90ZWFtbWF0ZSgzKTtcblx0XHRcdGluaXRfcG93ZXJVUF9pbnZlcnNlX3BsYXllcigzKTtcblx0XHRcdHBvd2VyVVBfbmIgPSAzO1xuXHRcdH0pO1xuXG5cdFx0bnVtYmVyX3Bvd2VyVVBfNS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdG51bWJlcl9wb3dlclVQXzUuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpXG5cdFx0XHRudW1iZXJfcG93ZXJVUF8xLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdG51bWJlcl9wb3dlclVQXzMuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0Y29uc29sZS5sb2coJzUgcG93ZXJVUCBzZWxlY3RlZCBhbmQgMSBhbmQgMyB1bnNlbGVjdGVkJyk7XG5cdFx0XHRpbml0X25iX3Bvd2VyVVBfZ3JlbmFkZUZsYXNoKDUpO1xuXHRcdFx0aW5pdF9uYl9wb3dlclVQX3RlYW1tYXRlKDUpO1xuXHRcdFx0aW5pdF9wb3dlclVQX2ludmVyc2VfcGxheWVyKDUpO1xuXHRcdFx0cG93ZXJVUF9uYiA9IDU7XG5cdFx0fSk7XG5cblx0XHRza2luX3BlcnNvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0c2tpbl9wZXJzby5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJyk7XG5cdFx0XHRjb25zb2xlLmxvZygnU2tpbiBwZXJzbyBzZWxlY3RlZCcpO1xuXHRcdH0pO1xuXG5cdFx0Y29uc3QgcG93ZXJVUF9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3dlclVQX211bHRpJyk7XG5cdFx0Y29uc3QgbnVtYmVyX3Bvd2VyVVBfMV9nYW1lX211bHRpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ251bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aScpO1xuXHRcdGNvbnN0IG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGknKTtcblx0XHRjb25zdCBudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpJyk7XG5cdFx0Y29uc3QgcG93ZXJfc2VsZWN0b3JfZ2FtZV9tdWx0aSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3dlcl9zZWxlY3Rvcl9nYW1lX211bHRpJyk7XG5cblx0XHRwb3dlclVQX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0cG93ZXJVUF9tdWx0aS5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJyk7XG5cblx0XHRcdGlmIChwb3dlclVQX211bHRpLmNsYXNzTGlzdC5jb250YWlucygnY2hlY2tlZCcpKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdQb3dlclVQIGlzIGFjdGl2ZScpO1xuXHRcdFx0XHRwb3dlcl9zZWxlY3Rvcl9nYW1lX211bHRpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdQb3dlclVQIGlzIGluYWN0aXZlJyk7XG5cdFx0XHRcdHBvd2VyX3NlbGVjdG9yX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdHJlc2V0X3Bvd2VyVVBfZ3JlbmFkZSgpO1xuXHRcdFx0XHRyZXNldF9wb3dlclVQX3RlYW1tYXRlKCk7XG5cdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cblx0XHRudW1iZXJfcG93ZXJVUF8xX2dhbWVfbXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF8xX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnRvZ2dsZSgnY2hlY2tlZCcpXG5cdFx0XHRudW1iZXJfcG93ZXJVUF8zX2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdGNvbnNvbGUubG9nKCcxIHBvd2VyVVAgc2VsZWN0ZWQgYW5kIDMgYW5kIDUgdW5zZWxlY3RlZCcpO1xuXHRcdFx0aW5pdF9uYl9wb3dlclVQX2dyZW5hZGVGbGFzaF90ZWFtX3BsYXllcigxKTtcblx0XHRcdGluaXRfcG93ZXJVUF9mcmVlemVfVGVhbV9wbGF5ZXIoMSk7XG5cdFx0XHRwb3dlclVQX25iX211bHRpID0gMTtcblx0XHR9KTtcblxuXHRcdG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5jbGFzc0xpc3QudG9nZ2xlKCdjaGVja2VkJylcblx0XHRcdG51bWJlcl9wb3dlclVQXzFfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRudW1iZXJfcG93ZXJVUF81X2dhbWVfbXVsdGkuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpO1xuXHRcdFx0Y29uc29sZS5sb2coJzMgcG93ZXJVUCBzZWxlY3RlZCBhbmQgMSBhbmQgNSB1bnNlbGVjdGVkJyk7XG5cdFx0XHRpbml0X25iX3Bvd2VyVVBfZ3JlbmFkZUZsYXNoX3RlYW1fcGxheWVyKDMpO1xuXHRcdFx0aW5pdF9wb3dlclVQX2ZyZWV6ZV9UZWFtX3BsYXllcigzKTtcblx0XHRcdHBvd2VyVVBfbmJfbXVsdGkgPSAzO1xuXHRcdH0pO1xuXG5cdFx0bnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfNV9nYW1lX211bHRpLmNsYXNzTGlzdC50b2dnbGUoJ2NoZWNrZWQnKVxuXHRcdFx0bnVtYmVyX3Bvd2VyVVBfMV9nYW1lX211bHRpLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKTtcblx0XHRcdG51bWJlcl9wb3dlclVQXzNfZ2FtZV9tdWx0aS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJyk7XG5cdFx0XHRjb25zb2xlLmxvZygnNSBwb3dlclVQIHNlbGVjdGVkIGFuZCAxIGFuZCAzIHVuc2VsZWN0ZWQnKTtcblx0XHRcdGluaXRfbmJfcG93ZXJVUF9ncmVuYWRlRmxhc2hfdGVhbV9wbGF5ZXIoNSk7XG5cdFx0XHRpbml0X3Bvd2VyVVBfZnJlZXplX1RlYW1fcGxheWVyKDUpO1xuXHRcdFx0cG93ZXJVUF9uYl9tdWx0aSA9IDU7XG5cdFx0fSk7XG5cblx0XHRpZiAoZ2V0VmFsdWVfbGVhdmVfZ2FtZSgpID09IHRydWUpXG5cdFx0e1xuXHRcdFx0cG93ZXJVUF9uYiA9IDA7XG5cdFx0XHRzZXRMZWF2ZUdhbWVWYXIoZmFsc2UpO1xuXHRcdH1cblx0fVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQb3dlclVQX3ZhbHVlKCkge1xuXHRyZXR1cm4gcG93ZXJVUF9uYjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBvd2VyVVBfdmFsdWVfbXVsdGkoKSB7XG5cdHJldHVybiBwb3dlclVQX25iX211bHRpO1xufSJdfQ==