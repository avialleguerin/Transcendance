import Platform from './Platform.js';
import Sprite from './Sprite.js';

export function createLevelFromMap(levelMap, tileSize = 32) {
	const platforms = [];
	const rows = levelMap.trim().split('\n');
	
	for (let y = 0; y < rows.length; y++) {
		for (let x = 0; x < rows[y].length; x++) {
			const char = rows[y][x];
			
			if (char === '#') {
				platforms.push(
					new Platform({
						position: { x: x * tileSize, y: y * tileSize },
						width: tileSize,
						height: tileSize,
						image: new Sprite({
							position: { x: x * tileSize, y: y * tileSize },
							Image_src: '/srcs/game/assets/City/wall.png',
							scaleX: 1,
							scaleY: 1,
						}),
					})
				);
			}
			if (char === '2') {
				platforms.push(
					new Platform({
						position: { x: x * tileSize, y: y * tileSize },
						width: tileSize,
						height: tileSize,
						image: new Sprite({
							position: { x: x * tileSize, y: y * tileSize },
							Image_src: '/srcs/game/assets/City/wall.png',
							scaleX: 1,
							scaleY: 1,
						}),
					})
				);
			}
			if (char === '1') {
				platforms.push(
					new Platform({
						position: { x: x * tileSize, y: y * tileSize },
						width: tileSize,
						height: tileSize,
						image: new Sprite({
							position: { x: x * tileSize, y: y * tileSize },
							Image_src: '/srcs/game/assets/City/pltformV2.png',
							scaleX: 1,
							scaleY: 1,
						}),
					})
				);
			}
			if (char === '3') {
				platforms.push(
					new Platform({
						position: { x: x * tileSize, y: y * tileSize },
						width: tileSize,
						height: tileSize,
						image: new Sprite({
							position: { x: x * tileSize, y: y * tileSize },
							Image_src: '/srcs/game/assets/City/trap.png',
							scaleX: 1,
							scaleY: 1,
						}),
					})
				);
			}
		}
	}
	return platforms;
}