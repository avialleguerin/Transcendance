import { c } from './constants.js';

export default class Platform {
    constructor({ position, width, height, image = null }) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.image = image;
    }
    
    draw() {
        if (this.image && this.image.loaded) {
            // Utiliser directement l'image de Sprite
            c.drawImage(
                this.image.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
        } else {
            // Dessiner un rectangle si pas d'image ou si l'image n'est pas chargée
            c.fillStyle = "black";
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }
}