// import { create_environment_view1} from "./init_game.js";
// import { UpdatePlayerPose} from "./player.js";
// import { MoveBall, MoveBall2v2 } from "./ball.js";
// import { init_game_solo , start_game_solo , destroy_game_solo} from "./solo/1v1_player/init_game_Solo.js";
// import { init_game_multiplayer, destroy_game_multiplayer } from "./multiplayer/init_game_2v2.js";
// import { UpdatePLayerPoseMulti } from "./multiplayer/2v2_game/init_players2v2.js";
// import { init_game_ai } from "./solo/1v1_ai/init_game_ai.js";
// import { UpdatePlayerAndAI_Pose } from "./solo/1v1_ai/init_player_and_ai.js";
// import { init_skins_perso_player1, init_skins_perso_player2 } from "./solo/skin/init_skin_perso.js";
// import { init_skins_perso_player1_multi, init_skins_perso_player2_multi, init_skins_perso_player3_multi, init_skins_perso_player4_multi } from "./multiplayer/init_skin_perso_multi.js";
// import { init_skins_perso_first, init_skins_perso_seconde } from "./solo/skin/init_skin_player_podium.js";
// import { isGameFinished } from "./score.js";
// import { gameIsFinished } from "./score.js";
// import { SetIsGameFinished } from "./score.js";
// import { init_skins_perso_player1_multi_podium, init_skins_perso_player2_multi_podium, init_skins_perso_player3_multi_podium, init_skins_perso_player4_multi_podium } from "./multiplayer/init_teamPlayer_podium.js";
// import { start_tournament_game, init_game_tournament, destroy_game_solo_tournament } from "./tournament/tournament.js";
// import { move_player_tournament } from "./tournament/init_player_tournament.js";


// const canvas = document.getElementById('renderCanvas');
// const engine = new BABYLON.Engine(canvas, true, {
// 	preserveDrawingBuffer: true,
// 	stencil: true,
// 	antialias: true,
// 	adapToDeviceRatio: true,
//     disableWebGLWarnings: true
// });


// // Désactiver les logs WebGL de Babylon.js
// engine.getRenderingCanvas().addEventListener("webglcontextlost", (e) => {
//     console.log("WebGL context lost!");
//     e.preventDefault();
// });

// // Surveiller l'objet `console.warn` pour filtrer les warnings spécifiques
// const originalConsoleWarn = console.warn;
// console.warn = function(message) {
//     if (message.includes("generateMipmap") || message.includes("WEBGL_debug_renderer_info")) {
//         return; // Ignore ces messages
//     }
//     originalConsoleWarn.apply(console, arguments); // Applique les autres messages
// };

// window.scene = new BABYLON.Scene(engine);
// scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
// scene.imageProcessingConfiguration.contrast = 1.2;
// scene.imageProcessingConfiguration.exposure = 1.0;
// scene.imageProcessingConfiguration.toneMappingEnabled = true;



// scene.getEngine().setHardwareScalingLevel(1.0);
// scene.performancePriority = BABYLON.Scene.PRIORITY_ANTIALIAS;


// window.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(7.860370854357264, 4, -55.57231601704761), scene);
// camera.attachControl(canvas, true);
// camera.position = new BABYLON.Vector3(-45.79301951065982, 5.879735371044789, -31.342210947081313),
// camera.rotation = new BABYLON.Vector3(-0.029665280069011667, -2.566387085794712, 0)
// camera.minZ = 0.1;
// camera.maxZ = 5000;

// const pipeline = new BABYLON.DefaultRenderingPipeline(
// 	"defaultPipeline", 
// 	true, 
// 	scene,
// 	[camera]
// );
// pipeline.samples = 8;
// pipeline.fxaaEnabled = true;
// pipeline.sharpenEnabled = true;
// pipeline.sharpen.edgeAmount = 0.3;


// scene.getEngine().setHardwareScalingLevel(1.0);
// scene.performancePriority = BABYLON.Scene.PRIORITY_ANTIALIAS;

