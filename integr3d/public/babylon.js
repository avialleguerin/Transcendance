const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    antialias: true,
    adapToDeviceRatio: true
});

// Configuration de la scène avec une meilleure qualité
window.scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
scene.imageProcessingConfiguration.contrast = 1.2;
scene.imageProcessingConfiguration.exposure = 1.0;
scene.imageProcessingConfiguration.toneMappingEnabled = true;
// scene.collisionsEnabled = true;




// Amélioration de la qualité globale
scene.getEngine().setHardwareScalingLevel(1.0);
scene.performancePriority = BABYLON.Scene.PRIORITY_ANTIALIAS;

// Création de la caméra
window.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(7.860370854357264, 4, -55.57231601704761), scene);
camera.attachControl(canvas, true);
camera.position = new BABYLON.Vector3(107.45137114956808, 350.16014619598326, -71.0351214961887),
camera.rotation = new BABYLON.Vector3(0.3689776126123451, -1.5805112517089825, 0)
camera.minZ = 0.1;
camera.maxZ = 1000;

// Configuration de l'anti-aliasing FXAA
const pipeline = new BABYLON.DefaultRenderingPipeline(
    "defaultPipeline", 
    true, 
    scene,
    [camera]
);
pipeline.samples = 8;
pipeline.fxaaEnabled = true;
pipeline.sharpenEnabled = true;
pipeline.sharpen.edgeAmount = 0.3;


scene.getEngine().setHardwareScalingLevel(1.0);
scene.performancePriority = BABYLON.Scene.PRIORITY_ANTIALIAS;

// Ajout d'une lumière ambiante
const ambientLight = new BABYLON.HemisphericLight(
    "ambientLight",
    new BABYLON.Vector3(0, 1, 0),
    scene
);
ambientLight.intensity = 0.8;

// Chargement du stade
BABYLON.SceneLoader.Append("/3d_object/", "ImageToStl.com_football_stadiumv2.glb", scene, function () {
    console.log("Stade chargé avec succès !");

    // scene.meshes.forEach(m => {
    //     console.log("Nom du mesh :", m.name);
    // });
    
    scene.meshes.forEach(m => {
        if (m.name === "test6") { // Remplace par le nom correct du mesh principal
            m.scaling = new BABYLON.Vector3(0, 0, 0);
            m.position = new BABYLON.Vector3(0, 0, 0);
            // console.log("Scale appliqué sur :", m.name);
        }
    });
});

BABYLON.SceneLoader.ImportMesh("", "/3d_object/", "versionFinalV2.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
    console.log("Modèle chargé avec succès !");

    // Trouver le mesh racine (parent)
    let rootMesh = null;
    newMeshes.forEach(mesh => {
        if (!mesh.parent) {
            rootMesh = mesh;
            // console.log("Mesh racine trouvpyé:", mesh.name);
        }
    });

    // Si on trouve un mesh racine, on le déplace
    if (rootMesh) {
        rootMesh.position = new BABYLON.Vector3(0, 100, 0);
    } else {
        // Si pas de mesh racine, on crée un conteneur
        let container = new BABYLON.TransformNode("container", scene);
        newMeshes.forEach(mesh => {
            mesh.setParent(container);
        });
        container.position = new BABYLON.Vector3(0, 100, 0);
    }

    // Afficher la hiérarchie pour debug
    // newMeshes.forEach(mesh => {
    //     console.log(`Mesh: ${mesh.name}, Parent: ${mesh.parent ? mesh.parent.name : 'pas de parent'}`);
    // });
});



BABYLON.SceneLoader.ImportMesh("", "/3d_object/", "ImageToStl.com_footballterraindejeuxv2.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
    console.log("Modèle chargé avec succès !");

    // Trouver le mesh racine (parent)
    let rootMesh = null;
    newMeshes.forEach(mesh => {
        if (!mesh.parent) {
            rootMesh = mesh;
            // console.log("Mesh racine trouvé:", mesh.name);
        }
    });

    // Si on trouve un mesh racine, on le déplace
    if (rootMesh) {
        rootMesh.position = new BABYLON.Vector3(0, 300, 0);
    } else {
        // Si pas de mesh racine, on crée un conteneur
        let test = new BABYLON.TransformNode("test", scene);
        newMeshes.forEach(mesh => {
            mesh.setParent(test);
        });
        test.position = new BABYLON.Vector3(0, 300, 0);
    }

    // Afficher la hiérarchie pour debug
    // newMeshes.forEach(mesh => {
    //     console.log(`Mesh: ${mesh.name}, Parent: ${mesh.parent ? mesh.parent.name : 'pas de parent'}`);
    // });
});





