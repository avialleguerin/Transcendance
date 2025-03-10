let nb_powerUP_inverse_player1 = 0;
let nb_powerUP_inverse_player2 = 0;

export function init_powerUP_inverse_player(number) {
	nb_powerUP_inverse_player1 = number;
	nb_powerUP_inverse_player2 = number;
}

let canUsePowerUP_inverse_player1 = true;
let canUsePowerUP_inverse_player2 = true;
let is_Inverse_team1 = false;
let is_Inverse_team2 = false;


export function inverse_player1()
{
	if (nb_powerUP_inverse_player1 > 0 && canUsePowerUP_inverse_player1)
	{
		nb_powerUP_inverse_player1--;
		canUsePowerUP_inverse_player1 = false;
		is_Inverse_team1 = true;

		setTimeout(() => {
			is_Inverse_team1 = false;
			console.log("inverse power up fini");
		}, 5000);

		setTimeout(() => {
			canUsePowerUP_inverse_player1 = true;
			console.log("inverse power up recharger");
		}, 15000);
	}
	return is_Inverse_team1;
}

export function inverse_player2()
{
	if (nb_powerUP_inverse_player2 > 0 && canUsePowerUP_inverse_player2)
	{
		nb_powerUP_inverse_player2--;
		canUsePowerUP_inverse_player2 = false;
		is_Inverse_team2 = true;

		setTimeout(() => {
			is_Inverse_team2 = false;
			console.log("inverse power up fini");
		}, 5000);

		setTimeout(() => {
			canUsePowerUP_inverse_player2 = true;
			console.log("inverse power up recharger");
		}, 15000);
	}
	return is_Inverse_team2;
}

export { is_Inverse_team1, is_Inverse_team2 };