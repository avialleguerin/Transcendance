import { createLoadingOverlay, removeLoadingOverlay } from './loading_screen.js';

const views = {
    default: {
        position: new BABYLON.Vector3(-45.79301951065982, 5.879735371044789, -31.342210947081313),
        rotation: new BABYLON.Vector3(-0.029665280069011667, -2.566387085794712, 0)
    },
    vue1: {
        position: new BABYLON.Vector3(-121.10280824924784, 24.6207952767514, -174.07209971938224),
        rotation: new BABYLON.Vector3(-0.11883037823762914, -2.5943873381271416, 0)
    },
    vue2: {
        position: new BABYLON.Vector3(-18.362079870354155, 108.25251269427612, 25.862876364155152),
        rotation: new BABYLON.Vector3(0.030709202934622, -3.1253471752812234, 0)
    },
    vue3: {
        position: new BABYLON.Vector3(-54.75561421839585, 323.8935256263618, -69.46923226717574),
        rotation: new BABYLON.Vector3(0.04110218558828448, -1.5940112517089828, 0)
    },
	vue4: {
		position: new BABYLON.Vector3(107.45137114956808, 350.16014619598326, -71.0351214961887),
		rotation: new BABYLON.Vector3(0.3689776126123451, -1.5805112517089825, 0)
	},
    aerienne: {
        position: new BABYLON.Vector3(0, 100, 0),
        rotation: new BABYLON.Vector3(Math.PI/2, 0, 0)
    }
};

let currentTransitionAnimation = null;
let isLoading = false;
let targetView = null;
// Fonction de transition améliorée avec courbe d'animation
export function smoothTransition(targetPosition, targetRotation, duration = 1.5) {
    // Annuler l'animation précédente si elle existe
    if (currentTransitionAnimation) {
        scene.onBeforeRenderObservable.remove(currentTransitionAnimation);
    }

    const startPosition = camera.position.clone();
    const startRotation = camera.rotation.clone();
    const startTime = performance.now();

    // Créer des vecteurs temporaires pour éviter la création d'objets pendant l'animation
    const tempPosition = new BABYLON.Vector3();
    const tempRotation = new BABYLON.Vector3();

    // Fonction d'ease (lissage)
    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    currentTransitionAnimation = scene.onBeforeRenderObservable.add(() => {
        const currentTime = performance.now();
        let t = (currentTime - startTime) / (duration * 1000);

        if (t >= 1) {
            camera.position.copyFrom(targetPosition);
            camera.rotation.copyFrom(targetRotation);
            scene.onBeforeRenderObservable.remove(currentTransitionAnimation);
            currentTransitionAnimation = null;
            return;
        }

        // Appliquer la fonction d'ease
        const easedT = easeInOutCubic(t);

        // Interpolation de la position
        BABYLON.Vector3.LerpToRef(startPosition, targetPosition, easedT, tempPosition);
        camera.position.copyFrom(tempPosition);

        // Interpolation de la rotation
        BABYLON.Vector3.LerpToRef(startRotation, targetRotation, easedT, tempRotation);
        camera.rotation.copyFrom(tempRotation);
    });
}


export function changeView(viewName, force = false) {
    const view = views[viewName];
    if (!view || (window.currentView === viewName && !force)) return;
    
    const previousView = window.currentView;
    if (!isLoading || force) {
        window.currentView = viewName;
        targetView = viewName;
        smoothTransition(view.position, view.rotation, 1.5);
    }
    
    if (!force) {
        handleViewTransitions(viewName, previousView);
    }
}

export function handleViewTransitions(viewName, previousView)
{
	if (isLoading)
		return;
    if (!previousView)
        previousView = 'default';

	if (viewName === 'vue1' && previousView === 'default')
	{
		changeView('vue1', true);
		setTimeout(() =>
		{
			window.currentView = 'vue1';
			createLoadingOverlay();
		}, 1500);
		setTimeout(() =>
		{
			changeView('vue2', true);
		}, 3500);
		setTimeout(() => removeLoadingOverlay(), 5000);
	}
	if (viewName === 'vue3' && previousView === 'vue2')
	{
		createLoadingOverlay();
		setTimeout(() =>
		{
			changeView('vue3', true);
			window.currentView = 'vue3';
		}, 1500);
		setTimeout(() => 
		{
			removeLoadingOverlay();
			changeView('vue4', true);
		}, 3500);
	}
    if (viewName === 'vue2' && previousView === 'vue4') {
        isLoading = true;
        changeView('vue3', true);
        setTimeout(() => {
            createLoadingOverlay();
        }, 1500);
        setTimeout(() => {
            changeView('vue2', true);
            window.currentView = 'vue2'; 
        }, 3500);
        
        setTimeout(() => {
            removeLoadingOverlay();
            isLoading = false;
        }, 5000);
    }
    if (viewName === 'vue1' && previousView === 'vue2')
    {
        console.log('je suis la ');
        isLoading = true;
        createLoadingOverlay();
        
        setTimeout(() => {
            changeView('vue1', true);
        }, 1500);
        setTimeout(() => {
            removeLoadingOverlay();
            changeView('default', true);
            isLoading = false;
        }, 3500);
    }
}