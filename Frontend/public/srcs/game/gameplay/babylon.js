import { create_environment_view1} from "./init_game.js";
import { UpdatePlayerPose} from "./player.js";
import { MoveBall, MoveBall2v2 } from "./ball.js";
import { init_game_solo , start_game_solo , destroy_game_solo} from "./solo/1v1_player/init_game_Solo.js";
import { init_game_multiplayer, destroy_game_multiplayer } from "./multiplayer/init_game_2v2.js";
import { UpdatePLayerPoseMulti } from "./multiplayer/2v2_game/init_players2v2.js";
import { init_game_ai } from "./solo/1v1_ai/init_game_ai.js";
import { UpdatePlayerAndAI_Pose } from "./solo/1v1_ai/init_player_and_ai.js";
import { init_skins_perso_player1, init_skins_perso_player2 } from "./solo/skin/init_skin_perso.js";
import { init_skins_perso_player1_multi, init_skins_perso_player2_multi, init_skins_perso_player3_multi, init_skins_perso_player4_multi } from "./multiplayer/init_skin_perso_multi.js";
import { init_skins_perso_first, init_skins_perso_seconde } from "./solo/skin/init_skin_player_podium.js";
import { isGameFinished } from "./score.js";
import { gameIsFinished } from "./score.js";
import { SetIsGameFinished } from "./score.js";
import { init_skins_perso_player1_multi_podium, init_skins_perso_player2_multi_podium, init_skins_perso_player3_multi_podium, init_skins_perso_player4_multi_podium } from "./multiplayer/init_teamPlayer_podium.js";
import { start_tournament_game, init_game_tournament } from "./tournament/tournament.js";

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, {
	preserveDrawingBuffer: true,
	stencil: true,
	antialias: true,
	adapToDeviceRatio: true,
    disableWebGLWarnings: true
});


// Désactiver les logs WebGL de Babylon.js
engine.getRenderingCanvas().addEventListener("webglcontextlost", (e) => {
    console.log("WebGL context lost!");
    e.preventDefault();
});

// Surveiller l'objet `console.warn` pour filtrer les warnings spécifiques
const originalConsoleWarn = console.warn;
console.warn = function(message) {
    if (message.includes("generateMipmap") || message.includes("WEBGL_debug_renderer_info")) {
        return; // Ignore ces messages
    }
    originalConsoleWarn.apply(console, arguments); // Applique les autres messages
};

window.scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
scene.imageProcessingConfiguration.contrast = 1.2;
scene.imageProcessingConfiguration.exposure = 1.0;
scene.imageProcessingConfiguration.toneMappingEnabled = true;



scene.getEngine().setHardwareScalingLevel(1.0);
scene.performancePriority = BABYLON.Scene.PRIORITY_ANTIALIAS;


window.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(7.860370854357264, 4, -55.57231601704761), scene);
camera.attachControl(canvas, true);
camera.position = new BABYLON.Vector3(-45.79301951065982, 5.879735371044789, -31.342210947081313),
camera.rotation = new BABYLON.Vector3(-0.029665280069011667, -2.566387085794712, 0)
camera.minZ = 0.1;
camera.maxZ = 5000;

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

const ambientLight = new BABYLON.HemisphericLight(
	"ambientLight",
	new BABYLON.Vector3(0, 1, 0),
	scene
);
ambientLight.intensity = 3;


create_environment_view1(scene);

function createOptimizedSkybox(scene) {
    // Créer un matériau optimisé pour la skybox
    const skyMaterial = new BABYLON.StandardMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // Pas de reflets
    skyMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1); // Émission complète

    // Charger la texture avec des paramètres optimaux  
    const skyTexture = new BABYLON.Texture("/srcs/game/assets/skybox/skybox.jpg", scene);
    skyTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;
    skyTexture.hasAlpha = false; // Pas de canal alpha dans une skybox
    skyTexture.generateMipMaps = false; // Désactive la génération des mipmaps pour éviter le warning
    skyTexture.updateSamplingMode(BABYLON.Texture.NEAREST_NEAREST); // Utilisation du filtrage le plus simple

    // Appliquer la texture au matériau
    skyMaterial.diffuseTexture = skyTexture;

    // Attendre que la texture soit complètement chargée
    skyTexture.onLoadObservable.add(() => {
        console.log("Texture de skybox chargée");
    });

    // Créer une sphère inversée pour la skybox
    const skySphere = BABYLON.MeshBuilder.CreateSphere("skySphere", {diameter: 5000, sideOrientation: BABYLON.Mesh.BACKSIDE}, scene);
    skySphere.material = skyMaterial;
    skySphere.isPickable = false;
    skySphere.infiniteDistance = true;
    skySphere.scaling.y = -1; // Corrige l'orientation de la texture si besoin

    // Optimiser la skybox (elle ne bouge pas)
    skySphere.freezeWorldMatrix();
    skyMaterial.freeze();

    return skySphere;
}

