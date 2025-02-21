import { create_game, create_environment_view1, create_environment_view2, create_environment_view3 } from "./init_game.js";
import { UpdatePlayerPose, init_players } from "./player.js";
import { MoveBall } from "./ball.js";
import { loadScoreModel } from "./score.js";


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
camera.position = new BABYLON.Vector3(107.45137114956808, 350.16014619598326, -71.0351214961887),
camera.rotation = new BABYLON.Vector3(0.3689776126123451, -1.5805112517089825, 0)
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
create_environment_view2(scene);
create_environment_view3(scene);


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


const gameInstance = create_game(scene);

let initialized = false;
let { player_1, player_2 } = init_players(scene);

engine.runRenderLoop(() =>
{
    const scale = window.devicePixelRatio;
    if (canvas.width !== canvas.clientWidth * scale || canvas.height !== canvas.clientHeight * scale) {
        engine.resize(true);
        canvas.width = canvas.clientWidth * scale;
        canvas.height = canvas.clientHeight * scale;
    }

    if (!initialized) {
        create_game(scene);
        loadScoreModel(0, 'left', true);
        loadScoreModel(0, 'right', false);
        initialized = true;
    }
    if (initialized) {
        UpdatePlayerPose(player_1, player_2);
        MoveBall(scene, player_1, player_2);
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