// const ambientLight = new BABYLON.HemisphericLight(
// 	"ambientLight",
// 	new BABYLON.Vector3(0, 1, 0),
// 	scene
// );
// ambientLight.intensity = 3;


// create_environment_view1(scene);

// function createOptimizedSkybox(scene) {
//     // Créer un matériau optimisé pour la skybox
//     const skyMaterial = new BABYLON.StandardMaterial("skyMaterial", scene);
//     skyMaterial.backFaceCulling = false;
//     skyMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // Pas de reflets
//     skyMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1); // Émission complète

//     // Charger la texture avec des paramètres optimaux  
//     const skyTexture = new BABYLON.Texture("/srcs/game/assets/skybox/skybox.jpg", scene);
//     skyTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;
//     skyTexture.hasAlpha = false; // Pas de canal alpha dans une skybox
//     skyTexture.generateMipMaps = false; // Désactive la génération des mipmaps pour éviter le warning
//     skyTexture.updateSamplingMode(BABYLON.Texture.NEAREST_NEAREST); // Utilisation du filtrage le plus simple

//     // Appliquer la texture au matériau
//     skyMaterial.diffuseTexture = skyTexture;

//     // Attendre que la texture soit complètement chargée
//     skyTexture.onLoadObservable.add(() => {
//         console.log("Texture de skybox chargée");
//     });

//     // Créer une sphère inversée pour la skybox
//     const skySphere = BABYLON.MeshBuilder.CreateSphere("skySphere", {diameter: 5000, sideOrientation: BABYLON.Mesh.BACKSIDE}, scene);
//     skySphere.material = skyMaterial;
//     skySphere.isPickable = false;
//     skySphere.infiniteDistance = true;
//     skySphere.scaling.y = -1; // Corrige l'orientation de la texture si besoin

//     // Optimiser la skybox (elle ne bouge pas)
//     skySphere.freezeWorldMatrix();
//     skyMaterial.freeze();

//     return skySphere;
// }

// // Utilisation
// const skybox = createOptimizedSkybox(scene);



// let initialized = false;
// let player_1;
// let player_2;
// let player_3;
// let player_4;
// let player_1_tournament;
// let player_2_tournament;
// let AI_player;
// let Solo_gameStart = false;
// let Multi_gameStart = false;
// let AI_gameStart = false;
// let ball;
// let tournament_game = false;

// export function startGame()
// {
//     console.log("Game started");
//     Solo_gameStart = true;
//     Multi_gameStart = false;
//     AI_gameStart = false;
//     SetIsGameFinished(false);
// }

// export function startMultiGame()
// {
//     Multi_gameStart = true;
//     Solo_gameStart = false;
//     AI_gameStart = false;
//     SetIsGameFinished(false);
// }

// export function startAI_Game()
// {
//     AI_gameStart = true;
//     Solo_gameStart = false;
//     Multi_gameStart = false;
//     SetIsGameFinished(false);
// }

// export function startTournamentGame()
// {
//     tournament_game = true;
//     Solo_gameStart = false;
//     Multi_gameStart = false;
//     AI_gameStart = false;
//     SetIsGameFinished(false);
// }

// scene.inputStates = { space: false };

// window.addEventListener("keydown", (event) => {
//     if (event.code === "Space") {
//         scene.inputStates.space = true;
//     }
// });

// window.addEventListener("keyup", (event) => {
//     if (event.code === "Space") {
//         scene.inputStates.space = false;
//     }
// });

// let play = false;

// async function initializeGame_solo_game() 
// {
//     let players = await init_game_solo(scene);
//     player_1 = players.player_1;
//     player_2 = players.player_2;
//     ball = players.ball;
// }

// async function initialize_Multiplayer_game()
// {
//     let players = await init_game_multiplayer(scene);
//     player_1 = players.player_1;
//     player_2 = players.player_2;
//     player_3 = players.player_3;
//     player_4 = players.player_4;
//     ball = players.ball;
// }

// async function initialize_AI_game()
// {
//     let players = await init_game_ai(scene);
//     player_1 = players.player_1;
//     AI_player = players.ai_player;
//     ball = players.ball;
// }

