// import { getScene } from "../../babylon.js";
// const scene = getScene();
let currentSkinPlayer1 = 0;
let currentSkinPlayer2 = 0;
let defaultSkinPlayer1 = 0;
let defaultSkinPlayer2 = 0;

const skinPaths = [
    { name: "player_skin_1", path: "/srcs/game/assets/player_skin/", file: "player_blanc.glb" },
    { name: "player_skin_2", path: "/srcs/game/assets/player_skin/", file: "player_bleuv2.glb" },
    { name: "player_skin_3", path: "/srcs/game/assets/player_skin/", file: "player_rougev2.glb" },
    { name: "player_skin_4", path: "/srcs/game/assets/player_skin/", file: "player_vert.glb" }
];

let player1Skins = [];
let player2Skins = [];

// Fonction pour charger les skins
// Fonction pour charger les skins, avec promesses pour garantir l'ordre
function loadSkin(skin, scene) {
    return new Promise((resolve, reject) => {
        BABYLON.SceneLoader.ImportMesh("", skin.path, skin.file, scene, (meshes) => {
            const rootMesh = meshes.find(mesh => mesh.name === "__root__");
            if (rootMesh) {
                rootMesh.position = new BABYLON.Vector3(0, 100, -15); // Modifier selon la position voulue
                rootMesh.scaling = new BABYLON.Vector3(4, 4, 4);
                rootMesh.rotation = new BABYLON.Vector3(0, 0, 0);
                rootMesh.metadata = { isPlayer: true };

                rootMesh.setEnabled(false); // Masquer tous les skins au départ
                resolve(rootMesh); // Résoudre la promesse avec le mesh
            } else {
                reject(`Erreur lors du chargement de ${skin.name}`);
            }
        });
    });
}

// Fonction pour charger tous les skins dans l'ordre
function loadSkinsForPlayer(skinPaths, scene, playerSkins, offsetX) {
    let loadPromises = skinPaths.map((skin) => loadSkin(skin, scene)); // Créer un tableau de promesses

    // Attendre que toutes les promesses soient résolues dans l'ordre
    Promise.all(loadPromises)
        .then((meshes) => {
            meshes.forEach((mesh, index) => {
                mesh.position.x += offsetX; // Modifier la position de chaque mesh selon le joueur
                playerSkins.push(mesh); // Ajouter chaque skin au tableau du joueur
                console.log(`Skin ${skinPaths[index].name} chargé avec succès pour l'index ${index}`);
            });
        })
        .catch((error) => {
            console.error(error);
        });
}

// Initialiser les skins pour Player 1
export function init_skins_perso_player1(scene) {
    loadSkinsForPlayer(skinPaths, scene, player1Skins, -15); // Positionner Player 1 à X = 25
}

// Initialiser les skins pour Player 2
export function init_skins_perso_player2(scene) {
    loadSkinsForPlayer(skinPaths, scene, player2Skins, -25); // Positionner Player 2 à X = -25
}

export function enable_skin_perso_player1() {
    if (player1Skins.length === 0)
	{
		console.log("player1Skins.length === 0");
		return;
	}
    // Désactiver tous les skins avant d'en activer un
    player1Skins.forEach(skin => skin.setEnabled(false));

	console.log("defaultSkinPlayer1", defaultSkinPlayer1);
    // Activer le skin blanc (default)

	player1Skins[defaultSkinPlayer1].setEnabled(true);
	console.log("defaultSkinPlayer1wwww", defaultSkinPlayer1);

    // Mettre à jour le skin actuel
    // currentSkinPlayer1 = defaultSkinPlayer1;
	console.log("currentSkinPlayer1", currentSkinPlayer1);
}

export function enable_skin_perso_player2() {
    if (player2Skins.length === 0) return;

    player2Skins.forEach(skin => skin.setEnabled(false));

	console.log("defaultSkinPlayer2", defaultSkinPlayer2);
    player2Skins[defaultSkinPlayer2].setEnabled(true);
	console.log("defaultSkinPlayer2", defaultSkinPlayer2);

    // currentSkinPlayer2 = defaultSkinPlayer2;
	console.log("currentSkinPlayer2", currentSkinPlayer2);
}

export function disable_skin_perso_player1() {
    if (player1Skins.length === 0) return;

    // Désactiver uniquement le skin actuellement actif
    player1Skins[currentSkinPlayer1].setEnabled(false);
	currentSkinPlayer1 = defaultSkinPlayer1;

	console.log("currentSkinPlayer1", currentSkinPlayer1);
}

export function disable_skin_perso_player2() {
    if (player2Skins.length === 0) return;

    player2Skins[currentSkinPlayer2].setEnabled(false);
	currentSkinPlayer2 = defaultSkinPlayer2;

	console.log("currentSkinPlayer2", currentSkinPlayer2);
}


export function disable_skin_perso_player1_and_save() {
    if (player1Skins.length === 0) return;

    // Désactiver uniquement le skin actuellement actif
    player1Skins[currentSkinPlayer1].setEnabled(false);

	console.log("currentSkinPlayer1", currentSkinPlayer1);
}

export function disable_skin_perso_player2_and_save() {
    if (player2Skins.length === 0) return;

    player2Skins[currentSkinPlayer2].setEnabled(false);

	console.log("currentSkinPlayer2", currentSkinPlayer2);
}


export function switch_skin_perso_player1_right() {
    if (player1Skins.length === 0) return;

    // Désactiver l'ancien skin
    player1Skins[currentSkinPlayer1].setEnabled(false);

    // Changer d'index
    currentSkinPlayer1 = (currentSkinPlayer1 + 1) % player1Skins.length;

    // Activer le nouveau skin
    player1Skins[currentSkinPlayer1].setEnabled(true);
	console.log("currentSkinPlayer1", currentSkinPlayer1);
}

export function switch_skin_perso_player1_left() {
    if (player1Skins.length === 0) return;

    player1Skins[currentSkinPlayer1].setEnabled(false);
    currentSkinPlayer1 = (currentSkinPlayer1 - 1 + player1Skins.length) % player1Skins.length;
    player1Skins[currentSkinPlayer1].setEnabled(true);
	console.log("currentSkinPlayer1", currentSkinPlayer1);
}

export function switch_skin_perso_player2_right() {
    if (player2Skins.length === 0) return;

    player2Skins[currentSkinPlayer2].setEnabled(false);
    currentSkinPlayer2 = (currentSkinPlayer2 + 1) % player2Skins.length;
    player2Skins[currentSkinPlayer2].setEnabled(true);
	console.log("currentSkinPlayer2", currentSkinPlayer2);
}

export function switch_skin_perso_player2_left() {
    if (player2Skins.length === 0) return;

    player2Skins[currentSkinPlayer2].setEnabled(false);
    currentSkinPlayer2 = (currentSkinPlayer2 - 1 + player2Skins.length) % player2Skins.length;
    player2Skins[currentSkinPlayer2].setEnabled(true);

	console.log("currentSkinPlayer2", currentSkinPlayer2);
}


export { currentSkinPlayer1, currentSkinPlayer2 };