const environment = scene.createDefaultEnvironment({
    createSkybox: false,
    // skyboxSize: 1000,
    // skyboxColor: new BABYLON.Color3.Teal(),
    CreateGround: true,
    enableGroundShadow: true,
    groundYBias: 1
});

const skysphere = BABYLON.MeshBuilder.CreateSphere("skysphere", {
    diameter: 1000,
    segments: 32  // Plus de segments pour une meilleure qualité visuelle
}, scene);

// Matériau pour le ciel
const skyMaterial = new BABYLON.StandardMaterial("skyMaterial", scene);
skyMaterial.backFaceCulling = false; // Affiche l'intérieur de la sphère
skyMaterial.diffuseTexture = new BABYLON.Texture("/skybox/skybox.jpg", scene); // Remplace par ton image
skyMaterial.diffuseTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE; // Mode sphérique
skyMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // Pas de reflets brillants
skyMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1); // Rend l'image lumineuse, sans dépendre de la lumière

// Application du matériau à la sphère
skysphere.material = skyMaterial;
skysphere.isPickable = false; // Empêche l'interaction avec la sphère
skysphere.infiniteDistance = true; // Reste fixe par rapport à la caméra


skysphere.scaling.y = -1;


// BABYLON.SceneLoader.ImportMesh("", "/3d_object/", "jongleAnnimationV4.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {

//     newMeshes.forEach(mesh => {
//         if (mesh.material) {
//             mesh.material.transparencyMode = 0;
//             mesh.material.backFaceCulling = false;
//             if (mesh.material.pbr) {
//                 mesh.material.pbr.usePhysicalLightFalloff = true;
//             }
//         }
//     });

//     let perso = newMeshes.find(mesh => mesh.name === "__root__");
//     if (perso) {
//         perso.scaling = new BABYLON.Vector3(3, 3, 3);
//         perso.position = new BABYLON.Vector3(-80, 2, -55);
//         perso.rotation = new BABYLON.Vector3(0, Math.PI/4, 0);
//     }

//     // Stopper toutes les animations d'abord
//     animationGroups.forEach(anim => {
//         anim.stop();
//     });

//     // Démarrer seulement l'animation de la balle et l'animation principale
//     const ballAnimation = animationGroups.find(anim => anim.name === "Ball low_Baked_0Action");
//     const mainAnimation = animationGroups.find(anim => anim.name === "Armature.006|mixamo.com|Layer0"); // ou Layer0.001
// 	// const mainAnimation2 = animationGroups.find(anim => anim.name === "Armature.001|mixamo.com|Layer0"); // ou Layer0.001


//     if (ballAnimation && mainAnimation) {
//         ballAnimation.start(true);
// 		mainAnimation.start(true);
//     }

// 	// if (mainAnimation2 && mainAnimation2 !== mainAnimation) {
// 	// 	mainAnimation2.start(true);
// 	// 	console.log("Animation principale 2 démarrée");
// 	// }

//     if (typeof controlPerso === "function") {
//         controlPerso(perso);
//     }
// });







BABYLON.SceneLoader.ImportMesh("", "/3d_object/", "testPersoPageDeGardeV1.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {

    newMeshes.forEach(mesh => {
        if (mesh.material) {
            mesh.material.transparencyMode = 0;
            mesh.material.backFaceCulling = false;
            if (mesh.material.pbr) {
                mesh.material.pbr.usePhysicalLightFalloff = true;
            }
        }
    });

    let perso = newMeshes.find(mesh => mesh.name === "__root__");
    if (perso) {
        perso.scaling = new BABYLON.Vector3(5.5, 5.5, 5.5);
        perso.position = new BABYLON.Vector3(-90, 1.5, -65);
        perso.rotation = new BABYLON.Vector3(0, Math.PI/4, 0);
    }

    if (typeof controlPerso === "function") {
        controlPerso(perso);
    }
});








// Fonction pour créer une plane avec texture d'herbe
function createGrassPlane(name, position) {
    const grassPlane = BABYLON.MeshBuilder.CreateGround(name, {width: 45, height: 50}, scene);
    const grassMaterial = new BABYLON.StandardMaterial(name + "Material", scene);
    grassMaterial.diffuseTexture = new BABYLON.Texture("/image/perfect-green-grass.jpg", scene);
    grassMaterial.backFaceCulling = false;
    // Amélioration de la qualité des textures
    grassMaterial.diffuseTexture.anisotropicFilteringLevel = 16;
    grassMaterial.diffuseTexture.uScale = 5;
    grassMaterial.diffuseTexture.vScale = 5;
    grassPlane.material = grassMaterial;
    grassPlane.position = position;
}

