let view1Meshes = [];
let view2Meshes = [];
let view3Meshes = [];

export function create_environment_view1(scene) {
	view1Meshes = []; // Réinitialise la liste pour éviter les doublons

    const grassTexture = new BABYLON.Texture("/srcs/game/assets/image/perfect-green-grass.jpg", scene);
    grassTexture.anisotropicFilteringLevel = 8;
    grassTexture.uScale = 5;
    grassTexture.vScale = 5;
    grassTexture.hasAlpha = false;
    grassTexture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
    grassTexture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;

    // Matériau unique pour l'herbe
    const grassMaterial = new BABYLON.StandardMaterial("grassMaterial", scene);
    grassMaterial.diffuseTexture = grassTexture;
    grassMaterial.backFaceCulling = false;
    grassMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    // Attente du chargement de la texture
    grassTexture.onLoadObservable.add(() => {
        console.log("Texture d'herbe chargée");
    });
	BABYLON.SceneLoader.Append("/srcs/game/assets/3d_object/", "ImageToStl.com_football_stadiumv2.glb", scene, function () {
		console.log("Stade chargé avec succès !");
	
		scene.meshes.forEach(m => {
			if (m.name === "test6") {
				m.scaling = new BABYLON.Vector3(0, 0, 0);
				m.position = new BABYLON.Vector3(0, 0, 0);
				view1Meshes.push(m);
			}
		});
	});

	BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/3d_object/", "testPersoPageDeGardeV1.glb", scene, function (newMeshes) {
		newMeshes.forEach(mesh => {
			if (mesh.material) {
				mesh.material.transparencyMode = 0;
				mesh.material.backFaceCulling = false;
				if (mesh.material.pbr) {
					mesh.material.pbr.usePhysicalLightFalloff = true;
				}
			}
			view1Meshes.push(mesh);
		});
	
		let perso = newMeshes.find(mesh => mesh.name === "__root__");
		if (perso) {
			perso.scaling = new BABYLON.Vector3(5.5, 5.5, 5.5);
			perso.position = new BABYLON.Vector3(-90, 1.5, -65);
			perso.rotation = new BABYLON.Vector3(0, Math.PI/4, 0);
		}
	
		if (typeof controlPerso === "function") {
			controlPerso(perso);
		}
	});

	function createGrassPlane(name, position) {
        const grassPlane = BABYLON.MeshBuilder.CreateGround(name, { width: 45, height: 50 }, scene);
        grassPlane.material = grassMaterial;
        grassPlane.position = position;
        grassPlane.freezeWorldMatrix(); // Optimisation : le sol ne bouge pas
        view1Meshes.push(grassPlane);
    }

    // Création des sols en herbe
    const grassPositions = [
        new BABYLON.Vector3(-61.5, 1.3, -152),
        new BABYLON.Vector3(-61.5, 1.3, -102),
        new BABYLON.Vector3(-61.5, 1.3, -52),
        new BABYLON.Vector3(-106.5, 1.3, -152),
        new BABYLON.Vector3(-106.5, 1.3, -102),
        new BABYLON.Vector3(-106.5, 1.3, -52),
    ];

    grassPositions.forEach((pos, index) => createGrassPlane(`grassPlane${index + 1}`, pos));
}

export function destroy_environement_view1() {
	view1Meshes.forEach(mesh => mesh.dispose());
	view1Meshes = []; // Vide la liste après destruction
}

// ========================= VIEW 2 =========================

