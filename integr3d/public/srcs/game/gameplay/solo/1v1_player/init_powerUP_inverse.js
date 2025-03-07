let nb_powerUP_inverse_player1 = 0;
let nb_powerUP_inverse_player2 = 0;

export function init_powerUP_inverse_player(number) {
	nb_powerUP_inverse_player1 = number;
	nb_powerUP_inverse_player2 = number;
}

let canUsePowerUP_inverse_player1 = true;
let canUsePowerUP_inverse_player2 = true;


export function inverse_player1()
{
	if (nb_powerUP_inverse_player1 > 0 && canUsePowerUP_inverse_player1)
	{
		canUsePowerUP_inverse_player1 = false;
		nb_powerUP_inverse_player1--;

		setTimeout(() => {
			canUsePowerUP_inverse_player1 = true;
			console.log("inverse power up recharger");
		}, 10000);
	}
}

export function inverse_player2()
{
	if (nb_powerUP_inverse_player2 > 0 && canUsePowerUP_inverse_player2)
	{
		canUsePowerUP_inverse_player2 = false;
		nb_powerUP_inverse_player2--;

		setTimeout(() => {
			canUsePowerUP_inverse_player2 = true;
			console.log("inverse power up recharger");
		}, 10000);
	}
}