// async function initializeGame_tournament()
// {
//     let players = await init_game_tournament(scene);
//     player_1_tournament = players.player_1_tournament;
//     player_2_tournament = players.player_2_tournament;
//     ball = players.ball;
//     console.log("Game initialized");
//     console.log(player_1_tournament.position);
//     console.log(player_2_tournament.position);
//     console.log(ball.position);
//     console.log("Game initialized");
// }

// export function leave_Game()
// {
//     destroy_game_solo(scene);
//     Solo_gameStart = false;
//     initialized = false;
//     play = false;
// }

// export function leave_tournament_game()
// {
//     destroy_game_solo_tournament(scene);
//     tournament_game = false;
//     initialized = false;
//     play = false;
// }

// export function leave_Multiplayer_Game()
// {
//     destroy_game_multiplayer(scene);
//     Multi_gameStart = false;
//     initialized = false;
//     play = false;
// }

// export function leave_AI_Game()
// {
//     AI_gameStart = false;
//     initialized = false;
//     play = false;
// }

// engine.runRenderLoop(() =>
// {
//     const scale = window.devicePixelRatio;
//     if (canvas.width !== canvas.clientWidth * scale || canvas.height !== canvas.clientHeight * scale)
//     {
//         engine.resize(true);
//         canvas.width = canvas.clientWidth * scale;
//         canvas.height = canvas.clientHeight * scale;
//     }

//     if (Solo_gameStart && !gameIsFinished)
//     {
//         if (!initialized)
//         {
//             initializeGame_solo_game();
//             initialized = true;
//         }
        
//         if (initialized)
//         {
//             if (scene.inputStates.space && !play)
//                 play = true;

//             if (play)
//             {
//                 const bonusPlayer = UpdatePlayerPose(player_1, player_2);
//                 MoveBall(player_1, player_2, ball, bonusPlayer.player_1_bonus, bonusPlayer.player_2_bonus);
//             }
//         }
//     }

//     if (Multi_gameStart && !gameIsFinished)
//     {
//         if (!initialized)
//         {
//             initialize_Multiplayer_game();
//             initialized = true;
//         }
//         if (initialized)
//         {
//             if (scene.inputStates.space && !play)
//                 play = true;
//             if (play)
//             {
//                 UpdatePLayerPoseMulti(player_1, player_2, player_3, player_4);
//                 MoveBall2v2(player_1, player_2, player_3, player_4, ball);
//             }
//         }
//     }

//     if (AI_gameStart && !gameIsFinished)
//     {
//         if (!initialized)
//         {
//             initialize_AI_game();
//             initialized = true;
//         }
//         if (initialized)
//         {
//             if (scene.inputStates.space && !play)
//                 play = true;
//             if (play)
//             {
//                 UpdatePlayerAndAI_Pose(player_1, AI_player, ball);
//                 MoveBall(player_1, AI_player, ball);
//             }
//         }
//     }

//     if (tournament_game && !gameIsFinished)
//     {
//         if (!initialized)
//         {
//             initializeGame_tournament();
//             initialized = true;
//         }
//         if (initialized)
//         {
//             if (scene.inputStates.space && !play)
//                 play = true;
//             if (play)
//             {
//                 move_player_tournament(player_1_tournament, player_2_tournament);
//                 MoveBall(player_1_tournament, player_2_tournament, ball);
//             }
//         }
//     }

//     const currentFps = engine.getFps();
//     console.log("FPS: " + currentFps);

//     // console.log(camera.rotation);
//     // console.log(camera.position);
//     scene.render();
// });

// window.addEventListener('resize', () => {
// 	engine.resize(true);
// });

// export function getSoloGameStart()
// {
//     return Solo_gameStart;
// }

// export function getMultiGameStart()
// {
//     return Multi_gameStart;
// }

// export function getAIGameStart()
// {
//     return AI_gameStart;
// }

// export function getTournamentGameStart()
// {
//     return tournament_game;
// }



