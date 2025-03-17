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

        console.log("Freeze activé pour l'équipe 1");

        setTimeout(() => {
            isfreeze_team1 = false;
            console.log("Freeze terminé pour l'équipe 1");
        }, 5000); // Durée du freeze

        setTimeout(() => {
            canUsePowerUP_freeze_team1 = true;
            console.log("Freeze power-up rechargé pour l'équipe 1");
        }, 15000); // Cooldown du power-up
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

        console.log("Freeze activé pour l'équipe 2");

        setTimeout(() => {
            isfreeze_team2 = false;
            console.log("Freeze terminé pour l'équipe 2");
        }, 5000); // Durée du freeze

        setTimeout(() => {
            canUsePowerUP_freeze_team2 = true;
            console.log("Freeze power-up rechargé pour l'équipe 2");
        }, 15000); // Cooldown du power-up
    }
    return isfreeze_team2;
}

export { isfreeze_team1, isfreeze_team2 };
