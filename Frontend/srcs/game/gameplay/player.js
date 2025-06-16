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
    player_1.metadata = { isPlayer_paddle_1v1: true };
    player_1.visibility = 0;
    player_2 = new BABYLON.MeshBuilder.CreateBox("player_2", {
        width: 10,
        height: 1.5,
        depth: 1.5
    }, scene);
    player_2.position = new BABYLON.Vector3(-7, 301, -24);
    player_2.checkPaddleCollision = true;
    player_2.metadata = { isPlayer_paddle_1v1: true };
    player_2.visibility = 0;
    if (currentSkinPlayer1 === 0) {
        BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/player/", "PlayerIdleAnnimation.glb", scene, function (newMeshes) {
            const rootMesh = newMeshes.find(mesh => mesh.name === "__root__");
            if (rootMesh) {
                rootMesh.position = player_1.position.clone();
                rootMesh.scaling = new BABYLON.Vector3(6, 6, 6);
                rootMesh.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(0, Math.PI, 0);
                rootMesh.metadata = { isPlayer_1v1: true };
            }
            newMeshes.forEach(mesh => {
                if (mesh instanceof BABYLON.Mesh) {
                    mesh.rotationQuaternion = null;
                    mesh.rotation = new BABYLON.Vector3(Math.PI, 0, 0);
                    mesh.metadata = { isPlayer_1v1: true };
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
            playerRepere.metadata = { isPlayerRepere_1v1: true }; // Tag ajouté pour le repère du joueur
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
            playerModel.metadata = { isPlayer_1v1: true }; // Tag ajouté pour le joueur 2
            const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
                width: 10,
                height: 0.1,
                depth: 1,
            }, scene);
            playerRepere.position = new BABYLON.Vector3(-7, 301, -24.5);
            playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
            playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
            playerRepere.metadata = { isPlayerRepere_1v1: true };
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
            playerModel.metadata = { isPlayer_1v1: true }; // Tag ajouté pour le joueur 2
            newMeshes.forEach(mesh => {
                if (mesh instanceof BABYLON.Mesh) {
                    mesh.rotationQuaternion = null;
                    mesh.rotation = new BABYLON.Vector3(Math.PI, 0, 0);
                    mesh.metadata = { isPlayer_1v1: true };
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
            playerRepere.metadata = { isPlayerRepere_1v1: true };
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
            playerModel.metadata = { isPlayer_1v1: true }; // Tag ajouté pour le joueur 2
            const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
                width: 10,
                height: 0.1,
                depth: 1,
            }, scene);
            playerRepere.position = new BABYLON.Vector3(-7, 301, -24.5);
            playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
            playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
            playerRepere.metadata = { isPlayerRepere_1v1: true };
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
            playerModel.metadata = { isPlayer_1v1: true }; // Tag ajouté pour le joueur 2
            newMeshes.forEach(mesh => {
                if (mesh instanceof BABYLON.Mesh) {
                    mesh.rotationQuaternion = null;
                    mesh.rotation = new BABYLON.Vector3(Math.PI, 0, 0);
                    mesh.metadata = { isPlayer_1v1: true };
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
            playerRepere.metadata = { isPlayerRepere_1v1: true };
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
            playerModel.metadata = { isPlayer_1v1: true }; // Tag ajouté pour le joueur 2
            const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
                width: 10,
                height: 0.1,
                depth: 1,
            }, scene);
            playerRepere.position = new BABYLON.Vector3(-7, 301, -24.5);
            playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
            playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
            playerRepere.metadata = { isPlayerRepere_1v1: true };
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
            playerModel.metadata = { isPlayer_1v1: true }; // Tag ajouté pour le joueur 2
            newMeshes.forEach(mesh => {
                if (mesh instanceof BABYLON.Mesh) {
                    mesh.rotationQuaternion = null;
                    mesh.rotation = new BABYLON.Vector3(Math.PI, 0, 0);
                    mesh.metadata = { isPlayer_1v1: true };
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
            playerRepere.metadata = { isPlayerRepere_1v1: true };
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
            playerModel.metadata = { isPlayer_1v1: true }; // Tag ajouté pour le joueur 2
            const playerRepere = new BABYLON.MeshBuilder.CreateBox("playerRepere", {
                width: 10,
                height: 0.1,
                depth: 1,
            }, scene);
            playerRepere.position = new BABYLON.Vector3(-7, 301, -24.5);
            playerRepere.material = new BABYLON.StandardMaterial("playerRepereMat", scene);
            playerRepere.material.emissiveColor = new BABYLON.Color3.Red();
            playerRepere.metadata = { isPlayerRepere_1v1: true };
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
        if (keys["ArrowUp"] && player_2.position.x > minX) {
            player_2.position.x -= paddleSpeed;
        }
        if (keys["ArrowDown"] && player_2.position.x < maxX) {
            player_2.position.x += paddleSpeed;
        }
    }
    if (is_Inverse_team2 == true) {
        if (keys["ArrowUp"] && player_2.position.x < maxX) {
            player_2.position.x += paddleSpeed;
        }
        if (keys["ArrowDown"] && player_2.position.x > minX) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHVibGljL3NyY3MvZ2FtZS9nYW1lcGxheS9wbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHFCQUFxQixFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDOUcsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDcEYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDcEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNqSSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUd4RixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFDYixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFFYixNQUFNLFNBQVMsR0FBRztJQUNqQixFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLGdDQUFnQyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRTtJQUMzRixFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLGdDQUFnQyxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRTtJQUM1RixFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLGdDQUFnQyxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRTtJQUM3RixFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLGdDQUFnQyxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRTtDQUMxRixDQUFDO0FBRUYsU0FBUyxXQUFXO0lBQ25CLE1BQU0sU0FBUyxHQUFHLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO1FBQzdELEtBQUssRUFB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LENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNyQyxVQUFVLENBQUMsR0FBRyxFQUFFO29CQUNmLGNBQWMsR0FBRyxJQUFJLENBQUM7Z0JBQ3ZCLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNYLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztJQUVELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQWMsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQ25FLENBQUM7UUFDQSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxXQUFXLENBQUM7SUFDMUMsQ0FBQztJQUVELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQWMsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQ25FLENBQUM7UUFDQSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxXQUFXLENBQUM7SUFDMUMsQ0FBQztJQUVELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQWMsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQ25FLENBQUM7UUFDQSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxXQUFXLENBQUM7SUFDMUMsQ0FBQztJQUVELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQWMsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQ25FLENBQUM7UUFDQSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxXQUFXLENBQUM7SUFDMUMsQ0FBQztJQUdELE9BQU87UUFDTixjQUFjLEVBQUUsY0FBYztRQUM5QixjQUFjLEVBQUUsY0FBYztLQUM5QixDQUFDO0FBRUgsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdyZW5hZGVfZmxhc2hfcGxheWVyMSwgZ3JlbmFkZV9mbGFzaF9wbGF5ZXIyIH0gZnJvbSBcIi4vc29sby8xdjFfcGxheWVyL2luaXRfcG93ZXJVUF9HcmVuYWRlRmxhc2guanNcIjtcbmltcG9ydCB7IGluaXRfVGVhbW1hdGVfcGxheWVyXzEgfSBmcm9tIFwiLi9zb2xvLzF2MV9wbGF5ZXIvaW5pdF9wb3dlclVQX3RlYW1tYXRlLmpzXCI7XG5pbXBvcnQgeyBpbml0X1RlYW1tYXRlX3BsYXllcl8yIH0gZnJvbSBcIi4vc29sby8xdjFfcGxheWVyL2luaXRfcG93ZXJVUF90ZWFtbWF0ZS5qc1wiO1xuaW1wb3J0IHsgaW52ZXJzZV9wbGF5ZXIxLCBpbnZlcnNlX3BsYXllcjIsIGlzX0ludmVyc2VfdGVhbTEsIGlzX0ludmVyc2VfdGVhbTIgfSBmcm9tIFwiLi9zb2xvLzF2MV9wbGF5ZXIvaW5pdF9wb3dlclVQX2ludmVyc2UuanNcIjtcbmltcG9ydCB7IGN1cnJlbnRTa2luUGxheWVyMSwgY3VycmVudFNraW5QbGF5ZXIyIH0gZnJvbSBcIi4vc29sby9za2luL2luaXRfc2tpbl9wZXJzby5qc1wiO1xuXG5cbmxldCBtaW5YID0gMDtcbmxldCBtYXhYID0gMDtcblxuY29uc3QgcGF0aF9za2luID0gW1xuXHR7IG5hbWU6IFwicGxheWVyX3NraW5fMVwiLCBwYXRoOiBcIi9zcmNzL2dhbWUvYXNzZXRzL3BsYXllcl9za2luL1wiLCBmaWxlOiBcInBsYXllcl9ibGFuYy5nbGJcIiB9LFxuXHR7IG5hbWU6IFwicGxheWVyX3NraW5fMlwiLCBwYXRoOiBcIi9zcmNzL2dhbWUvYXNzZXRzL3BsYXllcl9za2luL1wiLCBmaWxlOiBcInBsYXllcl9ibGV1djIuZ2xiXCIgfSxcblx0eyBuYW1lOiBcInBsYXllcl9za2luXzNcIiwgcGF0aDogXCIvc3Jjcy9nYW1lL2Fzc2V0cy9wbGF5ZXJfc2tpbi9cIiwgZmlsZTogXCJwbGF5ZXJfcm91Z2V2Mi5nbGJcIiB9LFxuXHR7IG5hbWU6IFwicGxheWVyX3NraW5fNFwiLCBwYXRoOiBcIi9zcmNzL2dhbWUvYXNzZXRzL3BsYXllcl9za2luL1wiLCBmaWxlOiBcInBsYXllcl92ZXJ0LmdsYlwiIH1cbl07XG5cbmZ1bmN0aW9uIGluaXRfYm9yZGVyKCkge1xuXHRjb25zdCBib3JkZXJUb3AgPSBuZXcgQkFCWUxPTi5NZXNoQnVpbGRlci5DcmVhdGVCb3goXCJib3JkZXJcIiwge1xuXHRcdHdpZHRoOiAxMTUsXG5cdFx0aGVpZ2h0OiAzLFxuXHRcdGRlcHRoOiAxXG5cdH0sIHNjZW5lKTtcblx0Ym9yZGVyVG9wLnBvc2l0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygyNSwgMzAwLCAtNzIpO1xuXHRib3JkZXJUb3Aucm90YXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKDAsIE1hdGguUEkgLyAyLCAwKTtcblx0Ym9yZGVyVG9wLnZpc2liaWxpdHkgPSAwO1xuXHRcblx0Y29uc3QgYm9yZGVyQm90dG9tID0gbmV3IEJBQllMT04uTWVzaEJ1aWxkZXIuQ3JlYXRlQm94KFwiYm9yZGVyXCIsIHtcblx0XHR3aWR0aDogMTE1LFxuXHRcdGhlaWdodDogMyxcblx0XHRkZXB0aDogMVxuXHR9LCBzY2VuZSk7XG5cdGJvcmRlckJvdHRvbS5wb3NpdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoLTQwLCAzMDAsIC03Mik7XG5cdGJvcmRlckJvdHRvbS5yb3RhdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgTWF0aC5QSSAvIDIsIDApO1xuXHRib3JkZXJCb3R0b20udmlzaWJpbGl0eSA9IDA7XG5cblx0bWluWCA9IGJvcmRlckJvdHRvbS5wb3NpdGlvbi54ICsgKGJvcmRlckJvdHRvbS5zY2FsaW5nLnggLyAyKSArIDQuNTtcblx0bWF4WCA9IGJvcmRlclRvcC5wb3NpdGlvbi54IC0gKGJvcmRlclRvcC5zY2FsaW5nLnggLyAyKSAtIDQuNTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRfcGxheWVycyhzY2VuZSwgcGxheWVyXzEsIHBsYXllcl8yKSB7XG5cblx0aW5pdF9ib3JkZXIoKTtcblxuXHRwbGF5ZXJfMSA9IG5ldyBCQUJZTE9OLk1lc2hCdWlsZGVyLkNyZWF0ZUJveChcInBsYXllcl8xXCIsIHtcblx0XHR3aWR0aDogMTAsXG5cdFx0aGVpZ2h0OiAxLjUsXG5cdFx0ZGVwdGg6IDEuNVxuXHR9LCBzY2VuZSk7XG5cdHBsYXllcl8xLnBvc2l0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygtNywgMzAxLCAtMTIwKTtcblx0cGxheWVyXzEuY2hlY2tQYWRkbGVDb2xsaXNpb24gPSB0cnVlO1xuXHRwbGF5ZXJfMS5tZXRhZGF0YSA9IHsgaXNQbGF5ZXJfcGFkZGxlXzF2MTogdHJ1ZSB9OyAgXG5cdHBsYXllcl8xLnZpc2liaWxpdHkgPSAwO1xuXHRcblx0cGxheWVyXzIgPSBuZXcgQkFCWUxPTi5NZXNoQnVpbGRlci5DcmVhdGVCb3goXCJwbGF5ZXJfMlwiLCB7XG5cdFx0d2lkdGg6IDEwLFxuXHRcdGhlaWdodDogMS41LFxuXHRcdGRlcHRoOiAxLjVcblx0fSwgc2NlbmUpO1xuXHRwbGF5ZXJfMi5wb3NpdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoLTcsIDMwMSwgLTI0KTtcblx0cGxheWVyXzIuY2hlY2tQYWRkbGVDb2xsaXNpb24gPSB0cnVlO1xuXHRwbGF5ZXJfMi5tZXRhZGF0YSA9IHsgaXNQbGF5ZXJfcGFkZGxlXzF2MTogdHJ1ZSB9OyAgXG5cdHBsYXllcl8yLnZpc2liaWxpdHkgPSAwO1xuXG5cdGlmIChjdXJyZW50U2tpblBsYXllcjEgPT09IDApXG5cdHtcblx0XHRCQUJZTE9OLlNjZW5lTG9hZGVyLkltcG9ydE1lc2goXCJcIiwgXCIvc3Jjcy9nYW1lL2Fzc2V0cy9wbGF5ZXIvXCIsIFwiUGxheWVySWRsZUFubmltYXRpb24uZ2xiXCIsIHNjZW5lLCBmdW5jdGlvbiAobmV3TWVzaGVzKSB7XG5cdFx0XHRjb25zdCByb290TWVzaCA9IG5ld01lc2hlcy5maW5kKG1lc2ggPT4gbWVzaC5uYW1lID09PSBcIl9fcm9vdF9fXCIpO1xuXHRcdFx0aWYgKHJvb3RNZXNoKSB7XG5cdFx0XHRcdHJvb3RNZXNoLnBvc2l0aW9uID0gcGxheWVyXzEucG9zaXRpb24uY2xvbmUoKTtcblx0XHRcdFx0cm9vdE1lc2guc2NhbGluZyA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoNiwgNiwgNik7XG5cdFx0XHRcdHJvb3RNZXNoLnJvdGF0aW9uUXVhdGVybmlvbiA9IEJBQllMT04uUXVhdGVybmlvbi5Gcm9tRXVsZXJBbmdsZXMoMCwgTWF0aC5QSSwgMCk7XG5cdFx0XHRcdHJvb3RNZXNoLm1ldGFkYXRhID0geyBpc1BsYXllcl8xdjE6IHRydWUgfTsgIFxuXHRcdFx0fVxuXHRcdFxuXHRcdFx0bmV3TWVzaGVzLmZvckVhY2gobWVzaCA9PiB7XG5cdFx0XHRcdGlmIChtZXNoIGluc3RhbmNlb2YgQkFCWUxPTi5NZXNoKSB7XG5cdFx0XHRcdFx0bWVzaC5yb3RhdGlvblF1YXRlcm5pb24gPSBudWxsO1xuXHRcdFx0XHRcdG1lc2gucm90YXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKE1hdGguUEksIDAsIDApO1xuXHRcdFx0XHRcdG1lc2gubWV0YWRhdGEgPSB7IGlzUGxheWVyXzF2MTogdHJ1ZSB9OyAgXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFxuXHRcdFx0Y29uc3QgcGxheWVyUmVwZXJlID0gbmV3IEJBQllMT04uTWVzaEJ1aWxkZXIuQ3JlYXRlQm94KFwicGxheWVyUmVwZXJlXCIsIHtcblx0XHRcdFx0d2lkdGg6IDEwLFxuXHRcdFx0XHRoZWlnaHQ6IDAuMSxcblx0XHRcdFx0ZGVwdGg6IDEsXG5cdFx0XHR9LCBzY2VuZSk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUucG9zaXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKC03LCAzMDEsIC0xMjApO1xuXHRcdFx0cGxheWVyUmVwZXJlLm1hdGVyaWFsID0gbmV3IEJBQllMT04uU3RhbmRhcmRNYXRlcmlhbChcInBsYXllclJlcGVyZU1hdFwiLCBzY2VuZSk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUubWF0ZXJpYWwuZW1pc3NpdmVDb2xvciA9IG5ldyBCQUJZTE9OLkNvbG9yMy5SZWQoKTtcblx0XHRcdHBsYXllclJlcGVyZS5tZXRhZGF0YSA9IHsgaXNQbGF5ZXJSZXBlcmVfMXYxOiB0cnVlIH07ICAvLyBUYWcgYWpvdXTDqSBwb3VyIGxlIHJlcMOocmUgZHUgam91ZXVyXG5cdFx0XG5cdFx0XHRzY2VuZS5yZWdpc3RlckJlZm9yZVJlbmRlcigoKSA9PiB7XG5cdFx0XHRcdHJvb3RNZXNoLnBvc2l0aW9uLnggPSBwbGF5ZXJfMS5wb3NpdGlvbi54O1xuXHRcdFx0XHRyb290TWVzaC5wb3NpdGlvbi55ID0gcGxheWVyXzEucG9zaXRpb24ueTtcblx0XHRcdFx0cm9vdE1lc2gucG9zaXRpb24ueiA9IHBsYXllcl8xLnBvc2l0aW9uLno7XG5cdFx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbi54ID0gcGxheWVyXzEucG9zaXRpb24ueDtcblx0XHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uLnkgPSBwbGF5ZXJfMS5wb3NpdGlvbi55O1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblx0XG5cdGlmIChjdXJyZW50U2tpblBsYXllcjIgPT09IDApXG5cdHtcblx0XHRCQUJZTE9OLlNjZW5lTG9hZGVyLkltcG9ydE1lc2goXCJcIiwgXCIvc3Jjcy9nYW1lL2Fzc2V0cy9wbGF5ZXIvXCIsIFwiUGxheWVySWRsZUFubmltYXRpb24uZ2xiXCIsIHNjZW5lLCBmdW5jdGlvbiAobmV3TWVzaGVzKSB7XG5cdFx0XHRjb25zdCBwbGF5ZXJNb2RlbCA9IG5ld01lc2hlc1swXTtcblx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uID0gcGxheWVyXzIucG9zaXRpb24uY2xvbmUoKTtcblx0XHRcdHBsYXllck1vZGVsLnNjYWxpbmcgPSBuZXcgQkFCWUxPTi5WZWN0b3IzKDYsIDYsIDYpO1xuXHRcdFx0cGxheWVyTW9kZWwucm90YXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKDAsIE1hdGguUEksIDApO1xuXHRcdFx0cGxheWVyTW9kZWwubWV0YWRhdGEgPSB7IGlzUGxheWVyXzF2MTogdHJ1ZSB9OyAgLy8gVGFnIGFqb3V0w6kgcG91ciBsZSBqb3VldXIgMlxuXHRcdFxuXHRcdFx0Y29uc3QgcGxheWVyUmVwZXJlID0gbmV3IEJBQllMT04uTWVzaEJ1aWxkZXIuQ3JlYXRlQm94KFwicGxheWVyUmVwZXJlXCIsIHtcblx0XHRcdFx0d2lkdGg6IDEwLFxuXHRcdFx0XHRoZWlnaHQ6IDAuMSxcblx0XHRcdFx0ZGVwdGg6IDEsXG5cdFx0XHR9LCBzY2VuZSk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUucG9zaXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKC03LCAzMDEsIC0yNC41KTtcblx0XHRcdHBsYXllclJlcGVyZS5tYXRlcmlhbCA9IG5ldyBCQUJZTE9OLlN0YW5kYXJkTWF0ZXJpYWwoXCJwbGF5ZXJSZXBlcmVNYXRcIiwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLm1hdGVyaWFsLmVtaXNzaXZlQ29sb3IgPSBuZXcgQkFCWUxPTi5Db2xvcjMuUmVkKCk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUubWV0YWRhdGEgPSB7IGlzUGxheWVyUmVwZXJlXzF2MTogdHJ1ZSB9OyBcblx0XHRcblxuXHRcdFx0c2NlbmUucmVnaXN0ZXJCZWZvcmVSZW5kZXIoKCkgPT4ge1xuXHRcdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbi54ID0gcGxheWVyXzIucG9zaXRpb24ueDtcblx0XHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24ueSA9IHBsYXllcl8yLnBvc2l0aW9uLnk7XG5cdFx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uLnogPSBwbGF5ZXJfMi5wb3NpdGlvbi56O1xuXHRcdFx0XHRwbGF5ZXJSZXBlcmUucG9zaXRpb24ueCA9IHBsYXllcl8yLnBvc2l0aW9uLng7XG5cdFx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbi55ID0gcGxheWVyXzIucG9zaXRpb24ueTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKGN1cnJlbnRTa2luUGxheWVyMSA9PT0gMSlcblx0e1xuXHRcdEJBQllMT04uU2NlbmVMb2FkZXIuSW1wb3J0TWVzaChcIlwiLCBcIi9zcmNzL2dhbWUvYXNzZXRzL3BsYXllcl9za2luL1wiLCBcImlkbGVfYmxldS5nbGJcIiwgc2NlbmUsIGZ1bmN0aW9uIChuZXdNZXNoZXMpIHtcblx0XHRcdGNvbnN0IHBsYXllck1vZGVsID0gbmV3TWVzaGVzWzBdO1xuXHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24gPSBwbGF5ZXJfMS5wb3NpdGlvbi5jbG9uZSgpO1xuXHRcdFx0cGxheWVyTW9kZWwuc2NhbGluZyA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoNiwgNiwgNik7XG5cdFx0XHRwbGF5ZXJNb2RlbC5yb3RhdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgTWF0aC5QSSwgMCk7XG5cdFx0XHRwbGF5ZXJNb2RlbC5tZXRhZGF0YSA9IHsgaXNQbGF5ZXJfMXYxOiB0cnVlIH07ICAvLyBUYWcgYWpvdXTDqSBwb3VyIGxlIGpvdWV1ciAyXG5cblx0XHRcdG5ld01lc2hlcy5mb3JFYWNoKG1lc2ggPT4ge1xuXHRcdFx0XHRpZiAobWVzaCBpbnN0YW5jZW9mIEJBQllMT04uTWVzaCkge1xuXHRcdFx0XHRcdG1lc2gucm90YXRpb25RdWF0ZXJuaW9uID0gbnVsbDtcblx0XHRcdFx0XHRtZXNoLnJvdGF0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMyhNYXRoLlBJLCAwLCAwKTtcblx0XHRcdFx0XHRtZXNoLm1ldGFkYXRhID0geyBpc1BsYXllcl8xdjE6IHRydWUgfTsgIFxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcblx0XHRcdGNvbnN0IHBsYXllclJlcGVyZSA9IG5ldyBCQUJZTE9OLk1lc2hCdWlsZGVyLkNyZWF0ZUJveChcInBsYXllclJlcGVyZVwiLCB7XG5cdFx0XHRcdHdpZHRoOiAxMCxcblx0XHRcdFx0aGVpZ2h0OiAwLjEsXG5cdFx0XHRcdGRlcHRoOiAxLFxuXHRcdFx0fSwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygtNywgMzAxLCAtMTIwKTtcblx0XHRcdHBsYXllclJlcGVyZS5tYXRlcmlhbCA9IG5ldyBCQUJZTE9OLlN0YW5kYXJkTWF0ZXJpYWwoXCJwbGF5ZXJSZXBlcmVNYXRcIiwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLm1hdGVyaWFsLmVtaXNzaXZlQ29sb3IgPSBuZXcgQkFCWUxPTi5Db2xvcjMuUmVkKCk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUubWV0YWRhdGEgPSB7IGlzUGxheWVyUmVwZXJlXzF2MTogdHJ1ZSB9OyBcblx0XHRcblxuXHRcdFx0c2NlbmUucmVnaXN0ZXJCZWZvcmVSZW5kZXIoKCkgPT4ge1xuXHRcdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbi54ID0gcGxheWVyXzEucG9zaXRpb24ueDtcblx0XHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24ueSA9IHBsYXllcl8xLnBvc2l0aW9uLnk7XG5cdFx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uLnogPSBwbGF5ZXJfMS5wb3NpdGlvbi56O1xuXHRcdFx0XHRwbGF5ZXJSZXBlcmUucG9zaXRpb24ueCA9IHBsYXllcl8xLnBvc2l0aW9uLng7XG5cdFx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbi55ID0gcGxheWVyXzEucG9zaXRpb24ueTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKGN1cnJlbnRTa2luUGxheWVyMiA9PT0gMSlcblx0e1xuXHRcdEJBQllMT04uU2NlbmVMb2FkZXIuSW1wb3J0TWVzaChcIlwiLCBcIi9zcmNzL2dhbWUvYXNzZXRzL3BsYXllcl9za2luL1wiLCBcImlkbGVfYmxldS5nbGJcIiwgc2NlbmUsIGZ1bmN0aW9uIChuZXdNZXNoZXMpIHtcblx0XHRcdGNvbnN0IHBsYXllck1vZGVsID0gbmV3TWVzaGVzWzBdO1xuXHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24gPSBwbGF5ZXJfMi5wb3NpdGlvbi5jbG9uZSgpO1xuXHRcdFx0cGxheWVyTW9kZWwuc2NhbGluZyA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoNiwgNiwgNik7XG5cdFx0XHRwbGF5ZXJNb2RlbC5yb3RhdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgTWF0aC5QSSwgMCk7XG5cdFx0XHRwbGF5ZXJNb2RlbC5tZXRhZGF0YSA9IHsgaXNQbGF5ZXJfMXYxOiB0cnVlIH07ICAvLyBUYWcgYWpvdXTDqSBwb3VyIGxlIGpvdWV1ciAyXG5cdFx0XG5cdFx0XHRjb25zdCBwbGF5ZXJSZXBlcmUgPSBuZXcgQkFCWUxPTi5NZXNoQnVpbGRlci5DcmVhdGVCb3goXCJwbGF5ZXJSZXBlcmVcIiwge1xuXHRcdFx0XHR3aWR0aDogMTAsXG5cdFx0XHRcdGhlaWdodDogMC4xLFxuXHRcdFx0XHRkZXB0aDogMSxcblx0XHRcdH0sIHNjZW5lKTtcblx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoLTcsIDMwMSwgLTI0LjUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLm1hdGVyaWFsID0gbmV3IEJBQllMT04uU3RhbmRhcmRNYXRlcmlhbChcInBsYXllclJlcGVyZU1hdFwiLCBzY2VuZSk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUubWF0ZXJpYWwuZW1pc3NpdmVDb2xvciA9IG5ldyBCQUJZTE9OLkNvbG9yMy5SZWQoKTtcblx0XHRcdHBsYXllclJlcGVyZS5tZXRhZGF0YSA9IHsgaXNQbGF5ZXJSZXBlcmVfMXYxOiB0cnVlIH07IFxuXHRcdFxuXG5cdFx0XHRzY2VuZS5yZWdpc3RlckJlZm9yZVJlbmRlcigoKSA9PiB7XG5cdFx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uLnggPSBwbGF5ZXJfMi5wb3NpdGlvbi54O1xuXHRcdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbi55ID0gcGxheWVyXzIucG9zaXRpb24ueTtcblx0XHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24ueiA9IHBsYXllcl8yLnBvc2l0aW9uLno7XG5cdFx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbi54ID0gcGxheWVyXzIucG9zaXRpb24ueDtcblx0XHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uLnkgPSBwbGF5ZXJfMi5wb3NpdGlvbi55O1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoY3VycmVudFNraW5QbGF5ZXIxID09PSAyKVxuXHR7XG5cdFx0QkFCWUxPTi5TY2VuZUxvYWRlci5JbXBvcnRNZXNoKFwiXCIsIFwiL3NyY3MvZ2FtZS9hc3NldHMvcGxheWVyX3NraW4vXCIsIFwiaWRsZV9yb3VnZS5nbGJcIiwgc2NlbmUsIGZ1bmN0aW9uIChuZXdNZXNoZXMpIHtcblx0XHRcdGNvbnN0IHBsYXllck1vZGVsID0gbmV3TWVzaGVzWzBdO1xuXHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24gPSBwbGF5ZXJfMS5wb3NpdGlvbi5jbG9uZSgpO1xuXHRcdFx0cGxheWVyTW9kZWwuc2NhbGluZyA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoNiwgNiwgNik7XG5cdFx0XHRwbGF5ZXJNb2RlbC5yb3RhdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgTWF0aC5QSSwgMCk7XG5cdFx0XHRwbGF5ZXJNb2RlbC5tZXRhZGF0YSA9IHsgaXNQbGF5ZXJfMXYxOiB0cnVlIH07ICAvLyBUYWcgYWpvdXTDqSBwb3VyIGxlIGpvdWV1ciAyXG5cblx0XHRcdG5ld01lc2hlcy5mb3JFYWNoKG1lc2ggPT4ge1xuXHRcdFx0XHRpZiAobWVzaCBpbnN0YW5jZW9mIEJBQllMT04uTWVzaCkge1xuXHRcdFx0XHRcdG1lc2gucm90YXRpb25RdWF0ZXJuaW9uID0gbnVsbDtcblx0XHRcdFx0XHRtZXNoLnJvdGF0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMyhNYXRoLlBJLCAwLCAwKTtcblx0XHRcdFx0XHRtZXNoLm1ldGFkYXRhID0geyBpc1BsYXllcl8xdjE6IHRydWUgfTsgIFxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcblx0XHRcdGNvbnN0IHBsYXllclJlcGVyZSA9IG5ldyBCQUJZTE9OLk1lc2hCdWlsZGVyLkNyZWF0ZUJveChcInBsYXllclJlcGVyZVwiLCB7XG5cdFx0XHRcdHdpZHRoOiAxMCxcblx0XHRcdFx0aGVpZ2h0OiAwLjEsXG5cdFx0XHRcdGRlcHRoOiAxLFxuXHRcdFx0fSwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygtNywgMzAxLCAtMTIwKTtcblx0XHRcdHBsYXllclJlcGVyZS5tYXRlcmlhbCA9IG5ldyBCQUJZTE9OLlN0YW5kYXJkTWF0ZXJpYWwoXCJwbGF5ZXJSZXBlcmVNYXRcIiwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLm1hdGVyaWFsLmVtaXNzaXZlQ29sb3IgPSBuZXcgQkFCWUxPTi5Db2xvcjMuUmVkKCk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUubWV0YWRhdGEgPSB7IGlzUGxheWVyUmVwZXJlXzF2MTogdHJ1ZSB9OyBcblx0XHRcblxuXHRcdFx0c2NlbmUucmVnaXN0ZXJCZWZvcmVSZW5kZXIoKCkgPT4ge1xuXHRcdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbi54ID0gcGxheWVyXzEucG9zaXRpb24ueDtcblx0XHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24ueSA9IHBsYXllcl8xLnBvc2l0aW9uLnk7XG5cdFx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uLnogPSBwbGF5ZXJfMS5wb3NpdGlvbi56O1xuXHRcdFx0XHRwbGF5ZXJSZXBlcmUucG9zaXRpb24ueCA9IHBsYXllcl8xLnBvc2l0aW9uLng7XG5cdFx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbi55ID0gcGxheWVyXzEucG9zaXRpb24ueTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKGN1cnJlbnRTa2luUGxheWVyMiA9PT0gMilcblx0e1xuXHRcdEJBQllMT04uU2NlbmVMb2FkZXIuSW1wb3J0TWVzaChcIlwiLCBcIi9zcmNzL2dhbWUvYXNzZXRzL3BsYXllcl9za2luL1wiLCBcImlkbGVfcm91Z2UuZ2xiXCIsIHNjZW5lLCBmdW5jdGlvbiAobmV3TWVzaGVzKSB7XG5cdFx0XHRjb25zdCBwbGF5ZXJNb2RlbCA9IG5ld01lc2hlc1swXTtcblx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uID0gcGxheWVyXzIucG9zaXRpb24uY2xvbmUoKTtcblx0XHRcdHBsYXllck1vZGVsLnNjYWxpbmcgPSBuZXcgQkFCWUxPTi5WZWN0b3IzKDYsIDYsIDYpO1xuXHRcdFx0cGxheWVyTW9kZWwucm90YXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKDAsIE1hdGguUEksIDApO1xuXHRcdFx0cGxheWVyTW9kZWwubWV0YWRhdGEgPSB7IGlzUGxheWVyXzF2MTogdHJ1ZSB9OyAgLy8gVGFnIGFqb3V0w6kgcG91ciBsZSBqb3VldXIgMlxuXHRcdFxuXHRcdFx0Y29uc3QgcGxheWVyUmVwZXJlID0gbmV3IEJBQllMT04uTWVzaEJ1aWxkZXIuQ3JlYXRlQm94KFwicGxheWVyUmVwZXJlXCIsIHtcblx0XHRcdFx0d2lkdGg6IDEwLFxuXHRcdFx0XHRoZWlnaHQ6IDAuMSxcblx0XHRcdFx0ZGVwdGg6IDEsXG5cdFx0XHR9LCBzY2VuZSk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUucG9zaXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKC03LCAzMDEsIC0yNC41KTtcblx0XHRcdHBsYXllclJlcGVyZS5tYXRlcmlhbCA9IG5ldyBCQUJZTE9OLlN0YW5kYXJkTWF0ZXJpYWwoXCJwbGF5ZXJSZXBlcmVNYXRcIiwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLm1hdGVyaWFsLmVtaXNzaXZlQ29sb3IgPSBuZXcgQkFCWUxPTi5Db2xvcjMuUmVkKCk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUubWV0YWRhdGEgPSB7IGlzUGxheWVyUmVwZXJlXzF2MTogdHJ1ZSB9OyBcblx0XHRcblxuXHRcdFx0c2NlbmUucmVnaXN0ZXJCZWZvcmVSZW5kZXIoKCkgPT4ge1xuXHRcdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbi54ID0gcGxheWVyXzIucG9zaXRpb24ueDtcblx0XHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24ueSA9IHBsYXllcl8yLnBvc2l0aW9uLnk7XG5cdFx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uLnogPSBwbGF5ZXJfMi5wb3NpdGlvbi56O1xuXHRcdFx0XHRwbGF5ZXJSZXBlcmUucG9zaXRpb24ueCA9IHBsYXllcl8yLnBvc2l0aW9uLng7XG5cdFx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbi55ID0gcGxheWVyXzIucG9zaXRpb24ueTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKGN1cnJlbnRTa2luUGxheWVyMSA9PT0gMylcblx0e1xuXHRcdEJBQllMT04uU2NlbmVMb2FkZXIuSW1wb3J0TWVzaChcIlwiLCBcIi9zcmNzL2dhbWUvYXNzZXRzL3BsYXllcl9za2luL1wiLCBcImlkbGVfdmVydC5nbGJcIiwgc2NlbmUsIGZ1bmN0aW9uIChuZXdNZXNoZXMpIHtcblx0XHRcdGNvbnN0IHBsYXllck1vZGVsID0gbmV3TWVzaGVzWzBdO1xuXHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24gPSBwbGF5ZXJfMS5wb3NpdGlvbi5jbG9uZSgpO1xuXHRcdFx0cGxheWVyTW9kZWwuc2NhbGluZyA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoNiwgNiwgNik7XG5cdFx0XHRwbGF5ZXJNb2RlbC5yb3RhdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgTWF0aC5QSSwgMCk7XG5cdFx0XHRwbGF5ZXJNb2RlbC5tZXRhZGF0YSA9IHsgaXNQbGF5ZXJfMXYxOiB0cnVlIH07ICAvLyBUYWcgYWpvdXTDqSBwb3VyIGxlIGpvdWV1ciAyXG5cblx0XHRcdG5ld01lc2hlcy5mb3JFYWNoKG1lc2ggPT4ge1xuXHRcdFx0XHRpZiAobWVzaCBpbnN0YW5jZW9mIEJBQllMT04uTWVzaCkge1xuXHRcdFx0XHRcdG1lc2gucm90YXRpb25RdWF0ZXJuaW9uID0gbnVsbDtcblx0XHRcdFx0XHRtZXNoLnJvdGF0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMyhNYXRoLlBJLCAwLCAwKTtcblx0XHRcdFx0XHRtZXNoLm1ldGFkYXRhID0geyBpc1BsYXllcl8xdjE6IHRydWUgfTsgIFxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcblx0XHRcdGNvbnN0IHBsYXllclJlcGVyZSA9IG5ldyBCQUJZTE9OLk1lc2hCdWlsZGVyLkNyZWF0ZUJveChcInBsYXllclJlcGVyZVwiLCB7XG5cdFx0XHRcdHdpZHRoOiAxMCxcblx0XHRcdFx0aGVpZ2h0OiAwLjEsXG5cdFx0XHRcdGRlcHRoOiAxLFxuXHRcdFx0fSwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygtNywgMzAxLCAtMTIwKTtcblx0XHRcdHBsYXllclJlcGVyZS5tYXRlcmlhbCA9IG5ldyBCQUJZTE9OLlN0YW5kYXJkTWF0ZXJpYWwoXCJwbGF5ZXJSZXBlcmVNYXRcIiwgc2NlbmUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLm1hdGVyaWFsLmVtaXNzaXZlQ29sb3IgPSBuZXcgQkFCWUxPTi5Db2xvcjMuUmVkKCk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUubWV0YWRhdGEgPSB7IGlzUGxheWVyUmVwZXJlXzF2MTogdHJ1ZSB9OyBcblx0XHRcblxuXHRcdFx0c2NlbmUucmVnaXN0ZXJCZWZvcmVSZW5kZXIoKCkgPT4ge1xuXHRcdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbi54ID0gcGxheWVyXzEucG9zaXRpb24ueDtcblx0XHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24ueSA9IHBsYXllcl8xLnBvc2l0aW9uLnk7XG5cdFx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uLnogPSBwbGF5ZXJfMS5wb3NpdGlvbi56O1xuXHRcdFx0XHRwbGF5ZXJSZXBlcmUucG9zaXRpb24ueCA9IHBsYXllcl8xLnBvc2l0aW9uLng7XG5cdFx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbi55ID0gcGxheWVyXzEucG9zaXRpb24ueTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKGN1cnJlbnRTa2luUGxheWVyMiA9PT0gMylcblx0e1xuXHRcdEJBQllMT04uU2NlbmVMb2FkZXIuSW1wb3J0TWVzaChcIlwiLCBcIi9zcmNzL2dhbWUvYXNzZXRzL3BsYXllcl9za2luL1wiLCBcImlkbGVfdmVydC5nbGJcIiwgc2NlbmUsIGZ1bmN0aW9uIChuZXdNZXNoZXMpIHtcblx0XHRcdGNvbnN0IHBsYXllck1vZGVsID0gbmV3TWVzaGVzWzBdO1xuXHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24gPSBwbGF5ZXJfMi5wb3NpdGlvbi5jbG9uZSgpO1xuXHRcdFx0cGxheWVyTW9kZWwuc2NhbGluZyA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoNiwgNiwgNik7XG5cdFx0XHRwbGF5ZXJNb2RlbC5yb3RhdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgTWF0aC5QSSwgMCk7XG5cdFx0XHRwbGF5ZXJNb2RlbC5tZXRhZGF0YSA9IHsgaXNQbGF5ZXJfMXYxOiB0cnVlIH07ICAvLyBUYWcgYWpvdXTDqSBwb3VyIGxlIGpvdWV1ciAyXG5cdFx0XG5cdFx0XHRjb25zdCBwbGF5ZXJSZXBlcmUgPSBuZXcgQkFCWUxPTi5NZXNoQnVpbGRlci5DcmVhdGVCb3goXCJwbGF5ZXJSZXBlcmVcIiwge1xuXHRcdFx0XHR3aWR0aDogMTAsXG5cdFx0XHRcdGhlaWdodDogMC4xLFxuXHRcdFx0XHRkZXB0aDogMSxcblx0XHRcdH0sIHNjZW5lKTtcblx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoLTcsIDMwMSwgLTI0LjUpO1xuXHRcdFx0cGxheWVyUmVwZXJlLm1hdGVyaWFsID0gbmV3IEJBQllMT04uU3RhbmRhcmRNYXRlcmlhbChcInBsYXllclJlcGVyZU1hdFwiLCBzY2VuZSk7XG5cdFx0XHRwbGF5ZXJSZXBlcmUubWF0ZXJpYWwuZW1pc3NpdmVDb2xvciA9IG5ldyBCQUJZTE9OLkNvbG9yMy5SZWQoKTtcblx0XHRcdHBsYXllclJlcGVyZS5tZXRhZGF0YSA9IHsgaXNQbGF5ZXJSZXBlcmVfMXYxOiB0cnVlIH07IFxuXHRcdFxuXG5cdFx0XHRzY2VuZS5yZWdpc3RlckJlZm9yZVJlbmRlcigoKSA9PiB7XG5cdFx0XHRcdHBsYXllck1vZGVsLnBvc2l0aW9uLnggPSBwbGF5ZXJfMi5wb3NpdGlvbi54O1xuXHRcdFx0XHRwbGF5ZXJNb2RlbC5wb3NpdGlvbi55ID0gcGxheWVyXzIucG9zaXRpb24ueTtcblx0XHRcdFx0cGxheWVyTW9kZWwucG9zaXRpb24ueiA9IHBsYXllcl8yLnBvc2l0aW9uLno7XG5cdFx0XHRcdHBsYXllclJlcGVyZS5wb3NpdGlvbi54ID0gcGxheWVyXzIucG9zaXRpb24ueDtcblx0XHRcdFx0cGxheWVyUmVwZXJlLnBvc2l0aW9uLnkgPSBwbGF5ZXJfMi5wb3NpdGlvbi55O1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblx0XG5cdGNvbnNvbGUubG9nKFwicGxheWVyIDEgXCIgKyBwbGF5ZXJfMS5wb3NpdGlvbik7XG5cdGNvbnNvbGUubG9nKFwicGxheWVyIDIgXCIgKyBwbGF5ZXJfMi5wb3NpdGlvbik7XG5cblx0cmV0dXJuIHsgcGxheWVyXzEsIHBsYXllcl8yIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGF5ZXJSZWYoKSB7XG5cdGNvbnNvbGUubG9nKFwicGxheWVyIDEgYmlzIFwiICsgcGxheWVyXzEucG9zaXRpb24pO1xuXHRjb25zb2xlLmxvZyhcInBsYXllciAyIGJpcyBcIiArIHBsYXllcl8yLnBvc2l0aW9uKTtcblx0cmV0dXJuIHsgcGxheWVyXzEsIHBsYXllcl8yIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldF9wbGF5ZXJfcG9zaXRpb24ocGxheWVyXzEsIHBsYXllcl8yKSB7XG5cdHBsYXllcl8xLnBvc2l0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygtNywgMzAxLCAtMTIwKTtcblx0cGxheWVyXzIucG9zaXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKC03LCAzMDEsIC0yNCk7XG59XG5cblxuXG5jb25zdCBwYWRkbGVTcGVlZCA9IDEuMTtcbmNvbnN0IGtleXMgPSB7fTsgXG5cbmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldmVudCkgPT4ga2V5c1tldmVudC5rZXldID0gdHJ1ZSk7XG5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKGV2ZW50KSA9PiBrZXlzW2V2ZW50LmtleV0gPSBmYWxzZSk7XG5cbmxldCBwbGF5ZXJfMV9ib251cyA9IG51bGw7XG5sZXQgcGxheWVyXzJfYm9udXMgPSBudWxsO1xuXG5cblxuXG5leHBvcnQgZnVuY3Rpb24gVXBkYXRlUGxheWVyUG9zZShwbGF5ZXJfMSwgcGxheWVyXzIpIHtcblxuXHRpZiAoaXNfSW52ZXJzZV90ZWFtMSA9PSBmYWxzZSlcblx0e1xuXHRcdGlmIChrZXlzW1wid1wiXSAmJiBwbGF5ZXJfMS5wb3NpdGlvbi54ID4gbWluWCkge1xuXHRcdFx0cGxheWVyXzEucG9zaXRpb24ueCAtPSBwYWRkbGVTcGVlZDtcblx0XHR9XG5cdFx0aWYgKGtleXNbXCJzXCJdICYmIHBsYXllcl8xLnBvc2l0aW9uLnggPCBtYXhYKSB7XG5cdFx0XHRwbGF5ZXJfMS5wb3NpdGlvbi54ICs9IHBhZGRsZVNwZWVkO1xuXHRcdH1cblx0fVxuXG5cdGlmIChpc19JbnZlcnNlX3RlYW0xID09IHRydWUpXG5cdHtcblx0XHRpZiAoa2V5c1tcIndcIl0gJiYgcGxheWVyXzEucG9zaXRpb24ueCA8IG1heFgpIHtcblx0XHRcdHBsYXllcl8xLnBvc2l0aW9uLnggKz0gcGFkZGxlU3BlZWQ7XG5cdFx0fVxuXHRcdGlmIChrZXlzW1wic1wiXSAmJiBwbGF5ZXJfMS5wb3NpdGlvbi54ID4gbWluWCkge1xuXHRcdFx0cGxheWVyXzEucG9zaXRpb24ueCAtPSBwYWRkbGVTcGVlZDtcblx0XHR9XG5cdH1cblxuXHRpZiAoaXNfSW52ZXJzZV90ZWFtMiA9PSBmYWxzZSlcblx0e1xuXHRcdGlmIChrZXlzW1wiQXJyb3dVcFwiXSAmJiBwbGF5ZXJfMi5wb3NpdGlvbi54ID4gbWluWCkge1xuXHRcdFx0cGxheWVyXzIucG9zaXRpb24ueCAtPSBwYWRkbGVTcGVlZDtcblx0XHR9XG5cdFx0aWYgKGtleXNbXCJBcnJvd0Rvd25cIl0gJiYgcGxheWVyXzIucG9zaXRpb24ueCA8IG1heFgpIHtcblx0XHRcdHBsYXllcl8yLnBvc2l0aW9uLnggKz0gcGFkZGxlU3BlZWQ7XG5cdFx0fVxuXHR9XG5cblx0aWYgKGlzX0ludmVyc2VfdGVhbTIgPT0gdHJ1ZSlcblx0e1xuXHRcdGlmIChrZXlzW1wiQXJyb3dVcFwiXSAmJiBwbGF5ZXJfMi5wb3NpdGlvbi54IDwgbWF4WCkge1xuXHRcdFx0cGxheWVyXzIucG9zaXRpb24ueCArPSBwYWRkbGVTcGVlZDtcblx0XHR9XG5cdFx0aWYgKGtleXNbXCJBcnJvd0Rvd25cIl0gJiYgcGxheWVyXzIucG9zaXRpb24ueCA+IG1pblgpIHtcblx0XHRcdHBsYXllcl8yLnBvc2l0aW9uLnggLT0gcGFkZGxlU3BlZWQ7XG5cdFx0fVxuXHR9XG5cblx0aWYgKGtleXNbXCJjXCJdICYmIGlzX0ludmVyc2VfdGVhbTEgPT0gZmFsc2UpXG5cdHtcblx0XHRpbnZlcnNlX3BsYXllcjIoKVxuXHR9XG5cblxuXHRpZiAoa2V5c1tcIjNcIl0gJiYgaXNfSW52ZXJzZV90ZWFtMiA9PSBmYWxzZSlcblx0e1xuXHRcdGludmVyc2VfcGxheWVyMSgpXG5cdH1cblxuXG5cdGlmIChrZXlzW1wielwiXSlcblx0XHRncmVuYWRlX2ZsYXNoX3BsYXllcjEoc2NlbmUpO1xuXHRpZiAoa2V5c1tcIjFcIl0pXG5cdFx0Z3JlbmFkZV9mbGFzaF9wbGF5ZXIyKHNjZW5lKTtcblxuXHRpZiAoa2V5c1tcInhcIl0pXG5cdHtcblx0XHRpZiAoIXBsYXllcl8xX2JvbnVzKVxuXHRcdHtcblx0XHRcdHBsYXllcl8xX2JvbnVzID0gaW5pdF9UZWFtbWF0ZV9wbGF5ZXJfMShzY2VuZSk7XG5cdFx0XHRpZiAocGxheWVyXzFfYm9udXMpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHBsYXllcl8xX2JvbnVzLnBvc2l0aW9uKTtcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0cGxheWVyXzFfYm9udXMgPSBudWxsO1xuXHRcdFx0XHR9LCAxMDAwMCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGlmIChrZXlzW1wiMlwiXSlcblx0e1xuXHRcdGlmICghcGxheWVyXzJfYm9udXMpXG5cdFx0e1xuXHRcdFx0cGxheWVyXzJfYm9udXMgPSBpbml0X1RlYW1tYXRlX3BsYXllcl8yKHNjZW5lKTtcblx0XHRcdGlmIChwbGF5ZXJfMl9ib251cylcblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5sb2cocGxheWVyXzJfYm9udXMucG9zaXRpb24pO1xuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRwbGF5ZXJfMl9ib251cyA9IG51bGw7XG5cdFx0XHRcdH0sIDEwMDAwKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpZiAoa2V5c1tcImVcIl0gJiYgcGxheWVyXzFfYm9udXMgJiYgcGxheWVyXzFfYm9udXMucG9zaXRpb24ueCA+IG1pblgpXG5cdHsgXG5cdFx0cGxheWVyXzFfYm9udXMucG9zaXRpb24ueCAtPSBwYWRkbGVTcGVlZDtcblx0fVxuXG5cdGlmIChrZXlzW1wiZFwiXSAmJiBwbGF5ZXJfMV9ib251cyAmJiBwbGF5ZXJfMV9ib251cy5wb3NpdGlvbi54IDwgbWF4WClcblx0e1xuXHRcdHBsYXllcl8xX2JvbnVzLnBvc2l0aW9uLnggKz0gcGFkZGxlU3BlZWQ7XG5cdH1cblxuXHRpZiAoa2V5c1tcIm9cIl0gJiYgcGxheWVyXzJfYm9udXMgJiYgcGxheWVyXzJfYm9udXMucG9zaXRpb24ueCA+IG1pblgpXG5cdHtcblx0XHRwbGF5ZXJfMl9ib251cy5wb3NpdGlvbi54IC09IHBhZGRsZVNwZWVkO1xuXHR9XG5cblx0aWYgKGtleXNbXCJsXCJdICYmIHBsYXllcl8yX2JvbnVzICYmIHBsYXllcl8yX2JvbnVzLnBvc2l0aW9uLnggPCBtYXhYKVxuXHR7XG5cdFx0cGxheWVyXzJfYm9udXMucG9zaXRpb24ueCArPSBwYWRkbGVTcGVlZDtcblx0fVxuXG5cblx0cmV0dXJuIHtcblx0XHRwbGF5ZXJfMV9ib251czogcGxheWVyXzFfYm9udXMsXG5cdFx0cGxheWVyXzJfYm9udXM6IHBsYXllcl8yX2JvbnVzXG5cdH07XG5cbn1cbiJdfQ==