const skinDefault = { name: "player_skin_default", path: "/srcs/game/assets/player_skin/", file: "player_blanc.glb" };

let player1_podium_multi_default = null;
let player2_podium_multi_default = null;
let player3_podium_multi_default = null;
let player4_podium_multi_default = null;

function loadDefaultSkin(scene, x, y, z, scaleX, scaleY, scaleZ) {
    return new Promise((resolve, reject) => {
        BABYLON.SceneLoader.ImportMesh("", skinDefault.path, skinDefault.file, scene, (meshes) => {
            const rootMesh = meshes.find(mesh => mesh.name === "__root__");
            if (rootMesh) {
                rootMesh.position = new BABYLON.Vector3(x, y, z);
                rootMesh.scaling = new BABYLON.Vector3(scaleX, scaleY, scaleZ);
                rootMesh.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
                rootMesh.metadata = { isPlayer_skin_podium: true };
                rootMesh.setEnabled(false);
                resolve(rootMesh);
            } else {
                reject(`Erreur lors du chargement du skin par défaut`);
            }
        });
    });
}

export async function init_skins_perso_podium_multi_default(scene) {
    player1_podium_multi_default = await loadDefaultSkin(scene, -62, 304.5, -57, 4, 4, 4);
    player2_podium_multi_default = await loadDefaultSkin(scene, -65, 304.5, -53, 4, 4, 4);
    player3_podium_multi_default = await loadDefaultSkin(scene, -62, 303, -49, 4, 4, 4);
    player4_podium_multi_default = await loadDefaultSkin(scene, -65, 303, -45, 4, 4, 4);
}

export function enable_skin_multi_podium_default() {
    if (!player1_podium_multi_default || !player2_podium_multi_default || !player3_podium_multi_default || !player4_podium_multi_default) return;

    player1_podium_multi_default.setEnabled(true);
    player2_podium_multi_default.setEnabled(true);
    player3_podium_multi_default.setEnabled(true);
    player4_podium_multi_default.setEnabled(true);
}

export function disable_skin_multi_podium_default() {
    if (!player1_podium_multi_default || !player2_podium_multi_default || !player3_podium_multi_default || !player4_podium_multi_default) return;

    player1_podium_multi_default.setEnabled(false);
    player2_podium_multi_default.setEnabled(false);
    player3_podium_multi_default.setEnabled(false);
    player4_podium_multi_default.setEnabled(false);
}
