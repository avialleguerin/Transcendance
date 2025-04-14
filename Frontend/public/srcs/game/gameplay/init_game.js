import { getSoloGameStart, getMultiGameStart } from "./babylon.js";

export function create_game(scene)
{
	const border_right = new BABYLON.MeshBuilder.CreateBox("border", {
		width: 65,
		height: 3,
		depth: 1
	}, scene);
	border_right.position = new BABYLON.Vector3(-7, 300, -14);
	border_right.visibility = 0;

	const border_left = new BABYLON.MeshBuilder.CreateBox("border", {
		width: 65,
		height: 3,
		depth: 1
	}, scene);
	border_left.position = new BABYLON.Vector3(-7, 300, -130);
	border_left.visibility = 0;

	const borderTop = new BABYLON.MeshBuilder.CreateBox("border", {
		width: 115,
		height: 3,
		depth: 1
	}, scene);
	borderTop.position = new BABYLON.Vector3(25, 300, -72);
	borderTop.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
	borderTop.visibility = 0;

	const borderBottom = new BABYLON.MeshBuilder.CreateBox("border", {
		width: 115,
		height: 3,
		depth: 1
	}, scene);
	borderBottom.position = new BABYLON.Vector3(-40, 300, -72);
	borderBottom.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
	borderBottom.visibility = 0;

	return { border_right, border_left, borderTop, borderBottom };
}


export function destroy_game(scene)
{
	scene.meshes.forEach(m => {
		if (m.name === "border")
		{
			m.dispose();
		}
	});
}

let view1Meshes = [];
let view2Meshes = [];
let view3Meshes = [];

// ========================= VIEW 1 =========================

export function create_environment_view1(scene) {
	destroy_environement_view1();

	const grassTexture = new BABYLON.Texture("/srcs/game/assets/image/perfect-green-grass.jpg", scene);
	grassTexture.anisotropicFilteringLevel = 8;
	grassTexture.uScale = 5;
	grassTexture.vScale = 5;
	grassTexture.hasAlpha = false;
	grassTexture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
	grassTexture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;

	const grassMaterial = new BABYLON.StandardMaterial("grassMaterial", scene);
	grassMaterial.diffuseTexture = grassTexture;
	grassMaterial.backFaceCulling = false;
	grassMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

	BABYLON.SceneLoader.Append("/srcs/game/assets/3d_object/", "ImageToStl.com_football_stadiumv2.glb", scene, function () {
		const stadiumGroup = new BABYLON.TransformNode("stadiumGroup", scene);
		scene.meshes.forEach(m => {
			if (m.name.includes("__root__")) {
				m.parent = stadiumGroup;
			}
		});
		view1Meshes.push(stadiumGroup);
	});

	BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/3d_object/", "testPersoPageDeGardeV1.glb", scene, function (newMeshes) {
		let perso = null;
		newMeshes.forEach(mesh => {
			if (mesh.material) {
				mesh.material.transparencyMode = 0;
				mesh.material.backFaceCulling = false;
			}
			if (mesh.name === "__root__") {
				perso = mesh;
			}
			view1Meshes.push(mesh);
		});

		if (perso) {
			perso.scaling = new BABYLON.Vector3(5.5, 5.5, 5.5);
			perso.position = new BABYLON.Vector3(-90, 1.5, -65);
			perso.rotation = new BABYLON.Vector3(0, Math.PI / 4, 0);
		}

		if (typeof controlPerso === "function") {
			controlPerso(perso);
		}
	});

	const positions = [
		[-61.5, 1.3, -152], [-61.5, 1.3, -102], [-61.5, 1.3, -52],
		[-106.5, 1.3, -152], [-106.5, 1.3, -102], [-106.5, 1.3, -52]
	];

	positions.forEach((pos, i) => {
		const ground = BABYLON.MeshBuilder.CreateGround(`grass${i}`, { width: 45, height: 50 }, scene);
		ground.material = grassMaterial;
		ground.position = new BABYLON.Vector3(...pos);
		ground.freezeWorldMatrix();
		view1Meshes.push(ground);
	});
}

export function destroy_environement_view1() {
	view1Meshes.forEach(mesh => mesh.dispose());
	view1Meshes = [];
}

// ========================= VIEW 2 =========================

export function create_environment_view2(scene) {
	destroy_environement_view2();

	BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/3d_object/", "versionFinalV2.glb", scene, function (meshes) {
		const container = new BABYLON.TransformNode("container", scene);
		meshes.forEach(m => {
			m.setParent(container);
			view2Meshes.push(m);
		});
		container.position = new BABYLON.Vector3(0, 100, 0);
		view2Meshes.push(container);
	});

	const lights = [
		{ name: "spotLight", pos: [-6, 101, -14], dir: [2.5, 4, -2] },
		{ name: "spotLight2", pos: [-7.69, 101, -27], dir: [-7, 4, -2] },
        // { name: "spotLight3", pos: [-19.5, 100, -30], dir: [0, 1, 0] },
	];

	lights.forEach(({ name, pos, dir }) => {
		const light = new BABYLON.SpotLight(name, new BABYLON.Vector3(...pos), new BABYLON.Vector3(...dir), Math.PI, 4, scene);
		light.intensity = 10000;
		light.diffuse = light.specular = new BABYLON.Color3(1, 1, 1);
		light.range = 30;
		view2Meshes.push(light);
	});
}

