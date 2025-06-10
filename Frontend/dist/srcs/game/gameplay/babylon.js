import { create_environment_view1, create_environment_view3, create_environment_view2 } from "./init_game.js";
import { UpdatePlayerPose } from "./player.js";
import { MoveBall, MoveBall2v2 } from "./ball.js";
import { init_game_solo, start_game_solo, destroy_game_solo } from "./solo/1v1_player/init_game_Solo.js";
import { init_game_multiplayer, destroy_game_multiplayer } from "./multiplayer/init_game_2v2.js";
import { UpdatePLayerPoseMulti } from "./multiplayer/2v2_game/init_players2v2.js";
import { init_game_ai } from "./solo/1v1_ai/init_game_ai.js";
import { UpdatePlayerAndAI_Pose } from "./solo/1v1_ai/init_player_and_ai.js";
import { gameIsFinished, SetIsGameFinished } from "./score.js";
import { init_game_tournament, destroy_game_solo_tournament } from "./tournament/tournament.js";
import { move_player_tournament } from "./tournament/init_player_tournament.js";
import { init_all_skin } from "./solo/skin/init_skin_perso.js";
import { handleViewTransitions } from "./views/camera.js";
import { get_skin_is_init } from "./solo/skin/init_skin_utils.js";
import { init_skins_podium_default } from "./solo/skin/init_skin_player_default.js";
// import { init_skin_default } from "./solo/skin/init_skin_perso.js";
console.log("BABYLON JS");
/**************************************************************/
/*****************CREATION DU MOTEUR***************************/
/**************************************************************/
// history.pushState({}, '', '/');
let qualityLevel = 'medium';
const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    antialias: true,
    adaptToDeviceRatio: false,
    disableWebGLWarnings: true,
    powerPreference: "high-performance"
});
/***************************************************************/
/*****************DETECTION DES PERFORMANCES*******************/
/***************************************************************/
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
        }
        else if (renderer.includes('intel') || perfScore < 5) {
            return 'medium';
        }
        else {
            return 'low';
        }
    }
    catch (e) {
        console.log("Performance detection failed, using default settings");
        return 'medium';
    }
}
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
        }
        catch (err) {
            console.error("Failed to recover WebGL context:", err);
            showErrorMessage("Erreur graphique détectée. Veuillez rafraîchir la page.");
        }
    }, 1000);
});
// Filtrer les avertissements non-critiques
const originalConsoleWarn = console.warn;
console.warn = function (message) {
    const ignoredPatterns = ["generateMipmap", "WEBGL_debug_renderer_info", "precision issues"];
    if (typeof message === 'string' && ignoredPatterns.some(pattern => message.includes(pattern))) {
        return;
    }
    originalConsoleWarn.apply(console, arguments);
};
function applyQualitySettings() {
    const currentTime = Date.now();
    frameCounter++;
    if (currentTime - lastPerformanceCheck > 3000) {
        const currentFps = frameCounter / ((currentTime - lastPerformanceCheck) / 1000);
        fpsHistory.push(currentFps);
        // Garder un historique limité
        if (fpsHistory.length > 5) {
            fpsHistory.shift();
        }
        // Calculer la moyenne des FPS
        const avgFps = fpsHistory.reduce((sum, fps) => sum + fps, 0) / fpsHistory.length;
        if (avgFps < 90 && qualityLevel !== 'low') {
            qualityLevel = 'low';
            applyQualitySettingsImmediate();
        }
        else if (avgFps > 55 && qualityLevel === 'low') {
            qualityLevel = 'medium';
            applyQualitySettingsImmediate();
        }
        else if (avgFps > 90 && qualityLevel === 'medium') {
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
            engine.setHardwareScalingLevel(1);
            scene.postProcessesEnabled = false;
            pipeline.fxaaEnabled = false;
            pipeline.sharpenEnabled = false;
            pipeline.samples = 1;
            scene.particlesEnabled = false;
            break;
        case 'medium':
            engine.setHardwareScalingLevel(1);
            scene.postProcessesEnabled = false;
            pipeline.fxaaEnabled = false;
            pipeline.sharpenEnabled = false;
            pipeline.samples = 1;
            scene.particlesEnabled = false;
            break;
        case 'high':
            engine.setHardwareScalingLevel(1);
            scene.postProcessesEnabled = false;
            pipeline.fxaaEnabled = false;
            pipeline.sharpenEnabled = false;
            pipeline.samples = 1;
            scene.particlesEnabled = false;
            break;
    }
    // Debug info
    console.log(`Quality level set to: ${qualityLevel}`);
}
/**************************************************************/
/*****************CREATION DE LA SCENE*************************/
/**************************************************************/
window.scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
scene.blockMaterialDirtyMechanism = true;
window.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(-45.79301951065982, 5.879735371044789, -31.342210947081313), scene);
camera.rotation = new BABYLON.Vector3(-0.029665280069011667, -2.566387085794712, 0);
camera.minZ = 0.1;
camera.maxZ = 5000;
// camera.attachControl(canvas, false);
camera.speed = 1;
const pipeline = new BABYLON.DefaultRenderingPipeline("defaultPipeline", true, scene, [camera]);
const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
ambientLight.intensity = 3;
function createOptimizedSkybox(scene) {
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
    skySphere.scaling.y = -1;
    skySphere.freezeWorldMatrix();
    skySphere.doNotSyncBoundingInfo = true;
    skyMaterial.freeze();
    return skySphere;
}
/*************************************************************/
/*****************VARIABLE DE JEUX ***************************/
/**************************************************************/
let initialized = false;
let player_1, player_2, player_3, player_4, player_1_tournament, player_2_tournament, AI_player, ball;
let Solo_gameStart = false;
let Multi_gameStart = false;
let AI_gameStart = false;
let tournament_game = false;
let play = false;
let canPressSpace = false; // Nouveau drapeau pour bloquer l'appui sur Espace
let lastPerformanceCheck = Date.now();
let frameCounter = 0;
let fpsHistory = [];
create_environment_view1(scene);
create_environment_view3(scene);
create_environment_view2(scene);
console.log("create_environment_view1");
// init_all_skin(scene);
const skybox = createOptimizedSkybox(scene);
let skin = get_skin_is_init();
if (skin === false) {
    init_skins_podium_default(scene);
}
qualityLevel = detectPerformanceLevel();
applyQualitySettingsImmediate();
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
/*************************************************************/
/*****************INITIALISATION DES JEUX ********************/
/*************************************************************/
async function initializeGame_solo_game() {
    try {
        let players = await init_game_solo(scene);
        player_1 = players.player_1;
        player_2 = players.player_2;
        ball = players.ball;
        optimizeGameObjects([player_1, player_2, ball]);
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.error("Error initializing tournament game:", error);
        handleGameInitError();
    }
}
function optimizeGameObjects(objects) {
    objects.forEach(obj => {
        if (!obj)
            return;
        // Optimiser les meshes si possible
        if (obj.getChildMeshes) {
            const meshes = obj.getChildMeshes();
            meshes.forEach(mesh => {
                if (!mesh.isVisible)
                    return;
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
/*************************************************************/
/*****************COMMENCEMENT DES JEUX **********************/
/*************************************************************/
export function startGame() {
    Solo_gameStart = true;
    Multi_gameStart = false;
    AI_gameStart = false;
    tournament_game = false;
    SetIsGameFinished(false);
    // Bloquer l'appui sur Espace pendant 5 secondes
    canPressSpace = false;
    setTimeout(() => {
        canPressSpace = true; // Autoriser l'appui sur Espace après 5 secondes
        console.log("Espace activé !");
    }, 5000);
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
/*************************************************************/
/*****************QUITTER LES JEUX ***************************/
/*************************************************************/
export function leave_Game() {
    try {
        destroy_game_solo(scene);
    }
    catch (e) {
        console.error("Error cleaning up solo game:", e);
    }
    Solo_gameStart = false;
    initialized = false;
    play = false;
}
export function leave_tournament_game() {
    try {
        destroy_game_solo_tournament(scene);
    }
    catch (e) {
        console.error("Error cleaning up tournament game:", e);
    }
    tournament_game = false;
    initialized = false;
    play = false;
}
export function leave_Multiplayer_Game() {
    try {
        destroy_game_multiplayer(scene);
    }
    catch (e) {
        console.error("Error cleaning up multiplayer game:", e);
    }
    Multi_gameStart = false;
    initialized = false;
    play = false;
}
export function leave_AI_Game() {
    AI_gameStart = false;
    initialized = false;
    play = false;
}
/*************************************************************/
/*****************COMPTEUR FPS *******************************/
/*************************************************************/
const fpsDiv = document.createElement('div');
fpsDiv.style.position = 'absolute';
fpsDiv.style.top = '50px';
fpsDiv.style.left = '10px';
fpsDiv.style.color = 'green';
fpsDiv.style.zIndex = '1000';
fpsDiv.style.fontSize = '10px';
fpsDiv.style.fontFamily = 'monospace';
fpsDiv.style.backgroundColor = 'rgba(0, 0, 0, 0)';
fpsDiv.style.padding = '5px';
document.body.appendChild(fpsDiv);
let frameCount = 0;
let lastFpsUpdate = performance.now();
/***********************************************************/
/*****************BOUCLE PRINCIPALE ************************/
/***********************************************************/
let isConnected = false;
engine.runRenderLoop(() => {
    try {
        const scale = qualityLevel === 'low' ? 1.0 : window.devicePixelRatio;
        if (canvas.width !== canvas.clientWidth * scale || canvas.height !== canvas.clientHeight * scale) {
            canvas.width = canvas.clientWidth * scale;
            canvas.height = canvas.clientHeight * scale;
            engine.resize(true);
        }
        frameCount++;
        const now = performance.now();
        const delta = now - lastFpsUpdate;
        if (delta >= 250) {
            const fps = (frameCount / delta) * 1000;
            fpsDiv.textContent = `FPS: ${fps.toFixed(1)}`;
            lastFpsUpdate = now;
            frameCount = 0;
        }
        applyQualitySettings();
        const accessToken = sessionStorage.getItem('accessToken');
        if ((accessToken && accessToken !== undefined) && accessToken !== "undefined" && !isConnected) {
            isConnected = true;
            console.log("User is connectedddddddddddddddddddddddddddddd");
            handleViewTransitions("vue1", "default");
        }
        if (!(accessToken && accessToken !== undefined) && accessToken !== "undefined" && isConnected) {
            isConnected = false;
            console.log("User is disconnectedddddddddddddddddddddddddddddd");
            handleViewTransitions("vue1", "vue2");
        }
        if (Solo_gameStart && !gameIsFinished) {
            if (!initialized) {
                initializeGame_solo_game();
                initialized = true;
            }
            if (initialized) {
                // Bloquer l'appui sur Espace si canPressSpace est false
                if (scene.inputStates.space && !play) {
                    if (!canPressSpace) {
                        console.log("Espace désactivé, veuillez attendre...");
                        return;
                    }
                    play = true;
                }
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
                if (scene.inputStates.space && !play) {
                    if (!canPressSpace) {
                        console.log("Espace désactivé, veuillez attendre...");
                        return;
                    }
                    play = true;
                }
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
        if (DEBUG_MODE && now - lastDebugOutput > 5000) {
            const debugFps = engine.getFps().toFixed(1);
            console.log(`FPS: ${debugFps} | Quality: ${qualityLevel} | Active Meshes: ${scene.getActiveMeshes().length}`);
            lastDebugOutput = now;
        }
        scene.render();
        // console.log("camera position", camera.position);
        // console.log("camera rotation", camera.rotation);
    }
    catch (error) {
        console.error("Error in render loop:", error);
        if (qualityLevel !== 'low') {
            qualityLevel = 'low';
            applyQualitySettingsImmediate();
        }
    }
});
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        engine.resize(true);
    }, 100);
});
window.addEventListener('blur', () => {
    engine.hideLoadingUI();
    engine.renderEvenInBackground = false;
});
window.addEventListener('focus', () => {
    engine.renderEvenInBackground = true;
});
const DEBUG_MODE = false;
let lastDebugOutput = 0;
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
export function setQualityLevel(level) {
    if (['low', 'medium', 'high'].includes(level)) {
        qualityLevel = level;
        applyQualitySettingsImmediate();
        return true;
    }
    return false;
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFieWxvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9zcmNzL2dhbWUvZ2FtZXBsYXkvYmFieWxvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsd0JBQXdCLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5RyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDbEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN6RyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNqRyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNsRixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDN0QsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUMvRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNoRyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUNoRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDL0QsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDMUQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDbEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFFcEYsc0VBQXNFO0FB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ZW52aXJvbm1lbnRfdmlldzEsIGNyZWF0ZV9lbnZpcm9ubWVudF92aWV3MywgY3JlYXRlX2Vudmlyb25tZW50X3ZpZXcyIH0gZnJvbSBcIi4vaW5pdF9nYW1lLmpzXCI7XG5pbXBvcnQgeyBVcGRhdGVQbGF5ZXJQb3NlIH0gZnJvbSBcIi4vcGxheWVyLmpzXCI7XG5pbXBvcnQgeyBNb3ZlQmFsbCwgTW92ZUJhbGwydjIgfSBmcm9tIFwiLi9iYWxsLmpzXCI7XG5pbXBvcnQgeyBpbml0X2dhbWVfc29sbywgc3RhcnRfZ2FtZV9zb2xvLCBkZXN0cm95X2dhbWVfc29sbyB9IGZyb20gXCIuL3NvbG8vMXYxX3BsYXllci9pbml0X2dhbWVfU29sby5qc1wiO1xuaW1wb3J0IHsgaW5pdF9nYW1lX211bHRpcGxheWVyLCBkZXN0cm95X2dhbWVfbXVsdGlwbGF5ZXIgfSBmcm9tIFwiLi9tdWx0aXBsYXllci9pbml0X2dhbWVfMnYyLmpzXCI7XG5pbXBvcnQgeyBVcGRhdGVQTGF5ZXJQb3NlTXVsdGkgfSBmcm9tIFwiLi9tdWx0aXBsYXllci8ydjJfZ2FtZS9pbml0X3BsYXllcnMydjIuanNcIjtcbmltcG9ydCB7IGluaXRfZ2FtZV9haSB9IGZyb20gXCIuL3NvbG8vMXYxX2FpL2luaXRfZ2FtZV9haS5qc1wiO1xuaW1wb3J0IHsgVXBkYXRlUGxheWVyQW5kQUlfUG9zZSB9IGZyb20gXCIuL3NvbG8vMXYxX2FpL2luaXRfcGxheWVyX2FuZF9haS5qc1wiO1xuaW1wb3J0IHsgZ2FtZUlzRmluaXNoZWQsIFNldElzR2FtZUZpbmlzaGVkIH0gZnJvbSBcIi4vc2NvcmUuanNcIjtcbmltcG9ydCB7IGluaXRfZ2FtZV90b3VybmFtZW50LCBkZXN0cm95X2dhbWVfc29sb190b3VybmFtZW50IH0gZnJvbSBcIi4vdG91cm5hbWVudC90b3VybmFtZW50LmpzXCI7XG5pbXBvcnQgeyBtb3ZlX3BsYXllcl90b3VybmFtZW50IH0gZnJvbSBcIi4vdG91cm5hbWVudC9pbml0X3BsYXllcl90b3VybmFtZW50LmpzXCI7XG5pbXBvcnQgeyBpbml0X2FsbF9za2luIH0gZnJvbSBcIi4vc29sby9za2luL2luaXRfc2tpbl9wZXJzby5qc1wiO1xuaW1wb3J0IHsgaGFuZGxlVmlld1RyYW5zaXRpb25zIH0gZnJvbSBcIi4vdmlld3MvY2FtZXJhLmpzXCI7XG5pbXBvcnQgeyBnZXRfc2tpbl9pc19pbml0IH0gZnJvbSBcIi4vc29sby9za2luL2luaXRfc2tpbl91dGlscy5qc1wiO1xuaW1wb3J0IHsgaW5pdF9za2luc19wb2RpdW1fZGVmYXVsdCB9IGZyb20gXCIuL3NvbG8vc2tpbi9pbml0X3NraW5fcGxheWVyX2RlZmF1bHQuanNcIjtcblxuLy8gaW1wb3J0IHsgaW5pdF9za2luX2RlZmF1bHQgfSBmcm9tIFwiLi9zb2xvL3NraW4vaW5pdF9za2luX3BlcnNvLmpzXCI7XG5cbmNvbnNvbGUubG9nKFwiQkFCWUxPTiBKU1wiKTtcblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKipDUkVBVElPTiBEVSBNT1RFVVIqKioqKioqKioqKioqKioqKioqKioqKioqKiovIFxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgJycsICcvJyk7XG5sZXQgcXVhbGl0eUxldmVsID0gJ21lZGl1bSc7XG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVuZGVyQ2FudmFzJyk7XG5jb25zdCBlbmdpbmUgPSBuZXcgQkFCWUxPTi5FbmdpbmUoY2FudmFzLCB0cnVlLCB7XG5cdHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZSxcblx0c3RlbmNpbDogdHJ1ZSxcblx0YW50aWFsaWFzOiB0cnVlLFxuXHRhZGFwdFRvRGV2aWNlUmF0aW86IGZhbHNlLFxuXHRkaXNhYmxlV2ViR0xXYXJuaW5nczogdHJ1ZSxcblx0cG93ZXJQcmVmZXJlbmNlOiBcImhpZ2gtcGVyZm9ybWFuY2VcIlxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKkRFVEVDVElPTiBERVMgUEVSRk9STUFOQ0VTKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuZnVuY3Rpb24gZGV0ZWN0UGVyZm9ybWFuY2VMZXZlbCgpIHtcblx0dHJ5IHtcblx0XHRjb25zdCBnbCA9IGVuZ2luZS5nZXRSZW5kZXJpbmdDYW52YXMoKS5nZXRDb250ZXh0KFwid2ViZ2xcIik7XG5cdFx0Y29uc3QgZGVidWdJbmZvID0gZ2wuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvJyk7XG5cdFx0Y29uc3QgcmVuZGVyZXIgPSBnbC5nZXRQYXJhbWV0ZXIoZGVidWdJbmZvLlVOTUFTS0VEX1JFTkRFUkVSX1dFQkdMKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFxuXHRcdC8vIE1lc3VyZSBkZXMgcGVyZm9ybWFuY2VzIGluaXRpYWxlc1xuXHRcdGNvbnN0IHN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgMTAwMDsgaSsrKSB7XG5cdFx0XHRNYXRoLnNxcnQoaSk7XG5cdFx0fVxuXHRcdGNvbnN0IGVuZFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblx0XHRjb25zdCBwZXJmU2NvcmUgPSBlbmRUaW1lIC0gc3RhcnRUaW1lO1xuXHRcdFxuXHRcdC8vIETDqXRlcm1pbmVyIG5pdmVhdSBlbiBmb25jdGlvbiBkdSBHUFUgZXQgZGVzIHBlcmZvcm1hbmNlcyBDUFVcblx0XHRpZiAocmVuZGVyZXIuaW5jbHVkZXMoJ252aWRpYScpIHx8IHJlbmRlcmVyLmluY2x1ZGVzKCdhbWQnKSB8fCBwZXJmU2NvcmUgPCAxKSB7XG5cdFx0XHRyZXR1cm4gJ2hpZ2gnO1xuXHRcdH0gZWxzZSBpZiAocmVuZGVyZXIuaW5jbHVkZXMoJ2ludGVsJykgfHwgcGVyZlNjb3JlIDwgNSkge1xuXHRcdFx0cmV0dXJuICdtZWRpdW0nO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gJ2xvdyc7XG5cdFx0fVxuXHR9IGNhdGNoIChlKSB7XG5cdFx0Y29uc29sZS5sb2coXCJQZXJmb3JtYW5jZSBkZXRlY3Rpb24gZmFpbGVkLCB1c2luZyBkZWZhdWx0IHNldHRpbmdzXCIpO1xuXHRcdHJldHVybiAnbWVkaXVtJztcblx0fVxufVxuXG5cbmVuZ2luZS5nZXRSZW5kZXJpbmdDYW52YXMoKS5hZGRFdmVudExpc3RlbmVyKFwid2ViZ2xjb250ZXh0bG9zdFwiLCAoZSkgPT4ge1xuXHRjb25zb2xlLmxvZyhcIldlYkdMIGNvbnRleHQgbG9zdCEgQXR0ZW1wdGluZyB0byByZWNvdmVyLi4uXCIpO1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFxuXHQvLyBSw6lkdWlyZSBsYSBxdWFsaXTDqSBldCB0ZW50ZXIgZGUgcsOpY3Vww6lyZXJcblx0cXVhbGl0eUxldmVsID0gJ2xvdyc7XG5cdGFwcGx5UXVhbGl0eVNldHRpbmdzKCk7XG5cdFxuXHQvLyBFc3NheWVyIGRlIHJlc3RhdXJlciBhcHLDqHMgdW4gZMOpbGFpXG5cdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRlbmdpbmUucmVzaXplKHRydWUpO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihcIkZhaWxlZCB0byByZWNvdmVyIFdlYkdMIGNvbnRleHQ6XCIsIGVycik7XG5cdFx0XHRzaG93RXJyb3JNZXNzYWdlKFwiRXJyZXVyIGdyYXBoaXF1ZSBkw6l0ZWN0w6llLiBWZXVpbGxleiByYWZyYcOuY2hpciBsYSBwYWdlLlwiKTtcblx0XHR9XG5cdH0sIDEwMDApO1xufSk7XG5cbi8vIEZpbHRyZXIgbGVzIGF2ZXJ0aXNzZW1lbnRzIG5vbi1jcml0aXF1ZXNcbmNvbnN0IG9yaWdpbmFsQ29uc29sZVdhcm4gPSBjb25zb2xlLndhcm47XG5jb25zb2xlLndhcm4gPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cdGNvbnN0IGlnbm9yZWRQYXR0ZXJucyA9IFtcImdlbmVyYXRlTWlwbWFwXCIsIFwiV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mb1wiLCBcInByZWNpc2lvbiBpc3N1ZXNcIl07XG5cdGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycgJiYgaWdub3JlZFBhdHRlcm5zLnNvbWUocGF0dGVybiA9PiBtZXNzYWdlLmluY2x1ZGVzKHBhdHRlcm4pKSkge1xuXHRcdHJldHVybjtcblx0fVxuXHRvcmlnaW5hbENvbnNvbGVXYXJuLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG59O1xuXG5mdW5jdGlvbiBhcHBseVF1YWxpdHlTZXR0aW5ncygpXG57XG5cdGNvbnN0IGN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKTtcblx0ZnJhbWVDb3VudGVyKys7XG5cdFxuXHRpZiAoY3VycmVudFRpbWUgLSBsYXN0UGVyZm9ybWFuY2VDaGVjayA+IDMwMDApXG5cdHtcblx0XHRjb25zdCBjdXJyZW50RnBzID0gZnJhbWVDb3VudGVyIC8gKChjdXJyZW50VGltZSAtIGxhc3RQZXJmb3JtYW5jZUNoZWNrKSAvIDEwMDApO1xuXHRcdGZwc0hpc3RvcnkucHVzaChjdXJyZW50RnBzKTtcblx0XHRcblx0XHQvLyBHYXJkZXIgdW4gaGlzdG9yaXF1ZSBsaW1pdMOpXG5cdFx0aWYgKGZwc0hpc3RvcnkubGVuZ3RoID4gNSlcblx0XHR7XG5cdFx0XHRmcHNIaXN0b3J5LnNoaWZ0KCk7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIENhbGN1bGVyIGxhIG1veWVubmUgZGVzIEZQU1xuXHRcdGNvbnN0IGF2Z0ZwcyA9IGZwc0hpc3RvcnkucmVkdWNlKChzdW0sIGZwcykgPT4gc3VtICsgZnBzLCAwKSAvIGZwc0hpc3RvcnkubGVuZ3RoO1xuXHRcdFxuXHRcdGlmIChhdmdGcHMgPCA5MCAmJiBxdWFsaXR5TGV2ZWwgIT09ICdsb3cnKSB7XG5cdFx0XHRxdWFsaXR5TGV2ZWwgPSAnbG93Jztcblx0XHRcdGFwcGx5UXVhbGl0eVNldHRpbmdzSW1tZWRpYXRlKCk7XG5cdFx0fSBlbHNlIGlmIChhdmdGcHMgPiA1NSAmJiBxdWFsaXR5TGV2ZWwgPT09ICdsb3cnKSB7XG5cdFx0XHRxdWFsaXR5TGV2ZWwgPSAnbWVkaXVtJztcblx0XHRcdGFwcGx5UXVhbGl0eVNldHRpbmdzSW1tZWRpYXRlKCk7XG5cdFx0fSBlbHNlIGlmIChhdmdGcHMgPiA5MCAmJiBxdWFsaXR5TGV2ZWwgPT09ICdtZWRpdW0nKSB7XG5cdFx0XHRxdWFsaXR5TGV2ZWwgPSAnaGlnaCc7XG5cdFx0XHRhcHBseVF1YWxpdHlTZXR0aW5nc0ltbWVkaWF0ZSgpO1xuXHRcdH1cblx0XHRcblx0XHRsYXN0UGVyZm9ybWFuY2VDaGVjayA9IGN1cnJlbnRUaW1lO1xuXHRcdGZyYW1lQ291bnRlciA9IDA7XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlRdWFsaXR5U2V0dGluZ3NJbW1lZGlhdGUoKSB7XG5cdHN3aXRjaCAocXVhbGl0eUxldmVsKSB7XG5cdFx0Y2FzZSAnbG93Jzpcblx0XHRcdGVuZ2luZS5zZXRIYXJkd2FyZVNjYWxpbmdMZXZlbCgxKTtcblx0XHRcdHNjZW5lLnBvc3RQcm9jZXNzZXNFbmFibGVkID0gZmFsc2U7XG5cdFx0XHRwaXBlbGluZS5meGFhRW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0cGlwZWxpbmUuc2hhcnBlbkVuYWJsZWQgPSBmYWxzZTtcblx0XHRcdHBpcGVsaW5lLnNhbXBsZXMgPSAxO1xuXHRcdFx0c2NlbmUucGFydGljbGVzRW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAnbWVkaXVtJzpcblx0XHRcdGVuZ2luZS5zZXRIYXJkd2FyZVNjYWxpbmdMZXZlbCgxKTtcblx0XHRcdHNjZW5lLnBvc3RQcm9jZXNzZXNFbmFibGVkID0gZmFsc2U7XG5cdFx0XHRwaXBlbGluZS5meGFhRW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0cGlwZWxpbmUuc2hhcnBlbkVuYWJsZWQgPSBmYWxzZTtcblx0XHRcdHBpcGVsaW5lLnNhbXBsZXMgPSAxO1xuXHRcdFx0c2NlbmUucGFydGljbGVzRW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAnaGlnaCc6XG5cdFx0XHRlbmdpbmUuc2V0SGFyZHdhcmVTY2FsaW5nTGV2ZWwoMSk7XG5cdFx0XHRzY2VuZS5wb3N0UHJvY2Vzc2VzRW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0cGlwZWxpbmUuZnhhYUVuYWJsZWQgPSBmYWxzZTtcblx0XHRcdHBpcGVsaW5lLnNoYXJwZW5FbmFibGVkID0gZmFsc2U7XG5cdFx0XHRwaXBlbGluZS5zYW1wbGVzID0gMTtcblx0XHRcdHNjZW5lLnBhcnRpY2xlc0VuYWJsZWQgPSBmYWxzZTtcblx0XHRcdGJyZWFrO1xuXHR9XG5cdFxuXHQvLyBEZWJ1ZyBpbmZvXG5cdGNvbnNvbGUubG9nKGBRdWFsaXR5IGxldmVsIHNldCB0bzogJHtxdWFsaXR5TGV2ZWx9YCk7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKkNSRUFUSU9OIERFIExBIFNDRU5FKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxud2luZG93LnNjZW5lID0gbmV3IEJBQllMT04uU2NlbmUoZW5naW5lKTtcbnNjZW5lLmNsZWFyQ29sb3IgPSBuZXcgQkFCWUxPTi5Db2xvcjQoMCwgMCwgMCwgMSk7XG5zY2VuZS5ibG9ja01hdGVyaWFsRGlydHlNZWNoYW5pc20gPSB0cnVlO1xuXG53aW5kb3cuY2FtZXJhID0gbmV3IEJBQllMT04uRnJlZUNhbWVyYShcImNhbWVyYVwiLCBuZXcgQkFCWUxPTi5WZWN0b3IzKC00NS43OTMwMTk1MTA2NTk4MiwgNS44Nzk3MzUzNzEwNDQ3ODksIC0zMS4zNDIyMTA5NDcwODEzMTMpLCBzY2VuZSk7XG5jYW1lcmEucm90YXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKC0wLjAyOTY2NTI4MDA2OTAxMTY2NywgLTIuNTY2Mzg3MDg1Nzk0NzEyLCAwKTtcbmNhbWVyYS5taW5aID0gMC4xO1xuY2FtZXJhLm1heFogPSA1MDAwO1xuLy8gY2FtZXJhLmF0dGFjaENvbnRyb2woY2FudmFzLCBmYWxzZSk7XG5jYW1lcmEuc3BlZWQgPSAxO1xuXG5jb25zdCBwaXBlbGluZSA9IG5ldyBCQUJZTE9OLkRlZmF1bHRSZW5kZXJpbmdQaXBlbGluZShcImRlZmF1bHRQaXBlbGluZVwiLCB0cnVlLCBzY2VuZSwgW2NhbWVyYV0pO1xuXG5jb25zdCBhbWJpZW50TGlnaHQgPSBuZXcgQkFCWUxPTi5IZW1pc3BoZXJpY0xpZ2h0KFwiYW1iaWVudExpZ2h0XCIsIG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgMSwgMCksIHNjZW5lKTtcbmFtYmllbnRMaWdodC5pbnRlbnNpdHkgPSAzO1xuXG5mdW5jdGlvbiBjcmVhdGVPcHRpbWl6ZWRTa3lib3goc2NlbmUpIHtcblx0Y29uc3Qgc2ltcGxpZmllZFNreWJveCA9IHF1YWxpdHlMZXZlbCA9PT0gJ2xvdyc7XG5cdFxuXHRjb25zdCBza3lNYXRlcmlhbCA9IG5ldyBCQUJZTE9OLlN0YW5kYXJkTWF0ZXJpYWwoXCJza3lNYXRlcmlhbFwiLCBzY2VuZSk7XG5cdHNreU1hdGVyaWFsLmJhY2tGYWNlQ3VsbGluZyA9IGZhbHNlO1xuXHRza3lNYXRlcmlhbC5zcGVjdWxhckNvbG9yID0gbmV3IEJBQllMT04uQ29sb3IzKDAsIDAsIDApO1xuXHRza3lNYXRlcmlhbC5lbWlzc2l2ZUNvbG9yID0gbmV3IEJBQllMT04uQ29sb3IzKDEsIDEsIDEpO1xuXHRcblx0Ly8gVGV4dHVyZSBhdmVjIHBhcmFtw6h0cmVzIGFkYXB0w6lzIMOgIGxhIHF1YWxpdMOpXG5cdGNvbnN0IHNreVRleHR1cmUgPSBuZXcgQkFCWUxPTi5UZXh0dXJlKFwiL3NyY3MvZ2FtZS9hc3NldHMvc2t5Ym94L3NreWJveC5qcGdcIiwgc2NlbmUpO1xuXHRza3lUZXh0dXJlLmNvb3JkaW5hdGVzTW9kZSA9IEJBQllMT04uVGV4dHVyZS5TUEhFUklDQUxfTU9ERTtcblx0c2t5VGV4dHVyZS5oYXNBbHBoYSA9IGZhbHNlO1xuXHRza3lUZXh0dXJlLmdlbmVyYXRlTWlwTWFwcyA9ICFzaW1wbGlmaWVkU2t5Ym94O1xuXHRza3lUZXh0dXJlLnVwZGF0ZVNhbXBsaW5nTW9kZShzaW1wbGlmaWVkU2t5Ym94ID8gXG5cdFx0QkFCWUxPTi5UZXh0dXJlLk5FQVJFU1RfTkVBUkVTVCA6IFxuXHRcdEJBQllMT04uVGV4dHVyZS5ORUFSRVNUX0xJTkVBUik7XG5cdFxuXHRza3lNYXRlcmlhbC5kaWZmdXNlVGV4dHVyZSA9IHNreVRleHR1cmU7XG5cdFxuXHQvLyBDcsOpZXIgdW5lIHNwaMOocmUgb3B0aW1pc8OpZVxuXHRjb25zdCBzZWdtZW50c0NvdW50ID0gc2ltcGxpZmllZFNreWJveCA/IDE2IDogMzI7XG5cdGNvbnN0IHNreVNwaGVyZSA9IEJBQllMT04uTWVzaEJ1aWxkZXIuQ3JlYXRlU3BoZXJlKFwic2t5U3BoZXJlXCIsIHtcblx0XHRkaWFtZXRlcjogNTAwMCwgXG5cdFx0c2VnbWVudHM6IHNlZ21lbnRzQ291bnQsXG5cdFx0c2lkZU9yaWVudGF0aW9uOiBCQUJZTE9OLk1lc2guQkFDS1NJREVcblx0fSwgc2NlbmUpO1xuXHRcblx0c2t5U3BoZXJlLm1hdGVyaWFsID0gc2t5TWF0ZXJpYWw7XG5cdHNreVNwaGVyZS5pc1BpY2thYmxlID0gZmFsc2U7XG5cdHNreVNwaGVyZS5pbmZpbml0ZURpc3RhbmNlID0gdHJ1ZTtcblx0c2t5U3BoZXJlLnNjYWxpbmcueSA9IC0xO1xuXG5cdHNreVNwaGVyZS5mcmVlemVXb3JsZE1hdHJpeCgpO1xuXHRza3lTcGhlcmUuZG9Ob3RTeW5jQm91bmRpbmdJbmZvID0gdHJ1ZTtcblx0c2t5TWF0ZXJpYWwuZnJlZXplKCk7XG5cdFxuXHRyZXR1cm4gc2t5U3BoZXJlO1xufVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKipWQVJJQUJMRSBERSBKRVVYICoqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxubGV0IGluaXRpYWxpemVkID0gZmFsc2U7XG5sZXQgcGxheWVyXzEsIHBsYXllcl8yLCBwbGF5ZXJfMywgcGxheWVyXzQsIHBsYXllcl8xX3RvdXJuYW1lbnQsIHBsYXllcl8yX3RvdXJuYW1lbnQsIEFJX3BsYXllciwgYmFsbDtcbmxldCBTb2xvX2dhbWVTdGFydCA9IGZhbHNlO1xubGV0IE11bHRpX2dhbWVTdGFydCA9IGZhbHNlO1xubGV0IEFJX2dhbWVTdGFydCA9IGZhbHNlO1xubGV0IHRvdXJuYW1lbnRfZ2FtZSA9IGZhbHNlO1xubGV0IHBsYXkgPSBmYWxzZTtcbmxldCBjYW5QcmVzc1NwYWNlID0gZmFsc2U7IC8vIE5vdXZlYXUgZHJhcGVhdSBwb3VyIGJsb3F1ZXIgbCdhcHB1aSBzdXIgRXNwYWNlXG5sZXQgbGFzdFBlcmZvcm1hbmNlQ2hlY2sgPSBEYXRlLm5vdygpO1xubGV0IGZyYW1lQ291bnRlciA9IDA7XG5sZXQgZnBzSGlzdG9yeSA9IFtdO1xuXG5cbmNyZWF0ZV9lbnZpcm9ubWVudF92aWV3MShzY2VuZSk7XG5jcmVhdGVfZW52aXJvbm1lbnRfdmlldzMoc2NlbmUpO1xuY3JlYXRlX2Vudmlyb25tZW50X3ZpZXcyKHNjZW5lKTtcbmNvbnNvbGUubG9nKFwiY3JlYXRlX2Vudmlyb25tZW50X3ZpZXcxXCIpO1xuLy8gaW5pdF9hbGxfc2tpbihzY2VuZSk7XG5jb25zdCBza3lib3ggPSBjcmVhdGVPcHRpbWl6ZWRTa3lib3goc2NlbmUpO1xuXG5sZXQgc2tpbiA9IGdldF9za2luX2lzX2luaXQoKTtcbmlmIChza2luID09PSBmYWxzZSkge1xuXHRpbml0X3NraW5zX3BvZGl1bV9kZWZhdWx0KHNjZW5lKTtcbn1cblxucXVhbGl0eUxldmVsID0gZGV0ZWN0UGVyZm9ybWFuY2VMZXZlbCgpO1xuYXBwbHlRdWFsaXR5U2V0dGluZ3NJbW1lZGlhdGUoKTtcblxuc2NlbmUuaW5wdXRTdGF0ZXMgPSB7IHNwYWNlOiBmYWxzZSB9O1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2ZW50KSA9PiB7XG5cdGlmIChldmVudC5jb2RlID09PSBcIlNwYWNlXCIpIHtcblx0XHRzY2VuZS5pbnB1dFN0YXRlcy5zcGFjZSA9IHRydWU7XG5cdH1cbn0pO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIChldmVudCkgPT4ge1xuXHRpZiAoZXZlbnQuY29kZSA9PT0gXCJTcGFjZVwiKSB7XG5cdFx0c2NlbmUuaW5wdXRTdGF0ZXMuc3BhY2UgPSBmYWxzZTtcblx0fVxufSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqSU5JVElBTElTQVRJT04gREVTIEpFVVggKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuYXN5bmMgZnVuY3Rpb24gaW5pdGlhbGl6ZUdhbWVfc29sb19nYW1lKCkge1xuXHR0cnkge1xuXHRcdGxldCBwbGF5ZXJzID0gYXdhaXQgaW5pdF9nYW1lX3NvbG8oc2NlbmUpO1xuXHRcdHBsYXllcl8xID0gcGxheWVycy5wbGF5ZXJfMTtcblx0XHRwbGF5ZXJfMiA9IHBsYXllcnMucGxheWVyXzI7XG5cdFx0YmFsbCA9IHBsYXllcnMuYmFsbDtcblx0XHRvcHRpbWl6ZUdhbWVPYmplY3RzKFtwbGF5ZXJfMSwgcGxheWVyXzIsIGJhbGxdKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3IgaW5pdGlhbGl6aW5nIHNvbG8gZ2FtZTpcIiwgZXJyb3IpO1xuXHRcdGhhbmRsZUdhbWVJbml0RXJyb3IoKTtcblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplX011bHRpcGxheWVyX2dhbWUoKSB7XG5cdHRyeSB7XG5cdFx0bGV0IHBsYXllcnMgPSBhd2FpdCBpbml0X2dhbWVfbXVsdGlwbGF5ZXIoc2NlbmUpO1xuXHRcdHBsYXllcl8xID0gcGxheWVycy5wbGF5ZXJfMTtcblx0XHRwbGF5ZXJfMiA9IHBsYXllcnMucGxheWVyXzI7XG5cdFx0cGxheWVyXzMgPSBwbGF5ZXJzLnBsYXllcl8zO1xuXHRcdHBsYXllcl80ID0gcGxheWVycy5wbGF5ZXJfNDtcblx0XHRiYWxsID0gcGxheWVycy5iYWxsO1xuXHRcdG9wdGltaXplR2FtZU9iamVjdHMoW3BsYXllcl8xLCBwbGF5ZXJfMiwgcGxheWVyXzMsIHBsYXllcl80LCBiYWxsXSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihcIkVycm9yIGluaXRpYWxpemluZyBtdWx0aXBsYXllciBnYW1lOlwiLCBlcnJvcik7XG5cdFx0aGFuZGxlR2FtZUluaXRFcnJvcigpO1xuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGluaXRpYWxpemVfQUlfZ2FtZSgpIHtcblx0dHJ5IHtcblx0XHRsZXQgcGxheWVycyA9IGF3YWl0IGluaXRfZ2FtZV9haShzY2VuZSk7XG5cdFx0cGxheWVyXzEgPSBwbGF5ZXJzLnBsYXllcl8xO1xuXHRcdEFJX3BsYXllciA9IHBsYXllcnMuYWlfcGxheWVyO1xuXHRcdGJhbGwgPSBwbGF5ZXJzLmJhbGw7XG5cdFx0b3B0aW1pemVHYW1lT2JqZWN0cyhbcGxheWVyXzEsIEFJX3BsYXllciwgYmFsbF0pO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJFcnJvciBpbml0aWFsaXppbmcgQUkgZ2FtZTpcIiwgZXJyb3IpO1xuXHRcdGhhbmRsZUdhbWVJbml0RXJyb3IoKTtcblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplR2FtZV90b3VybmFtZW50KCkge1xuXHR0cnkge1xuXHRcdGxldCBwbGF5ZXJzID0gYXdhaXQgaW5pdF9nYW1lX3RvdXJuYW1lbnQoc2NlbmUpO1xuXHRcdHBsYXllcl8xX3RvdXJuYW1lbnQgPSBwbGF5ZXJzLnBsYXllcl8xX3RvdXJuYW1lbnQ7XG5cdFx0cGxheWVyXzJfdG91cm5hbWVudCA9IHBsYXllcnMucGxheWVyXzJfdG91cm5hbWVudDtcblx0XHRiYWxsID0gcGxheWVycy5iYWxsO1xuXHRcdG9wdGltaXplR2FtZU9iamVjdHMoW3BsYXllcl8xX3RvdXJuYW1lbnQsIHBsYXllcl8yX3RvdXJuYW1lbnQsIGJhbGxdKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3IgaW5pdGlhbGl6aW5nIHRvdXJuYW1lbnQgZ2FtZTpcIiwgZXJyb3IpO1xuXHRcdGhhbmRsZUdhbWVJbml0RXJyb3IoKTtcblx0fVxufVxuXG5mdW5jdGlvbiBvcHRpbWl6ZUdhbWVPYmplY3RzKG9iamVjdHMpIHtcblx0b2JqZWN0cy5mb3JFYWNoKG9iaiA9PiB7XG5cdFx0aWYgKCFvYmopIHJldHVybjtcblx0XHRcblx0XHQvLyBPcHRpbWlzZXIgbGVzIG1lc2hlcyBzaSBwb3NzaWJsZVxuXHRcdGlmIChvYmouZ2V0Q2hpbGRNZXNoZXMpIHtcblx0XHRcdGNvbnN0IG1lc2hlcyA9IG9iai5nZXRDaGlsZE1lc2hlcygpO1xuXHRcdFx0bWVzaGVzLmZvckVhY2gobWVzaCA9PiB7XG5cdFx0XHRcdGlmICghbWVzaC5pc1Zpc2libGUpIHJldHVybjtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChxdWFsaXR5TGV2ZWwgPT09ICdsb3cnKSB7XG5cdFx0XHRcdFx0Ly8gU2ltcGxpZmllciBsZSBtYWlsbGFnZSBwb3VyIGxlcyBhcHBhcmVpbHMgw6AgZmFpYmxlcyBwZXJmb3JtYW5jZXNcblx0XHRcdFx0XHRpZiAobWVzaC5zaW1wbGlmeSkge1xuXHRcdFx0XHRcdFx0bWVzaC5zaW1wbGlmeShbeyBxdWFsaXR5OiAwLjUsIGRpc3RhbmNlOiA1MCB9XSwgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBPcHRpbWlzYXRpb25zIGNvbW11bmVzXG5cdFx0XHRcdC8vIG1lc2guZnJlZXplV29ybGRNYXRyaXgoKTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIETDqXNhY3RpdmVyIGxlcyBmb25jdGlvbm5hbGl0w6lzIGNvw7t0ZXVzZXMgc3VyIGxlcyBtYWlsbGFnZXMgbm9uIGVzc2VudGllbHNcblx0XHRcdFx0aWYgKCFtZXNoLm5hbWUuaW5jbHVkZXMoXCJwbGF5ZXJcIikgJiYgIW1lc2gubmFtZS5pbmNsdWRlcyhcImJhbGxcIikpIHtcblx0XHRcdFx0XHRtZXNoLmRvTm90U3luY0JvdW5kaW5nSW5mbyA9IHRydWU7XG5cdFx0XHRcdFx0bWVzaC5hbHdheXNTZWxlY3RBc0FjdGl2ZU1lc2ggPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuLy8gR2VzdGlvbiBkZXMgZXJyZXVycyBkJ2luaXRpYWxpc2F0aW9uXG5mdW5jdGlvbiBoYW5kbGVHYW1lSW5pdEVycm9yKCkge1xuXHRjb25zb2xlLmVycm9yKFwiR2FtZSBpbml0aWFsaXphdGlvbiBmYWlsZWQuIFJlc2V0dGluZyB0byBtZW51Li4uXCIpO1xuXHRpbml0aWFsaXplZCA9IGZhbHNlO1xuXHRwbGF5ID0gZmFsc2U7XG5cdFxuXHQvLyBSw6lpbml0aWFsaXNlciB0b3VzIGxlcyBkcmFwZWF1eCBkZSBtb2RlIGRlIGpldVxuXHRTb2xvX2dhbWVTdGFydCA9IGZhbHNlO1xuXHRNdWx0aV9nYW1lU3RhcnQgPSBmYWxzZTtcblx0QUlfZ2FtZVN0YXJ0ID0gZmFsc2U7XG5cdHRvdXJuYW1lbnRfZ2FtZSA9IGZhbHNlO1xuXHRcblx0Ly8gQWZmaWNoZXIgdW4gbWVzc2FnZSBkJ2VycmV1ciDDoCBsJ3V0aWxpc2F0ZXVyIGljaSBzaSBuw6ljZXNzYWlyZVxuXHRjb25zdCBlcnJvck1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0ZXJyb3JNZXNzYWdlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblx0ZXJyb3JNZXNzYWdlLnN0eWxlLnRvcCA9ICc1MCUnO1xuXHRlcnJvck1lc3NhZ2Uuc3R5bGUubGVmdCA9ICc1MCUnO1xuXHRlcnJvck1lc3NhZ2Uuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSc7XG5cdGVycm9yTWVzc2FnZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgwLDAsMCwwLjgpJztcblx0ZXJyb3JNZXNzYWdlLnN0eWxlLmNvbG9yID0gJ3doaXRlJztcblx0ZXJyb3JNZXNzYWdlLnN0eWxlLnBhZGRpbmcgPSAnMjBweCc7XG5cdGVycm9yTWVzc2FnZS5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnNXB4Jztcblx0ZXJyb3JNZXNzYWdlLnN0eWxlLnpJbmRleCA9ICcxMDAwJztcblx0ZXJyb3JNZXNzYWdlLnRleHRDb250ZW50ID0gJ0VycmV1ciBsb3JzIGR1IGNoYXJnZW1lbnQgZHUgamV1LiBSZXRvdXIgYXUgbWVudS4uLic7XG5cdFxuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVycm9yTWVzc2FnZSk7XG5cdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZXJyb3JNZXNzYWdlKTtcblx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvR2FtZV9tZW51JzsgLy8gUmVkaXJpZ2VyIHZlcnMgbGUgbWVudVxuXHR9LCAzMDAwKTtcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKipDT01NRU5DRU1FTlQgREVTIEpFVVggKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRHYW1lKCkge1xuXHRTb2xvX2dhbWVTdGFydCA9IHRydWU7XG5cdE11bHRpX2dhbWVTdGFydCA9IGZhbHNlO1xuXHRBSV9nYW1lU3RhcnQgPSBmYWxzZTtcblx0dG91cm5hbWVudF9nYW1lID0gZmFsc2U7XG5cdFNldElzR2FtZUZpbmlzaGVkKGZhbHNlKTtcblxuXHQvLyBCbG9xdWVyIGwnYXBwdWkgc3VyIEVzcGFjZSBwZW5kYW50IDUgc2Vjb25kZXNcblx0Y2FuUHJlc3NTcGFjZSA9IGZhbHNlO1xuXHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRjYW5QcmVzc1NwYWNlID0gdHJ1ZTsgLy8gQXV0b3Jpc2VyIGwnYXBwdWkgc3VyIEVzcGFjZSBhcHLDqHMgNSBzZWNvbmRlc1xuXHRcdGNvbnNvbGUubG9nKFwiRXNwYWNlIGFjdGl2w6kgIVwiKTtcblx0fSwgNTAwMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydE11bHRpR2FtZSgpIHtcblx0TXVsdGlfZ2FtZVN0YXJ0ID0gdHJ1ZTtcblx0U29sb19nYW1lU3RhcnQgPSBmYWxzZTtcblx0QUlfZ2FtZVN0YXJ0ID0gZmFsc2U7XG5cdHRvdXJuYW1lbnRfZ2FtZSA9IGZhbHNlO1xuXHRTZXRJc0dhbWVGaW5pc2hlZChmYWxzZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydEFJX0dhbWUoKSB7XG5cdEFJX2dhbWVTdGFydCA9IHRydWU7XG5cdFNvbG9fZ2FtZVN0YXJ0ID0gZmFsc2U7XG5cdE11bHRpX2dhbWVTdGFydCA9IGZhbHNlO1xuXHR0b3VybmFtZW50X2dhbWUgPSBmYWxzZTtcblx0U2V0SXNHYW1lRmluaXNoZWQoZmFsc2UpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRUb3VybmFtZW50R2FtZSgpIHtcblx0dG91cm5hbWVudF9nYW1lID0gdHJ1ZTtcblx0U29sb19nYW1lU3RhcnQgPSBmYWxzZTtcblx0TXVsdGlfZ2FtZVN0YXJ0ID0gZmFsc2U7XG5cdEFJX2dhbWVTdGFydCA9IGZhbHNlO1xuXHRTZXRJc0dhbWVGaW5pc2hlZChmYWxzZSk7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqUVVJVFRFUiBMRVMgSkVVWCAqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGxlYXZlX0dhbWUoKSB7XG5cdHRyeSB7XG5cdFx0ZGVzdHJveV9nYW1lX3NvbG8oc2NlbmUpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Y29uc29sZS5lcnJvcihcIkVycm9yIGNsZWFuaW5nIHVwIHNvbG8gZ2FtZTpcIiwgZSk7XG5cdH1cblx0U29sb19nYW1lU3RhcnQgPSBmYWxzZTtcblx0aW5pdGlhbGl6ZWQgPSBmYWxzZTtcblx0cGxheSA9IGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGVhdmVfdG91cm5hbWVudF9nYW1lKCkge1xuXHR0cnkge1xuXHRcdGRlc3Ryb3lfZ2FtZV9zb2xvX3RvdXJuYW1lbnQoc2NlbmUpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Y29uc29sZS5lcnJvcihcIkVycm9yIGNsZWFuaW5nIHVwIHRvdXJuYW1lbnQgZ2FtZTpcIiwgZSk7XG5cdH1cblx0dG91cm5hbWVudF9nYW1lID0gZmFsc2U7XG5cdGluaXRpYWxpemVkID0gZmFsc2U7XG5cdHBsYXkgPSBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxlYXZlX011bHRpcGxheWVyX0dhbWUoKSB7XG5cdHRyeSB7XG5cdFx0ZGVzdHJveV9nYW1lX211bHRpcGxheWVyKHNjZW5lKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJFcnJvciBjbGVhbmluZyB1cCBtdWx0aXBsYXllciBnYW1lOlwiLCBlKTtcblx0fVxuXHRNdWx0aV9nYW1lU3RhcnQgPSBmYWxzZTtcblx0aW5pdGlhbGl6ZWQgPSBmYWxzZTtcblx0cGxheSA9IGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGVhdmVfQUlfR2FtZSgpIHtcblx0QUlfZ2FtZVN0YXJ0ID0gZmFsc2U7XG5cdGluaXRpYWxpemVkID0gZmFsc2U7XG5cdHBsYXkgPSBmYWxzZTtcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKipDT01QVEVVUiBGUFMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBmcHNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmZwc0Rpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5mcHNEaXYuc3R5bGUudG9wID0gJzUwcHgnO1xuZnBzRGl2LnN0eWxlLmxlZnQgPSAnMTBweCc7XG5mcHNEaXYuc3R5bGUuY29sb3IgPSAnZ3JlZW4nO1xuZnBzRGl2LnN0eWxlLnpJbmRleCA9ICcxMDAwJztcbmZwc0Rpdi5zdHlsZS5mb250U2l6ZSA9ICcxMHB4JztcbmZwc0Rpdi5zdHlsZS5mb250RmFtaWx5ID0gJ21vbm9zcGFjZSc7XG5mcHNEaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMCwgMCwgMCwgMCknO1xuZnBzRGl2LnN0eWxlLnBhZGRpbmcgPSAnNXB4JztcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZnBzRGl2KTtcbmxldCBmcmFtZUNvdW50ID0gMDtcbmxldCBsYXN0RnBzVXBkYXRlID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKkJPVUNMRSBQUklOQ0lQQUxFICoqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxubGV0IGlzQ29ubmVjdGVkID0gZmFsc2U7XG5cblxuZW5naW5lLnJ1blJlbmRlckxvb3AoKCkgPT4ge1xuXHR0cnlcblx0e1xuXHRcdGNvbnN0IHNjYWxlID0gcXVhbGl0eUxldmVsID09PSAnbG93JyA/IDEuMCA6IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuXHRcdGlmIChjYW52YXMud2lkdGggIT09IGNhbnZhcy5jbGllbnRXaWR0aCAqIHNjYWxlIHx8IGNhbnZhcy5oZWlnaHQgIT09IGNhbnZhcy5jbGllbnRIZWlnaHQgKiBzY2FsZSkge1xuXHRcdFx0Y2FudmFzLndpZHRoID0gY2FudmFzLmNsaWVudFdpZHRoICogc2NhbGU7XG5cdFx0XHRjYW52YXMuaGVpZ2h0ID0gY2FudmFzLmNsaWVudEhlaWdodCAqIHNjYWxlO1xuXHRcdFx0ZW5naW5lLnJlc2l6ZSh0cnVlKTtcblx0XHR9XG5cdFx0ZnJhbWVDb3VudCsrO1xuXHRcdGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXHRcdGNvbnN0IGRlbHRhID0gbm93IC0gbGFzdEZwc1VwZGF0ZTtcblx0XHRpZiAoZGVsdGEgPj0gMjUwKSB7XG5cdFx0XHRjb25zdCBmcHMgPSAoZnJhbWVDb3VudCAvIGRlbHRhKSAqIDEwMDA7XG5cdFx0XHRmcHNEaXYudGV4dENvbnRlbnQgPSBgRlBTOiAke2Zwcy50b0ZpeGVkKDEpfWA7XG5cdFx0XHRsYXN0RnBzVXBkYXRlID0gbm93O1xuXHRcdFx0ZnJhbWVDb3VudCA9IDA7XG5cdFx0fVxuXHRcdGFwcGx5UXVhbGl0eVNldHRpbmdzKCk7XG5cdFx0Y29uc3QgYWNjZXNzVG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhY2Nlc3NUb2tlbicpO1xuXHRcdGlmICgoYWNjZXNzVG9rZW4gJiYgYWNjZXNzVG9rZW4gIT09IHVuZGVmaW5lZCkgJiYgYWNjZXNzVG9rZW4gIT09IFwidW5kZWZpbmVkXCIgJiYgIWlzQ29ubmVjdGVkKSB7XG5cdFx0XHRpc0Nvbm5lY3RlZCA9IHRydWU7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlVzZXIgaXMgY29ubmVjdGVkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRcIik7XG5cdFx0XHRoYW5kbGVWaWV3VHJhbnNpdGlvbnMoXCJ2dWUxXCIsIFwiZGVmYXVsdFwiKTtcblx0XHR9XG5cblx0XHRpZiAoIShhY2Nlc3NUb2tlbiAmJiBhY2Nlc3NUb2tlbiAhPT0gdW5kZWZpbmVkKSAmJiBhY2Nlc3NUb2tlbiAhPT0gXCJ1bmRlZmluZWRcIiAmJiBpc0Nvbm5lY3RlZCkge1xuXHRcdFx0aXNDb25uZWN0ZWQgPSBmYWxzZTtcblx0XHRcdGNvbnNvbGUubG9nKFwiVXNlciBpcyBkaXNjb25uZWN0ZWRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZFwiKTtcblx0XHRcdGhhbmRsZVZpZXdUcmFuc2l0aW9ucyhcInZ1ZTFcIiwgXCJ2dWUyXCIpO1xuXHRcdH1cblxuXHRcdGlmIChTb2xvX2dhbWVTdGFydCAmJiAhZ2FtZUlzRmluaXNoZWQpIHtcblx0XHRcdGlmICghaW5pdGlhbGl6ZWQpIHtcblx0XHRcdFx0aW5pdGlhbGl6ZUdhbWVfc29sb19nYW1lKCk7XG5cdFx0XHRcdGluaXRpYWxpemVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChpbml0aWFsaXplZCkge1xuXHRcdFx0XHQvLyBCbG9xdWVyIGwnYXBwdWkgc3VyIEVzcGFjZSBzaSBjYW5QcmVzc1NwYWNlIGVzdCBmYWxzZVxuXHRcdFx0XHRpZiAoc2NlbmUuaW5wdXRTdGF0ZXMuc3BhY2UgJiYgIXBsYXkpIHtcblx0XHRcdFx0XHRpZiAoIWNhblByZXNzU3BhY2UpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiRXNwYWNlIGTDqXNhY3RpdsOpLCB2ZXVpbGxleiBhdHRlbmRyZS4uLlwiKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cGxheSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHBsYXkpIHtcblx0XHRcdFx0XHRjb25zdCBib251c1BsYXllciA9IFVwZGF0ZVBsYXllclBvc2UocGxheWVyXzEsIHBsYXllcl8yKTtcblx0XHRcdFx0XHRNb3ZlQmFsbChwbGF5ZXJfMSwgcGxheWVyXzIsIGJhbGwsIGJvbnVzUGxheWVyLnBsYXllcl8xX2JvbnVzLCBib251c1BsYXllci5wbGF5ZXJfMl9ib251cyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoTXVsdGlfZ2FtZVN0YXJ0ICYmICFnYW1lSXNGaW5pc2hlZCkge1xuXHRcdFx0aWYgKCFpbml0aWFsaXplZCkge1xuXHRcdFx0XHRpbml0aWFsaXplX011bHRpcGxheWVyX2dhbWUoKTtcblx0XHRcdFx0aW5pdGlhbGl6ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGluaXRpYWxpemVkKSB7XG5cdFx0XHRcdGlmIChzY2VuZS5pbnB1dFN0YXRlcy5zcGFjZSAmJiAhcGxheSlcblx0XHRcdFx0XHRwbGF5ID0gdHJ1ZTtcblx0XHRcdFx0aWYgKHBsYXkpIHtcblx0XHRcdFx0XHRVcGRhdGVQTGF5ZXJQb3NlTXVsdGkocGxheWVyXzEsIHBsYXllcl8yLCBwbGF5ZXJfMywgcGxheWVyXzQpO1xuXHRcdFx0XHRcdE1vdmVCYWxsMnYyKHBsYXllcl8xLCBwbGF5ZXJfMiwgcGxheWVyXzMsIHBsYXllcl80LCBiYWxsKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChBSV9nYW1lU3RhcnQgJiYgIWdhbWVJc0ZpbmlzaGVkKSB7XG5cdFx0XHRpZiAoIWluaXRpYWxpemVkKSB7XG5cdFx0XHRcdGluaXRpYWxpemVfQUlfZ2FtZSgpO1xuXHRcdFx0XHRpbml0aWFsaXplZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaW5pdGlhbGl6ZWQpIHtcblx0XHRcdFx0aWYgKHNjZW5lLmlucHV0U3RhdGVzLnNwYWNlICYmICFwbGF5KSB7XG5cdFx0XHRcdFx0aWYgKCFjYW5QcmVzc1NwYWNlKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkVzcGFjZSBkw6lzYWN0aXbDqSwgdmV1aWxsZXogYXR0ZW5kcmUuLi5cIik7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHBsYXkgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwbGF5KSB7XG5cdFx0XHRcdFx0VXBkYXRlUGxheWVyQW5kQUlfUG9zZShwbGF5ZXJfMSwgQUlfcGxheWVyLCBiYWxsKTtcblx0XHRcdFx0XHRNb3ZlQmFsbChwbGF5ZXJfMSwgQUlfcGxheWVyLCBiYWxsKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0b3VybmFtZW50X2dhbWUgJiYgIWdhbWVJc0ZpbmlzaGVkKSB7XG5cdFx0XHRpZiAoIWluaXRpYWxpemVkKSB7XG5cdFx0XHRcdGluaXRpYWxpemVHYW1lX3RvdXJuYW1lbnQoKTtcblx0XHRcdFx0aW5pdGlhbGl6ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGluaXRpYWxpemVkKSB7XG5cdFx0XHRcdGlmIChzY2VuZS5pbnB1dFN0YXRlcy5zcGFjZSAmJiAhcGxheSlcblx0XHRcdFx0XHRwbGF5ID0gdHJ1ZTtcblx0XHRcdFx0aWYgKHBsYXkpIHtcblx0XHRcdFx0XHRtb3ZlX3BsYXllcl90b3VybmFtZW50KHBsYXllcl8xX3RvdXJuYW1lbnQsIHBsYXllcl8yX3RvdXJuYW1lbnQpO1xuXHRcdFx0XHRcdE1vdmVCYWxsKHBsYXllcl8xX3RvdXJuYW1lbnQsIHBsYXllcl8yX3RvdXJuYW1lbnQsIGJhbGwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKERFQlVHX01PREUgJiYgbm93IC0gbGFzdERlYnVnT3V0cHV0ID4gNTAwMCkge1xuXHRcdFx0Y29uc3QgZGVidWdGcHMgPSBlbmdpbmUuZ2V0RnBzKCkudG9GaXhlZCgxKTtcblx0XHRcdGNvbnNvbGUubG9nKGBGUFM6ICR7ZGVidWdGcHN9IHwgUXVhbGl0eTogJHtxdWFsaXR5TGV2ZWx9IHwgQWN0aXZlIE1lc2hlczogJHtzY2VuZS5nZXRBY3RpdmVNZXNoZXMoKS5sZW5ndGh9YCk7XG5cdFx0XHRsYXN0RGVidWdPdXRwdXQgPSBub3c7XG5cdFx0fVxuXG5cdFx0c2NlbmUucmVuZGVyKCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY2FtZXJhIHBvc2l0aW9uXCIsIGNhbWVyYS5wb3NpdGlvbik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY2FtZXJhIHJvdGF0aW9uXCIsIGNhbWVyYS5yb3RhdGlvbik7XG5cblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3IgaW4gcmVuZGVyIGxvb3A6XCIsIGVycm9yKTtcblx0XHRpZiAocXVhbGl0eUxldmVsICE9PSAnbG93Jykge1xuXHRcdFx0cXVhbGl0eUxldmVsID0gJ2xvdyc7XG5cdFx0XHRhcHBseVF1YWxpdHlTZXR0aW5nc0ltbWVkaWF0ZSgpO1xuXHRcdH1cblx0fVxufSk7XG5cbmxldCByZXNpemVUaW1lb3V0O1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcblx0Y2xlYXJUaW1lb3V0KHJlc2l6ZVRpbWVvdXQpO1xuXHRyZXNpemVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0ZW5naW5lLnJlc2l6ZSh0cnVlKTtcblx0fSwgMTAwKTtcbn0pO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsICgpID0+IHtcblx0ZW5naW5lLmhpZGVMb2FkaW5nVUkoKTtcblx0ZW5naW5lLnJlbmRlckV2ZW5JbkJhY2tncm91bmQgPSBmYWxzZTtcbn0pO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCAoKSA9PiB7XG5cdGVuZ2luZS5yZW5kZXJFdmVuSW5CYWNrZ3JvdW5kID0gdHJ1ZTtcbn0pO1xuXG5jb25zdCBERUJVR19NT0RFID0gZmFsc2U7XG5sZXQgbGFzdERlYnVnT3V0cHV0ID0gMDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNvbG9HYW1lU3RhcnQoKSB7XG5cdHJldHVybiBTb2xvX2dhbWVTdGFydDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE11bHRpR2FtZVN0YXJ0KCkge1xuXHRyZXR1cm4gTXVsdGlfZ2FtZVN0YXJ0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QUlHYW1lU3RhcnQoKSB7XG5cdHJldHVybiBBSV9nYW1lU3RhcnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUb3VybmFtZW50R2FtZVN0YXJ0KCkge1xuXHRyZXR1cm4gdG91cm5hbWVudF9nYW1lO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0UXVhbGl0eUxldmVsKGxldmVsKSB7XG5cdGlmIChbJ2xvdycsICdtZWRpdW0nLCAnaGlnaCddLmluY2x1ZGVzKGxldmVsKSkge1xuXHRcdHF1YWxpdHlMZXZlbCA9IGxldmVsO1xuXHRcdGFwcGx5UXVhbGl0eVNldHRpbmdzSW1tZWRpYXRlKCk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBzaG93RXJyb3JNZXNzYWdlKG1lc3NhZ2UpIHtcblx0Y29uc3QgZXJyb3JEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0ZXJyb3JEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuXHRlcnJvckRpdi5zdHlsZS50b3AgPSAnMTBweCc7XG5cdGVycm9yRGl2LnN0eWxlLmxlZnQgPSAnNTAlJztcblx0ZXJyb3JEaXYuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoLTUwJSknO1xuXHRlcnJvckRpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgyNTUsIDAsIDAsIDAuNyknO1xuXHRlcnJvckRpdi5zdHlsZS5jb2xvciA9ICd3aGl0ZSc7XG5cdGVycm9yRGl2LnN0eWxlLnBhZGRpbmcgPSAnMTBweCc7XG5cdGVycm9yRGl2LnN0eWxlLmJvcmRlclJhZGl1cyA9ICc1cHgnO1xuXHRlcnJvckRpdi5zdHlsZS56SW5kZXggPSAnMTAwMCc7XG5cdGVycm9yRGl2LnRleHRDb250ZW50ID0gbWVzc2FnZTtcblx0XG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZXJyb3JEaXYpO1xuXHRcblx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChlcnJvckRpdik7XG5cdH0sIDUwMDApO1xufSJdfQ==