// Création des planes d'herbe
createGrassPlane("grassPlane1", new BABYLON.Vector3(-61.5, 1.3, -152));
createGrassPlane("grassPlane2", new BABYLON.Vector3(-61.5, 1.3, -102));
createGrassPlane("grassPlane3", new BABYLON.Vector3(-61.5, 1.3, -52));
createGrassPlane("grassPlane4", new BABYLON.Vector3(-106.5, 1.3, -152));
createGrassPlane("grassPlane5", new BABYLON.Vector3(-106.5, 1.3, -102));
createGrassPlane("grassPlane6", new BABYLON.Vector3(-106.5, 1.3, -52));

function createGrassPlane2(name, position) {
    const grassPlane = BABYLON.MeshBuilder.CreateGround(name, {width: 32.8, height: 58}, scene);
    const grassMaterial = new BABYLON.StandardMaterial(name + "Material", scene);
    grassMaterial.diffuseTexture = new BABYLON.Texture("/image/perfect-green-grass.jpg", scene);
    grassMaterial.backFaceCulling = false;
    // Amélioration de la qualité des textures
    grassMaterial.diffuseTexture.anisotropicFilteringLevel = 16;
    grassMaterial.diffuseTexture.uScale = 5;
    grassMaterial.diffuseTexture.vScale = 5;
    grassPlane.material = grassMaterial;
    grassPlane.position = position;
}

createGrassPlane2("grassPlane7", new BABYLON.Vector3(-23.6, 299.8, -102));
createGrassPlane2("grassPlane8", new BABYLON.Vector3(-23.6, 299.8, -44));
createGrassPlane2("grassPlane9", new BABYLON.Vector3(9.2, 299.8, -102));
createGrassPlane2("grassPlane10", new BABYLON.Vector3(9.2, 299.8, -44));


const border_right = new BABYLON.MeshBuilder.CreateBox("border", {
    width: 65,
    height: 3,
    depth: 1
}, scene);
border_right.position = new BABYLON.Vector3(-7, 300, -14);



const border_left = new BABYLON.MeshBuilder.CreateBox("border", {
    width: 65,
    height: 3,
    depth: 1
}, scene);
border_left.position = new BABYLON.Vector3(-7, 300, -130);




const borderTop = new BABYLON.MeshBuilder.CreateBox("border", {
    width: 115,
    height: 3,
    depth: 1
}, scene);
borderTop.position = new BABYLON.Vector3(25, 300, -72);
borderTop.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);




const borderBottom = new BABYLON.MeshBuilder.CreateBox("border", {
    width: 115,
    height: 3,
    depth: 1
}, scene);
borderBottom.position = new BABYLON.Vector3(-40, 300, -72);
borderBottom.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);




const paddle_left = new BABYLON.MeshBuilder.CreateBox("padle_left", {
    width: 10,
    height: 1.5,
    depth: 1.5
}, scene);

paddle_left.position = new BABYLON.Vector3(-7, 301, -120);
paddle_left.checkPaddleCollision = true;

const paddle_right = new BABYLON.MeshBuilder.CreateBox("padle_right", {
    width: 10,
    height: 1.5,
    depth: 1.5
}, scene);

paddle_right.position = new BABYLON.Vector3(-7, 301, -24);
paddle_right.checkPaddleCollision = true;

const ball = new BABYLON.MeshBuilder.CreateSphere("ball", {
    diameter: 3
}, scene);

ball.position = new BABYLON.Vector3(-7, 301.5, -72.5);
ball.checkPaddleCollision = true;

const paddleSpeed = 1.1;
const keys = {}; 

// Constantes pour les limites du terrain
const minX = borderBottom.position.x + (borderBottom.scaling.x / 2) + 4.5;
const maxX = borderTop.position.x - (borderTop.scaling.x / 2) - 4.5;
const FIELD_LEFT = -40;
const FIELD_RIGHT = 25;
const FIELD_TOP = -14;
const FIELD_BOTTOM = -130;
const BALL_RADIUS = 1.5;
const PADDLE_WIDTH = 10;    // Largeur du paddle
const PADDLE_HEIGHT = 1.5;  // Hauteur du paddle
const MAX_BALL_SPEED = 1;