export function destroy_environement_view2() {
	view2Meshes.forEach(mesh => mesh.dispose());
	view2Meshes = [];
}

// export function destroy_environement_view2() {
//     // Détruire les meshes
//     view2Meshes.forEach(mesh => mesh.dispose());
//     view2Meshes = [];

//     // Vider les matériaux et textures associés
//     scene.materials.forEach(material => {
//         if (material.diffuseTexture) {
//             material.diffuseTexture.dispose();  // Libérer les textures
//         }
//         material.dispose();  // Libérer le matériau lui-même
//     });

//     // Vider les lumières (si tu as des lumières personnalisées)
//     scene.lights.forEach(light => light.dispose());

//     // Vider les transform nodes ou autres objets
//     scene.transformNodes.forEach(node => {
//         node.dispose();
//     });

//     // Vider les systèmes de particules (si tu en as)
//     scene.particles.forEach(particleSystem => particleSystem.dispose());
// }

// ========================= VIEW 3 =========================

export function create_environment_view3(scene) {
	destroy_environement_view3();

	view3Meshes = [];

	const grassMaterial = new BABYLON.StandardMaterial("grassMaterial", scene);
	const texture = new BABYLON.Texture("/srcs/game/assets/image/perfect-green-grass.jpg", scene);
	texture.anisotropicFilteringLevel = 8;
	texture.uScale = 5;
	texture.vScale = 5;
	grassMaterial.diffuseTexture = texture;
	grassMaterial.backFaceCulling = false;
	grassMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

	BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/3d_object/", "ImageToStl.com_footballterraindejeuxv2.glb", scene, function (meshes) {
		const container = new BABYLON.TransformNode("terrainContainer", scene);
		meshes.forEach(m => {
			m.setParent(container);
			view3Meshes.push(m);
		});
		container.position = new BABYLON.Vector3(0, 300, 0);
		view3Meshes.push(container);
	});

	const grassPositions = [
		[-23.6, 299.8, -102], [-23.6, 299.8, -44],
		[9.2, 299.8, -102], [9.2, 299.8, -44]
	];

	grassPositions.forEach((pos, i) => {
		const ground = BABYLON.MeshBuilder.CreateGround(`g${i}`, { width: 32.8, height: 58 }, scene);
		ground.material = grassMaterial.clone(`grassMat${i}`);
		ground.material.diffuseTexture = texture.clone(`tex${i}`);
		ground.material.diffuseTexture.uScale = 5;
		ground.material.diffuseTexture.vScale = 5;
		ground.position = new BABYLON.Vector3(...pos);
		view3Meshes.push(ground);
	});

	if (getSoloGameStart()) create_podium(scene, 5, 5, 5);
	if (getMultiGameStart()) create_podium(scene, 8, 5, 8);

	[[-57, -65], [-57, -45], [27, -120], [-42, -120], [27, -24], [-42, -24]].forEach(([x, z]) => {
		create_spot_particule(scene, x, 299.5, z);
	});
}

export function destroy_environement_view3() {
	view3Meshes.forEach(mesh => mesh.dispose());
	view3Meshes = [];
}

// export function destroy_environement_view3() {
//     // Détruire les meshes
//     view3Meshes.forEach(mesh => mesh.dispose());
//     view3Meshes = [];

//     // Vider les matériaux et textures
//     scene.materials.forEach(material => {
//         if (material.diffuseTexture) {
//             material.diffuseTexture.dispose();
//         }
//         material.dispose();
//     });

//     // Vider les autres ressources si nécessaire
//     scene.meshes.forEach(mesh => {
//         if (mesh.material) {
//             mesh.material.dispose();
//         }
//         mesh.dispose();
//     });

//     // Vider les nodes (comme TransformNodes)
//     scene.transformNodes.forEach(node => {
//         node.dispose();
//     });

//     // Facultatif : vider les ressources supplémentaires comme les particules ou les lumières
//     scene.lights.forEach(light => light.dispose());
//     scene.particles.forEach(particleSystem => particleSystem.dispose());
// }

function create_podium(scene, sx, sy, sz) {
	BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/3d_object/", "podium.glb", scene, function (meshes) {
		const container = new BABYLON.TransformNode("podiumContainer", scene);
		meshes.forEach(m => {
			m.setParent(container);
			view3Meshes.push(m);
		});
		container.position = new BABYLON.Vector3(-57, 302, -55);
		container.scaling = new BABYLON.Vector3(sx, sy, sz);
		container.rotation = new BABYLON.Vector3(0, Math.PI, 0);
		view3Meshes.push(container);
	});
}

function create_spot_particule(scene, x, y, z) {
	BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/3d_object/", "spot_particule.glb", scene, function (meshes) {
		const container = new BABYLON.TransformNode("spotContainer", scene);
		meshes.forEach(m => {
			m.setParent(container);
			view3Meshes.push(m);
		});
		container.position = new BABYLON.Vector3(x, y, z);
		view3Meshes.push(container);
	});
}
