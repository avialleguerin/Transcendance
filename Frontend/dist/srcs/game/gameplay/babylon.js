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
camera.attachControl(canvas, true);
camera.speed = 0.15;
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
let lastPerformanceCheck = Date.now();
let frameCounter = 0;
let fpsHistory = [];
create_environment_view1(scene);
create_environment_view3(scene);
create_environment_view2(scene);
// init_all_skin(scene);
const skybox = createOptimizedSkybox(scene);
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
fpsDiv.style.top = '10px';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFieWxvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9zcmNzL2dhbWUvZ2FtZXBsYXkvYmFieWxvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsd0JBQXdCLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5RyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDbEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN6RyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNqRyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNsRixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDN0QsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUMvRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNoRyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUNoRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFHL0QsZ0VBQWdFO0FBQ2hFLGdFQUFnRTtBQUNoRSxnRUFBZ0U7QUFFaEUsa0NBQWtDO0FBQ2xDLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQztBQUM1QixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3ZELE1BQU0s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QyxLQUFLLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDO0lBQzlDLFFBQVEsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLHNCQUFzQixDQUFDO0lBQ3hELFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztJQUMvQixRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDaEMsUUFBUSxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQ3BDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUMvQixRQUFRLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztJQUUvQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVwQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2YsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ1YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgY3JlYXRlX2Vudmlyb25tZW50X3ZpZXcxLCBjcmVhdGVfZW52aXJvbm1lbnRfdmlldzMsIGNyZWF0ZV9lbnZpcm9ubWVudF92aWV3MiB9IGZyb20gXCIuL2luaXRfZ2FtZS5qc1wiO1xuaW1wb3J0IHsgVXBkYXRlUGxheWVyUG9zZSB9IGZyb20gXCIuL3BsYXllci5qc1wiO1xuaW1wb3J0IHsgTW92ZUJhbGwsIE1vdmVCYWxsMnYyIH0gZnJvbSBcIi4vYmFsbC5qc1wiO1xuaW1wb3J0IHsgaW5pdF9nYW1lX3NvbG8sIHN0YXJ0X2dhbWVfc29sbywgZGVzdHJveV9nYW1lX3NvbG8gfSBmcm9tIFwiLi9zb2xvLzF2MV9wbGF5ZXIvaW5pdF9nYW1lX1NvbG8uanNcIjtcbmltcG9ydCB7IGluaXRfZ2FtZV9tdWx0aXBsYXllciwgZGVzdHJveV9nYW1lX211bHRpcGxheWVyIH0gZnJvbSBcIi4vbXVsdGlwbGF5ZXIvaW5pdF9nYW1lXzJ2Mi5qc1wiO1xuaW1wb3J0IHsgVXBkYXRlUExheWVyUG9zZU11bHRpIH0gZnJvbSBcIi4vbXVsdGlwbGF5ZXIvMnYyX2dhbWUvaW5pdF9wbGF5ZXJzMnYyLmpzXCI7XG5pbXBvcnQgeyBpbml0X2dhbWVfYWkgfSBmcm9tIFwiLi9zb2xvLzF2MV9haS9pbml0X2dhbWVfYWkuanNcIjtcbmltcG9ydCB7IFVwZGF0ZVBsYXllckFuZEFJX1Bvc2UgfSBmcm9tIFwiLi9zb2xvLzF2MV9haS9pbml0X3BsYXllcl9hbmRfYWkuanNcIjtcbmltcG9ydCB7IGdhbWVJc0ZpbmlzaGVkLCBTZXRJc0dhbWVGaW5pc2hlZCB9IGZyb20gXCIuL3Njb3JlLmpzXCI7XG5pbXBvcnQgeyBpbml0X2dhbWVfdG91cm5hbWVudCwgZGVzdHJveV9nYW1lX3NvbG9fdG91cm5hbWVudCB9IGZyb20gXCIuL3RvdXJuYW1lbnQvdG91cm5hbWVudC5qc1wiO1xuaW1wb3J0IHsgbW92ZV9wbGF5ZXJfdG91cm5hbWVudCB9IGZyb20gXCIuL3RvdXJuYW1lbnQvaW5pdF9wbGF5ZXJfdG91cm5hbWVudC5qc1wiO1xuaW1wb3J0IHsgaW5pdF9hbGxfc2tpbiB9IGZyb20gXCIuL3NvbG8vc2tpbi9pbml0X3NraW5fcGVyc28uanNcIjtcblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKipDUkVBVElPTiBEVSBNT1RFVVIqKioqKioqKioqKioqKioqKioqKioqKioqKiovIFxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgJycsICcvJyk7XG5sZXQgcXVhbGl0eUxldmVsID0gJ21lZGl1bSc7XG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVuZGVyQ2FudmFzJyk7XG5jb25zdCBlbmdpbmUgPSBuZXcgQkFCWUxPTi5FbmdpbmUoY2FudmFzLCB0cnVlLCB7XG5cdHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZSxcblx0c3RlbmNpbDogdHJ1ZSxcblx0YW50aWFsaWFzOiB0cnVlLFxuXHRhZGFwdFRvRGV2aWNlUmF0aW86IGZhbHNlLFxuXHRkaXNhYmxlV2ViR0xXYXJuaW5nczogdHJ1ZSxcblx0cG93ZXJQcmVmZXJlbmNlOiBcImhpZ2gtcGVyZm9ybWFuY2VcIlxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKkRFVEVDVElPTiBERVMgUEVSRk9STUFOQ0VTKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuZnVuY3Rpb24gZGV0ZWN0UGVyZm9ybWFuY2VMZXZlbCgpIHtcblx0dHJ5IHtcblx0XHRjb25zdCBnbCA9IGVuZ2luZS5nZXRSZW5kZXJpbmdDYW52YXMoKS5nZXRDb250ZXh0KFwid2ViZ2xcIik7XG5cdFx0Y29uc3QgZGVidWdJbmZvID0gZ2wuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvJyk7XG5cdFx0Y29uc3QgcmVuZGVyZXIgPSBnbC5nZXRQYXJhbWV0ZXIoZGVidWdJbmZvLlVOTUFTS0VEX1JFTkRFUkVSX1dFQkdMKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFxuXHRcdC8vIE1lc3VyZSBkZXMgcGVyZm9ybWFuY2VzIGluaXRpYWxlc1xuXHRcdGNvbnN0IHN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgMTAwMDsgaSsrKSB7XG5cdFx0XHRNYXRoLnNxcnQoaSk7XG5cdFx0fVxuXHRcdGNvbnN0IGVuZFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblx0XHRjb25zdCBwZXJmU2NvcmUgPSBlbmRUaW1lIC0gc3RhcnRUaW1lO1xuXHRcdFxuXHRcdC8vIETDqXRlcm1pbmVyIG5pdmVhdSBlbiBmb25jdGlvbiBkdSBHUFUgZXQgZGVzIHBlcmZvcm1hbmNlcyBDUFVcblx0XHRpZiAocmVuZGVyZXIuaW5jbHVkZXMoJ252aWRpYScpIHx8IHJlbmRlcmVyLmluY2x1ZGVzKCdhbWQnKSB8fCBwZXJmU2NvcmUgPCAxKSB7XG5cdFx0XHRyZXR1cm4gJ2hpZ2gnO1xuXHRcdH0gZWxzZSBpZiAocmVuZGVyZXIuaW5jbHVkZXMoJ2ludGVsJykgfHwgcGVyZlNjb3JlIDwgNSkge1xuXHRcdFx0cmV0dXJuICdtZWRpdW0nO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gJ2xvdyc7XG5cdFx0fVxuXHR9IGNhdGNoIChlKSB7XG5cdFx0Y29uc29sZS5sb2coXCJQZXJmb3JtYW5jZSBkZXRlY3Rpb24gZmFpbGVkLCB1c2luZyBkZWZhdWx0IHNldHRpbmdzXCIpO1xuXHRcdHJldHVybiAnbWVkaXVtJztcblx0fVxufVxuXG5cbmVuZ2luZS5nZXRSZW5kZXJpbmdDYW52YXMoKS5hZGRFdmVudExpc3RlbmVyKFwid2ViZ2xjb250ZXh0bG9zdFwiLCAoZSkgPT4ge1xuXHRjb25zb2xlLmxvZyhcIldlYkdMIGNvbnRleHQgbG9zdCEgQXR0ZW1wdGluZyB0byByZWNvdmVyLi4uXCIpO1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFxuXHQvLyBSw6lkdWlyZSBsYSBxdWFsaXTDqSBldCB0ZW50ZXIgZGUgcsOpY3Vww6lyZXJcblx0cXVhbGl0eUxldmVsID0gJ2xvdyc7XG5cdGFwcGx5UXVhbGl0eVNldHRpbmdzKCk7XG5cdFxuXHQvLyBFc3NheWVyIGRlIHJlc3RhdXJlciBhcHLDqHMgdW4gZMOpbGFpXG5cdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRlbmdpbmUucmVzaXplKHRydWUpO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihcIkZhaWxlZCB0byByZWNvdmVyIFdlYkdMIGNvbnRleHQ6XCIsIGVycik7XG5cdFx0XHRzaG93RXJyb3JNZXNzYWdlKFwiRXJyZXVyIGdyYXBoaXF1ZSBkw6l0ZWN0w6llLiBWZXVpbGxleiByYWZyYcOuY2hpciBsYSBwYWdlLlwiKTtcblx0XHR9XG5cdH0sIDEwMDApO1xufSk7XG5cbi8vIEZpbHRyZXIgbGVzIGF2ZXJ0aXNzZW1lbnRzIG5vbi1jcml0aXF1ZXNcbmNvbnN0IG9yaWdpbmFsQ29uc29sZVdhcm4gPSBjb25zb2xlLndhcm47XG5jb25zb2xlLndhcm4gPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cdGNvbnN0IGlnbm9yZWRQYXR0ZXJucyA9IFtcImdlbmVyYXRlTWlwbWFwXCIsIFwiV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mb1wiLCBcInByZWNpc2lvbiBpc3N1ZXNcIl07XG5cdGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycgJiYgaWdub3JlZFBhdHRlcm5zLnNvbWUocGF0dGVybiA9PiBtZXNzYWdlLmluY2x1ZGVzKHBhdHRlcm4pKSkge1xuXHRcdHJldHVybjtcblx0fVxuXHRvcmlnaW5hbENvbnNvbGVXYXJuLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG59O1xuXG5mdW5jdGlvbiBhcHBseVF1YWxpdHlTZXR0aW5ncygpXG57XG5cdGNvbnN0IGN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKTtcblx0ZnJhbWVDb3VudGVyKys7XG5cdFxuXHRpZiAoY3VycmVudFRpbWUgLSBsYXN0UGVyZm9ybWFuY2VDaGVjayA+IDMwMDApXG5cdHtcblx0XHRjb25zdCBjdXJyZW50RnBzID0gZnJhbWVDb3VudGVyIC8gKChjdXJyZW50VGltZSAtIGxhc3RQZXJmb3JtYW5jZUNoZWNrKSAvIDEwMDApO1xuXHRcdGZwc0hpc3RvcnkucHVzaChjdXJyZW50RnBzKTtcblx0XHRcblx0XHQvLyBHYXJkZXIgdW4gaGlzdG9yaXF1ZSBsaW1pdMOpXG5cdFx0aWYgKGZwc0hpc3RvcnkubGVuZ3RoID4gNSlcblx0XHR7XG5cdFx0XHRmcHNIaXN0b3J5LnNoaWZ0KCk7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIENhbGN1bGVyIGxhIG1veWVubmUgZGVzIEZQU1xuXHRcdGNvbnN0IGF2Z0ZwcyA9IGZwc0hpc3RvcnkucmVkdWNlKChzdW0sIGZwcykgPT4gc3VtICsgZnBzLCAwKSAvIGZwc0hpc3RvcnkubGVuZ3RoO1xuXHRcdFxuXHRcdGlmIChhdmdGcHMgPCA5MCAmJiBxdWFsaXR5TGV2ZWwgIT09ICdsb3cnKSB7XG5cdFx0XHRxdWFsaXR5TGV2ZWwgPSAnbG93Jztcblx0XHRcdGFwcGx5UXVhbGl0eVNldHRpbmdzSW1tZWRpYXRlKCk7XG5cdFx0fSBlbHNlIGlmIChhdmdGcHMgPiA1NSAmJiBxdWFsaXR5TGV2ZWwgPT09ICdsb3cnKSB7XG5cdFx0XHRxdWFsaXR5TGV2ZWwgPSAnbWVkaXVtJztcblx0XHRcdGFwcGx5UXVhbGl0eVNldHRpbmdzSW1tZWRpYXRlKCk7XG5cdFx0fSBlbHNlIGlmIChhdmdGcHMgPiA5MCAmJiBxdWFsaXR5TGV2ZWwgPT09ICdtZWRpdW0nKSB7XG5cdFx0XHRxdWFsaXR5TGV2ZWwgPSAnaGlnaCc7XG5cdFx0XHRhcHBseVF1YWxpdHlTZXR0aW5nc0ltbWVkaWF0ZSgpO1xuXHRcdH1cblx0XHRcblx0XHRsYXN0UGVyZm9ybWFuY2VDaGVjayA9IGN1cnJlbnRUaW1lO1xuXHRcdGZyYW1lQ291bnRlciA9IDA7XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlRdWFsaXR5U2V0dGluZ3NJbW1lZGlhdGUoKSB7XG5cdHN3aXRjaCAocXVhbGl0eUxldmVsKSB7XG5cdFx0Y2FzZSAnbG93Jzpcblx0XHRcdGVuZ2luZS5zZXRIYXJkd2FyZVNjYWxpbmdMZXZlbCgxKTtcblx0XHRcdHNjZW5lLnBvc3RQcm9jZXNzZXNFbmFibGVkID0gZmFsc2U7XG5cdFx0XHRwaXBlbGluZS5meGFhRW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0cGlwZWxpbmUuc2hhcnBlbkVuYWJsZWQgPSBmYWxzZTtcblx0XHRcdHBpcGVsaW5lLnNhbXBsZXMgPSAxO1xuXHRcdFx0c2NlbmUucGFydGljbGVzRW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAnbWVkaXVtJzpcblx0XHRcdGVuZ2luZS5zZXRIYXJkd2FyZVNjYWxpbmdMZXZlbCgxKTtcblx0XHRcdHNjZW5lLnBvc3RQcm9jZXNzZXNFbmFibGVkID0gZmFsc2U7XG5cdFx0XHRwaXBlbGluZS5meGFhRW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0cGlwZWxpbmUuc2hhcnBlbkVuYWJsZWQgPSBmYWxzZTtcblx0XHRcdHBpcGVsaW5lLnNhbXBsZXMgPSAxO1xuXHRcdFx0c2NlbmUucGFydGljbGVzRW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAnaGlnaCc6XG5cdFx0XHRlbmdpbmUuc2V0SGFyZHdhcmVTY2FsaW5nTGV2ZWwoMSk7XG5cdFx0XHRzY2VuZS5wb3N0UHJvY2Vzc2VzRW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0cGlwZWxpbmUuZnhhYUVuYWJsZWQgPSBmYWxzZTtcblx0XHRcdHBpcGVsaW5lLnNoYXJwZW5FbmFibGVkID0gZmFsc2U7XG5cdFx0XHRwaXBlbGluZS5zYW1wbGVzID0gMTtcblx0XHRcdHNjZW5lLnBhcnRpY2xlc0VuYWJsZWQgPSBmYWxzZTtcblx0XHRcdGJyZWFrO1xuXHR9XG5cdFxuXHQvLyBEZWJ1ZyBpbmZvXG5cdGNvbnNvbGUubG9nKGBRdWFsaXR5IGxldmVsIHNldCB0bzogJHtxdWFsaXR5TGV2ZWx9YCk7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKkNSRUFUSU9OIERFIExBIFNDRU5FKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxud2luZG93LnNjZW5lID0gbmV3IEJBQllMT04uU2NlbmUoZW5naW5lKTtcbnNjZW5lLmNsZWFyQ29sb3IgPSBuZXcgQkFCWUxPTi5Db2xvcjQoMCwgMCwgMCwgMSk7XG5zY2VuZS5ibG9ja01hdGVyaWFsRGlydHlNZWNoYW5pc20gPSB0cnVlO1xuXG53aW5kb3cuY2FtZXJhID0gbmV3IEJBQllMT04uRnJlZUNhbWVyYShcImNhbWVyYVwiLCBuZXcgQkFCWUxPTi5WZWN0b3IzKC00NS43OTMwMTk1MTA2NTk4MiwgNS44Nzk3MzUzNzEwNDQ3ODksIC0zMS4zNDIyMTA5NDcwODEzMTMpLCBzY2VuZSk7XG5jYW1lcmEucm90YXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKC0wLjAyOTY2NTI4MDA2OTAxMTY2NywgLTIuNTY2Mzg3MDg1Nzk0NzEyLCAwKTtcbmNhbWVyYS5taW5aID0gMC4xO1xuY2FtZXJhLm1heFogPSA1MDAwO1xuY2FtZXJhLmF0dGFjaENvbnRyb2woY2FudmFzLCB0cnVlKTtcbmNhbWVyYS5zcGVlZCA9IDAuMTU7XG5cbmNvbnN0IHBpcGVsaW5lID0gbmV3IEJBQllMT04uRGVmYXVsdFJlbmRlcmluZ1BpcGVsaW5lKFwiZGVmYXVsdFBpcGVsaW5lXCIsIHRydWUsIHNjZW5lLCBbY2FtZXJhXSk7XG5cbmNvbnN0IGFtYmllbnRMaWdodCA9IG5ldyBCQUJZTE9OLkhlbWlzcGhlcmljTGlnaHQoXCJhbWJpZW50TGlnaHRcIiwgbmV3IEJBQllMT04uVmVjdG9yMygwLCAxLCAwKSwgc2NlbmUpO1xuYW1iaWVudExpZ2h0LmludGVuc2l0eSA9IDM7XG5cbmZ1bmN0aW9uIGNyZWF0ZU9wdGltaXplZFNreWJveChzY2VuZSkge1xuXHRjb25zdCBzaW1wbGlmaWVkU2t5Ym94ID0gcXVhbGl0eUxldmVsID09PSAnbG93Jztcblx0XG5cdGNvbnN0IHNreU1hdGVyaWFsID0gbmV3IEJBQllMT04uU3RhbmRhcmRNYXRlcmlhbChcInNreU1hdGVyaWFsXCIsIHNjZW5lKTtcblx0c2t5TWF0ZXJpYWwuYmFja0ZhY2VDdWxsaW5nID0gZmFsc2U7XG5cdHNreU1hdGVyaWFsLnNwZWN1bGFyQ29sb3IgPSBuZXcgQkFCWUxPTi5Db2xvcjMoMCwgMCwgMCk7XG5cdHNreU1hdGVyaWFsLmVtaXNzaXZlQ29sb3IgPSBuZXcgQkFCWUxPTi5Db2xvcjMoMSwgMSwgMSk7XG5cdFxuXHQvLyBUZXh0dXJlIGF2ZWMgcGFyYW3DqHRyZXMgYWRhcHTDqXMgw6AgbGEgcXVhbGl0w6lcblx0Y29uc3Qgc2t5VGV4dHVyZSA9IG5ldyBCQUJZTE9OLlRleHR1cmUoXCIvc3Jjcy9nYW1lL2Fzc2V0cy9za3lib3gvc2t5Ym94LmpwZ1wiLCBzY2VuZSk7XG5cdHNreVRleHR1cmUuY29vcmRpbmF0ZXNNb2RlID0gQkFCWUxPTi5UZXh0dXJlLlNQSEVSSUNBTF9NT0RFO1xuXHRza3lUZXh0dXJlLmhhc0FscGhhID0gZmFsc2U7XG5cdHNreVRleHR1cmUuZ2VuZXJhdGVNaXBNYXBzID0gIXNpbXBsaWZpZWRTa3lib3g7XG5cdHNreVRleHR1cmUudXBkYXRlU2FtcGxpbmdNb2RlKHNpbXBsaWZpZWRTa3lib3ggPyBcblx0XHRCQUJZTE9OLlRleHR1cmUuTkVBUkVTVF9ORUFSRVNUIDogXG5cdFx0QkFCWUxPTi5UZXh0dXJlLk5FQVJFU1RfTElORUFSKTtcblx0XG5cdHNreU1hdGVyaWFsLmRpZmZ1c2VUZXh0dXJlID0gc2t5VGV4dHVyZTtcblx0XG5cdC8vIENyw6llciB1bmUgc3Bow6hyZSBvcHRpbWlzw6llXG5cdGNvbnN0IHNlZ21lbnRzQ291bnQgPSBzaW1wbGlmaWVkU2t5Ym94ID8gMTYgOiAzMjtcblx0Y29uc3Qgc2t5U3BoZXJlID0gQkFCWUxPTi5NZXNoQnVpbGRlci5DcmVhdGVTcGhlcmUoXCJza3lTcGhlcmVcIiwge1xuXHRcdGRpYW1ldGVyOiA1MDAwLCBcblx0XHRzZWdtZW50czogc2VnbWVudHNDb3VudCxcblx0XHRzaWRlT3JpZW50YXRpb246IEJBQllMT04uTWVzaC5CQUNLU0lERVxuXHR9LCBzY2VuZSk7XG5cdFxuXHRza3lTcGhlcmUubWF0ZXJpYWwgPSBza3lNYXRlcmlhbDtcblx0c2t5U3BoZXJlLmlzUGlja2FibGUgPSBmYWxzZTtcblx0c2t5U3BoZXJlLmluZmluaXRlRGlzdGFuY2UgPSB0cnVlO1xuXHRza3lTcGhlcmUuc2NhbGluZy55ID0gLTE7XG5cblx0c2t5U3BoZXJlLmZyZWV6ZVdvcmxkTWF0cml4KCk7XG5cdHNreVNwaGVyZS5kb05vdFN5bmNCb3VuZGluZ0luZm8gPSB0cnVlO1xuXHRza3lNYXRlcmlhbC5mcmVlemUoKTtcblx0XG5cdHJldHVybiBza3lTcGhlcmU7XG59XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKlZBUklBQkxFIERFIEpFVVggKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5sZXQgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbmxldCBwbGF5ZXJfMSwgcGxheWVyXzIsIHBsYXllcl8zLCBwbGF5ZXJfNCwgcGxheWVyXzFfdG91cm5hbWVudCwgcGxheWVyXzJfdG91cm5hbWVudCwgQUlfcGxheWVyLCBiYWxsO1xubGV0IFNvbG9fZ2FtZVN0YXJ0ID0gZmFsc2U7XG5sZXQgTXVsdGlfZ2FtZVN0YXJ0ID0gZmFsc2U7XG5sZXQgQUlfZ2FtZVN0YXJ0ID0gZmFsc2U7XG5sZXQgdG91cm5hbWVudF9nYW1lID0gZmFsc2U7XG5sZXQgcGxheSA9IGZhbHNlO1xubGV0IGxhc3RQZXJmb3JtYW5jZUNoZWNrID0gRGF0ZS5ub3coKTtcbmxldCBmcmFtZUNvdW50ZXIgPSAwO1xubGV0IGZwc0hpc3RvcnkgPSBbXTtcblxuXG5jcmVhdGVfZW52aXJvbm1lbnRfdmlldzEoc2NlbmUpO1xuY3JlYXRlX2Vudmlyb25tZW50X3ZpZXczKHNjZW5lKTtcbmNyZWF0ZV9lbnZpcm9ubWVudF92aWV3MihzY2VuZSk7XG4vLyBpbml0X2FsbF9za2luKHNjZW5lKTtcbmNvbnN0IHNreWJveCA9IGNyZWF0ZU9wdGltaXplZFNreWJveChzY2VuZSk7XG5cbnF1YWxpdHlMZXZlbCA9IGRldGVjdFBlcmZvcm1hbmNlTGV2ZWwoKTtcbmFwcGx5UXVhbGl0eVNldHRpbmdzSW1tZWRpYXRlKCk7XG5cbnNjZW5lLmlucHV0U3RhdGVzID0geyBzcGFjZTogZmFsc2UgfTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldmVudCkgPT4ge1xuXHRpZiAoZXZlbnQuY29kZSA9PT0gXCJTcGFjZVwiKSB7XG5cdFx0c2NlbmUuaW5wdXRTdGF0ZXMuc3BhY2UgPSB0cnVlO1xuXHR9XG59KTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZXZlbnQpID0+IHtcblx0aWYgKGV2ZW50LmNvZGUgPT09IFwiU3BhY2VcIikge1xuXHRcdHNjZW5lLmlucHV0U3RhdGVzLnNwYWNlID0gZmFsc2U7XG5cdH1cbn0pO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKklOSVRJQUxJU0FUSU9OIERFUyBKRVVYICoqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmFzeW5jIGZ1bmN0aW9uIGluaXRpYWxpemVHYW1lX3NvbG9fZ2FtZSgpIHtcblx0dHJ5IHtcblx0XHRsZXQgcGxheWVycyA9IGF3YWl0IGluaXRfZ2FtZV9zb2xvKHNjZW5lKTtcblx0XHRwbGF5ZXJfMSA9IHBsYXllcnMucGxheWVyXzE7XG5cdFx0cGxheWVyXzIgPSBwbGF5ZXJzLnBsYXllcl8yO1xuXHRcdGJhbGwgPSBwbGF5ZXJzLmJhbGw7XG5cdFx0b3B0aW1pemVHYW1lT2JqZWN0cyhbcGxheWVyXzEsIHBsYXllcl8yLCBiYWxsXSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihcIkVycm9yIGluaXRpYWxpemluZyBzb2xvIGdhbWU6XCIsIGVycm9yKTtcblx0XHRoYW5kbGVHYW1lSW5pdEVycm9yKCk7XG5cdH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5pdGlhbGl6ZV9NdWx0aXBsYXllcl9nYW1lKCkge1xuXHR0cnkge1xuXHRcdGxldCBwbGF5ZXJzID0gYXdhaXQgaW5pdF9nYW1lX211bHRpcGxheWVyKHNjZW5lKTtcblx0XHRwbGF5ZXJfMSA9IHBsYXllcnMucGxheWVyXzE7XG5cdFx0cGxheWVyXzIgPSBwbGF5ZXJzLnBsYXllcl8yO1xuXHRcdHBsYXllcl8zID0gcGxheWVycy5wbGF5ZXJfMztcblx0XHRwbGF5ZXJfNCA9IHBsYXllcnMucGxheWVyXzQ7XG5cdFx0YmFsbCA9IHBsYXllcnMuYmFsbDtcblx0XHRvcHRpbWl6ZUdhbWVPYmplY3RzKFtwbGF5ZXJfMSwgcGxheWVyXzIsIHBsYXllcl8zLCBwbGF5ZXJfNCwgYmFsbF0pO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJFcnJvciBpbml0aWFsaXppbmcgbXVsdGlwbGF5ZXIgZ2FtZTpcIiwgZXJyb3IpO1xuXHRcdGhhbmRsZUdhbWVJbml0RXJyb3IoKTtcblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplX0FJX2dhbWUoKSB7XG5cdHRyeSB7XG5cdFx0bGV0IHBsYXllcnMgPSBhd2FpdCBpbml0X2dhbWVfYWkoc2NlbmUpO1xuXHRcdHBsYXllcl8xID0gcGxheWVycy5wbGF5ZXJfMTtcblx0XHRBSV9wbGF5ZXIgPSBwbGF5ZXJzLmFpX3BsYXllcjtcblx0XHRiYWxsID0gcGxheWVycy5iYWxsO1xuXHRcdG9wdGltaXplR2FtZU9iamVjdHMoW3BsYXllcl8xLCBBSV9wbGF5ZXIsIGJhbGxdKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3IgaW5pdGlhbGl6aW5nIEFJIGdhbWU6XCIsIGVycm9yKTtcblx0XHRoYW5kbGVHYW1lSW5pdEVycm9yKCk7XG5cdH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5pdGlhbGl6ZUdhbWVfdG91cm5hbWVudCgpIHtcblx0dHJ5IHtcblx0XHRsZXQgcGxheWVycyA9IGF3YWl0IGluaXRfZ2FtZV90b3VybmFtZW50KHNjZW5lKTtcblx0XHRwbGF5ZXJfMV90b3VybmFtZW50ID0gcGxheWVycy5wbGF5ZXJfMV90b3VybmFtZW50O1xuXHRcdHBsYXllcl8yX3RvdXJuYW1lbnQgPSBwbGF5ZXJzLnBsYXllcl8yX3RvdXJuYW1lbnQ7XG5cdFx0YmFsbCA9IHBsYXllcnMuYmFsbDtcblx0XHRvcHRpbWl6ZUdhbWVPYmplY3RzKFtwbGF5ZXJfMV90b3VybmFtZW50LCBwbGF5ZXJfMl90b3VybmFtZW50LCBiYWxsXSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihcIkVycm9yIGluaXRpYWxpemluZyB0b3VybmFtZW50IGdhbWU6XCIsIGVycm9yKTtcblx0XHRoYW5kbGVHYW1lSW5pdEVycm9yKCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gb3B0aW1pemVHYW1lT2JqZWN0cyhvYmplY3RzKSB7XG5cdG9iamVjdHMuZm9yRWFjaChvYmogPT4ge1xuXHRcdGlmICghb2JqKSByZXR1cm47XG5cdFx0XG5cdFx0Ly8gT3B0aW1pc2VyIGxlcyBtZXNoZXMgc2kgcG9zc2libGVcblx0XHRpZiAob2JqLmdldENoaWxkTWVzaGVzKSB7XG5cdFx0XHRjb25zdCBtZXNoZXMgPSBvYmouZ2V0Q2hpbGRNZXNoZXMoKTtcblx0XHRcdG1lc2hlcy5mb3JFYWNoKG1lc2ggPT4ge1xuXHRcdFx0XHRpZiAoIW1lc2guaXNWaXNpYmxlKSByZXR1cm47XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAocXVhbGl0eUxldmVsID09PSAnbG93Jykge1xuXHRcdFx0XHRcdC8vIFNpbXBsaWZpZXIgbGUgbWFpbGxhZ2UgcG91ciBsZXMgYXBwYXJlaWxzIMOgIGZhaWJsZXMgcGVyZm9ybWFuY2VzXG5cdFx0XHRcdFx0aWYgKG1lc2guc2ltcGxpZnkpIHtcblx0XHRcdFx0XHRcdG1lc2guc2ltcGxpZnkoW3sgcXVhbGl0eTogMC41LCBkaXN0YW5jZTogNTAgfV0sIHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0Ly8gT3B0aW1pc2F0aW9ucyBjb21tdW5lc1xuXHRcdFx0XHQvLyBtZXNoLmZyZWV6ZVdvcmxkTWF0cml4KCk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBEw6lzYWN0aXZlciBsZXMgZm9uY3Rpb25uYWxpdMOpcyBjb8O7dGV1c2VzIHN1ciBsZXMgbWFpbGxhZ2VzIG5vbiBlc3NlbnRpZWxzXG5cdFx0XHRcdGlmICghbWVzaC5uYW1lLmluY2x1ZGVzKFwicGxheWVyXCIpICYmICFtZXNoLm5hbWUuaW5jbHVkZXMoXCJiYWxsXCIpKSB7XG5cdFx0XHRcdFx0bWVzaC5kb05vdFN5bmNCb3VuZGluZ0luZm8gPSB0cnVlO1xuXHRcdFx0XHRcdG1lc2guYWx3YXlzU2VsZWN0QXNBY3RpdmVNZXNoID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbi8vIEdlc3Rpb24gZGVzIGVycmV1cnMgZCdpbml0aWFsaXNhdGlvblxuZnVuY3Rpb24gaGFuZGxlR2FtZUluaXRFcnJvcigpIHtcblx0Y29uc29sZS5lcnJvcihcIkdhbWUgaW5pdGlhbGl6YXRpb24gZmFpbGVkLiBSZXNldHRpbmcgdG8gbWVudS4uLlwiKTtcblx0aW5pdGlhbGl6ZWQgPSBmYWxzZTtcblx0cGxheSA9IGZhbHNlO1xuXHRcblx0Ly8gUsOpaW5pdGlhbGlzZXIgdG91cyBsZXMgZHJhcGVhdXggZGUgbW9kZSBkZSBqZXVcblx0U29sb19nYW1lU3RhcnQgPSBmYWxzZTtcblx0TXVsdGlfZ2FtZVN0YXJ0ID0gZmFsc2U7XG5cdEFJX2dhbWVTdGFydCA9IGZhbHNlO1xuXHR0b3VybmFtZW50X2dhbWUgPSBmYWxzZTtcblx0XG5cdC8vIEFmZmljaGVyIHVuIG1lc3NhZ2UgZCdlcnJldXIgw6AgbCd1dGlsaXNhdGV1ciBpY2kgc2kgbsOpY2Vzc2FpcmVcblx0Y29uc3QgZXJyb3JNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdGVycm9yTWVzc2FnZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cdGVycm9yTWVzc2FnZS5zdHlsZS50b3AgPSAnNTAlJztcblx0ZXJyb3JNZXNzYWdlLnN0eWxlLmxlZnQgPSAnNTAlJztcblx0ZXJyb3JNZXNzYWdlLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknO1xuXHRlcnJvck1lc3NhZ2Uuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMCwwLDAsMC44KSc7XG5cdGVycm9yTWVzc2FnZS5zdHlsZS5jb2xvciA9ICd3aGl0ZSc7XG5cdGVycm9yTWVzc2FnZS5zdHlsZS5wYWRkaW5nID0gJzIwcHgnO1xuXHRlcnJvck1lc3NhZ2Uuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzVweCc7XG5cdGVycm9yTWVzc2FnZS5zdHlsZS56SW5kZXggPSAnMTAwMCc7XG5cdGVycm9yTWVzc2FnZS50ZXh0Q29udGVudCA9ICdFcnJldXIgbG9ycyBkdSBjaGFyZ2VtZW50IGR1IGpldS4gUmV0b3VyIGF1IG1lbnUuLi4nO1xuXHRcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlcnJvck1lc3NhZ2UpO1xuXHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVycm9yTWVzc2FnZSk7XG5cdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL0dhbWVfbWVudSc7IC8vIFJlZGlyaWdlciB2ZXJzIGxlIG1lbnVcblx0fSwgMzAwMCk7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqQ09NTUVOQ0VNRU5UIERFUyBKRVVYICoqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0R2FtZSgpIHtcblx0U29sb19nYW1lU3RhcnQgPSB0cnVlO1xuXHRNdWx0aV9nYW1lU3RhcnQgPSBmYWxzZTtcblx0QUlfZ2FtZVN0YXJ0ID0gZmFsc2U7XG5cdHRvdXJuYW1lbnRfZ2FtZSA9IGZhbHNlO1xuXHRTZXRJc0dhbWVGaW5pc2hlZChmYWxzZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydE11bHRpR2FtZSgpIHtcblx0TXVsdGlfZ2FtZVN0YXJ0ID0gdHJ1ZTtcblx0U29sb19nYW1lU3RhcnQgPSBmYWxzZTtcblx0QUlfZ2FtZVN0YXJ0ID0gZmFsc2U7XG5cdHRvdXJuYW1lbnRfZ2FtZSA9IGZhbHNlO1xuXHRTZXRJc0dhbWVGaW5pc2hlZChmYWxzZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydEFJX0dhbWUoKSB7XG5cdEFJX2dhbWVTdGFydCA9IHRydWU7XG5cdFNvbG9fZ2FtZVN0YXJ0ID0gZmFsc2U7XG5cdE11bHRpX2dhbWVTdGFydCA9IGZhbHNlO1xuXHR0b3VybmFtZW50X2dhbWUgPSBmYWxzZTtcblx0U2V0SXNHYW1lRmluaXNoZWQoZmFsc2UpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRUb3VybmFtZW50R2FtZSgpIHtcblx0dG91cm5hbWVudF9nYW1lID0gdHJ1ZTtcblx0U29sb19nYW1lU3RhcnQgPSBmYWxzZTtcblx0TXVsdGlfZ2FtZVN0YXJ0ID0gZmFsc2U7XG5cdEFJX2dhbWVTdGFydCA9IGZhbHNlO1xuXHRTZXRJc0dhbWVGaW5pc2hlZChmYWxzZSk7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqUVVJVFRFUiBMRVMgSkVVWCAqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGxlYXZlX0dhbWUoKSB7XG5cdHRyeSB7XG5cdFx0ZGVzdHJveV9nYW1lX3NvbG8oc2NlbmUpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Y29uc29sZS5lcnJvcihcIkVycm9yIGNsZWFuaW5nIHVwIHNvbG8gZ2FtZTpcIiwgZSk7XG5cdH1cblx0U29sb19nYW1lU3RhcnQgPSBmYWxzZTtcblx0aW5pdGlhbGl6ZWQgPSBmYWxzZTtcblx0cGxheSA9IGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGVhdmVfdG91cm5hbWVudF9nYW1lKCkge1xuXHR0cnkge1xuXHRcdGRlc3Ryb3lfZ2FtZV9zb2xvX3RvdXJuYW1lbnQoc2NlbmUpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Y29uc29sZS5lcnJvcihcIkVycm9yIGNsZWFuaW5nIHVwIHRvdXJuYW1lbnQgZ2FtZTpcIiwgZSk7XG5cdH1cblx0dG91cm5hbWVudF9nYW1lID0gZmFsc2U7XG5cdGluaXRpYWxpemVkID0gZmFsc2U7XG5cdHBsYXkgPSBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxlYXZlX011bHRpcGxheWVyX0dhbWUoKSB7XG5cdHRyeSB7XG5cdFx0ZGVzdHJveV9nYW1lX211bHRpcGxheWVyKHNjZW5lKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJFcnJvciBjbGVhbmluZyB1cCBtdWx0aXBsYXllciBnYW1lOlwiLCBlKTtcblx0fVxuXHRNdWx0aV9nYW1lU3RhcnQgPSBmYWxzZTtcblx0aW5pdGlhbGl6ZWQgPSBmYWxzZTtcblx0cGxheSA9IGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGVhdmVfQUlfR2FtZSgpIHtcblx0QUlfZ2FtZVN0YXJ0ID0gZmFsc2U7XG5cdGluaXRpYWxpemVkID0gZmFsc2U7XG5cdHBsYXkgPSBmYWxzZTtcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKipDT01QVEVVUiBGUFMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBmcHNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmZwc0Rpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5mcHNEaXYuc3R5bGUudG9wID0gJzEwcHgnO1xuZnBzRGl2LnN0eWxlLmxlZnQgPSAnMTBweCc7XG5mcHNEaXYuc3R5bGUuY29sb3IgPSAnZ3JlZW4nO1xuZnBzRGl2LnN0eWxlLnpJbmRleCA9ICcxMDAwJztcbmZwc0Rpdi5zdHlsZS5mb250U2l6ZSA9ICcxMHB4JztcbmZwc0Rpdi5zdHlsZS5mb250RmFtaWx5ID0gJ21vbm9zcGFjZSc7XG5mcHNEaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMCwgMCwgMCwgMCknO1xuZnBzRGl2LnN0eWxlLnBhZGRpbmcgPSAnNXB4JztcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZnBzRGl2KTtcbmxldCBmcmFtZUNvdW50ID0gMDtcbmxldCBsYXN0RnBzVXBkYXRlID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKkJPVUNMRSBQUklOQ0lQQUxFICoqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG5lbmdpbmUucnVuUmVuZGVyTG9vcCgoKSA9PiB7XG5cdHRyeVxuXHR7XG5cdFx0Y29uc3Qgc2NhbGUgPSBxdWFsaXR5TGV2ZWwgPT09ICdsb3cnID8gMS4wIDogd2luZG93LmRldmljZVBpeGVsUmF0aW87XG5cdFx0aWYgKGNhbnZhcy53aWR0aCAhPT0gY2FudmFzLmNsaWVudFdpZHRoICogc2NhbGUgfHwgY2FudmFzLmhlaWdodCAhPT0gY2FudmFzLmNsaWVudEhlaWdodCAqIHNjYWxlKSB7XG5cdFx0XHRjYW52YXMud2lkdGggPSBjYW52YXMuY2xpZW50V2lkdGggKiBzY2FsZTtcblx0XHRcdGNhbnZhcy5oZWlnaHQgPSBjYW52YXMuY2xpZW50SGVpZ2h0ICogc2NhbGU7XG5cdFx0XHRlbmdpbmUucmVzaXplKHRydWUpO1xuXHRcdH1cblx0XHRmcmFtZUNvdW50Kys7XG5cdFx0Y29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cdFx0Y29uc3QgZGVsdGEgPSBub3cgLSBsYXN0RnBzVXBkYXRlO1xuXHRcdGlmIChkZWx0YSA+PSAyNTApIHtcblx0XHRcdGNvbnN0IGZwcyA9IChmcmFtZUNvdW50IC8gZGVsdGEpICogMTAwMDtcblx0XHRcdGZwc0Rpdi50ZXh0Q29udGVudCA9IGBGUFM6ICR7ZnBzLnRvRml4ZWQoMSl9YDtcblx0XHRcdGxhc3RGcHNVcGRhdGUgPSBub3c7XG5cdFx0XHRmcmFtZUNvdW50ID0gMDtcblx0XHR9XG5cdFx0YXBwbHlRdWFsaXR5U2V0dGluZ3MoKTtcblxuXHRcdGlmIChTb2xvX2dhbWVTdGFydCAmJiAhZ2FtZUlzRmluaXNoZWQpIHtcblx0XHRcdGlmICghaW5pdGlhbGl6ZWQpIHtcblx0XHRcdFx0aW5pdGlhbGl6ZUdhbWVfc29sb19nYW1lKCk7XG5cdFx0XHRcdGluaXRpYWxpemVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChpbml0aWFsaXplZCkge1xuXHRcdFx0XHRpZiAoc2NlbmUuaW5wdXRTdGF0ZXMuc3BhY2UgJiYgIXBsYXkpXG5cdFx0XHRcdFx0cGxheSA9IHRydWU7XG5cdFx0XHRcdGlmIChwbGF5KSB7XG5cdFx0XHRcdFx0Y29uc3QgYm9udXNQbGF5ZXIgPSBVcGRhdGVQbGF5ZXJQb3NlKHBsYXllcl8xLCBwbGF5ZXJfMik7XG5cdFx0XHRcdFx0TW92ZUJhbGwocGxheWVyXzEsIHBsYXllcl8yLCBiYWxsLCBib251c1BsYXllci5wbGF5ZXJfMV9ib251cywgYm9udXNQbGF5ZXIucGxheWVyXzJfYm9udXMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKE11bHRpX2dhbWVTdGFydCAmJiAhZ2FtZUlzRmluaXNoZWQpIHtcblx0XHRcdGlmICghaW5pdGlhbGl6ZWQpIHtcblx0XHRcdFx0aW5pdGlhbGl6ZV9NdWx0aXBsYXllcl9nYW1lKCk7XG5cdFx0XHRcdGluaXRpYWxpemVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChpbml0aWFsaXplZCkge1xuXHRcdFx0XHRpZiAoc2NlbmUuaW5wdXRTdGF0ZXMuc3BhY2UgJiYgIXBsYXkpXG5cdFx0XHRcdFx0cGxheSA9IHRydWU7XG5cdFx0XHRcdGlmIChwbGF5KSB7XG5cdFx0XHRcdFx0VXBkYXRlUExheWVyUG9zZU11bHRpKHBsYXllcl8xLCBwbGF5ZXJfMiwgcGxheWVyXzMsIHBsYXllcl80KTtcblx0XHRcdFx0XHRNb3ZlQmFsbDJ2MihwbGF5ZXJfMSwgcGxheWVyXzIsIHBsYXllcl8zLCBwbGF5ZXJfNCwgYmFsbCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoQUlfZ2FtZVN0YXJ0ICYmICFnYW1lSXNGaW5pc2hlZCkge1xuXHRcdFx0aWYgKCFpbml0aWFsaXplZCkge1xuXHRcdFx0XHRpbml0aWFsaXplX0FJX2dhbWUoKTtcblx0XHRcdFx0aW5pdGlhbGl6ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGluaXRpYWxpemVkKSB7XG5cdFx0XHRcdGlmIChzY2VuZS5pbnB1dFN0YXRlcy5zcGFjZSAmJiAhcGxheSlcblx0XHRcdFx0XHRwbGF5ID0gdHJ1ZTtcblx0XHRcdFx0aWYgKHBsYXkpIHtcblx0XHRcdFx0XHRVcGRhdGVQbGF5ZXJBbmRBSV9Qb3NlKHBsYXllcl8xLCBBSV9wbGF5ZXIsIGJhbGwpO1xuXHRcdFx0XHRcdE1vdmVCYWxsKHBsYXllcl8xLCBBSV9wbGF5ZXIsIGJhbGwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRvdXJuYW1lbnRfZ2FtZSAmJiAhZ2FtZUlzRmluaXNoZWQpIHtcblx0XHRcdGlmICghaW5pdGlhbGl6ZWQpIHtcblx0XHRcdFx0aW5pdGlhbGl6ZUdhbWVfdG91cm5hbWVudCgpO1xuXHRcdFx0XHRpbml0aWFsaXplZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaW5pdGlhbGl6ZWQpIHtcblx0XHRcdFx0aWYgKHNjZW5lLmlucHV0U3RhdGVzLnNwYWNlICYmICFwbGF5KVxuXHRcdFx0XHRcdHBsYXkgPSB0cnVlO1xuXHRcdFx0XHRpZiAocGxheSkge1xuXHRcdFx0XHRcdG1vdmVfcGxheWVyX3RvdXJuYW1lbnQocGxheWVyXzFfdG91cm5hbWVudCwgcGxheWVyXzJfdG91cm5hbWVudCk7XG5cdFx0XHRcdFx0TW92ZUJhbGwocGxheWVyXzFfdG91cm5hbWVudCwgcGxheWVyXzJfdG91cm5hbWVudCwgYmFsbCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoREVCVUdfTU9ERSAmJiBub3cgLSBsYXN0RGVidWdPdXRwdXQgPiA1MDAwKSB7XG5cdFx0XHRjb25zdCBkZWJ1Z0ZwcyA9IGVuZ2luZS5nZXRGcHMoKS50b0ZpeGVkKDEpO1xuXHRcdFx0Y29uc29sZS5sb2coYEZQUzogJHtkZWJ1Z0Zwc30gfCBRdWFsaXR5OiAke3F1YWxpdHlMZXZlbH0gfCBBY3RpdmUgTWVzaGVzOiAke3NjZW5lLmdldEFjdGl2ZU1lc2hlcygpLmxlbmd0aH1gKTtcblx0XHRcdGxhc3REZWJ1Z091dHB1dCA9IG5vdztcblx0XHR9XG5cblx0XHRzY2VuZS5yZW5kZXIoKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJjYW1lcmEgcG9zaXRpb25cIiwgY2FtZXJhLnBvc2l0aW9uKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJjYW1lcmEgcm90YXRpb25cIiwgY2FtZXJhLnJvdGF0aW9uKTtcblxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJFcnJvciBpbiByZW5kZXIgbG9vcDpcIiwgZXJyb3IpO1xuXHRcdGlmIChxdWFsaXR5TGV2ZWwgIT09ICdsb3cnKSB7XG5cdFx0XHRxdWFsaXR5TGV2ZWwgPSAnbG93Jztcblx0XHRcdGFwcGx5UXVhbGl0eVNldHRpbmdzSW1tZWRpYXRlKCk7XG5cdFx0fVxuXHR9XG59KTtcblxubGV0IHJlc2l6ZVRpbWVvdXQ7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuXHRjbGVhclRpbWVvdXQocmVzaXplVGltZW91dCk7XG5cdHJlc2l6ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRlbmdpbmUucmVzaXplKHRydWUpO1xuXHR9LCAxMDApO1xufSk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKCkgPT4ge1xuXHRlbmdpbmUuaGlkZUxvYWRpbmdVSSgpO1xuXHRlbmdpbmUucmVuZGVyRXZlbkluQmFja2dyb3VuZCA9IGZhbHNlO1xufSk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHtcblx0ZW5naW5lLnJlbmRlckV2ZW5JbkJhY2tncm91bmQgPSB0cnVlO1xufSk7XG5cbmNvbnN0IERFQlVHX01PREUgPSBmYWxzZTtcbmxldCBsYXN0RGVidWdPdXRwdXQgPSAwO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U29sb0dhbWVTdGFydCgpIHtcblx0cmV0dXJuIFNvbG9fZ2FtZVN0YXJ0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TXVsdGlHYW1lU3RhcnQoKSB7XG5cdHJldHVybiBNdWx0aV9nYW1lU3RhcnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBSUdhbWVTdGFydCgpIHtcblx0cmV0dXJuIEFJX2dhbWVTdGFydDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRvdXJuYW1lbnRHYW1lU3RhcnQoKSB7XG5cdHJldHVybiB0b3VybmFtZW50X2dhbWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRRdWFsaXR5TGV2ZWwobGV2ZWwpIHtcblx0aWYgKFsnbG93JywgJ21lZGl1bScsICdoaWdoJ10uaW5jbHVkZXMobGV2ZWwpKSB7XG5cdFx0cXVhbGl0eUxldmVsID0gbGV2ZWw7XG5cdFx0YXBwbHlRdWFsaXR5U2V0dGluZ3NJbW1lZGlhdGUoKTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHNob3dFcnJvck1lc3NhZ2UobWVzc2FnZSkge1xuXHRjb25zdCBlcnJvckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRlcnJvckRpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cdGVycm9yRGl2LnN0eWxlLnRvcCA9ICcxMHB4Jztcblx0ZXJyb3JEaXYuc3R5bGUubGVmdCA9ICc1MCUnO1xuXHRlcnJvckRpdi5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgtNTAlKSc7XG5cdGVycm9yRGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDI1NSwgMCwgMCwgMC43KSc7XG5cdGVycm9yRGl2LnN0eWxlLmNvbG9yID0gJ3doaXRlJztcblx0ZXJyb3JEaXYuc3R5bGUucGFkZGluZyA9ICcxMHB4Jztcblx0ZXJyb3JEaXYuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzVweCc7XG5cdGVycm9yRGl2LnN0eWxlLnpJbmRleCA9ICcxMDAwJztcblx0ZXJyb3JEaXYudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXHRcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlcnJvckRpdik7XG5cdFxuXHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVycm9yRGl2KTtcblx0fSwgNTAwMCk7XG59Il19