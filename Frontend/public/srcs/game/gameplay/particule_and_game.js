import { getPlayer_1_win, getPlayer_2_win } from "./score.js";
import { currentSkinPlayer1, currentSkinPlayer2 } from "./solo/skin/init_skin_perso.js";

export function SpawnParticules_endGame(scene, x, y, z) {
    // Création du système de particules
	let player1_win = getPlayer_1_win();
	let player2_win = getPlayer_2_win();

	let _currentSkinPlayer1 = currentSkinPlayer1;
	let _currentSkinPlayer2 = currentSkinPlayer2;
    const particleSystem = new BABYLON.ParticleSystem("sparkler", 8000, scene);

    // Texture des particules (point lumineux)
    particleSystem.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/textures/flare.png", scene);

    // Position d'émission
	
    particleSystem.emitter = new BABYLON.Vector3(x, y, z);
    particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, 0, -0.1);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0.2, 0.1);

    // Couleurs des étincelles (jaune/blanc/orange)
	if (player1_win)
	{
		if (_currentSkinPlayer1 == 2)
		{
			particleSystem.color1 = new BABYLON.Color4(1.0, 0.0, 0.0, 1.0); // Rouge vif
			particleSystem.color2 = new BABYLON.Color4(0.8, 0.0, 0.0, 1.0); // Rouge plus foncé
			particleSystem.colorDead = new BABYLON.Color4(0.4, 0.0, 0.0, 0.0); // Disparition en rouge foncé
			
		}
		else if (_currentSkinPlayer1 == 1)
		{
			particleSystem.color1 = new BABYLON.Color4(0.0, 0.0, 1.0, 1.0); // Bleu vif
			particleSystem.color2 = new BABYLON.Color4(0.0, 0.0, 0.8, 1.0); // Bleu plus foncé
			particleSystem.colorDead = new BABYLON.Color4(0.0, 0.0, 0.4, 0.0); // Disparition en bleu très foncé
		}
		else if (_currentSkinPlayer1 == 0)
		{
			particleSystem.color1 = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0); // Blanc
			particleSystem.color2 = new BABYLON.Color4(0.8, 0.8, 0.8, 1.0); // Blanc plus doux
			particleSystem.colorDead = new BABYLON.Color4(0.6, 0.6, 0.6, 0.0); // Disparition en gris clair
		}
		else if (_currentSkinPlayer1 == 3)
		{
			particleSystem.color1 = new BABYLON.Color4(0.0, 1.0, 0.0, 1.0); // Vert vif
			particleSystem.color2 = new BABYLON.Color4(0.0, 0.8, 0.0, 1.0); // Vert plus foncé
			particleSystem.colorDead = new BABYLON.Color4(0.0, 0.4, 0.0, 0.0); // Disparition en vert foncé
		}
	}
	else if (player2_win)
	{
		if (_currentSkinPlayer2 == 2)
		{
			particleSystem.color1 = new BABYLON.Color4(1.0, 0.0, 0.0, 1.0); // Rouge vif
			particleSystem.color2 = new BABYLON.Color4(0.8, 0.0, 0.0, 1.0); // Rouge plus foncé
			particleSystem.colorDead = new BABYLON.Color4(0.4, 0.0, 0.0, 0.0); // Disparition en rouge foncé
			
		}
		else if (_currentSkinPlayer2 == 1)
		{
			particleSystem.color1 = new BABYLON.Color4(0.0, 0.0, 1.0, 1.0); // Bleu vif
			particleSystem.color2 = new BABYLON.Color4(0.0, 0.0, 0.8, 1.0); // Bleu plus foncé
			particleSystem.colorDead = new BABYLON.Color4(0.0, 0.0, 0.4, 0.0); // Disparition en bleu très foncé
		}
		else if (_currentSkinPlayer2 == 0)
		{
			particleSystem.color1 = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0); // Blanc
			particleSystem.color2 = new BABYLON.Color4(0.8, 0.8, 0.8, 1.0); // Blanc plus doux
			particleSystem.colorDead = new BABYLON.Color4(0.6, 0.6, 0.6, 0.0); // Disparition en gris clair
		}
		else if (_currentSkinPlayer2 == 3)
		{
			particleSystem.color1 = new BABYLON.Color4(0.0, 1.0, 0.0, 1.0); // Vert vif
			particleSystem.color2 = new BABYLON.Color4(0.0, 0.8, 0.0, 1.0); // Vert plus foncé
			particleSystem.colorDead = new BABYLON.Color4(0.0, 0.4, 0.0, 0.0); // Disparition en vert foncé
		}
	}


    // Taille des particules (très petites pour des étincelles)
    particleSystem.minSize = 0.05;
    particleSystem.maxSize = 1;

    // Durée de vie courte pour un effet crépitant
    particleSystem.minLifeTime = 0.2;
    particleSystem.maxLifeTime = 1;

    // Émission très rapide pour un effet dense
    particleSystem.emitRate = 15000;

    // Vitesse aléatoire pour donner un effet explosif
    particleSystem.minEmitPower = 2;
    particleSystem.maxEmitPower = 6;
    particleSystem.updateSpeed = 0.005; // Mouvements rapides

    // Directions aléatoires pour un effet "crépitant"
    particleSystem.direction1 = new BABYLON.Vector3(-2, 5, -2);
    particleSystem.direction2 = new BABYLON.Vector3(2, 7, 2);

    // Gravité légère pour faire flotter les étincelles
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);

    // Ajout d’un effet de scintillement
    particleSystem.minAngularSpeed = -Math.PI;
    particleSystem.maxAngularSpeed = Math.PI;

    // Effet lumineux
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;

    // Démarrer les particules
    particleSystem.start();

    console.log("Effet d’étincelles activé wdwdwadwa! 🎇");

    return particleSystem;
}