import { create_environment_view1 } from "./init_game.js";
import { UpdatePlayerPose } from "./player.js";
import { MoveBall, MoveBall2v2 } from "./ball.js";
import { init_game_solo, start_game_solo, destroy_game_solo } from "./solo/1v1_player/init_game_Solo.js";
import { init_game_multiplayer, destroy_game_multiplayer } from "./multiplayer/init_game_2v2.js";
import { UpdatePLayerPoseMulti } from "./multiplayer/2v2_game/init_players2v2.js";
import { init_game_ai } from "./solo/1v1_ai/init_game_ai.js";
import { UpdatePlayerAndAI_Pose } from "./solo/1v1_ai/init_player_and_ai.js";
import { init_skins_perso_player1, init_skins_perso_player2 } from "./solo/skin/init_skin_perso.js";
import { init_skins_perso_player1_multi, init_skins_perso_player2_multi, init_skins_perso_player3_multi, init_skins_perso_player4_multi } from "./multiplayer/init_skin_perso_multi.js";
import { init_skins_perso_first, init_skins_perso_seconde } from "./solo/skin/init_skin_player_podium.js";
import { isGameFinished, gameIsFinished, SetIsGameFinished } from "./score.js";
import { init_skins_perso_player1_multi_podium, init_skins_perso_player2_multi_podium, init_skins_perso_player3_multi_podium, init_skins_perso_player4_multi_podium } from "./multiplayer/init_teamPlayer_podium.js";
import { start_tournament_game, init_game_tournament, destroy_game_solo_tournament } from "./tournament/tournament.js";
import { move_player_tournament } from "./tournament/init_player_tournament.js";

// Configuration du moteur avec detection automatique de qualité
let qualityLevel = 'medium'; // default value
const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    antialias: true,
    adaptToDeviceRatio: false,
    disableWebGLWarnings: true,
    powerPreference: "high-performance"
});

// Détection de performances et ajustement automatique du niveau de qualité
function detectPerformanceLevel() {
    try {
        const gl = engine.getRenderingCanvas().getContext("webgl");
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
        
        // Mesure des performances initiales
        const startTime = performance.now();
        for (let i = 0; i < 1000; i++) {
            Math.sqrt(i);
        }
        const endTime = performance.now();
        const perfScore = endTime - startTime;
        
        // Déterminer niveau en fonction du GPU et des performances CPU
        if (renderer.includes('nvidia') || renderer.includes('amd') || perfScore < 1) {
            return 'high';
        } else if (renderer.includes('intel') || perfScore < 5) {
            return 'medium';
        } else {
            return 'low';
        }
    } catch (e) {
        console.log("Performance detection failed, using default settings");
        return 'medium';
    }
}

// Gérer les erreurs de contexte WebGL
engine.getRenderingCanvas().addEventListener("webglcontextlost", (e) => {
    console.log("WebGL context lost! Attempting to recover...");
    e.preventDefault();
    
    // Réduire la qualité et tenter de récupérer
    qualityLevel = 'low';
    applyQualitySettings();
    
    // Essayer de restaurer après un délai
    setTimeout(() => {
        try {
            engine.resize(true);
        } catch (err) {
            console.error("Failed to recover WebGL context:", err);
            showErrorMessage("Erreur graphique détectée. Veuillez rafraîchir la page.");
        }
    }, 1000);
});

// Filtrer les avertissements non-critiques
const originalConsoleWarn = console.warn;
console.warn = function(message) {
    const ignoredPatterns = ["generateMipmap", "WEBGL_debug_renderer_info", "precision issues"];
    if (typeof message === 'string' && ignoredPatterns.some(pattern => message.includes(pattern))) {
        return;
    }
    originalConsoleWarn.apply(console, arguments);
};

// Création et optimisation de la scène
window.scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
scene.blockMaterialDirtyMechanism = true; // Améliore les performances en bloquant les mises à jour automatiques des matériaux

// Configuration de la caméra optimisée
window.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(-45.79301951065982, 5.879735371044789, -31.342210947081313), scene);
camera.rotation = new BABYLON.Vector3(-0.029665280069011667, -2.566387085794712, 0);
camera.minZ = 0.1;
camera.maxZ = 5000;
camera.attachControl(canvas, true);
camera.speed = 0.75; // Réduit la vitesse pour améliorer les performances lors des déplacements

