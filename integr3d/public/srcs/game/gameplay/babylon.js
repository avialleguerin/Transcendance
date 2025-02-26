import { create_environment_view1, create_environment_view2, destroy_environement_view3} from "./init_game.js";
import { UpdatePlayerPose} from "./player.js";
import { MoveBall, MoveBall2v2 } from "./ball.js";
import { init_game_solo , start_game_solo , destroy_game_solo} from "./solo/1v1_player/init_game_Solo.js";
import { init_game_multiplayer, destroy_game_multiplayer } from "./multiplayer/init_game_2v2.js";
import { UpdatePLayerPoseMulti } from "./multiplayer/2v2_game/init_players2v2.js";


const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, {
	preserveDrawingBuffer: true,
	stencil: true,
	antialias: true,
	adapToDeviceRatio: true
});

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
camera.maxZ = 1000;

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
ambientLight.intensity = 0.8;


create_environment_view1(scene);
// create_environment_view2(scene);
// create_environment_view3(scene);


const environment = scene.createDefaultEnvironment({
	createSkybox: false,
	CreateGround: true,
	enableGroundShadow: true,
	groundYBias: 1
});

const skysphere = BABYLON.MeshBuilder.CreateSphere("skysphere", {
	diameter: 1000,
	segments: 32
}, scene);

const skyMaterial = new BABYLON.StandardMaterial("skyMaterial", scene);
skyMaterial.backFaceCulling = false;
skyMaterial.diffuseTexture = new BABYLON.Texture("/srcs/game/assets/skybox/skybox.jpg", scene);
skyMaterial.diffuseTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;
skyMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
skyMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);


skysphere.material = skyMaterial;
skysphere.isPickable = false;
skysphere.infiniteDistance = true;


skysphere.scaling.y = -1;


// const gameInstance = create_game(scene);

let initialized = false;
let player_1;
let player_2;
let player_3;
let player_4;
let Solo_gameStart = false;
let Multi_gameStart = false;
let ball;

export function startGame()
{
    console.log("Game started");
    Solo_gameStart = true;
    Multi_gameStart = false;
}

export function startMultiGame()
{
    Multi_gameStart = true;
    Solo_gameStart = false;
}

scene.inputStates = { space: false };

// Ensuite, configurez les écouteurs d'événements pour le clavier
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


engine.runRenderLoop(() =>
{
    const scale = window.devicePixelRatio;
    if (canvas.width !== canvas.clientWidth * scale || canvas.height !== canvas.clientHeight * scale)
    {
        engine.resize(true);
        canvas.width = canvas.clientWidth * scale;
        canvas.height = canvas.clientHeight * scale;
    }

    if (Solo_gameStart)
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
                UpdatePlayerPose(player_1, player_2);
                MoveBall(player_1, player_2, ball);
            }
        }
    }

    if (Multi_gameStart)
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
    scene.render();
});


window.addEventListener('resize', () => {
	engine.resize(true);
});

scene.onBeforeRenderObservable.add(() => {
	scene.meshes.forEach(mesh => {
		if (mesh.material && mesh.material.diffuseTexture) {
			mesh.material.diffuseTexture.anisotropicFilteringLevel = 16;
		}
	});
});