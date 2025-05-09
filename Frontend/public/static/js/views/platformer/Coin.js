import { c } from "./constants.js";
import Sprite from "./Sprite.js";

export default class Coin extends Sprite {
    constructor({ position, Image_src_prefix, width = 50, height = 50 }) {
        super({ position, Image_src: Image_src_prefix + "coin_0.png", scaleX: 0.6, scaleY: 0.6 });
        this.initialPosition = { x: position.x, y: position.y }; // 👈 sauvegarde
        this.position = { x: position.x, y: position.y }; // on crée une copie
        this.Image_src_prefix = Image_src_prefix;
        this.frames = 0;
        this.frameSpeed = 10;
        this.currentSprite = 0;
        this.totalSprites = 8;
        this.state = "idle";
        
        // Cache des images
        this.imageCache = [];
        this.preloadImages();
    }
    
    // Précharger toutes les images pour éviter les problèmes de chargement
    preloadImages() {
        for (let i = 0; i < this.totalSprites; i++) {
            const img = new Image();
            img.src = `${this.Image_src_prefix}coin_${i}.png`;
            this.imageCache[i] = img;
        }
    }
    
    updateCurrentImage() {
        // Utiliser l'image du cache au lieu d'en créer une nouvelle
        if (this.imageCache[this.currentSprite]) {
            this.image = this.imageCache[this.currentSprite];
        }
    }

    changeSprite() {
        if (this.frames % this.frameSpeed === 0) {
            this.currentSprite++;
            if (this.currentSprite >= this.totalSprites) {
                this.currentSprite = 0;
            }
            this.updateCurrentImage();
        }
        this.frames = (this.frames + 1) % 1000;
    }

    update() {
        this.changeSprite();
        this.draw();
        // this.drawBoxCollision();
    }

    drawBoxCollision() {
        c.fillStyle = "rgba(255, 0, 0, 0.5)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    checkCollision(player) {
        const hitboxOffsetX = 60;
        const hitboxOffsetY = 90;
        const hitboxOffsetBottom = 25;
    
        const hitboxX = player.position.x + hitboxOffsetX;
        const hitboxY = player.position.y + hitboxOffsetY;
        const hitboxWidth = player.width - hitboxOffsetX * 2;
        const hitboxHeight = player.height - hitboxOffsetY - hitboxOffsetBottom;
    
        // Vérifie l'intersection entre la hitbox du joueur et la boîte
        const collision = hitboxX < this.position.x + this.width &&
                        hitboxX + hitboxWidth > this.position.x &&
                        hitboxY < this.position.y + this.height &&
                        hitboxY + hitboxHeight > this.position.y;
    
        return collision;
    }

    destroy() {
        this.position.x = -100;
        this.position.y = -100;
        this.width = 0;
        this.height = 0;
    }

    Reset_coin() {
        console.log("Reset coin");
        this.position.x = this.initialPosition.x;
        this.position.y = this.initialPosition.y;
        this.width = this.image.width * this.scaleX;  // Calcul de la largeur
        this.height = this.image.height * this.scaleY; // Calcul de la hauteur     
        this.scaleX = 0.6;
        this.scaleY = 0.6;
        this.frames = 0;
        this.currentSprite = 0;
        this.state = "idle";
        this.updateCurrentImage(); // Assurez-vous que l'image est mise à jour
        console.log(this.position.x, this.position.y);
    }
}