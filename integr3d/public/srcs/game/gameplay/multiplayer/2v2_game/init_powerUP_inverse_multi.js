let nb_powerUP_inverse_Team_player1_2 = 0;
let nb_powerUP_inverse_Team_player3_4 = 0;

export function init_powerUP_inverse_Team_player(number) {
	nb_powerUP_inverse_Team_player1_2 = number;
	nb_powerUP_inverse_Team_player3_4 = number;
}

let canUsePowerUP_inverse_player1 = true;
let canUsePowerUP_inverse_player2 = true;


export function inverse_Team_player1_2()
{
	if (nb_powerUP_inverse_Team_player1_2 > 0 && canUsePowerUP_inverse_player1)
	{
		canUsePowerUP_inverse_player1 = false;
		nb_powerUP_inverse_Team_player1_2--;

		setTimeout(() => {
			canUsePowerUP_inverse_player1 = true;
			console.log("inverse power up recharger");
		}, 10000);
	}
}

export function inverse_Team_player3_4()
{
	if (nb_powerUP_inverse_Team_player3_4 > 0 && canUsePowerUP_inverse_player2)
	{
		canUsePowerUP_inverse_player2 = false;
		nb_powerUP_inverse_Team_player3_4--;

		setTimeout(() => {
			canUsePowerUP_inverse_player2 = true;
			console.log("inverse power up recharger");
		}, 10000);
	}
}