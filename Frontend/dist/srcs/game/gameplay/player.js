import { grenade_flash_player1, grenade_flash_player2 } from "./solo/1v1_player/init_powerUP_GrenadeFlash.js";
import { init_Teammate_player_1 } from "./solo/1v1_player/init_powerUP_teammate.js";
import { init_Teammate_player_2 } from "./solo/1v1_player/init_powerUP_teammate.js";
import { inverse_player1, inverse_player2, is_Inverse_team1, is_Inverse_team2 } from "./solo/1v1_player/init_powerUP_inverse.js";
import { currentSkinPlayer1, currentSkinPlayer2 } from "./solo/skin/init_skin_perso.js";
let minX = 0;
let maxX = 0;
const path_skin = [
    { name: "player_skin_1", path: "/srcs/game/assets/player_skin/", file: "player_blanc.glb" },
    { name: "player_skin_2", path: "/srcs/game/assets/player_skin/", file: "player_bleuv2.glb" },
    { name: "player_skin_3", path: "/srcs/game/assets/player_skin/", file: "player_rougev2.glb" },
    { name: "player_skin_4", path: "/srcs/game/assets/player_skin/", file: "player_vert.glb" }
];
function init_border() {
    const borderTop = new BABYLON.MeshBuilder.CreateBox("border", {
        width: 115,
        height: 3,
        depth: 1
    }, scene);
    borderTop.position = new BABYLON.Vector3(25, 300, -72);
    borderTop.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
    borderTop.visibility = 0;
    const borderBottom = new BABYLON.MeshBuilder.CreateBox("border", {
        width: 115,
        height: 3,
        depth: 1
    }, scene);
    borderBottom.position = new BABYLON.Vector3(-40, 300, -72);
    borderBottom.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
    borderBottom.visibility = 0;
    minX = borderBottom.position.x + (borderBottom.scaling.x / 2) + 4.5;
    maxX = borderTop.position.x - (borderTop.scaling.x / 2) - 4.5;
}
export function init_players(scene, player_1, player_2) {
    init_border();
    player_1 = new BABYLON.MeshBuilder.CreateBox("player_1", {
        width: 10,
        height: 1.5,
        depth: 1.5
    }, scene);
    player_1.position = new BABYLON.Vector3(-7, 301, -120);
    player_1.checkPaddleCollision = true;
    player_1.metadata = { isPlayer_paddle: true }; // Tag ajouté pour identifier ce mesh comme joueur
    player_1.visibility = 0;
    player_2 = new BABYLON.MeshBuilder.CreateBox("player_2", {
        width: 10,
        height: 1.5,
        depth: 1.5
    }, scene);
    player_2.position = new BABYLON.Vector3(-7, 301, -24);
    player_2.checkPaddleCollision = true;
    player_2.metadata = { isPlayer_paddle: true }; // Tag ajouté pour identifier ce mesh comme joueur
    player_2.visibility = 0;
    if (currentSkinPlayer1 === 0) {
        BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player/", "PlayerIdleAnnimation.glb", scene, function (newMeshes) {
            const rootMesh = newMeshes.find(mesh => mesh.name === "__root__");
            if (rootMesh) {
                rootMesh.position = player_1.position.clone();
                rootMesh.scaling = new BABYLON.Vector3(6, 6, 6);
                rootMesh.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(0, Math.PI, 0);
                rootMesh.metadata = { isPlayer: true }; // Tag ajouté pour identifier ce mesh comme joueur
            }
            newMeshes.forEach(mesh => {
                if (mesh instanceof BABYLON.Mesh) {
                    mesh.rotationQuaternion = null;
                    mesh.rotation = new BABYLON.Vector3(Math.PI, 0, 0);
                    mesh.metadata = { isPlayer: true }; // Tag ajouté pour identifier ce mesh comme joueur
                }
            });
            const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
                width: 10,
                height: 0.1,
                depth: 1,
            }, scene);
            playerRepere.position = new BABYLON.Vector3(-7, 301, -120);
            playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
            playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
            playerRepere.metadata = { isPlayerRepere: true }; // Tag ajouté pour le repère du joueur
            scene.registerBeforeRender(() => {
                rootMesh.position.x = player_1.position.x;
                rootMesh.position.y = player_1.position.y;
                rootMesh.position.z = player_1.position.z;
                playerRepere.position.x = player_1.position.x;
                playerRepere.position.y = player_1.position.y;
            });
        });
    }
    if (currentSkinPlayer2 === 0) {
        BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player/", "PlayerIdleAnnimation.glb", scene, function (newMeshes) {
            const playerModel = newMeshes[0];
            playerModel.position = player_2.position.clone();
            playerModel.scaling = new BABYLON.Vector3(6, 6, 6);
            playerModel.rotation = new BABYLON.Vector3(0, Math.PI, 0);
            playerModel.metadata = { isPlayer: true }; // Tag ajouté pour le joueur 2
            const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
                width: 10,
                height: 0.1,
                depth: 1,
            }, scene);
            playerRepere.position = new BABYLON.Vector3(-7, 301, -24.5);
            playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
            playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
            playerRepere.metadata = { isPlayerRepere: true }; // Tag ajouté pour le repère du joueur 2
            // Synchronisation continue de la position
            scene.registerBeforeRender(() => {
                playerModel.position.x = player_2.position.x;
                playerModel.position.y = player_2.position.y;
                playerModel.position.z = player_2.position.z;
                playerRepere.position.x = player_2.position.x;
                playerRepere.position.y = player_2.position.y;
            });
        });
    }
    if (currentSkinPlayer1 === 1) {
        BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player_skin/", "idle_bleu.glb", scene, function (newMeshes) {
            const playerModel = newMeshes[0];
            playerModel.position = player_1.position.clone();
            playerModel.scaling = new BABYLON.Vector3(6, 6, 6);
            playerModel.rotation = new BABYLON.Vector3(0, Math.PI, 0);
            playerModel.metadata = { isPlayer: true }; // Tag ajouté pour le joueur 2
            newMeshes.forEach(mesh => {
                if (mesh instanceof BABYLON.Mesh) {
                    mesh.rotationQuaternion = null;
                    mesh.rotation = new BABYLON.Vector3(Math.PI, 0, 0);
                    mesh.metadata = { isPlayer: true }; // Tag ajouté pour identifier ce mesh comme joueur
                }
            });
            const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
                width: 10,
                height: 0.1,
                depth: 1,
            }, scene);
            playerRepere.position = new BABYLON.Vector3(-7, 301, -120);
            playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
            playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
            playerRepere.metadata = { isPlayerRepere: true }; // Tag ajouté pour le repère du joueur 2
            // Synchronisation continue de la position
            scene.registerBeforeRender(() => {
                playerModel.position.x = player_1.position.x;
                playerModel.position.y = player_1.position.y;
                playerModel.position.z = player_1.position.z;
                playerRepere.position.x = player_1.position.x;
                playerRepere.position.y = player_1.position.y;
            });
        });
    }
    if (currentSkinPlayer2 === 1) {
        BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player_skin/", "idle_bleu.glb", scene, function (newMeshes) {
            const playerModel = newMeshes[0];
            playerModel.position = player_2.position.clone();
            playerModel.scaling = new BABYLON.Vector3(6, 6, 6);
            playerModel.rotation = new BABYLON.Vector3(0, Math.PI, 0);
            playerModel.metadata = { isPlayer: true }; // Tag ajouté pour le joueur 2
            const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
                width: 10,
                height: 0.1,
                depth: 1,
            }, scene);
            playerRepere.position = new BABYLON.Vector3(-7, 301, -24.5);
            playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
            playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
            playerRepere.metadata = { isPlayerRepere: true }; // Tag ajouté pour le repère du joueur 2
            // Synchronisation continue de la position
            scene.registerBeforeRender(() => {
                playerModel.position.x = player_2.position.x;
                playerModel.position.y = player_2.position.y;
                playerModel.position.z = player_2.position.z;
                playerRepere.position.x = player_2.position.x;
                playerRepere.position.y = player_2.position.y;
            });
        });
    }
    if (currentSkinPlayer1 === 2) {
        BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player_skin/", "idle_rouge.glb", scene, function (newMeshes) {
            const playerModel = newMeshes[0];
            playerModel.position = player_1.position.clone();
            playerModel.scaling = new BABYLON.Vector3(6, 6, 6);
            playerModel.rotation = new BABYLON.Vector3(0, Math.PI, 0);
            playerModel.metadata = { isPlayer: true }; // Tag ajouté pour le joueur 2
            newMeshes.forEach(mesh => {
                if (mesh instanceof BABYLON.Mesh) {
                    mesh.rotationQuaternion = null;
                    mesh.rotation = new BABYLON.Vector3(Math.PI, 0, 0);
                    mesh.metadata = { isPlayer: true }; // Tag ajouté pour identifier ce mesh comme joueur
                }
            });
            const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
                width: 10,
                height: 0.1,
                depth: 1,
            }, scene);
            playerRepere.position = new BABYLON.Vector3(-7, 301, -120);
            playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
            playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
            playerRepere.metadata = { isPlayerRepere: true }; // Tag ajouté pour le repère du joueur 2
            // Synchronisation continue de la position
            scene.registerBeforeRender(() => {
                playerModel.position.x = player_1.position.x;
                playerModel.position.y = player_1.position.y;
                playerModel.position.z = player_1.position.z;
                playerRepere.position.x = player_1.position.x;
                playerRepere.position.y = player_1.position.y;
            });
        });
    }
    if (currentSkinPlayer2 === 2) {
        BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player_skin/", "idle_rouge.glb", scene, function (newMeshes) {
            const playerModel = newMeshes[0];
            playerModel.position = player_2.position.clone();
            playerModel.scaling = new BABYLON.Vector3(6, 6, 6);
            playerModel.rotation = new BABYLON.Vector3(0, Math.PI, 0);
            playerModel.metadata = { isPlayer: true }; // Tag ajouté pour le joueur 2
            const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
                width: 10,
                height: 0.1,
                depth: 1,
            }, scene);
            playerRepere.position = new BABYLON.Vector3(-7, 301, -24.5);
            playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
            playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
            playerRepere.metadata = { isPlayerRepere: true }; // Tag ajouté pour le repère du joueur 2
            // Synchronisation continue de la position
            scene.registerBeforeRender(() => {
                playerModel.position.x = player_2.position.x;
                playerModel.position.y = player_2.position.y;
                playerModel.position.z = player_2.position.z;
                playerRepere.position.x = player_2.position.x;
                playerRepere.position.y = player_2.position.y;
            });
        });
    }
    if (currentSkinPlayer1 === 3) {
        BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player_skin/", "idle_vert.glb", scene, function (newMeshes) {
            const playerModel = newMeshes[0];
            playerModel.position = player_1.position.clone();
            playerModel.scaling = new BABYLON.Vector3(6, 6, 6);
            playerModel.rotation = new BABYLON.Vector3(0, Math.PI, 0);
            playerModel.metadata = { isPlayer: true }; // Tag ajouté pour le joueur 2
            newMeshes.forEach(mesh => {
                if (mesh instanceof BABYLON.Mesh) {
                    mesh.rotationQuaternion = null;
                    mesh.rotation = new BABYLON.Vector3(Math.PI, 0, 0);
                    mesh.metadata = { isPlayer: true }; // Tag ajouté pour identifier ce mesh comme joueur
                }
            });
            const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
                width: 10,
                height: 0.1,
                depth: 1,
            }, scene);
            playerRepere.position = new BABYLON.Vector3(-7, 301, -120);
            playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
            playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
            playerRepere.metadata = { isPlayerRepere: true }; // Tag ajouté pour le repère du joueur 2
            // Synchronisation continue de la position
            scene.registerBeforeRender(() => {
                playerModel.position.x = player_1.position.x;
                playerModel.position.y = player_1.position.y;
                playerModel.position.z = player_1.position.z;
                playerRepere.position.x = player_1.position.x;
                playerRepere.position.y = player_1.position.y;
            });
        });
    }
    if (currentSkinPlayer2 === 3) {
        BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player_skin/", "idle_vert.glb", scene, function (newMeshes) {
            const playerModel = newMeshes[0];
            playerModel.position = player_2.position.clone();
            playerModel.scaling = new BABYLON.Vector3(6, 6, 6);
            playerModel.rotation = new BABYLON.Vector3(0, Math.PI, 0);
            playerModel.metadata = { isPlayer: true }; // Tag ajouté pour le joueur 2
            const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
                width: 10,
                height: 0.1,
                depth: 1,
            }, scene);
            playerRepere.position = new BABYLON.Vector3(-7, 301, -24.5);
            playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
            playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
            playerRepere.metadata = { isPlayerRepere: true }; // Tag ajouté pour le repère du joueur 2
            // Synchronisation continue de la position
            scene.registerBeforeRender(() => {
                playerModel.position.x = player_2.position.x;
                playerModel.position.y = player_2.position.y;
                playerModel.position.z = player_2.position.z;
                playerRepere.position.x = player_2.position.x;
                playerRepere.position.y = player_2.position.y;
            });
        });
    }
    console.log("player 1 " + player_1.position);
    console.log("player 2 " + player_2.position);
    return { player_1, player_2 };
}
export function getPlayerRef() {
    console.log("player 1 bis " + player_1.position);
    console.log("player 2 bis " + player_2.position);
    return { player_1, player_2 };
}
export function reset_player_position(player_1, player_2) {
    player_1.position = new BABYLON.Vector3(-7, 301, -120);
    player_2.position = new BABYLON.Vector3(-7, 301, -24);
}
const paddleSpeed = 1.1;
const keys = {};
addEventListener("keydown", (event) => keys[event.key] = true);
addEventListener("keyup", (event) => keys[event.key] = false);
let player_1_bonus = null;
let player_2_bonus = null;
export function UpdatePlayerPose(player_1, player_2) {
    if (is_Inverse_team1 == false) {
        if (keys["w"] && player_1.position.x > minX) {
            player_1.position.x -= paddleSpeed;
        }
        if (keys["s"] && player_1.position.x < maxX) {
            player_1.position.x += paddleSpeed;
        }
    }
    if (is_Inverse_team1 == true) {
        if (keys["w"] && player_1.position.x < maxX) {
            player_1.position.x += paddleSpeed;
        }
        if (keys["s"] && player_1.position.x > minX) {
            player_1.position.x -= paddleSpeed;
        }
    }
    if (is_Inverse_team2 == false) {
        if (keys["i"] && player_2.position.x > minX) {
            player_2.position.x -= paddleSpeed;
        }
        if (keys["k"] && player_2.position.x < maxX) {
            player_2.position.x += paddleSpeed;
        }
    }
    if (is_Inverse_team2 == true) {
        if (keys["i"] && player_2.position.x < maxX) {
            player_2.position.x += paddleSpeed;
        }
        if (keys["k"] && player_2.position.x > minX) {
            player_2.position.x -= paddleSpeed;
        }
    }
    if (keys["c"] && is_Inverse_team1 == false) {
        inverse_player2();
    }
    if (keys["3"] && is_Inverse_team2 == false) {
        inverse_player1();
    }
    if (keys["z"])
        grenade_flash_player1(scene);
    if (keys["1"])
        grenade_flash_player2(scene);
    if (keys["x"]) {
        if (!player_1_bonus) {
            player_1_bonus = init_Teammate_player_1(scene);
            if (player_1_bonus) {
                console.log(player_1_bonus.position);
                setTimeout(() => {
                    player_1_bonus = null;
                }, 10000);
            }
        }
    }
    if (keys["2"]) {
        if (!player_2_bonus) {
            player_2_bonus = init_Teammate_player_2(scene);
            if (player_2_bonus) {
                console.log(player_2_bonus.position);
                setTimeout(() => {
                    player_2_bonus = null;
                }, 10000);
            }
        }
    }
    if (keys["e"] && player_1_bonus && player_1_bonus.position.x > minX) {
        player_1_bonus.position.x -= paddleSpeed;
    }
    if (keys["d"] && player_1_bonus && player_1_bonus.position.x < maxX) {
        player_1_bonus.position.x += paddleSpeed;
    }
    if (keys["o"] && player_2_bonus && player_2_bonus.position.x > minX) {
        player_2_bonus.position.x -= paddleSpeed;
    }
    if (keys["l"] && player_2_bonus && player_2_bonus.position.x < maxX) {
        player_2_bonus.position.x += paddleSpeed;
    }
    return {
        player_1_bonus: player_1_bonus,
        player_2_bonus: player_2_bonus
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHVibGljL3NyY3MvZ2FtZS9nYW1lcGxheS9wbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHFCQUFxQixFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDOUcsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDcEYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDcEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNqSSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUd4RixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFDYixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFFYixNQUFNLFNBQVMsR0FBRztJQUNqQixFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLGdDQUFnQyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRTtJQUMzRixFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLGdDQUFnQyxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRTtJQUM1RixFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLGdDQUFnQyxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRTtJQUM3RixFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLGdDQUFnQyxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRTtDQUMxRixDQUFDO0FBRUYsU0FBUyxXQUFXO0lBQ25CLE1BQU0sU0FBUyxHQUFHLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO1FBQzdELEtBQUssRUFB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QzdCLENBQUM7UUFDQSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQztZQUM3QyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxXQUFXLENBQUM7UUFDcEMsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDO1lBQzdDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQztRQUNwQyxDQUFDO0lBQ0YsQ0FBQztJQUVELElBQUksZ0JBQWdCLElBQUksSUFBSSxFQUM1QixDQUFDO1FBQ0EsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUM7WUFDN0MsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksV0FBVyxDQUFDO1FBQ3BDLENBQUM7UUFDRCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQztZQUM3QyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxXQUFXLENBQUM7UUFDcEMsQ0FBQztJQUNGLENBQUM7SUFFRCxJQUFJLGdCQUFnQixJQUFJLEtBQUssRUFDN0IsQ0FBQztRQUNBLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDO1lBQzdDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQztRQUNwQyxDQUFDO1FBQ0QsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUM7WUFDN0MsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFD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LElBQUksRUFDbkUsQ0FBQztRQUNBLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQztJQUMxQyxDQUFDO0lBR0QsT0FBTztRQUNOLGNBQWMsRUFBRSxjQUFjO1FBQzlCLGNBQWMsRUFBRSxjQUFjO0tBQzlCLENBQUM7QUFFSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ3JlbmFkZV9mbGFzaF9wbGF5ZXIxLCBncmVuYWRlX2ZsYXNoX3BsYXllcjIgfSBmcm9tIFwiLi9zb2xvLzF2MV9wbGF5ZXIvaW5pdF9wb3dlclVQX0dyZW5hZGVGbGFzaC5qc1wiO1xuaW1wb3J0IHsgaW5pdF9UZWFtbWF0ZV9wbGF5ZXJfMSB9IGZyb20gXCIuL3NvbG8vMXYxX3BsYXllci9pbml0X3Bvd2VyVVBfdGVhbW1hdGUuanNcIjtcbmltcG9ydCB7IGluaXRfVGVhbW1hdGVfcGxheWVyXzIgfSBmcm9tIFwiLi9zb2xvLzF2MV9wbGF5ZXIvaW5pdF9wb3dlclVQX3RlYW1tYXRlLmpzXCI7XG5pbXBvcnQgeyBpbnZlcnNlX3BsYXllcjEsIGludmVyc2VfcGxheWVyMiwgaXNfSW52ZXJzZV90ZWFtMSwgaXNfSW52ZXJzZV90ZWFtMiB9IGZyb20gXCIuL3NvbG8vMXYxX3BsYXllci9pbml0X3Bvd2VyVVBfaW52ZXJzZS5qc1wiO1xuaW1wb3J0IHsgY3VycmVudFNraW5QbGF5ZXIxLCBjdXJyZW50U2tpblBsYXllcjIgfSBmcm9tIFwiLi9zb2xvL3NraW4vaW5pdF9za2luX3BlcnNvLmpzXCI7XG5cblxubGV0IG1pblggPSAwO1xubGV0IG1heFggPSAwO1xuXG5jb25zdCBwYXRoX3NraW4gPSBbXG5cdHsgbmFtZTogXCJwbGF5ZXJfc2tpbl8xXCIsIHBhdGg6IFwiL3NyY3MvZ2FtZS9hc3NldHMvcGxheWVyX3NraW4vXCIsIGZpbGU6IFwicGxheWVyX2JsYW5jLmdsYlwiIH0sXG5cdHsgbmFtZTogXCJwbGF5ZXJfc2tpbl8yXCIsIHBhdGg6IFwiL3NyY3MvZ2FtZS9hc3NldHMvcGxheWVyX3NraW4vXCIsIGZpbGU6IFwicGxheWVyX2JsZXV2Mi5nbGJcIiB9LFxuXHR7IG5hbWU6IFwicGxheWVyX3NraW5fM1wiLCBwYXRoOiBcIi9zcmNzL2dhbWUvYXNzZXRzL3BsYXllcl9za2luL1wiLCBmaWxlOiBcInBsYXllcl9yb3VnZXYyLmdsYlwiIH0sXG5cdHsgbmFtZTogXCJwbGF5ZXJfc2tpbl80XCIsIHBhdGg6IFwiL3NyY3MvZ2FtZS9hc3NldHMvcGxheWVyX3NraW4vXCIsIGZpbGU6IFwicGxheWVyX3ZlcnQuZ2xiXCIgfVxuXTtcblxuZnVuY3Rpb24gaW5pdF9ib3JkZXIoKSB7XG5cdGNvbnN0IGJvcmRlclRvcCA9IG5ldyBCQUJZTE9OLk1lc2hCdWlsZGVyLkNyZWF0ZUJveChcImJvcmRlclwiLCB7XG5cdFx0d2lkdGg6IDExNSxcblx0XHRoZWlnaHQ6IDMsXG5cdFx0ZGVwdGg6IDFcblx0fSwgc2NlbmUpO1xuXHRib3JkZXJUb3AucG9zaXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKDI1LCAzMDAsIC03Mik7XG5cdGJvcmRlclRvcC5yb3RhdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgTWF0aC5QSSAvIDIsIDApO1xuXHRib3JkZXJUb3AudmlzaWJpbGl0eSA9IDA7XG5cdFxuXHRjb25zdCBib3JkZXJCb3R0b20gPSBuZXcgQkFCWUxPTi5NZXNoQnVpbGRlci5DcmVhdGVCb3goXCJib3JkZXJcIiwge1xuXHRcdHdpZHRoOiAxMTUsXG5cdFx0aGVpZ2h0OiAzLFxuXHRcdGRlcHRoOiAxXG5cdH0sIHNjZW5lKTtcblx0Ym9yZGVyQm90dG9tLnBvc2l0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygtNDAsIDMwMCwgLTcyKTtcblx0Ym9yZGVyQm90dG9tLnJvdGF0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygwLCBNYXRoLlBJIC8gMiwgMCk7XG5cdGJvcmRlckJvdHRvbS52aXNpYmlsaXR5ID0gMDtcblxuXHRtaW5YID0gYm9yZGVyQm90dG9tLnBvc2l0aW9uLnggKyAoYm9yZGVyQm90dG9tLnNjYWxpbmcueCAvIDIpICsgNC41O1xuXHRtYXhYID0gYm9yZGVyVG9wLnBvc2l0aW9uLnggLSAoYm9yZGVyVG9wLnNjYWxpbmcueCAvIDIpIC0gNC41O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdF9wbGF5ZXJzKHNjZW5lLCBwbGF5ZXJfMSwgcGxheWVyXzIpIHtcblxuXHRpbml0X2JvcmRlcigpO1xuXG5cdHBsYXllcl8xID0gbmV3IEJBQllMT04uTWVzaEJ1aWxkZXIuQ3JlYXRlQm94KFwicGxheWVyXzFcIiwge1xuXHRcdHdpZHRoOiAxMCxcblx0XHRoZWlnaHQ6IDEuNSxcblx0XHRkZXB0aDogMS41XG5cdH0sIHNjZW5lKTtcblx0cGxheWVyXzEucG9zaXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKC03LCAzMDEsIC0xMjApO1xuXHRwbGF5ZXJfMS5jaGVja1BhZGRsZUNvbGxpc2lvbiA9IHRydWU7XG5cdHBsYXllcl8xLm1ldGFkYXRhID0geyBpc1BsYXllcl9wYWRkbGU6IHRydWUgfTsgIC8vIFRhZyBham91dMOpIHBvdXIgaWRlbnRpZmllciBjZSBtZXNoIGNvbW1lIGpvdWV1clxuXHRwbGF5ZXJfMS52aXNpYmlsaXR5ID0gMDtcblx0XG5cdHBsYXllcl8yID0gbmV3IEJBQllMT04uTWVzaEJ1aWxkZXIuQ3JlYXRlQm94KFwicGxheWVyXzJcIiwge1xuXHRcdHdpZHRoOiAxMCxcblx0XHRoZWlnaHQ6IDEuNSxcblx0XHRkZXB0aDogMS41XG5cdH0sIHNjZW5lKTtcblx0cGxheWVyXzIucG9zaXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKC03LCAzMDEsIC0yNCk7XG5cdHBsYXllcl8yLmNoZWNrUGFkZGxlQ29sbGlzaW9uID0gdHJ1ZTtcblx0cGxheWVyXzIubWV0YWRhdGEgPSB7IGlzUGxheWVyX3BhZGRsZTogdHJ1ZSB9OyAgLy8gVGFnIGFqb3V0w6kgcG91ciBpZGVudGlmaWVyIGNlIG1lc2ggY29tbWUgam91ZXVyXG5cdHBsYXllcl8yLnZpc2liaWxpdHkgPSAwO1xuXG5cdGlmIChjdXJyZW50U2tpblBsYXllcjEgPT09IDApXG5cdHtcblx0XHRCQUJZTE9OLlNjZW5lTG9hZGVyLkltcG9ydE1lc2goXCJcIiwgXCIvc3Jjcy9nYW1lL2Fzc2V0cy9wbGF5ZXIvXCIsIFwiUGxheWVySWRsZUFubmltYXRpb24uZ2xiXCIsIHNjZW5lLCBmdW5jdGlvbiAobmV3TWVzaGVzKSB7XG5cdFx0XHRjb25zdCByb290TWVzaCA9IG5ld01lc2hlcy5maW5kKG1lc2ggPT4gbWVzaC5uYW1lID09PSBcIl9fcm9vdF9fXCIpO1xuXHRcdFx0aWYgKHJvb3RNZXNoKSB7XG5cdFx0XHRcdHJvb3RNZXNoLnBvc2l0aW9uID0gcGxheWVyXzEucG9zaXRpb24uY2xvbmUoKTtcblx0XHRcdFx0cm9vdE1lc2guc2NhbGluZyA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoNiwgNiwgNik7XG5cdFx0XHRcdHJvb3RNZXNoLnJvdGF0aW9uUXVhdGVybmlvbiA9IEJBQllMT04uUXVhdGVybmlvbi5Gcm9tRXVsZXJBbmdsZXMoMCwgTWF0aC5QSSwgMCk7XG5cdFx0XHRcdHJvb3RNZXNoLm1ldGFkYXRhID0geyBpc1BsYXllcjogdHJ1ZSB9OyAgLy8gVGFnIGFqb3V0w6kgcG91ciBpZGVudGlmaWVyIGNlIG1lc2ggY29tbWUgam91ZXVyXG5cdFx0XHR9XG5cdFx0XG5cdFx0XHRuZXdNZXNoZXMuZm9yRWFjaChtZXNoID0+IHtcblx0XHRcdFx0aWYgKG1lc2ggaW5zdGFuY2VvZiBCQUJZTE9OLk1lc2gpIHtcblx0XHRcdFx0XHRtZXNoLnJvdGF0aW9uUXVhdGVybmlvbiA9IG51bGw7XG5cdFx0XHRcdFx0bWVzaC5yb3RhdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoTWF0aC5QSSwgMCwgMCk7XG5cdFx0XHRcdFx0bWVzaC5tZXRhZGF0YSA9IHsgaXNQbGF5ZXI6IHRydWUgfTsgIC8vIFRhZyBham91dMOpIHBvdXIgaWRlbnRpZmllciBjZSBtZXNoIGNvbW1lIGpvdWV1clxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcblx0XHRcdGNvbnN0IHBsYXllclJlcGVyZSA9IG5ldyBCQUJZTE9OLk1lc2hCdWlsZGVyLkNyZWF0ZUJveChcInBsYXllclJlcGVyZVwiLCB7XG5cdFx0XHRcdHdpZHRoOiAxMCxcblx0XHRcdFx0aGVpZ2h0OiAwLjEsXG5cdFx0XHRcdGRlcHRoOiAxLFxuXHRcdFx0fSwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygtNywgMzAxLCAtMTIwKTtcblx0XHRcdHBsYXllclJlcGVyZS5tYXRlcmlhbCA9IG5ldyBCQUJZTE9OLlN0YW5kYXJkTWF0ZXJpYWwoXCJwbGF5ZXJSZXBlcmVNYXRcIiwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLm1hdGVyaWFsLmVtaXNzaXZlQ29sb3IgPSBuZXcgQkFCWUxPTi5Db2xvcjMuUmVkKCk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUubWV0YWRhdGEgPSB7IGlzUGxheWVyUmVwZXJlOiB0cnVlIH07ICAvLyBUYWcgYWpvdXTDqSBwb3VyIGxlIHJlcMOocmUgZHUgam91ZXVyXG5cdFx0XG5cdFx0XHRzY2VuZS5yZWdpc3RlckJlZm9yZVJlbmRlcigoKSA9PiB7XG5cdFx0XHRcdHJvb3RNZXNoLnBvc2l0aW9uLnggPSBwbGF5ZXJfMS5wb3NpdGlvbi54O1xuXHRcdFx0XHRyb290TWVzaC5wb3NpdGlvbi55ID0gcGxheWVyXzEucG9zaXRpb24ueTtcblx0XHRcdFx0cm9vdE1lc2gucG9zaXRpb24ueiA9IHBsYXllcl8xLnBvc2l0aW9uLno7XG5cdFx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbi54ID0gcGxheWVyXzEucG9zaXRpb24ueDtcblx0XHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uLnkgPSBwbGF5ZXJfMS5wb3NpdGlvbi55O1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblx0XG5cdGlmIChjdXJyZW50U2tpblBsYXllcjIgPT09IDApXG5cdHtcblx0XHRCQUJZTE9OLlNjZW5lTG9hZGVyLkltcG9ydE1lc2goXCJcIiwgXCIvc3Jjcy9nYW1lL2Fzc2V0cy9wbGF5ZXIvXCIsIFwiUGxheWVySWRsZUFubmltYXRpb24uZ2xiXCIsIHNjZW5lLCBmdW5jdGlvbiAobmV3TWVzaGVzKSB7XG5cdFx0XHRjb25zdCBwbGF5ZXJNb2RlbCA9IG5ld01lc2hlc1swXTtcblx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uID0gcGxheWVyXzIucG9zaXRpb24uY2xvbmUoKTtcblx0XHRcdHBsYXllck1vZGVsLnNjYWxpbmcgPSBuZXcgQkFCWUxPTi5WZWN0b3IzKDYsIDYsIDYpO1xuXHRcdFx0cGxheWVyTW9kZWwucm90YXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKDAsIE1hdGguUEksIDApO1xuXHRcdFx0cGxheWVyTW9kZWwubWV0YWRhdGEgPSB7IGlzUGxheWVyOiB0cnVlIH07ICAvLyBUYWcgYWpvdXTDqSBwb3VyIGxlIGpvdWV1ciAyXG5cdFx0XG5cdFx0XHRjb25zdCBwbGF5ZXJSZXBlcmUgPSBuZXcgQkFCWUxPTi5NZXNoQnVpbGRlci5DcmVhdGVCb3goXCJwbGF5ZXJSZXBlcmVcIiwge1xuXHRcdFx0XHR3aWR0aDogMTAsXG5cdFx0XHRcdGhlaWdodDogMC4xLFxuXHRcdFx0XHRkZXB0aDogMSxcblx0XHRcdH0sIHNjZW5lKTtcblx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoLTcsIDMwMSwgLTI0LjUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLm1hdGVyaWFsID0gbmV3IEJBQllMT04uU3RhbmRhcmRNYXRlcmlhbChcInBsYXllclJlcGVyZU1hdFwiLCBzY2VuZSk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUubWF0ZXJpYWwuZW1pc3NpdmVDb2xvciA9IG5ldyBCQUJZTE9OLkNvbG9yMy5SZWQoKTtcblx0XHRcdHBsYXllclJlcGVyZS5tZXRhZGF0YSA9IHsgaXNQbGF5ZXJSZXBlcmU6IHRydWUgfTsgIC8vIFRhZyBham91dMOpIHBvdXIgbGUgcmVww6hyZSBkdSBqb3VldXIgMlxuXHRcdFxuXHRcdFx0Ly8gU3luY2hyb25pc2F0aW9uIGNvbnRpbnVlIGRlIGxhIHBvc2l0aW9uXG5cdFx0XHRzY2VuZS5yZWdpc3RlckJlZm9yZVJlbmRlcigoKSA9PiB7XG5cdFx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uLnggPSBwbGF5ZXJfMi5wb3NpdGlvbi54O1xuXHRcdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbi55ID0gcGxheWVyXzIucG9zaXRpb24ueTtcblx0XHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24ueiA9IHBsYXllcl8yLnBvc2l0aW9uLno7XG5cdFx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbi54ID0gcGxheWVyXzIucG9zaXRpb24ueDtcblx0XHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uLnkgPSBwbGF5ZXJfMi5wb3NpdGlvbi55O1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoY3VycmVudFNraW5QbGF5ZXIxID09PSAxKVxuXHR7XG5cdFx0QkFCWUxPTi5TY2VuZUxvYWRlci5JbXBvcnRNZXNoKFwiXCIsIFwiL3NyY3MvZ2FtZS9hc3NldHMvcGxheWVyX3NraW4vXCIsIFwiaWRsZV9ibGV1LmdsYlwiLCBzY2VuZSwgZnVuY3Rpb24gKG5ld01lc2hlcykge1xuXHRcdFx0Y29uc3QgcGxheWVyTW9kZWwgPSBuZXdNZXNoZXNbMF07XG5cdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbiA9IHBsYXllcl8xLnBvc2l0aW9uLmNsb25lKCk7XG5cdFx0XHRwbGF5ZXJNb2RlbC5zY2FsaW5nID0gbmV3IEJBQllMT04uVmVjdG9yMyg2LCA2LCA2KTtcblx0XHRcdHBsYXllck1vZGVsLnJvdGF0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygwLCBNYXRoLlBJLCAwKTtcblx0XHRcdHBsYXllck1vZGVsLm1ldGFkYXRhID0geyBpc1BsYXllcjogdHJ1ZSB9OyAgLy8gVGFnIGFqb3V0w6kgcG91ciBsZSBqb3VldXIgMlxuXG5cdFx0XHRuZXdNZXNoZXMuZm9yRWFjaChtZXNoID0+IHtcblx0XHRcdFx0aWYgKG1lc2ggaW5zdGFuY2VvZiBCQUJZTE9OLk1lc2gpIHtcblx0XHRcdFx0XHRtZXNoLnJvdGF0aW9uUXVhdGVybmlvbiA9IG51bGw7XG5cdFx0XHRcdFx0bWVzaC5yb3RhdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoTWF0aC5QSSwgMCwgMCk7XG5cdFx0XHRcdFx0bWVzaC5tZXRhZGF0YSA9IHsgaXNQbGF5ZXI6IHRydWUgfTsgIC8vIFRhZyBham91dMOpIHBvdXIgaWRlbnRpZmllciBjZSBtZXNoIGNvbW1lIGpvdWV1clxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcblx0XHRcdGNvbnN0IHBsYXllclJlcGVyZSA9IG5ldyBCQUJZTE9OLk1lc2hCdWlsZGVyLkNyZWF0ZUJveChcInBsYXllclJlcGVyZVwiLCB7XG5cdFx0XHRcdHdpZHRoOiAxMCxcblx0XHRcdFx0aGVpZ2h0OiAwLjEsXG5cdFx0XHRcdGRlcHRoOiAxLFxuXHRcdFx0fSwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygtNywgMzAxLCAtMTIwKTtcblx0XHRcdHBsYXllclJlcGVyZS5tYXRlcmlhbCA9IG5ldyBCQUJZTE9OLlN0YW5kYXJkTWF0ZXJpYWwoXCJwbGF5ZXJSZXBlcmVNYXRcIiwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLm1hdGVyaWFsLmVtaXNzaXZlQ29sb3IgPSBuZXcgQkFCWUxPTi5Db2xvcjMuUmVkKCk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUubWV0YWRhdGEgPSB7IGlzUGxheWVyUmVwZXJlOiB0cnVlIH07ICAvLyBUYWcgYWpvdXTDqSBwb3VyIGxlIHJlcMOocmUgZHUgam91ZXVyIDJcblx0XHRcblx0XHRcdC8vIFN5bmNocm9uaXNhdGlvbiBjb250aW51ZSBkZSBsYSBwb3NpdGlvblxuXHRcdFx0c2NlbmUucmVnaXN0ZXJCZWZvcmVSZW5kZXIoKCkgPT4ge1xuXHRcdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbi54ID0gcGxheWVyXzEucG9zaXRpb24ueDtcblx0XHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24ueSA9IHBsYXllcl8xLnBvc2l0aW9uLnk7XG5cdFx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uLnogPSBwbGF5ZXJfMS5wb3NpdGlvbi56O1xuXHRcdFx0XHRwbGF5ZXJSZXBlcmUucG9zaXRpb24ueCA9IHBsYXllcl8xLnBvc2l0aW9uLng7XG5cdFx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbi55ID0gcGxheWVyXzEucG9zaXRpb24ueTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKGN1cnJlbnRTa2luUGxheWVyMiA9PT0gMSlcblx0e1xuXHRcdEJBQllMT04uU2NlbmVMb2FkZXIuSW1wb3J0TWVzaChcIlwiLCBcIi9zcmNzL2dhbWUvYXNzZXRzL3BsYXllcl9za2luL1wiLCBcImlkbGVfYmxldS5nbGJcIiwgc2NlbmUsIGZ1bmN0aW9uIChuZXdNZXNoZXMpIHtcblx0XHRcdGNvbnN0IHBsYXllck1vZGVsID0gbmV3TWVzaGVzWzBdO1xuXHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24gPSBwbGF5ZXJfMi5wb3NpdGlvbi5jbG9uZSgpO1xuXHRcdFx0cGxheWVyTW9kZWwuc2NhbGluZyA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoNiwgNiwgNik7XG5cdFx0XHRwbGF5ZXJNb2RlbC5yb3RhdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgTWF0aC5QSSwgMCk7XG5cdFx0XHRwbGF5ZXJNb2RlbC5tZXRhZGF0YSA9IHsgaXNQbGF5ZXI6IHRydWUgfTsgIC8vIFRhZyBham91dMOpIHBvdXIgbGUgam91ZXVyIDJcblx0XHRcblx0XHRcdGNvbnN0IHBsYXllclJlcGVyZSA9IG5ldyBCQUJZTE9OLk1lc2hCdWlsZGVyLkNyZWF0ZUJveChcInBsYXllclJlcGVyZVwiLCB7XG5cdFx0XHRcdHdpZHRoOiAxMCxcblx0XHRcdFx0aGVpZ2h0OiAwLjEsXG5cdFx0XHRcdGRlcHRoOiAxLFxuXHRcdFx0fSwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygtNywgMzAxLCAtMjQuNSk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUubWF0ZXJpYWwgPSBuZXcgQkFCWUxPTi5TdGFuZGFyZE1hdGVyaWFsKFwicGxheWVyUmVwZXJlTWF0XCIsIHNjZW5lKTtcblx0XHRcdHBsYXllclJlcGVyZS5tYXRlcmlhbC5lbWlzc2l2ZUNvbG9yID0gbmV3IEJBQllMT04uQ29sb3IzLlJlZCgpO1xuXHRcdFx0cGxheWVyUmVwZXJlLm1ldGFkYXRhID0geyBpc1BsYXllclJlcGVyZTogdHJ1ZSB9OyAgLy8gVGFnIGFqb3V0w6kgcG91ciBsZSByZXDDqHJlIGR1IGpvdWV1ciAyXG5cdFx0XG5cdFx0XHQvLyBTeW5jaHJvbmlzYXRpb24gY29udGludWUgZGUgbGEgcG9zaXRpb25cblx0XHRcdHNjZW5lLnJlZ2lzdGVyQmVmb3JlUmVuZGVyKCgpID0+IHtcblx0XHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24ueCA9IHBsYXllcl8yLnBvc2l0aW9uLng7XG5cdFx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uLnkgPSBwbGF5ZXJfMi5wb3NpdGlvbi55O1xuXHRcdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbi56ID0gcGxheWVyXzIucG9zaXRpb24uejtcblx0XHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uLnggPSBwbGF5ZXJfMi5wb3NpdGlvbi54O1xuXHRcdFx0XHRwbGF5ZXJSZXBlcmUucG9zaXRpb24ueSA9IHBsYXllcl8yLnBvc2l0aW9uLnk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdGlmIChjdXJyZW50U2tpblBsYXllcjEgPT09IDIpXG5cdHtcblx0XHRCQUJZTE9OLlNjZW5lTG9hZGVyLkltcG9ydE1lc2goXCJcIiwgXCIvc3Jjcy9nYW1lL2Fzc2V0cy9wbGF5ZXJfc2tpbi9cIiwgXCJpZGxlX3JvdWdlLmdsYlwiLCBzY2VuZSwgZnVuY3Rpb24gKG5ld01lc2hlcykge1xuXHRcdFx0Y29uc3QgcGxheWVyTW9kZWwgPSBuZXdNZXNoZXNbMF07XG5cdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbiA9IHBsYXllcl8xLnBvc2l0aW9uLmNsb25lKCk7XG5cdFx0XHRwbGF5ZXJNb2RlbC5zY2FsaW5nID0gbmV3IEJBQllMT04uVmVjdG9yMyg2LCA2LCA2KTtcblx0XHRcdHBsYXllck1vZGVsLnJvdGF0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygwLCBNYXRoLlBJLCAwKTtcblx0XHRcdHBsYXllck1vZGVsLm1ldGFkYXRhID0geyBpc1BsYXllcjogdHJ1ZSB9OyAgLy8gVGFnIGFqb3V0w6kgcG91ciBsZSBqb3VldXIgMlxuXG5cdFx0XHRuZXdNZXNoZXMuZm9yRWFjaChtZXNoID0+IHtcblx0XHRcdFx0aWYgKG1lc2ggaW5zdGFuY2VvZiBCQUJZTE9OLk1lc2gpIHtcblx0XHRcdFx0XHRtZXNoLnJvdGF0aW9uUXVhdGVybmlvbiA9IG51bGw7XG5cdFx0XHRcdFx0bWVzaC5yb3RhdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoTWF0aC5QSSwgMCwgMCk7XG5cdFx0XHRcdFx0bWVzaC5tZXRhZGF0YSA9IHsgaXNQbGF5ZXI6IHRydWUgfTsgIC8vIFRhZyBham91dMOpIHBvdXIgaWRlbnRpZmllciBjZSBtZXNoIGNvbW1lIGpvdWV1clxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcblx0XHRcdGNvbnN0IHBsYXllclJlcGVyZSA9IG5ldyBCQUJZTE9OLk1lc2hCdWlsZGVyLkNyZWF0ZUJveChcInBsYXllclJlcGVyZVwiLCB7XG5cdFx0XHRcdHdpZHRoOiAxMCxcblx0XHRcdFx0aGVpZ2h0OiAwLjEsXG5cdFx0XHRcdGRlcHRoOiAxLFxuXHRcdFx0fSwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygtNywgMzAxLCAtMTIwKTtcblx0XHRcdHBsYXllclJlcGVyZS5tYXRlcmlhbCA9IG5ldyBCQUJZTE9OLlN0YW5kYXJkTWF0ZXJpYWwoXCJwbGF5ZXJSZXBlcmVNYXRcIiwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLm1hdGVyaWFsLmVtaXNzaXZlQ29sb3IgPSBuZXcgQkFCWUxPTi5Db2xvcjMuUmVkKCk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUubWV0YWRhdGEgPSB7IGlzUGxheWVyUmVwZXJlOiB0cnVlIH07ICAvLyBUYWcgYWpvdXTDqSBwb3VyIGxlIHJlcMOocmUgZHUgam91ZXVyIDJcblx0XHRcblx0XHRcdC8vIFN5bmNocm9uaXNhdGlvbiBjb250aW51ZSBkZSBsYSBwb3NpdGlvblxuXHRcdFx0c2NlbmUucmVnaXN0ZXJCZWZvcmVSZW5kZXIoKCkgPT4ge1xuXHRcdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbi54ID0gcGxheWVyXzEucG9zaXRpb24ueDtcblx0XHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24ueSA9IHBsYXllcl8xLnBvc2l0aW9uLnk7XG5cdFx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uLnogPSBwbGF5ZXJfMS5wb3NpdGlvbi56O1xuXHRcdFx0XHRwbGF5ZXJSZXBlcmUucG9zaXRpb24ueCA9IHBsYXllcl8xLnBvc2l0aW9uLng7XG5cdFx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbi55ID0gcGxheWVyXzEucG9zaXRpb24ueTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKGN1cnJlbnRTa2luUGxheWVyMiA9PT0gMilcblx0e1xuXHRcdEJBQllMT04uU2NlbmVMb2FkZXIuSW1wb3J0TWVzaChcIlwiLCBcIi9zcmNzL2dhbWUvYXNzZXRzL3BsYXllcl9za2luL1wiLCBcImlkbGVfcm91Z2UuZ2xiXCIsIHNjZW5lLCBmdW5jdGlvbiAobmV3TWVzaGVzKSB7XG5cdFx0XHRjb25zdCBwbGF5ZXJNb2RlbCA9IG5ld01lc2hlc1swXTtcblx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uID0gcGxheWVyXzIucG9zaXRpb24uY2xvbmUoKTtcblx0XHRcdHBsYXllck1vZGVsLnNjYWxpbmcgPSBuZXcgQkFCWUxPTi5WZWN0b3IzKDYsIDYsIDYpO1xuXHRcdFx0cGxheWVyTW9kZWwucm90YXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKDAsIE1hdGguUEksIDApO1xuXHRcdFx0cGxheWVyTW9kZWwubWV0YWRhdGEgPSB7IGlzUGxheWVyOiB0cnVlIH07ICAvLyBUYWcgYWpvdXTDqSBwb3VyIGxlIGpvdWV1ciAyXG5cdFx0XG5cdFx0XHRjb25zdCBwbGF5ZXJSZXBlcmUgPSBuZXcgQkFCWUxPTi5NZXNoQnVpbGRlci5DcmVhdGVCb3goXCJwbGF5ZXJSZXBlcmVcIiwge1xuXHRcdFx0XHR3aWR0aDogMTAsXG5cdFx0XHRcdGhlaWdodDogMC4xLFxuXHRcdFx0XHRkZXB0aDogMSxcblx0XHRcdH0sIHNjZW5lKTtcblx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoLTcsIDMwMSwgLTI0LjUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLm1hdGVyaWFsID0gbmV3IEJBQllMT04uU3RhbmRhcmRNYXRlcmlhbChcInBsYXllclJlcGVyZU1hdFwiLCBzY2VuZSk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUubWF0ZXJpYWwuZW1pc3NpdmVDb2xvciA9IG5ldyBCQUJZTE9OLkNvbG9yMy5SZWQoKTtcblx0XHRcdHBsYXllclJlcGVyZS5tZXRhZGF0YSA9IHsgaXNQbGF5ZXJSZXBlcmU6IHRydWUgfTsgIC8vIFRhZyBham91dMOpIHBvdXIgbGUgcmVww6hyZSBkdSBqb3VldXIgMlxuXHRcdFxuXHRcdFx0Ly8gU3luY2hyb25pc2F0aW9uIGNvbnRpbnVlIGRlIGxhIHBvc2l0aW9uXG5cdFx0XHRzY2VuZS5yZWdpc3RlckJlZm9yZVJlbmRlcigoKSA9PiB7XG5cdFx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uLnggPSBwbGF5ZXJfMi5wb3NpdGlvbi54O1xuXHRcdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbi55ID0gcGxheWVyXzIucG9zaXRpb24ueTtcblx0XHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24ueiA9IHBsYXllcl8yLnBvc2l0aW9uLno7XG5cdFx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbi54ID0gcGxheWVyXzIucG9zaXRpb24ueDtcblx0XHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uLnkgPSBwbGF5ZXJfMi5wb3NpdGlvbi55O1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoY3VycmVudFNraW5QbGF5ZXIxID09PSAzKVxuXHR7XG5cdFx0QkFCWUxPTi5TY2VuZUxvYWRlci5JbXBvcnRNZXNoKFwiXCIsIFwiL3NyY3MvZ2FtZS9hc3NldHMvcGxheWVyX3NraW4vXCIsIFwiaWRsZV92ZXJ0LmdsYlwiLCBzY2VuZSwgZnVuY3Rpb24gKG5ld01lc2hlcykge1xuXHRcdFx0Y29uc3QgcGxheWVyTW9kZWwgPSBuZXdNZXNoZXNbMF07XG5cdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbiA9IHBsYXllcl8xLnBvc2l0aW9uLmNsb25lKCk7XG5cdFx0XHRwbGF5ZXJNb2RlbC5zY2FsaW5nID0gbmV3IEJBQllMT04uVmVjdG9yMyg2LCA2LCA2KTtcblx0XHRcdHBsYXllck1vZGVsLnJvdGF0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygwLCBNYXRoLlBJLCAwKTtcblx0XHRcdHBsYXllck1vZGVsLm1ldGFkYXRhID0geyBpc1BsYXllcjogdHJ1ZSB9OyAgLy8gVGFnIGFqb3V0w6kgcG91ciBsZSBqb3VldXIgMlxuXG5cdFx0XHRuZXdNZXNoZXMuZm9yRWFjaChtZXNoID0+IHtcblx0XHRcdFx0aWYgKG1lc2ggaW5zdGFuY2VvZiBCQUJZTE9OLk1lc2gpIHtcblx0XHRcdFx0XHRtZXNoLnJvdGF0aW9uUXVhdGVybmlvbiA9IG51bGw7XG5cdFx0XHRcdFx0bWVzaC5yb3RhdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoTWF0aC5QSSwgMCwgMCk7XG5cdFx0XHRcdFx0bWVzaC5tZXRhZGF0YSA9IHsgaXNQbGF5ZXI6IHRydWUgfTsgIC8vIFRhZyBham91dMOpIHBvdXIgaWRlbnRpZmllciBjZSBtZXNoIGNvbW1lIGpvdWV1clxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcblx0XHRcdGNvbnN0IHBsYXllclJlcGVyZSA9IG5ldyBCQUJZTE9OLk1lc2hCdWlsZGVyLkNyZWF0ZUJveChcInBsYXllclJlcGVyZVwiLCB7XG5cdFx0XHRcdHdpZHRoOiAxMCxcblx0XHRcdFx0aGVpZ2h0OiAwLjEsXG5cdFx0XHRcdGRlcHRoOiAxLFxuXHRcdFx0fSwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygtNywgMzAxLCAtMTIwKTtcblx0XHRcdHBsYXllclJlcGVyZS5tYXRlcmlhbCA9IG5ldyBCQUJZTE9OLlN0YW5kYXJkTWF0ZXJpYWwoXCJwbGF5ZXJSZXBlcmVNYXRcIiwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLm1hdGVyaWFsLmVtaXNzaXZlQ29sb3IgPSBuZXcgQkFCWUxPTi5Db2xvcjMuUmVkKCk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUubWV0YWRhdGEgPSB7IGlzUGxheWVyUmVwZXJlOiB0cnVlIH07ICAvLyBUYWcgYWpvdXTDqSBwb3VyIGxlIHJlcMOocmUgZHUgam91ZXVyIDJcblx0XHRcblx0XHRcdC8vIFN5bmNocm9uaXNhdGlvbiBjb250aW51ZSBkZSBsYSBwb3NpdGlvblxuXHRcdFx0c2NlbmUucmVnaXN0ZXJCZWZvcmVSZW5kZXIoKCkgPT4ge1xuXHRcdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbi54ID0gcGxheWVyXzEucG9zaXRpb24ueDtcblx0XHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24ueSA9IHBsYXllcl8xLnBvc2l0aW9uLnk7XG5cdFx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uLnogPSBwbGF5ZXJfMS5wb3NpdGlvbi56O1xuXHRcdFx0XHRwbGF5ZXJSZXBlcmUucG9zaXRpb24ueCA9IHBsYXllcl8xLnBvc2l0aW9uLng7XG5cdFx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbi55ID0gcGxheWVyXzEucG9zaXRpb24ueTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKGN1cnJlbnRTa2luUGxheWVyMiA9PT0gMylcblx0e1xuXHRcdEJBQllMT04uU2NlbmVMb2FkZXIuSW1wb3J0TWVzaChcIlwiLCBcIi9zcmNzL2dhbWUvYXNzZXRzL3BsYXllcl9za2luL1wiLCBcImlkbGVfdmVydC5nbGJcIiwgc2NlbmUsIGZ1bmN0aW9uIChuZXdNZXNoZXMpIHtcblx0XHRcdGNvbnN0IHBsYXllck1vZGVsID0gbmV3TWVzaGVzWzBdO1xuXHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24gPSBwbGF5ZXJfMi5wb3NpdGlvbi5jbG9uZSgpO1xuXHRcdFx0cGxheWVyTW9kZWwuc2NhbGluZyA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoNiwgNiwgNik7XG5cdFx0XHRwbGF5ZXJNb2RlbC5yb3RhdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgTWF0aC5QSSwgMCk7XG5cdFx0XHRwbGF5ZXJNb2RlbC5tZXRhZGF0YSA9IHsgaXNQbGF5ZXI6IHRydWUgfTsgIC8vIFRhZyBham91dMOpIHBvdXIgbGUgam91ZXVyIDJcblx0XHRcblx0XHRcdGNvbnN0IHBsYXllclJlcGVyZSA9IG5ldyBCQUJZTE9OLk1lc2hCdWlsZGVyLkNyZWF0ZUJveChcInBsYXllclJlcGVyZVwiLCB7XG5cdFx0XHRcdHdpZHRoOiAxMCxcblx0XHRcdFx0aGVpZ2h0OiAwLjEsXG5cdFx0XHRcdGRlcHRoOiAxLFxuXHRcdFx0fSwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygtNywgMzAxLCAtMjQuNSk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUubWF0ZXJpYWwgPSBuZXcgQkFCWUxPTi5TdGFuZGFyZE1hdGVyaWFsKFwicGxheWVyUmVwZXJlTWF0XCIsIHNjZW5lKTtcblx0XHRcdHBsYXllclJlcGVyZS5tYXRlcmlhbC5lbWlzc2l2ZUNvbG9yID0gbmV3IEJBQllMT04uQ29sb3IzLlJlZCgpO1xuXHRcdFx0cGxheWVyUmVwZXJlLm1ldGFkYXRhID0geyBpc1BsYXllclJlcGVyZTogdHJ1ZSB9OyAgLy8gVGFnIGFqb3V0w6kgcG91ciBsZSByZXDDqHJlIGR1IGpvdWV1ciAyXG5cdFx0XG5cdFx0XHQvLyBTeW5jaHJvbmlzYXRpb24gY29udGludWUgZGUgbGEgcG9zaXRpb25cblx0XHRcdHNjZW5lLnJlZ2lzdGVyQmVmb3JlUmVuZGVyKCgpID0+IHtcblx0XHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24ueCA9IHBsYXllcl8yLnBvc2l0aW9uLng7XG5cdFx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uLnkgPSBwbGF5ZXJfMi5wb3NpdGlvbi55O1xuXHRcdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbi56ID0gcGxheWVyXzIucG9zaXRpb24uejtcblx0XHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uLnggPSBwbGF5ZXJfMi5wb3NpdGlvbi54O1xuXHRcdFx0XHRwbGF5ZXJSZXBlcmUucG9zaXRpb24ueSA9IHBsYXllcl8yLnBvc2l0aW9uLnk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXHRcblx0Y29uc29sZS5sb2coXCJwbGF5ZXIgMSBcIiArIHBsYXllcl8xLnBvc2l0aW9uKTtcblx0Y29uc29sZS5sb2coXCJwbGF5ZXIgMiBcIiArIHBsYXllcl8yLnBvc2l0aW9uKTtcblxuXHRyZXR1cm4geyBwbGF5ZXJfMSwgcGxheWVyXzIgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBsYXllclJlZigpIHtcblx0Y29uc29sZS5sb2coXCJwbGF5ZXIgMSBiaXMgXCIgKyBwbGF5ZXJfMS5wb3NpdGlvbik7XG5cdGNvbnNvbGUubG9nKFwicGxheWVyIDIgYmlzIFwiICsgcGxheWVyXzIucG9zaXRpb24pO1xuXHRyZXR1cm4geyBwbGF5ZXJfMSwgcGxheWVyXzIgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0X3BsYXllcl9wb3NpdGlvbihwbGF5ZXJfMSwgcGxheWVyXzIpIHtcblx0cGxheWVyXzEucG9zaXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKC03LCAzMDEsIC0xMjApO1xuXHRwbGF5ZXJfMi5wb3NpdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoLTcsIDMwMSwgLTI0KTtcbn1cblxuXG5cbmNvbnN0IHBhZGRsZVNwZWVkID0gMS4xO1xuY29uc3Qga2V5cyA9IHt9OyBcblxuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2ZW50KSA9PiBrZXlzW2V2ZW50LmtleV0gPSB0cnVlKTtcbmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZXZlbnQpID0+IGtleXNbZXZlbnQua2V5XSA9IGZhbHNlKTtcblxubGV0IHBsYXllcl8xX2JvbnVzID0gbnVsbDtcbmxldCBwbGF5ZXJfMl9ib251cyA9IG51bGw7XG5cblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBVcGRhdGVQbGF5ZXJQb3NlKHBsYXllcl8xLCBwbGF5ZXJfMikge1xuXG5cdGlmIChpc19JbnZlcnNlX3RlYW0xID09IGZhbHNlKVxuXHR7XG5cdFx0aWYgKGtleXNbXCJ3XCJdICYmIHBsYXllcl8xLnBvc2l0aW9uLnggPiBtaW5YKSB7XG5cdFx0XHRwbGF5ZXJfMS5wb3NpdGlvbi54IC09IHBhZGRsZVNwZWVkO1xuXHRcdH1cblx0XHRpZiAoa2V5c1tcInNcIl0gJiYgcGxheWVyXzEucG9zaXRpb24ueCA8IG1heFgpIHtcblx0XHRcdHBsYXllcl8xLnBvc2l0aW9uLnggKz0gcGFkZGxlU3BlZWQ7XG5cdFx0fVxuXHR9XG5cblx0aWYgKGlzX0ludmVyc2VfdGVhbTEgPT0gdHJ1ZSlcblx0e1xuXHRcdGlmIChrZXlzW1wid1wiXSAmJiBwbGF5ZXJfMS5wb3NpdGlvbi54IDwgbWF4WCkge1xuXHRcdFx0cGxheWVyXzEucG9zaXRpb24ueCArPSBwYWRkbGVTcGVlZDtcblx0XHR9XG5cdFx0aWYgKGtleXNbXCJzXCJdICYmIHBsYXllcl8xLnBvc2l0aW9uLnggPiBtaW5YKSB7XG5cdFx0XHRwbGF5ZXJfMS5wb3NpdGlvbi54IC09IHBhZGRsZVNwZWVkO1xuXHRcdH1cblx0fVxuXG5cdGlmIChpc19JbnZlcnNlX3RlYW0yID09IGZhbHNlKVxuXHR7XG5cdFx0aWYgKGtleXNbXCJpXCJdICYmIHBsYXllcl8yLnBvc2l0aW9uLnggPiBtaW5YKSB7XG5cdFx0XHRwbGF5ZXJfMi5wb3NpdGlvbi54IC09IHBhZGRsZVNwZWVkO1xuXHRcdH1cblx0XHRpZiAoa2V5c1tcImtcIl0gJiYgcGxheWVyXzIucG9zaXRpb24ueCA8IG1heFgpIHtcblx0XHRcdHBsYXllcl8yLnBvc2l0aW9uLnggKz0gcGFkZGxlU3BlZWQ7XG5cdFx0fVxuXHR9XG5cblx0aWYgKGlzX0ludmVyc2VfdGVhbTIgPT0gdHJ1ZSlcblx0e1xuXHRcdGlmIChrZXlzW1wiaVwiXSAmJiBwbGF5ZXJfMi5wb3NpdGlvbi54IDwgbWF4WCkge1xuXHRcdFx0cGxheWVyXzIucG9zaXRpb24ueCArPSBwYWRkbGVTcGVlZDtcblx0XHR9XG5cdFx0aWYgKGtleXNbXCJrXCJdICYmIHBsYXllcl8yLnBvc2l0aW9uLnggPiBtaW5YKSB7XG5cdFx0XHRwbGF5ZXJfMi5wb3NpdGlvbi54IC09IHBhZGRsZVNwZWVkO1xuXHRcdH1cblx0fVxuXG5cdGlmIChrZXlzW1wiY1wiXSAmJiBpc19JbnZlcnNlX3RlYW0xID09IGZhbHNlKVxuXHR7XG5cdFx0aW52ZXJzZV9wbGF5ZXIyKClcblx0fVxuXG5cblx0aWYgKGtleXNbXCIzXCJdICYmIGlzX0ludmVyc2VfdGVhbTIgPT0gZmFsc2UpXG5cdHtcblx0XHRpbnZlcnNlX3BsYXllcjEoKVxuXHR9XG5cblxuXHRpZiAoa2V5c1tcInpcIl0pXG5cdFx0Z3JlbmFkZV9mbGFzaF9wbGF5ZXIxKHNjZW5lKTtcblx0aWYgKGtleXNbXCIxXCJdKVxuXHRcdGdyZW5hZGVfZmxhc2hfcGxheWVyMihzY2VuZSk7XG5cblx0aWYgKGtleXNbXCJ4XCJdKVxuXHR7XG5cdFx0aWYgKCFwbGF5ZXJfMV9ib251cylcblx0XHR7XG5cdFx0XHRwbGF5ZXJfMV9ib251cyA9IGluaXRfVGVhbW1hdGVfcGxheWVyXzEoc2NlbmUpO1xuXHRcdFx0aWYgKHBsYXllcl8xX2JvbnVzKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zb2xlLmxvZyhwbGF5ZXJfMV9ib251cy5wb3NpdGlvbik7XG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdHBsYXllcl8xX2JvbnVzID0gbnVsbDtcblx0XHRcdFx0fSwgMTAwMDApO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRpZiAoa2V5c1tcIjJcIl0pXG5cdHtcblx0XHRpZiAoIXBsYXllcl8yX2JvbnVzKVxuXHRcdHtcblx0XHRcdHBsYXllcl8yX2JvbnVzID0gaW5pdF9UZWFtbWF0ZV9wbGF5ZXJfMihzY2VuZSk7XG5cdFx0XHRpZiAocGxheWVyXzJfYm9udXMpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHBsYXllcl8yX2JvbnVzLnBvc2l0aW9uKTtcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0cGxheWVyXzJfYm9udXMgPSBudWxsO1xuXHRcdFx0XHR9LCAxMDAwMCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKGtleXNbXCJlXCJdICYmIHBsYXllcl8xX2JvbnVzICYmIHBsYXllcl8xX2JvbnVzLnBvc2l0aW9uLnggPiBtaW5YKVxuXHR7IFxuXHRcdHBsYXllcl8xX2JvbnVzLnBvc2l0aW9uLnggLT0gcGFkZGxlU3BlZWQ7XG5cdH1cblxuXHRpZiAoa2V5c1tcImRcIl0gJiYgcGxheWVyXzFfYm9udXMgJiYgcGxheWVyXzFfYm9udXMucG9zaXRpb24ueCA8IG1heFgpXG5cdHtcblx0XHRwbGF5ZXJfMV9ib251cy5wb3NpdGlvbi54ICs9IHBhZGRsZVNwZWVkO1xuXHR9XG5cblx0aWYgKGtleXNbXCJvXCJdICYmIHBsYXllcl8yX2JvbnVzICYmIHBsYXllcl8yX2JvbnVzLnBvc2l0aW9uLnggPiBtaW5YKVxuXHR7XG5cdFx0cGxheWVyXzJfYm9udXMucG9zaXRpb24ueCAtPSBwYWRkbGVTcGVlZDtcblx0fVxuXG5cdGlmIChrZXlzW1wibFwiXSAmJiBwbGF5ZXJfMl9ib251cyAmJiBwbGF5ZXJfMl9ib251cy5wb3NpdGlvbi54IDwgbWF4WClcblx0e1xuXHRcdHBsYXllcl8yX2JvbnVzLnBvc2l0aW9uLnggKz0gcGFkZGxlU3BlZWQ7XG5cdH1cblxuXG5cdHJldHVybiB7XG5cdFx0cGxheWVyXzFfYm9udXM6IHBsYXllcl8xX2JvbnVzLFxuXHRcdHBsYXllcl8yX2JvbnVzOiBwbGF5ZXJfMl9ib251c1xuXHR9O1xuXG59XG4iXX0=