// Post-processing modulaire selon la qualité
const pipeline = new BABYLON.DefaultRenderingPipeline("defaultPipeline", true, scene, [camera]);

// Lumière ambiante optimisée
const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
ambientLight.intensity = 3;
// ambientLight.specular = BABYLON.Color3.Black(); // Désactive les reflets spéculaires pour améliorer les performances

// Variables de jeu
let initialized = false;
let player_1, player_2, player_3, player_4, player_1_tournament, player_2_tournament, AI_player, ball;
let Solo_gameStart = false;
let Multi_gameStart = false;
let AI_gameStart = false;
let tournament_game = false;
let play = false;
let lastPerformanceCheck = Date.now();
let frameCounter = 0;
let fpsHistory = [];

// Fonction d'optimisation de skybox
function createOptimizedSkybox(scene) {
    // Déterminer si nous devons utiliser une skybox simplifiée
    const simplifiedSkybox = qualityLevel === 'low';
    
    const skyMaterial = new BABYLON.StandardMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
    
    // Texture avec paramètres adaptés à la qualité
    const skyTexture = new BABYLON.Texture("/srcs/game/assets/skybox/skybox.jpg", scene);
    skyTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;
    skyTexture.hasAlpha = false;
    skyTexture.generateMipMaps = !simplifiedSkybox;
    skyTexture.updateSamplingMode(simplifiedSkybox ? 
        BABYLON.Texture.NEAREST_NEAREST : 
        BABYLON.Texture.NEAREST_LINEAR);
    
    skyMaterial.diffuseTexture = skyTexture;
    
    // Créer une sphère optimisée
    const segmentsCount = simplifiedSkybox ? 16 : 32;
    const skySphere = BABYLON.MeshBuilder.CreateSphere("skySphere", {
        diameter: 5000, 
        segments: segmentsCount,
        sideOrientation: BABYLON.Mesh.BACKSIDE
    }, scene);
    
    skySphere.material = skyMaterial;
    skySphere.isPickable = false;
    skySphere.infiniteDistance = true;
    skySphere.scaling.y = -1; // Corrige l'orientation de la texture si besoin
    
    // Optimisations statiques
    skySphere.freezeWorldMatrix();
    skySphere.doNotSyncBoundingInfo = true;
    skyMaterial.freeze();
    
    return skySphere;
}

// Fonction pour appliquer les paramètres de qualité
function applyQualitySettings() {
    // Mesurer les performances actuelles pour ajustement dynamique
    const currentTime = Date.now();
    frameCounter++;
    
    if (currentTime - lastPerformanceCheck > 3000) { // Vérifier toutes les 3 secondes
        const currentFps = frameCounter / ((currentTime - lastPerformanceCheck) / 1000);
        fpsHistory.push(currentFps);
        
        // Garder un historique limité
        if (fpsHistory.length > 5) {
            fpsHistory.shift();
        }
        
        // Calculer la moyenne des FPS
        const avgFps = fpsHistory.reduce((sum, fps) => sum + fps, 0) / fpsHistory.length;
        
        // Ajuster la qualité automatiquement si nécessaire
        if (avgFps < 30 && qualityLevel !== 'low') {
            qualityLevel = 'low';
            applyQualitySettingsImmediate();
        } else if (avgFps > 55 && qualityLevel === 'low') {
            qualityLevel = 'medium';
            applyQualitySettingsImmediate();
        } else if (avgFps > 90 && qualityLevel === 'medium') {
            qualityLevel = 'high';
            applyQualitySettingsImmediate();
        }
        
        lastPerformanceCheck = currentTime;
        frameCounter = 0;
    }
}

