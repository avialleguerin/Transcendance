import Platform from './Platform.js';
import Sprite from './Sprite.js';
export function createLevelFromMap(levelMap, tileSize = 32) {
    const platforms = [];
    const rows = levelMap.trim().split('\n');
    for (let y = 0; y < rows.length; y++) {
        for (let x = 0; x < rows[y].length; x++) {
            const char = rows[y][x];
            if (char === '#') {
                platforms.push(new Platform({
                    position: { x: x * tileSize, y: y * tileSize },
                    width: tileSize,
                    height: tileSize,
                    image: new Sprite({
                        position: { x: x * tileSize, y: y * tileSize },
                        Image_src: '/srcs/game/assets/City/wall.png',
                        scaleX: 1,
                        scaleY: 1,
                    }),
                }));
            }
            if (char === '2') {
                platforms.push(new Platform({
                    position: { x: x * tileSize, y: y * tileSize },
                    width: tileSize,
                    height: tileSize,
                    image: new Sprite({
                        position: { x: x * tileSize, y: y * tileSize },
                        Image_src: '/srcs/game/assets/City/wall.png',
                        scaleX: 1,
                        scaleY: 1,
                    }),
                }));
            }
            if (char === '1') {
                platforms.push(new Platform({
                    position: { x: x * tileSize, y: y * tileSize },
                    width: tileSize,
                    height: tileSize,
                    image: new Sprite({
                        position: { x: x * tileSize, y: y * tileSize },
                        Image_src: '/srcs/game/assets/City/pltformV2.png',
                        scaleX: 1,
                        scaleY: 1,
                    }),
                }));
            }
            if (char === '3') {
                platforms.push(new Platform({
                    position: { x: x * tileSize, y: y * tileSize },
                    width: tileSize,
                    height: tileSize,
                    image: new Sprite({
                        position: { x: x * tileSize, y: y * tileSize },
                        Image_src: '/srcs/game/assets/City/trap.png',
                        scaleX: 1,
                        scaleY: 1,
                    }),
                }));
            }
            if (char === '4') {
                platforms.push(new Platform({
                    position: { x: x * tileSize, y: y * tileSize },
                    width: tileSize,
                    height: tileSize,
                    image: new Sprite({
                        position: { x: x * tileSize, y: y * tileSize },
                        Image_src: '/srcs/game/assets/City/sol5.png',
                        scaleX: 1,
                        scaleY: 1,
                    }),
                }));
            }
        }
    }
    return platforms;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV2ZWxfbWFwX3V0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHVibGljL3N0YXRpYy9qcy92aWV3cy9wbGF0Zm9ybWVyL2xldmVsX21hcF91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFFBQVEsTUFBTSxlQUFlLENBQUM7QUFDckMsT0FBTyxNQUFNLE1BQU0sYUFBYSxDQUFDO0FBRWpDLE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsUUFBUSxHQUFHLEVBQUU7SUFDekQsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFekMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUN0QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3pDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV4QixJQUFJLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFDbEIsU0FBUyxDQUFDLElBQUksQ0FDYixJQUFJLFFBQVEsQ0FBQztvQkFDWixRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRTtvQkFDOUMsS0FBSyxFQUFFLFFBQVE7b0JBQ2YsTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLEtBQUssRUFBRSxJQUFJLE1BQU0sQ0FBQzt3QkFDakIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FB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Q0FBQztxQkFDVCxDQUFDO2lCQUNGLENBQUMsQ0FDRixDQUFDO1lBQ0gsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQbGF0Zm9ybSBmcm9tICcuL1BsYXRmb3JtLmpzJztcbmltcG9ydCBTcHJpdGUgZnJvbSAnLi9TcHJpdGUuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTGV2ZWxGcm9tTWFwKGxldmVsTWFwLCB0aWxlU2l6ZSA9IDMyKSB7XG5cdGNvbnN0IHBsYXRmb3JtcyA9IFtdO1xuXHRjb25zdCByb3dzID0gbGV2ZWxNYXAudHJpbSgpLnNwbGl0KCdcXG4nKTtcblx0XG5cdGZvciAobGV0IHkgPSAwOyB5IDwgcm93cy5sZW5ndGg7IHkrKykge1xuXHRcdGZvciAobGV0IHggPSAwOyB4IDwgcm93c1t5XS5sZW5ndGg7IHgrKykge1xuXHRcdFx0Y29uc3QgY2hhciA9IHJvd3NbeV1beF07XG5cdFx0XHRcblx0XHRcdGlmIChjaGFyID09PSAnIycpIHtcblx0XHRcdFx0cGxhdGZvcm1zLnB1c2goXG5cdFx0XHRcdFx0bmV3IFBsYXRmb3JtKHtcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiB7IHg6IHggKiB0aWxlU2l6ZSwgeTogeSAqIHRpbGVTaXplIH0sXG5cdFx0XHRcdFx0XHR3aWR0aDogdGlsZVNpemUsXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IHRpbGVTaXplLFxuXHRcdFx0XHRcdFx0aW1hZ2U6IG5ldyBTcHJpdGUoe1xuXHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogeyB4OiB4ICogdGlsZVNpemUsIHk6IHkgKiB0aWxlU2l6ZSB9LFxuXHRcdFx0XHRcdFx0XHRJbWFnZV9zcmM6ICcvc3Jjcy9nYW1lL2Fzc2V0cy9DaXR5L3dhbGwucG5nJyxcblx0XHRcdFx0XHRcdFx0c2NhbGVYOiAxLFxuXHRcdFx0XHRcdFx0XHRzY2FsZVk6IDEsXG5cdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGNoYXIgPT09ICcyJykge1xuXHRcdFx0XHRwbGF0Zm9ybXMucHVzaChcblx0XHRcdFx0XHRuZXcgUGxhdGZvcm0oe1xuXHRcdFx0XHRcdFx0cG9zaXRpb246IHsgeDogeCAqIHRpbGVTaXplLCB5OiB5ICogdGlsZVNpemUgfSxcblx0XHRcdFx0XHRcdHdpZHRoOiB0aWxlU2l6ZSxcblx0XHRcdFx0XHRcdGhlaWdodDogdGlsZVNpemUsXG5cdFx0XHRcdFx0XHRpbWFnZTogbmV3IFNwcml0ZSh7XG5cdFx0XHRcdFx0XHRcdHBvc2l0aW9uOiB7IHg6IHggKiB0aWxlU2l6ZSwgeTogeSAqIHRpbGVTaXplIH0sXG5cdFx0XHRcdFx0XHRcdEltYWdlX3NyYzogJy9zcmNzL2dhbWUvYXNzZXRzL0NpdHkvd2FsbC5wbmcnLFxuXHRcdFx0XHRcdFx0XHRzY2FsZVg6IDEsXG5cdFx0XHRcdFx0XHRcdHNjYWxlWTogMSxcblx0XHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY2hhciA9PT0gJzEnKSB7XG5cdFx0XHRcdHBsYXRmb3Jtcy5wdXNoKFxuXHRcdFx0XHRcdG5ldyBQbGF0Zm9ybSh7XG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogeyB4OiB4ICogdGlsZVNpemUsIHk6IHkgKiB0aWxlU2l6ZSB9LFxuXHRcdFx0XHRcdFx0d2lkdGg6IHRpbGVTaXplLFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiB0aWxlU2l6ZSxcblx0XHRcdFx0XHRcdGltYWdlOiBuZXcgU3ByaXRlKHtcblx0XHRcdFx0XHRcdFx0cG9zaXRpb246IHsgeDogeCAqIHRpbGVTaXplLCB5OiB5ICogdGlsZVNpemUgfSxcblx0XHRcdFx0XHRcdFx0SW1hZ2Vfc3JjOiAnL3NyY3MvZ2FtZS9hc3NldHMvQ2l0eS9wbHRmb3JtVjIucG5nJyxcblx0XHRcdFx0XHRcdFx0c2NhbGVYOiAxLFxuXHRcdFx0XHRcdFx0XHRzY2FsZVk6IDEsXG5cdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGNoYXIgPT09ICczJykge1xuXHRcdFx0XHRwbGF0Zm9ybXMucHVzaChcblx0XHRcdFx0XHRuZXcgUGxhdGZvcm0oe1xuXHRcdFx0XHRcdFx0cG9zaXRpb246IHsgeDogeCAqIHRpbGVTaXplLCB5OiB5ICogdGlsZVNpemUgfSxcblx0XHRcdFx0XHRcdHdpZHRoOiB0aWxlU2l6ZSxcblx0XHRcdFx0XHRcdGhlaWdodDogdGlsZVNpemUsXG5cdFx0XHRcdFx0XHRpbWFnZTogbmV3IFNwcml0ZSh7XG5cdFx0XHRcdFx0XHRcdHBvc2l0aW9uOiB7IHg6IHggKiB0aWxlU2l6ZSwgeTogeSAqIHRpbGVTaXplIH0sXG5cdFx0XHRcdFx0XHRcdEltYWdlX3NyYzogJy9zcmNzL2dhbWUvYXNzZXRzL0NpdHkvdHJhcC5wbmcnLFxuXHRcdFx0XHRcdFx0XHRzY2FsZVg6IDEsXG5cdFx0XHRcdFx0XHRcdHNjYWxlWTogMSxcblx0XHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY2hhciA9PT0gJzQnKSB7XG5cdFx0XHRcdHBsYXRmb3Jtcy5wdXNoKFxuXHRcdFx0XHRcdG5ldyBQbGF0Zm9ybSh7XG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogeyB4OiB4ICogdGlsZVNpemUsIHk6IHkgKiB0aWxlU2l6ZSB9LFxuXHRcdFx0XHRcdFx0d2lkdGg6IHRpbGVTaXplLFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiB0aWxlU2l6ZSxcblx0XHRcdFx0XHRcdGltYWdlOiBuZXcgU3ByaXRlKHtcblx0XHRcdFx0XHRcdFx0cG9zaXRpb246IHsgeDogeCAqIHRpbGVTaXplLCB5OiB5ICogdGlsZVNpemUgfSxcblx0XHRcdFx0XHRcdFx0SW1hZ2Vfc3JjOiAnL3NyY3MvZ2FtZS9hc3NldHMvQ2l0eS9zb2w1LnBuZycsXG5cdFx0XHRcdFx0XHRcdHNjYWxlWDogMSxcblx0XHRcdFx0XHRcdFx0c2NhbGVZOiAxLFxuXHRcdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIHBsYXRmb3Jtcztcbn0iXX0=