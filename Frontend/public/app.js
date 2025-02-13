import { addLights } from './light.js';
import { changeView } from './camera.js';
import { createLoadingOverlay, removeLoadingOverlay } from './loading_screen.js';


(function () {
    window.scene = new THREE.Scene();

    // Caméra avec un champ de vision plus ajusté pour les petits écrans
    window.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
    window.camera.position.set(0, 0, 100); 
    
    // Rendu avec antialiasing amélioré
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Pixel Ratio boosté artificiellement pour plus de netteté
    // renderer.setPixelRatio(2); // Force un ratio de 2 même sur un petit écran

    
    
    const ciel = new THREE.TextureLoader().load('/image/Capture d’écran 2025-01-15 à 16.35.37.png');
    scene.background = ciel;
    
    const container = document.getElementById('threejs-container');
    container.appendChild(renderer.domElement);
    
    addLights(scene);

    // createLoadingOverlay(); // Démarrer l'animation de chargement
    // setTimeout(removeLoadingOverlay, 5000); // Simule un chargement de 5s


    // changeView('vue1');

    function resizeRenderer() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    const lightPositions = [
        { x: 40, y: 60, z: 80 },
        { x: -40, y: 60, z: 80 },
        { x: -40, y: 60, z: -80 },
        { x: 40, y: 60, z: -80 }
    ];

    lightPositions.forEach(pos => {
        const simpleLight = new THREE.PointLight(0xffffff, 1, 100);
        simpleLight.position.set(pos.x, pos.y, pos.z);
        simpleLight.intensity = 2;
        scene.add(simpleLight);
    });



    const pongWidth_side_rl = 80;  // Largeur de la zone de jeu
    const pongHeight = 0;  // Hauteur de la zone de jeu
    const borderThickness = 20; // Épaisseur des bords

    const pongWidth_side_tb = 220;  // Largeur de la zone de jeu
    
    // Création des bords
    const border_top = new THREE.Mesh(
        new THREE.BoxGeometry(pongWidth_side_tb + borderThickness * 2, borderThickness, 1),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );

    border_top.position.set(-55, 0, 0);
    border_top.rotation.set(0, Math.PI / 2, 0);

    // scene.add(border_top);

    const border_bottom = new THREE.Mesh(
        new THREE.BoxGeometry(pongWidth_side_tb + borderThickness * 2, borderThickness, 1),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );

    border_bottom.rotation.set(0, Math.PI / 2, 0);
    border_bottom.position.set(55, 0, 0);

    // scene.add(border_bottom);

    const border_left = new THREE.Mesh(
        new THREE.BoxGeometry(pongWidth_side_rl + borderThickness * 2, borderThickness, 1),
        new THREE.MeshBasicMaterial({ color: 0x0000ff })
    );

    border_left.position.set(0, 0, -120);
    // scene.add(border_left);

    const border_right = new THREE.Mesh(
        new THREE.BoxGeometry(pongWidth_side_rl + borderThickness * 2, borderThickness, 1),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    border_right.position.set(0, 0, 120);
    // scene.add(border_right);
    
    // Dimensions des paddles
    const paddleGeometry = new THREE.BoxGeometry(15, 5, 5);
    const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Paddle droit
    const paddle_right = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle_right.position.set(0, 0, 100);

    // Paddle gauche
    const paddle_left = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle_left.position.set(0, 0, -100);
    
    
    function initializeDefaultView() {
        // Définir la vue par défaut
        const defaultView = 'vue1'; // Vue par défaut
        changeView(defaultView); // Application de la vue par défaut
    }

    
    const ballGeometry = new THREE.SphereGeometry(5, 32, 32);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, 0, 0);


    let ballDirection = new THREE.Vector3(0, 0, 1).normalize(); // Direction initiale de la balle
    let ballSpeed = 0.5; // Vitesse de la balle
    
    function animateBall() {
        ball.position.add(ballDirection);
    
        // Collision avec les limites du terrain
        if (ball.position.z > 120 || ball.position.z < -120) {
            ballDirection.z *= -1;
        }
        else if (ball.position.x > 55 || ball.position.x < -55) {
            ballDirection.x *= -1;
        }
    
        // Collision avec le paddle droit
        if (Math.abs(ball.position.z - paddle_right.position.z) < 5) { // Distance de collision sur l'axe Z
            if (Math.abs(ball.position.x - paddle_right.position.x) < 10) { // Distance de collision sur l'axe X
                
                // Inverser la direction Z
                ballDirection.z *= -1;
                
                // Ajouter un effet basé sur la position de collision sur le paddle
                const relativeIntersectX = ball.position.x - paddle_right.position.x;
                // Normaliser entre -1 et 1
                const normalizedIntersect = relativeIntersectX / 7.5;
                // Modifier la direction X en fonction du point d'impact
                ballDirection.x = normalizedIntersect;
                // Normaliser le vecteur de direction
                ballDirection.normalize();
            }
        }
        
        // Collision avec le paddle gauche
        if (Math.abs(ball.position.z - paddle_left.position.z) < 5) { // Distance de collision sur l'axe Z
            if (Math.abs(ball.position.x - paddle_left.position.x) < 10) { // Distance de collision sur l'axe X
                // Inverser la direction Z
                ballDirection.z *= -1;
                
                // Ajouter un effet basé sur la position de collision sur le paddle
                const relativeIntersectX = ball.position.x - paddle_left.position.x;
                // Normaliser entre -1 et 1
                const normalizedIntersect = relativeIntersectX / 7.5;
                // Modifier la direction X en fonction du point d'impact
                ballDirection.x = normalizedIntersect;
                // Normaliser le vecteur de direction
                ballDirection.normalize();
            }
        }
    }

	const blockGeometry = new THREE.BoxGeometry(10, 10, 10);
	const blockMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const block = new THREE.Mesh(blockGeometry, blockMaterial);
	block.position.set(500, 500, 500);
	scene.add(block);
    
    let homeMenu = null;
    
    let SpotLight2 = null;
    let helper2 = null;
    
    let isLoading = false;
    let targetView = null;
    
    
    const loader = new THREE.GLTFLoader();
    loader.load('/3d_object/footballStadium copy 5.glb', function (gltf) {
        const model = gltf.scene;
        scene.add(model);
        
        model.position.set(0, 0, 0);
        model.rotation.set(0, Math.PI / 1, 0);
        model.scale.set(1.7, 1.54, 2);

        //vue par defaut
        initializeDefaultView();
        
        document.addEventListener('keydown', function (event) {
            const moveSpeed = 10; // Vitesse de déplacement
            const rotateSpeed = Math.PI / 60; // Vitesse de rotation
			
            switch (event.key) {
                case "z":
						camera.position.z -= moveSpeed; // Avancer
						break;
                        case "s":
                            camera.position.z += moveSpeed; // Reculer
                            break;
                            case "q":
                                camera.position.x -= moveSpeed; // Aller à gauche
                                break;
                                case "d":
                                    camera.position.x += moveSpeed; // Aller à droite
                                    break;
                                    case "ArrowUp":
						camera.rotation.x -= rotateSpeed; // Rotation vers le haut
						break;
                        case "ArrowDown":
                            camera.rotation.x += rotateSpeed; // Rotation vers le bas
						break;
                        case "ArrowLeft":
						camera.rotation.y -= rotateSpeed; // Rotation vers la gauche
						break;
                        case "ArrowRight":
                            camera.rotation.y += rotateSpeed; // Rotation vers la droite
						break;
                    }
                    console.log(camera.position);
                });
    
        // Ajout des contrôles des paddles
        let keysPressed = {};
        let paddleSpeed = 2;
        
        // Événements pour enregistrer les touches pressées
        document.addEventListener('keydown', (event) => {
            keysPressed[event.key] = true;
        });
    
        document.addEventListener('keyup', (event) => {
            keysPressed[event.key] = false;
        });

        let lastRenderTime = 0;
        const fps = 60;
        const fpsInterval = 1000 / fps;
        
        function animate() {
            // console.log('Balle position:', ball.position);
            // console.log('Paddle droit position:', paddle_right.position);
            // console.log('Paddle gauche position:', paddle_left.position);
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            // console.log(window.currentView);
			// console.log(camera.position);
			// console.log(camera.rotation);
			// console.log(camera.position);

            const currentTime = Date.now();
            const elapsed = currentTime - lastRenderTime;
            if (elapsed > fpsInterval) {
                lastRenderTime = currentTime - (elapsed % fpsInterval);
                update();
            }
            
            
            if (keysPressed['w'] && paddle_right.position.x > border_top.position.x + 10) {
                paddle_right.position.x -= paddleSpeed;
            }
            if (keysPressed['s'] && paddle_right.position.x < border_bottom.position.x - 12) {
                paddle_right.position.x += paddleSpeed;
            }
    
            if (keysPressed['ArrowUp'] && paddle_left.position.x > border_top.position.x + 10) {
                paddle_left.position.x -= paddleSpeed;
            }
            if (keysPressed['ArrowDown'] && paddle_left.position.x < border_bottom.position.x - 12) {
                paddle_left.position.x += paddleSpeed;
            }
            animateBall();
        }
        animate();
    });
    
    // const lode = new THREE.GLTFLoader();
    // lode.load('/3d_object/persoTest.glb', function (gltf) {
    //     const model = gltf.scene;
    //     scene.add(model);
    
    //     model.position.set(500, 500, 500);
    //     model.rotation.set(0, 0, 0);
    //     model.scale.set(10, 10, 10);
    // });

	function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
	window.addEventListener('resize', onWindowResize, false);
    
})();