function applyQualitySettingsImmediate() {
    switch (qualityLevel) {
        case 'low':
            engine.setHardwareScalingLevel(1.5);
            scene.postProcessesEnabled = false;
            pipeline.fxaaEnabled = false;
            pipeline.sharpenEnabled = false;
            pipeline.samples = 1;
            scene.particlesEnabled = false;
            break;
        case 'medium':
            engine.setHardwareScalingLevel(1.0);
            scene.postProcessesEnabled = true;
            pipeline.fxaaEnabled = true;
            pipeline.sharpenEnabled = true;
            pipeline.sharpen.edgeAmount = 0.3;
            pipeline.samples = 4;
            scene.particlesEnabled = true;
            break;
        case 'high':
            engine.setHardwareScalingLevel(1.0);
            scene.postProcessesEnabled = true;
            pipeline.fxaaEnabled = true;
            pipeline.sharpenEnabled = true;
            pipeline.sharpen.edgeAmount = 0.3;
            pipeline.samples = 8;
            scene.particlesEnabled = true;
            break;
    }
    
    // Debug info
    console.log(`Quality level set to: ${qualityLevel}`);
}

// Création de l'environnement initial
create_environment_view1(scene);
const skybox = createOptimizedSkybox(scene);

// Détection initiale des performances et application des réglages
qualityLevel = detectPerformanceLevel();
applyQualitySettingsImmediate();

// Gestionnaires d'événements
scene.inputStates = { space: false };

window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        scene.inputStates.space = true;
    }
});

window.addEventListener("keyup", (event) => {
    if (event.code === "Space") {
        scene.inputStates.space = false;
    }
});

// Fonctions d'initialisation des différents modes de jeu
async function initializeGame_solo_game() {
    try {
        let players = await init_game_solo(scene);
        player_1 = players.player_1;
        player_2 = players.player_2;
        ball = players.ball;
        optimizeGameObjects([player_1, player_2, ball]);
    } catch (error) {
        console.error("Error initializing solo game:", error);
        handleGameInitError();
    }
}

async function initialize_Multiplayer_game() {
    try {
        let players = await init_game_multiplayer(scene);
        player_1 = players.player_1;
        player_2 = players.player_2;
        player_3 = players.player_3;
        player_4 = players.player_4;
        ball = players.ball;
        optimizeGameObjects([player_1, player_2, player_3, player_4, ball]);
    } catch (error) {
        console.error("Error initializing multiplayer game:", error);
        handleGameInitError();
    }
}

async function initialize_AI_game() {
    try {
        let players = await init_game_ai(scene);
        player_1 = players.player_1;
        AI_player = players.ai_player;
        ball = players.ball;
        optimizeGameObjects([player_1, AI_player, ball]);
    } catch (error) {
        console.error("Error initializing AI game:", error);
        handleGameInitError();
    }
}

async function initializeGame_tournament() {
    try {
        let players = await init_game_tournament(scene);
        player_1_tournament = players.player_1_tournament;
        player_2_tournament = players.player_2_tournament;
        ball = players.ball;
        optimizeGameObjects([player_1_tournament, player_2_tournament, ball]);
    } catch (error) {
        console.error("Error initializing tournament game:", error);
        handleGameInitError();
    }
}

// Optimisation des objets de jeu
function optimizeGameObjects(objects) {
    objects.forEach(obj => {
        if (!obj) return;
        
        // Optimiser les meshes si possible
        if (obj.getChildMeshes) {
            const meshes = obj.getChildMeshes();
            meshes.forEach(mesh => {
                if (!mesh.isVisible) return;
                
                if (qualityLevel === 'low') {
                    // Simplifier le maillage pour les appareils à faibles performances
                    if (mesh.simplify) {
                        mesh.simplify([{ quality: 0.5, distance: 50 }], true);
                    }
                }
                
                // Optimisations communes
                // mesh.freezeWorldMatrix();
                
                // Désactiver les fonctionnalités coûteuses sur les maillages non essentiels
                if (!mesh.name.includes("player") && !mesh.name.includes("ball")) {
                    mesh.doNotSyncBoundingInfo = true;
                    mesh.alwaysSelectAsActiveMesh = false;
                }
            });
        }
    });
}