// Variables pour la vitesse de la balle
let ballSpeedX = 0.3;
let ballSpeedY = 0.3;
let baseSpeed = 0.3;

// Écouteurs d'événements pour les touches
addEventListener("keydown", (event) => keys[event.key] = true);
addEventListener("keyup", (event) => keys[event.key] = false);

// Fonction pour vérifier les collisions avec les paddles
// Créer une boîte de collision pour la balle
const ballCollisionBox = BABYLON.MeshBuilder.CreateBox("ballCollisionBox", {
    width: BALL_RADIUS * 2,   // Largeur de la boîte de collision
    height: BALL_RADIUS * 2,  // Hauteur de la boîte de collision
    depth: BALL_RADIUS * 2    // Profondeur de la boîte de collision
}, scene);

ballCollisionBox.isPickable = false;  // La boîte de collision ne doit pas être sélectionnable
ballCollisionBox.visibility = 0;      // La boîte de collision est invisible (pour le débogage)

ballCollisionBox.position = ball.position;  // On synchronise la position de la boîte avec la balle

// Fonction pour vérifier les collisions avec les paddles
function checkPaddleCollision(paddle) {
    const paddleTop = paddle.position.z + (paddle.scaling.z + 8) / 2;  // Profondeur ajustée
    const paddleBottom = paddle.position.z - (paddle.scaling.z + 8) / 2;  
    const paddleLeft = paddle.position.x - (paddle.scaling.x + 12) / 2; // Largeur ajustée
    const paddleRight = paddle.position.x + (paddle.scaling.x + 12) / 2; 
    const paddleHeight = paddle.position.y + (paddle.scaling.y + 10) / 2; // Augmenter la hauteur ici
    const paddleBottomHeight = paddle.position.y - (paddle.scaling.y + 10) / 2;

    return (
        ballCollisionBox.position.z + BALL_RADIUS >= paddleBottom &&
        ballCollisionBox.position.z - BALL_RADIUS <= paddleTop &&
        ballCollisionBox.position.x + BALL_RADIUS >= paddleLeft &&
        ballCollisionBox.position.x - BALL_RADIUS <= paddleRight &&
        ballCollisionBox.position.y + BALL_RADIUS >= paddleBottomHeight &&
        ballCollisionBox.position.y - BALL_RADIUS <= paddleHeight
    );
}
// Fonction de mise à jour des paddles
function updatePaddles() {
    if (keys["w"] && paddle_left.position.x > minX) {
        paddle_left.position.x -= paddleSpeed;
    }
    if (keys["s"] && paddle_left.position.x < maxX) {
        paddle_left.position.x += paddleSpeed;
    }
    if (keys["i"] && paddle_right.position.x > minX) {
        paddle_right.position.x -= paddleSpeed;
    }
    if (keys["k"] && paddle_right.position.x < maxX) {
        paddle_right.position.x += paddleSpeed;
    }
}

// Fonction de mise à jour de la balle
function updateBall() {
    ball.position.x += ballSpeedX;
    ball.position.z += ballSpeedY;

    // Mise à jour de la position de la boîte de collision
    ballCollisionBox.position = ball.position;

    if (ball.position.z >= FIELD_TOP || ball.position.z <= FIELD_BOTTOM) {
        ballSpeedY *= -1;
    }

    if (ball.position.x <= FIELD_LEFT || ball.position.x >= FIELD_RIGHT) {
        ballSpeedX *= -1;
    }

    if (checkPaddleCollision(paddle_left) || checkPaddleCollision(paddle_right)) {
        // Inverse la direction sans modifier la vitesse
        ballSpeedX *= -1;
        
        const paddle = checkPaddleCollision(paddle_left) ? paddle_left : paddle_right;
        const relativeIntersectY = (paddle.position.x - ball.position.x) / (paddle.scaling.x / 2);
        
        // Calcul de la nouvelle vitesse Y avec limitation
        let newSpeedY = -baseSpeed * relativeIntersectY;
        
        // Limitation de la vitesse maximale
        ballSpeedY = Math.max(Math.min(newSpeedY, MAX_BALL_SPEED), -MAX_BALL_SPEED);
        ballSpeedX = Math.max(Math.min(ballSpeedX, MAX_BALL_SPEED), -MAX_BALL_SPEED);
    }
}


