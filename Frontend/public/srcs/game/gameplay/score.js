import { handleViewTransitions } from "./views/camera.js";
import { enable_skin_perso_player_first_and_second } from "./solo/skin/init_skin_player_podium.js";

let scoreLeft = 0;
let scoreRight = 0;
let scoreLeftMesh = null;
let scoreRightMesh = null;
let gameIsFinished = false;

let isPlayer1_win = false;
let isPlayer2_win = false;

export function getPlayer_1_win() {
    return isPlayer1_win;
}

export function getPlayer_2_win() {
    return isPlayer2_win;
}

export function loadScoreModel(score, position, isLeft) {
    // Si un mesh existe déjà pour ce côté, le supprimer
    if (isLeft && scoreLeftMesh) {
        scoreLeftMesh.dispose();
    } else if (!isLeft && scoreRightMesh) {
        scoreRightMesh.dispose();
    }

    // Charger le nouveau modèle
    BABYLON.SceneLoader.ImportMesh(
        "",
        "/srcs/game/assets/score_object/",
        `3d_number_-_${score}_${getNumberWord(score)}.glb`,
        scene,
        function (newMeshes, particleSystems, skeletons, animationGroups) {
            
            // Trouver le mesh racine
            let rootMesh = null;
            newMeshes.forEach(mesh => {
                if (!mesh.parent) {
                    rootMesh = mesh;
                }
            });

            // Configurer le mesh
            if (rootMesh) {
                // Appliquer la position en fonction du côté
                if (isLeft) {
                    rootMesh.position = new BABYLON.Vector3(-65, 325, -80);
                    scoreLeftMesh = rootMesh;
                } else {
                    rootMesh.position = new BABYLON.Vector3(-65, 325, -65);
                    scoreRightMesh = rootMesh;
                }
                
                // Appliquer les transformations communes
                rootMesh.scaling = new BABYLON.Vector3(10, 10, 10);
                rootMesh.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
            } else {
                // Créer un conteneur si pas de mesh racine
                let container = new BABYLON.TransformNode("scoreContainer", scene);
                newMeshes.forEach(mesh => {
                    mesh.setParent(container);
                });
                
                // Configurer le conteneur
                if (isLeft) {
                    container.position = new BABYLON.Vector3(-65, 325, -80);
                    scoreLeftMesh = container;
                } else {
                    container.position = new BABYLON.Vector3(-65, 325, -65);
                    scoreRightMesh = container;
                }
                
                container.scaling = new BABYLON.Vector3(10, 10, 10);
                container.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
            }
        }
    );
}

export function getNumberWord(number) {
    const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    return words[number] || 'zero';
}


export function updateScore(side) {
    if (side === 'left') {
        scoreLeft++;
        if (scoreLeft > 9) scoreLeft = 0;
        loadScoreModel(scoreLeft, 'left', true);
    } else if (side === 'right') {
        scoreRight++;
        if (scoreRight > 9) scoreRight = 0;
        loadScoreModel(scoreRight, 'right', false);
    }
    if (scoreLeft === 1 || scoreRight === 1) {
        SetIsGameFinished(true);
        if (scoreLeft === 1)
        {
            isPlayer1_win = true;
            isPlayer2_win = false;
        }
        else
        {
            isPlayer1_win = false;
            isPlayer2_win = true;
        }
        handleViewTransitions('winner', true);
        enable_skin_perso_player_first_and_second();
    }
}

export function resetScore() {
    scoreLeft = 0;
    scoreRight = 0;
}

export function destroy_score() {
    // D'abord détruire les modèles existants
    if (scoreLeftMesh) {
        scoreLeftMesh.dispose();
    }
    if (scoreRightMesh) {
        scoreRightMesh.dispose();
    }
    
    // Réinitialiser les scores sans charger de nouveaux modèles
    resetScore();
    
    // Effacer les références
    scoreLeftMesh = null;
    scoreRightMesh = null;
}

// Fonction séparée pour charger les modèles de score
export function initScoreDisplay() {
    loadScoreModel(scoreLeft, 'left', true);
    loadScoreModel(scoreRight, 'right', false);
}

export function isGameFinished() {
    return gameIsFinished;
}

export function SetIsGameFinished(value) {
    gameIsFinished = value;
}


export { gameIsFinished };