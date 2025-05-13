import { changeView } from './camera.js';
let loadingOverlay;
let isLoading = false;
let targetView = null;
export function createLoadingOverlay() {
    loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.innerHTML = `
		<link rel="stylesheet" href="./static/js/css/test.css">
		<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
		<h1>TRANSCENDENCE</h1>
		<div class="loading-container">
			<div class="progress-container">
				<div class="progress-bar"></div>
			</div>
		</div>
	`;
    console.log("Création de l'ovesssssssssssssssssssssssssssssssssssssssssssssssssrlay...");
    document.body.appendChild(loadingOverlay);
}
export function removeLoadingOverlay() {
    if (loadingOverlay) {
        console.log("Suppression de l'overlay...");
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            if (loadingOverlay && loadingOverlay.parentNode) {
                document.body.removeChild(loadingOverlay);
                loadingOverlay = null;
                console.log("Overlay supprimé");
            }
            isLoading = false;
            console.log("isLoading:", isLoading);
            if (targetView) {
                changeView(targetView);
                targetView = null;
            }
        }, 1000);
    }
}
{ /* <div class="loading-text">
Chargement<span>.</span><span>.</span><span>.</span>
</div> */
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGluZ19zY3JlZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wdWJsaWMvc3Jjcy9nYW1lL2dhbWVwbGF5L3ZpZXdzL2xvYWRpbmdfc2NyZWVuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFekMsSUFBSSxjQUFjLENBQUM7QUFDbkIsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3RCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztBQUV0QixNQUFNLFVBQVUsb0JBQW9CO0lBRW5DLGNBQWMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9DLGNBQWMsQ0FBQyxFQUFFLEdBQUcsZ0JBQWdCLENBQUM7SUFDckMsY0FBYyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7O0VBUzFCLENBQUM7SUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLDJFQUEyRSxDQUFDLENBQUM7SUFDekYsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDM0MsQ0FBQztBQUVELE1BQU0sVUFBVSxvQkFBb0I7SUFFbkMsSUFBSSxjQUFjLEVBQ2xCLENBQUM7UUFDQSxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDM0MsY0FBYyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25DLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFFZixJQUFJLGNBQWMsSUFBSSxjQUFjLENBQUMsVUFBVSxFQUMvQyxDQUFDO2dCQUNBLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUMxQyxjQUFjLEdBQUcsSUFBSSxDQUFDO2dCQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDakMsQ0FBQztZQUNELFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDckMsSUFBSSxVQUFVLEVBQ2QsQ0FBQztnQkFDQSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3ZCLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDbkIsQ0FBQztRQUNGLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNWLENBQUM7QUFDRixDQUFDO0FBRUQsQ0FBQyxDQUFBOztTQUVRO0FBQUEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoYW5nZVZpZXcgfSBmcm9tICcuL2NhbWVyYS5qcyc7XG5cbmxldCBsb2FkaW5nT3ZlcmxheTtcbmxldCBpc0xvYWRpbmcgPSBmYWxzZTtcbmxldCB0YXJnZXRWaWV3ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxvYWRpbmdPdmVybGF5KClcbntcblx0bG9hZGluZ092ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0bG9hZGluZ092ZXJsYXkuaWQgPSAnbG9hZGluZ092ZXJsYXknO1xuXHRsb2FkaW5nT3ZlcmxheS5pbm5lckhUTUwgPSBgXG5cdFx0PGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIuL3N0YXRpYy9qcy9jc3MvdGVzdC5jc3NcIj5cblx0XHQ8bGluayBocmVmPVwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1CbGFjaytPcHMrT25lJmRpc3BsYXk9c3dhcFwiIHJlbD1cInN0eWxlc2hlZXRcIj5cblx0XHQ8aDE+VFJBTlNDRU5ERU5DRTwvaDE+XG5cdFx0PGRpdiBjbGFzcz1cImxvYWRpbmctY29udGFpbmVyXCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY29udGFpbmVyXCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIj48L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2PlxuXHRgO1xuXHRjb25zb2xlLmxvZyhcIkNyw6lhdGlvbiBkZSBsJ292ZXNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3NybGF5Li4uXCIpO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxvYWRpbmdPdmVybGF5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUxvYWRpbmdPdmVybGF5KClcbntcblx0aWYgKGxvYWRpbmdPdmVybGF5KVxuXHR7XG5cdFx0Y29uc29sZS5sb2coXCJTdXBwcmVzc2lvbiBkZSBsJ292ZXJsYXkuLi5cIik7XG5cdFx0bG9hZGluZ092ZXJsYXkuc3R5bGUub3BhY2l0eSA9ICcwJztcblx0XHRzZXRUaW1lb3V0KCgpID0+XG5cdFx0e1xuXHRcdFx0aWYgKGxvYWRpbmdPdmVybGF5ICYmIGxvYWRpbmdPdmVybGF5LnBhcmVudE5vZGUpXG5cdFx0XHR7XG5cdFx0XHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobG9hZGluZ092ZXJsYXkpO1xuXHRcdFx0XHRsb2FkaW5nT3ZlcmxheSA9IG51bGw7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiT3ZlcmxheSBzdXBwcmltw6lcIik7XG5cdFx0XHR9XG5cdFx0XHRpc0xvYWRpbmcgPSBmYWxzZTtcblx0XHRcdGNvbnNvbGUubG9nKFwiaXNMb2FkaW5nOlwiLCBpc0xvYWRpbmcpO1xuXHRcdFx0aWYgKHRhcmdldFZpZXcpXG5cdFx0XHR7XG5cdFx0XHRcdGNoYW5nZVZpZXcodGFyZ2V0Vmlldyk7XG5cdFx0XHRcdHRhcmdldFZpZXcgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH0sIDEwMDApO1xuXHR9XG59XG5cbnsvKiA8ZGl2IGNsYXNzPVwibG9hZGluZy10ZXh0XCI+XG5DaGFyZ2VtZW50PHNwYW4+Ljwvc3Bhbj48c3Bhbj4uPC9zcGFuPjxzcGFuPi48L3NwYW4+XG48L2Rpdj4gKi99Il19