export function create_environment_view2(scene) {
	view2Meshes = []; // Réinitialise la liste

	BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/3d_object/", "versionFinalV2.glb", scene, function (newMeshes) {
		console.log("Modèle chargé avec succès !");

		let container = new BABYLON.TransformNode("container", scene);
		newMeshes.forEach(mesh => {
			mesh.setParent(container);
			view2Meshes.push(mesh);
		});
		container.position = new BABYLON.Vector3(0, 100, 0);
		view2Meshes.push(container);
	});

	const spotLight = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-6, 101, -14), new BABYLON.Vector3(2.5, 4, -2), Math.PI / 1, 4, scene);
	spotLight.intensity = 5000;
	spotLight.diffuse = new BABYLON.Color3(1, 1, 1);
	spotLight.specular = new BABYLON.Color3(1, 1, 1);
	spotLight.range = 30;
	view2Meshes.push(spotLight);

	const spotLight2 = new BABYLON.SpotLight("spotLight2", new BABYLON.Vector3(-7.69, 101, -27), new BABYLON.Vector3(-7, 4, -2), Math.PI / 1, 4, scene);
	spotLight2.intensity = 5000;
	spotLight2.diffuse = new BABYLON.Color3(1, 1, 1);
	spotLight2.specular = new BABYLON.Color3(1, 1, 1);
	spotLight2.range = 30;
	view2Meshes.push(spotLight2);
}

export function destroy_environement_view2() {
	view2Meshes.forEach(mesh => mesh.dispose());
	view2Meshes = [];
}

// ========================= VIEW 3 =========================

export function create_environment_view3(scene) {
	view3Meshes = []; // Réinitialise la liste

	const grassTexture = new BABYLON.Texture("/srcs/game/assets/image/perfect-green-grass.jpg", scene);
    grassTexture.anisotropicFilteringLevel = 8; // Réduit de 16 à 8 pour de meilleures performances
    grassTexture.uScale = 5;
    grassTexture.vScale = 5;
    grassTexture.hasAlpha = false; // Indiquer explicitement qu'il n'y a pas de canal alpha
    grassTexture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
    grassTexture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
    
    // Création d'un matériau réutilisable pour toutes les instances de terrain
    const grassMaterial = new BABYLON.StandardMaterial("grassMaterial", scene);
    grassMaterial.diffuseTexture = grassTexture;
    grassMaterial.backFaceCulling = false;
    grassMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1); // Réduit les reflets
    
    // Attendre que la texture soit complètement chargée avant de l'utiliser
    grassTexture.onLoadObservable.add(() => {
        console.log("Texture d'herbe chargée");
    });

	BABYLON.SceneLoader.ImportMesh("", "/srcs/game/assets/3d_object/", "ImageToStl.com_footballterraindejeuxv2.glb", scene, function (newMeshes) {
		console.log("Modèle chargé avec succès !");

		let container = new BABYLON.TransformNode("test", scene);
		newMeshes.forEach(mesh => {
			mesh.setParent(container);
			view3Meshes.push(mesh);
		});
		container.position = new BABYLON.Vector3(0, 300, 0);
		view3Meshes.push(container);
	});

	function createGrassPlane2(name, position) {
		const grassPlane = BABYLON.MeshBuilder.CreateGround(name, {width: 32.8, height: 58}, scene);
		const grassMaterial = new BABYLON.StandardMaterial(name + "Material", scene);
		grassMaterial.diffuseTexture = new BABYLON.Texture("/srcs/game/assets/image/perfect-green-grass.jpg", scene);
		grassMaterial.backFaceCulling = false;
		grassMaterial.diffuseTexture.anisotropicFilteringLevel = 16;
		grassMaterial.diffuseTexture.uScale = 5;
		grassMaterial.diffuseTexture.vScale = 5;
		grassPlane.material = grassMaterial;
		grassPlane.position = position;
		view3Meshes.push(grassPlane);
	}

	createGrassPlane2("grassPlane7", new BABYLON.Vector3(-23.6, 299.8, -102));
	createGrassPlane2("grassPlane8", new BABYLON.Vector3(-23.6, 299.8, -44));
	createGrassPlane2("grassPlane9", new BABYLON.Vector3(9.2, 299.8, -102));
	createGrassPlane2("grassPlane10", new BABYLON.Vector3(9.2, 299.8, -44));
}

export function destroy_environement_view3() {
	view3Meshes.forEach(mesh => mesh.dispose());
	view3Meshes = [];
}


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

