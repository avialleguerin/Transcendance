let nb_powerUP_freeze_Team_player1_2 = 0;
let nb_powerUP_freeze_Team_player3_4 = 0;

export function init_powerUP_freeze_Team_player(number) {
	nb_powerUP_freeze_Team_player1_2 = number;
	nb_powerUP_freeze_Team_player3_4 = number;
}

export function reset_powerUP_freeze_Team_player() {
	nb_powerUP_freeze_Team_player1_2 = 0;
	nb_powerUP_freeze_Team_player3_4 = 0;
}

let isfreeze_team1 = false;
let isfreeze_team2 = false;
let canUsePowerUP_freeze_team1 = true;
let canUsePowerUP_freeze_team2 = true;

export function activateFreezeTeam1()
{
	if (nb_powerUP_freeze_Team_player3_4 > 0 && canUsePowerUP_freeze_team1)
	{
		nb_powerUP_freeze_Team_player3_4--;
		isfreeze_team1 = true;
		canUsePowerUP_freeze_team1 = false;


		setTimeout(() => {
			isfreeze_team1 = false;
		}, 5000);

		setTimeout(() => {
			canUsePowerUP_freeze_team1 = true;
		}, 15000);
	}
	return isfreeze_team1;
}

export function activateFreezeTeam2()
{
	if (nb_powerUP_freeze_Team_player1_2 > 0 && canUsePowerUP_freeze_team2)
	{
		nb_powerUP_freeze_Team_player1_2--;
		isfreeze_team2 = true;
		canUsePowerUP_freeze_team2 = false;

		setTimeout(() => {
			isfreeze_team2 = false;
		}, 5000);

		setTimeout(() => {
			canUsePowerUP_freeze_team2 = true;
		}, 15000);
	}
	return isfreeze_team2;
}

export { isfreeze_team1, isfreeze_team2 };
