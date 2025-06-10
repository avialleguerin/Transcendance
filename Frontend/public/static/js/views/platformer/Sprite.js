import { c } from './constants.js';

export default class Sprite {
    constructor({position, Image_src, scaleX = 1, scaleY = 1}) {
        this.position = position;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.image = new Image();
        this.loaded = false;
        this.width = 0;  // Initialisation
        this.height = 0; // Initialisation
        
        // Attendre que l'image soit chargée avant de dessiner
        this.image.onload = () => {
            this.loaded = true;
            this.width = this.image.width * this.scaleX;  // Calcul de la largeur
            this.height = this.image.height * this.scaleY; // Calcul de la hauteur

        };
        
        this.image.onerror = () => {
            console.error("Failed to load image:", Image_src);
        };
        
        // Définir la source après avoir configuré les gestionnaires d'événements
        this.image.src = Image_src;
    }

    draw() {
        if (!this.loaded) return;
        
        c.save();
        
        if (this.scaleX < 0) {
            // On inverse horizontalement
            c.translate(this.position.x + this.width, this.position.y);
            c.scale(-1, 1);
        } else {
            c.translate(this.position.x, this.position.y);
            c.scale(1, 1);
        }
    
        // On dessine à (0, 0) car on a déjà déplacé le contexte
        c.drawImage(
            this.image,
            0,
            0,
            this.width,
            this.height
        );
    
        c.restore();
    }

    update() {
        this.draw();
    }

    logStatus() {
        console.log("Image loaded status:", this.loaded);
        console.log("Image path:", this.image.src);
        console.log("Image dimensions:", this.width, this.height);
    }
}