// Utilisation
const skybox = createOptimizedSkybox(scene);



let initialized = false;
let player_1;
let player_2;
let player_3;
let player_4;
let AI_player;
let Solo_gameStart = false;
let Multi_gameStart = false;
let AI_gameStart = false;
let ball;
let tournament_game = false;

export function startGame()
{
    console.log("Game started");
    Solo_gameStart = true;
    Multi_gameStart = false;
    AI_gameStart = false;
    SetIsGameFinished(false);
}

export function startMultiGame()
{
    Multi_gameStart = true;
    Solo_gameStart = false;
    AI_gameStart = false;
    SetIsGameFinished(false);
}

export function startAI_Game()
{
    AI_gameStart = true;
    Solo_gameStart = false;
    Multi_gameStart = false;
    SetIsGameFinished(false);
}

export function startTournamentGame()
{
    tournament_game = true;
    Solo_gameStart = false;
    Multi_gameStart = false;
    AI_gameStart = false;
    SetIsGameFinished(false);
}

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

let play = false;

async function initializeGame_solo_game() 
{
    let players = await init_game_solo(scene);
    player_1 = players.player_1;
    player_2 = players.player_2;
    ball = players.ball;
}

async function initialize_Multiplayer_game()
{
    let players = await init_game_multiplayer(scene);
    player_1 = players.player_1;
    player_2 = players.player_2;
    player_3 = players.player_3;
    player_4 = players.player_4;
    ball = players.ball;
}

async function initialize_AI_game()
{
    let players = await init_game_ai(scene);
    player_1 = players.player_1;
    AI_player = players.ai_player;
    ball = players.ball;
}

async function initializeGame_tournament()
{
    let players = await init_game_tournament(scene);
    player_1 = players.player_1;
    player_2 = players.player_2;
    ball = players.ball;
}

export function leave_Game()
{
    destroy_game_solo(scene);
    Solo_gameStart = false;
    initialized = false;
    play = false;
}

export function leave_Multiplayer_Game()
{
    destroy_game_multiplayer(scene);
    Multi_gameStart = false;
    initialized = false;
    play = false;
}

export function leave_AI_Game()
{
    AI_gameStart = false;
    initialized = false;
    play = false;
}

engine.runRenderLoop(() =>
{
    const scale = window.devicePixelRatio;
    if (canvas.width !== canvas.clientWidth * scale || canvas.height !== canvas.clientHeight * scale)
    {
        engine.resize(true);
        canvas.width = canvas.clientWidth * scale;
        canvas.height = canvas.clientHeight * scale;
    }

    if (Solo_gameStart && !gameIsFinished)
    {
        if (!initialized)
        {
            initializeGame_solo_game();
            initialized = true;
        }
        
        if (initialized)
        {
            if (scene.inputStates.space && !play)
                play = true;

            if (play)
            {
                const bonusPlayer = UpdatePlayerPose(player_1, player_2);
                MoveBall(player_1, player_2, ball, bonusPlayer.player_1_bonus, bonusPlayer.player_2_bonus);
            }
        }
    }

    if (Multi_gameStart && !gameIsFinished)
    {
        if (!initialized)
        {
            initialize_Multiplayer_game();
            initialized = true;
        }
        if (initialized)
        {
            if (scene.inputStates.space && !play)
                play = true;
            if (play)
            {
                UpdatePLayerPoseMulti(player_1, player_2, player_3, player_4);
                MoveBall2v2(player_1, player_2, player_3, player_4, ball);
            }
        }
    }

    if (AI_gameStart && !gameIsFinished)
    {
        if (!initialized)
        {
            initialize_AI_game();
            initialized = true;
        }
        if (initialized)
        {
            if (scene.inputStates.space && !play)
                play = true;
            if (play)
            {
                UpdatePlayerAndAI_Pose(player_1, AI_player, ball);
                MoveBall(player_1, AI_player, ball);
            }
        }
    }

    if (tournament_game && !gameIsFinished)
    {
        if (!initialized)
        {
            initializeGame_tournament();
            initialized = true;
        }
        if (initialized)
        {
            if (scene.inputStates.space && !play)
                play = true;
            if (play)
            {
                UpdatePlayerPose(player_1, player_2);
                MoveBall(player_1, player_2, ball);
            }
        }
    }

    // console.log(camera.rotation);
    // console.log(camera.position);
    scene.render();
});

window.addEventListener('resize', () => {
	engine.resize(true);
});

export function getSoloGameStart()
{
    return Solo_gameStart;
}

export function getMultiGameStart()
{
    return Multi_gameStart;
}

export function getAIGameStart()
{
    return AI_gameStart;
}

export function getTournamentGameStart()
{
    return tournament_game;
}