// Gestion des erreurs d'initialisation
function handleGameInitError() {
    console.error("Game initialization failed. Resetting to menu...");
    initialized = false;
    play = false;
    
    // Réinitialiser tous les drapeaux de mode de jeu
    Solo_gameStart = false;
    Multi_gameStart = false;
    AI_gameStart = false;
    tournament_game = false;
    
    // Afficher un message d'erreur à l'utilisateur ici si nécessaire
    const errorMessage = document.createElement('div');
    errorMessage.style.position = 'absolute';
    errorMessage.style.top = '50%';
    errorMessage.style.left = '50%';
    errorMessage.style.transform = 'translate(-50%, -50%)';
    errorMessage.style.backgroundColor = 'rgba(0,0,0,0.8)';
    errorMessage.style.color = 'white';
    errorMessage.style.padding = '20px';
    errorMessage.style.borderRadius = '5px';
    errorMessage.style.zIndex = '1000';
    errorMessage.textContent = 'Erreur lors du chargement du jeu. Retour au menu...';
    
    document.body.appendChild(errorMessage);
    setTimeout(() => {
        document.body.removeChild(errorMessage);
        window.location.href = '/Game_menu'; // Rediriger vers le menu
    }, 3000);
}

// Fonctions pour démarrer les différents modes de jeu
export function startGame() {
    Solo_gameStart = true;
    Multi_gameStart = false;
    AI_gameStart = false;
    tournament_game = false;
    SetIsGameFinished(false);
}

export function startMultiGame() {
    Multi_gameStart = true;
    Solo_gameStart = false;
    AI_gameStart = false;
    tournament_game = false;
    SetIsGameFinished(false);
}

export function startAI_Game() {
    AI_gameStart = true;
    Solo_gameStart = false;
    Multi_gameStart = false;
    tournament_game = false;
    SetIsGameFinished(false);
}

export function startTournamentGame() {
    tournament_game = true;
    Solo_gameStart = false;
    Multi_gameStart = false;
    AI_gameStart = false;
    SetIsGameFinished(false);
}

// Fonctions pour quitter les différents modes de jeu
export function leave_Game() {
    try {
        destroy_game_solo(scene);
    } catch (e) {
        console.error("Error cleaning up solo game:", e);
    }
    Solo_gameStart = false;
    initialized = false;
    play = false;
}

export function leave_tournament_game() {
    try {
        destroy_game_solo_tournament(scene);
    } catch (e) {
        console.error("Error cleaning up tournament game:", e);
    }
    tournament_game = false;
    initialized = false;
    play = false;
}

export function leave_Multiplayer_Game() {
    try {
        destroy_game_multiplayer(scene);
    } catch (e) {
        console.error("Error cleaning up multiplayer game:", e);
    }
    Multi_gameStart = false;
    initialized = false;
    play = false;
}

export function leave_AI_Game() {
    // Implement proper cleanup here
    AI_gameStart = false;
    initialized = false;
    play = false;
}
// Création du compteur FPS une seule fois
const fpsDiv = document.createElement('div');
fpsDiv.style.position = 'absolute';
fpsDiv.style.top = '10px';
fpsDiv.style.left = '10px';
fpsDiv.style.color = 'green';
fpsDiv.style.zIndex = '1000';
fpsDiv.style.fontSize = '10px';
fpsDiv.style.fontFamily = 'monospace';
fpsDiv.style.backgroundColor = 'rgba(0, 0, 0, 0)';
fpsDiv.style.padding = '5px';
document.body.appendChild(fpsDiv);

// Variables pour le compteur FPS fluide
let frameCount = 0;
let lastFpsUpdate = performance.now();