export function SpawnParticules_GOAL(scene, x, y, z, isLeft) {
    // Création du système de particules
    const particleSystem = new BABYLON.ParticleSystem("sparkler", 8000, scene);
	let _currentSkinPlayer1 = currentSkinPlayer1;
	let _currentSkinPlayer2 = currentSkinPlayer2;

	console.log("currentSkinPlayer1", _currentSkinPlayer1);
	console.log("currentSkinPlayer2", _currentSkinPlayer2);

    // Texture des particules (point lumineux)
    particleSystem.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/textures/flare.png", scene);

    // Position d'émission
    particleSystem.emitter = new BABYLON.Vector3(x, y, z);
    particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, 0, -0.1);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0.2, 0.1);

    // Couleurs des étincelles (jaune/blanc/orange)
	if (isLeft)
	{
		if (_currentSkinPlayer1 == 2)
		{
			particleSystem.color1 = new BABYLON.Color4(1.0, 0.0, 0.0, 1.0); // Rouge vif
			particleSystem.color2 = new BABYLON.Color4(0.8, 0.0, 0.0, 1.0); // Rouge plus foncé
			particleSystem.colorDead = new BABYLON.Color4(0.4, 0.0, 0.0, 0.0); // Disparition en rouge foncé
		}
		else if (_currentSkinPlayer1 == 1)
		{
			particleSystem.color1 = new BABYLON.Color4(0.0, 0.0, 1.0, 1.0); // Bleu vif
			particleSystem.color2 = new BABYLON.Color4(0.0, 0.0, 0.8, 1.0); // Bleu plus foncé
			particleSystem.colorDead = new BABYLON.Color4(0.0, 0.0, 0.4, 0.0); // Disparition en bleu très foncé
		}
		else if (_currentSkinPlayer1 == 0)
		{
			particleSystem.color1 = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0); // Blanc
			particleSystem.color2 = new BABYLON.Color4(0.8, 0.8, 0.8, 1.0); // Blanc plus doux
			particleSystem.colorDead = new BABYLON.Color4(0.6, 0.6, 0.6, 0.0); // Disparition en gris clair
		}
		else if (_currentSkinPlayer1 == 3)
		{
			particleSystem.color1 = new BABYLON.Color4(0.0, 1.0, 0.0, 1.0); // Vert vif
			particleSystem.color2 = new BABYLON.Color4(0.0, 0.8, 0.0, 1.0); // Vert plus foncé
			particleSystem.colorDead = new BABYLON.Color4(0.0, 0.4, 0.0, 0.0); // Disparition en vert foncé
		}

	}
	else
	{
		if (_currentSkinPlayer2 == 2)
		{
			particleSystem.color1 = new BABYLON.Color4(1.0, 0.0, 0.0, 1.0); // Rouge vif
			particleSystem.color2 = new BABYLON.Color4(0.8, 0.0, 0.0, 1.0); // Rouge plus foncé
			particleSystem.colorDead = new BABYLON.Color4(0.4, 0.0, 0.0, 0.0); // Disparition en rouge foncé
		}
		else if (_currentSkinPlayer2 == 1)
		{
			particleSystem.color1 = new BABYLON.Color4(0.0, 0.0, 1.0, 1.0); // Bleu vif
			particleSystem.color2 = new BABYLON.Color4(0.0, 0.0, 0.8, 1.0); // Bleu plus foncé
			particleSystem.colorDead = new BABYLON.Color4(0.0, 0.0, 0.4, 0.0); // Disparition en bleu très foncé
		}
		else if (_currentSkinPlayer2 == 0)
		{
			particleSystem.color1 = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0); // Blanc
			particleSystem.color2 = new BABYLON.Color4(0.8, 0.8, 0.8, 1.0); // Blanc plus doux
			particleSystem.colorDead = new BABYLON.Color4(0.6, 0.6, 0.6, 0.0); // Disparition en gris clair
		}
		else if (_currentSkinPlayer2 == 3)
		{
			particleSystem.color1 = new BABYLON.Color4(0.0, 1.0, 0.0, 1.0); // Vert vif
			particleSystem.color2 = new BABYLON.Color4(0.0, 0.8, 0.0, 1.0); // Vert plus foncé
			particleSystem.colorDead = new BABYLON.Color4(0.0, 0.4, 0.0, 0.0); // Disparition en vert foncé
		}
	}
		

    // Taille des particules (très petites pour des étincelles)
    particleSystem.minSize = 0.05;
    particleSystem.maxSize = 2;

    // Durée de vie courte pour un effet crépitant
    particleSystem.minLifeTime = 0.2;
    particleSystem.maxLifeTime = 2;

    // Émission très rapide pour un effet dense
    particleSystem.emitRate = 15000;

    // Vitesse aléatoire pour donner un effet explosif
    particleSystem.minEmitPower = 2;
    particleSystem.maxEmitPower = 6;
    particleSystem.updateSpeed = 0.005; // Mouvements rapides

    // Directions aléatoires pour un effet "crépitant"
    particleSystem.direction1 = new BABYLON.Vector3(-2, 5, -2);
    particleSystem.direction2 = new BABYLON.Vector3(2, 7, 2);

    // Gravité légère pour faire flotter les étincelles
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);

    // Ajout d’un effet de scintillement
    particleSystem.minAngularSpeed = -Math.PI;
    particleSystem.maxAngularSpeed = Math.PI;

    // Effet lumineux
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;

    // Démarrer les particules
    particleSystem.start();

	setTimeout(() => {
		particleSystem.stop();
	}, 1000);

    console.log("Effet d’étincelles activé wdwdwadwa! 🎇");

    return particleSystem;
}