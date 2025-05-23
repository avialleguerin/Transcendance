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

function applyQualitySettings()
{
	const currentTime = Date.now();
	frameCounter++;
	
	if (currentTime - lastPerformanceCheck > 3000)
	{
		const currentFps = frameCounter / ((currentTime - lastPerformanceCheck) / 1000);
		fpsHistory.push(currentFps);
		
		// Garder un historique limité
		if (fpsHistory.length > 5)
		{
			fpsHistory.shift();
		}
		
		// Calculer la moyenne des FPS
		const avgFps = fpsHistory.reduce((sum, fps) => sum + fps, 0) / fpsHistory.length;
		
		if (avgFps < 90 && qualityLevel !== 'low') {
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
	try
	{
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

	} catch (error) {
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