engine.runRenderLoop(() => {
    try {
        // Gérer le redimensionnement du canvas
        const scale = qualityLevel === 'low' ? 1.0 : window.devicePixelRatio;
        if (canvas.width !== canvas.clientWidth * scale || canvas.height !== canvas.clientHeight * scale) {
            canvas.width = canvas.clientWidth * scale;
            canvas.height = canvas.clientHeight * scale;
            engine.resize(true);
        }

        // Calculer le FPS en temps réel avec mise à jour toutes les 0.25 secondes
        frameCount++;
        const now = performance.now();
        const delta = now - lastFpsUpdate;
        if (delta >= 250) {
            const fps = (frameCount / delta) * 1000;
            fpsDiv.textContent = `FPS: ${fps.toFixed(1)}`;
            lastFpsUpdate = now;
            frameCount = 0;
        }

        // Appliquer les réglages de qualité dynamiques
        applyQualitySettings();

        // Logique du jeu
        if (Solo_gameStart && !gameIsFinished) {
            if (!initialized) {
                initializeGame_solo_game();
                initialized = true;
            }
            if (initialized) {
                if (scene.inputStates.space && !play)
                    play = true;
                if (play) {
                    const bonusPlayer = UpdatePlayerPose(player_1, player_2);
                    MoveBall(player_1, player_2, ball, bonusPlayer.player_1_bonus, bonusPlayer.player_2_bonus);
                }
            }
        }

        if (Multi_gameStart && !gameIsFinished) {
            if (!initialized) {
                initialize_Multiplayer_game();
                initialized = true;
            }
            if (initialized) {
                if (scene.inputStates.space && !play)
                    play = true;
                if (play) {
                    UpdatePLayerPoseMulti(player_1, player_2, player_3, player_4);
                    MoveBall2v2(player_1, player_2, player_3, player_4, ball);
                }
            }
        }

        if (AI_gameStart && !gameIsFinished) {
            if (!initialized) {
                initialize_AI_game();
                initialized = true;
            }
            if (initialized) {
                if (scene.inputStates.space && !play)
                    play = true;
                if (play) {
                    UpdatePlayerAndAI_Pose(player_1, AI_player, ball);
                    MoveBall(player_1, AI_player, ball);
                }
            }
        }

        if (tournament_game && !gameIsFinished) {
            if (!initialized) {
                initializeGame_tournament();
                initialized = true;
            }
            if (initialized) {
                if (scene.inputStates.space && !play)
                    play = true;
                if (play) {
                    move_player_tournament(player_1_tournament, player_2_tournament);
                    MoveBall(player_1_tournament, player_2_tournament, ball);
                }
            }
        }

        // Debug info
        if (DEBUG_MODE && now - lastDebugOutput > 5000) {
            const debugFps = engine.getFps().toFixed(1);
            console.log(`FPS: ${debugFps} | Quality: ${qualityLevel} | Active Meshes: ${scene.getActiveMeshes().length}`);
            lastDebugOutput = now;
        }

        // Rendu de la scène
        scene.render();

    } catch (error) {
        console.error("Error in render loop:", error);
        if (qualityLevel !== 'low') {
            qualityLevel = 'low';
            applyQualitySettingsImmediate();
        }
    }
    console.log("FPS: " + engine.getFps());
});


// Gestionnaire de redimensionnement de fenêtre optimisé
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        engine.resize(true);
    }, 100); // Délai pour éviter les appels multiples lors du redimensionnement
});

// Gérer la perte de focus pour économiser les ressources
window.addEventListener('blur', () => {
    engine.hideLoadingUI();
    engine.renderEvenInBackground = false;
});

window.addEventListener('focus', () => {
    engine.renderEvenInBackground = true;
});

// Variables pour le debugging
const DEBUG_MODE = false;
let lastDebugOutput = 0;

// Fonctions publiques pour obtenir l'état du jeu
export function getSoloGameStart() {
    return Solo_gameStart;
}

export function getMultiGameStart() {
    return Multi_gameStart;
}

export function getAIGameStart() {
    return AI_gameStart;
}

export function getTournamentGameStart() {
    return tournament_game;
}

// Fonction pour ajuster manuellement la qualité (peut être exposée à l'UI)
export function setQualityLevel(level) {
    if (['low', 'medium', 'high'].includes(level)) {
        qualityLevel = level;
        applyQualitySettingsImmediate();
        return true;
    }
    return false;
}

// Afficher un message d'erreur UI si nécessaire
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'absolute';
    errorDiv.style.top = '10px';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translateX(-50%)';
    errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px';
    errorDiv.style.borderRadius = '5px';
    errorDiv.style.zIndex = '1000';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        document.body.removeChild(errorDiv);
    }, 5000);
}