function createDebugLines(scene) {
    const lines = [];
    const debugMaterial = new BABYLON.StandardMaterial("debugMaterial", scene);
    debugMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0); // Rouge
    debugMaterial.wireframe = true;

    // Fonction pour créer une boîte de debug
    function createDebugBox(paddle, scene) {
        const box = BABYLON.MeshBuilder.CreateBox("debugBox", {
            width: paddle.scaling.x + 12,  // Largeur ajustée
            height: 1.5,                   // Hauteur ajustée
            depth: paddle.scaling.z + 8,   // Profondeur ajustée
        }, scene);
    
        box.material = debugMaterial;
        box.isPickable = false;
        box.visibility = 0.5; // Plus visible
    
        // Mise à jour de la position de la box debug
        scene.registerBeforeRender(() => {
            box.position.x = paddle.position.x;
            box.position.y = paddle.position.y;
            box.position.z = paddle.position.z;
        });
    
        return box;
    }
    
    // Création des box de debug pour chaque paddle
    const leftPaddleDebug = createDebugBox(paddle_left, scene);
    const rightPaddleDebug = createDebugBox(paddle_right, scene);

    // Mettre à jour la position des boîtes de debug
    scene.registerBeforeRender(() => {
        // Mise à jour de la boîte de debug du paddle gauche
        leftPaddleDebug.position = new BABYLON.Vector3(
            paddle_left.position.x,
            paddle_left.position.y,
            paddle_left.position.z
        );

        // Mise à jour de la boîte de debug du paddle droit
        rightPaddleDebug.position = new BABYLON.Vector3(
            paddle_right.position.x,
            paddle_right.position.y,
            paddle_right.position.z
        );
    });

    return [leftPaddleDebug, rightPaddleDebug];
}

// Créer les lignes de debug
const debugBoxes = createDebugLines(scene);

function createBallDebugBox(scene) {
    const ballDebugMaterial = new BABYLON.StandardMaterial("ballDebugMaterial", scene);
    ballDebugMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0); // Vert, pour que ça se distingue

    // Créer une sphère avec le diamètre correspondant à la balle
    const ballDebugBox = BABYLON.MeshBuilder.CreateSphere("ballDebugBox", {
        diameter: BALL_RADIUS * 2  // Diamètre de la sphère basé sur le rayon de la balle
    }, scene);

    ballDebugBox.material = ballDebugMaterial;
    ballDebugBox.isPickable = false;
    ballDebugBox.visibility = 5;  // Semi-transparente pour mieux voir l'environnement

    return ballDebugBox;
}

// Crée une instance de la boîte de débogage pour la balle
const ballDebugBox = createBallDebugBox(scene);

// Met à jour la position de la boîte de débogage à chaque frame
scene.registerBeforeRender(() => {
    ballDebugBox.position = new BABYLON.Vector3(ball.position.x, ball.position.y, ball.position.z);
});

// Créer les lignes de débogage pour les paddles
const debugBoxess = createDebugLines(scene);

// Ajouter une touche pour activer/désactiver la visualisation des collisions
let debugVisible = true;
window.addEventListener('keydown', (event) => {
    if (event.key === 'h') { // Appuyer sur 'h' pour afficher/cacher
        debugVisible = !debugVisible;
        debugBoxess.forEach(box => {
            box.visibility = debugVisible ? 0.3 : 0;
        });

        // Afficher/masquer la sphère de débogage de la balle
        ballDebugBox.visibility = debugVisible ? 0.5 : 0;
    }
});



// Boucle de rendu principale
engine.runRenderLoop(() => {
    const scale = window.devicePixelRatio;
    if (canvas.width !== canvas.clientWidth * scale || canvas.height !== canvas.clientHeight * scale) {
        engine.resize(true);
        canvas.width = canvas.clientWidth * scale;
        canvas.height = canvas.clientHeight * scale;
    }
    
    updatePaddles();
    updateBall();
    // console.log(ball.position);
    
    scene.render();
});

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    engine.resize(true);
});

// Qualité des textures
scene.onBeforeRenderObservable.add(() => {
    scene.meshes.forEach(mesh => {
        if (mesh.material && mesh.material.diffuseTexture) {
            mesh.material.diffuseTexture.anisotropicFilteringLevel = 16;
        }
    });
});







// ImageToStl.com_football_stadiumv2.glb
// versionFinalV2.glb
// ImageToStl.com_footballterraindejeuxv2.glb
// testPersoPageDeGardeV1.glb
// jongleAnnimationV4.glb