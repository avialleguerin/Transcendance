let scoreLeft = 0;
let scoreRight = 0;
let scoreLeftMesh = null;
let scoreRightMesh = null;

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
            console.log(`Chiffre ${score} chargé avec succès !`);

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
                rootMesh.scaling = new BABYLON.Vector3(5, 5, 5);
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

                container.scaling = new BABYLON.Vector3(5, 5, 5);
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
}

export function resetScore() {
    scoreLeft = 0;
    scoreRight = 0;
    loadScoreModel(0, 'left', true);
    loadScoreModel(0, 'right', false);
}


export function destroy_score() {
    if (scoreLeftMesh) {
        scoreLeftMesh.dispose();
    }

    if (scoreRightMesh) {
        scoreRightMesh.dispose();
    }
}