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
    console.log("Creation of the overlay...");
    document.body.appendChild(loadingOverlay);
}
export function removeLoadingOverlay() {
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            if (loadingOverlay && loadingOverlay.parentNode) {
                document.body.removeChild(loadingOverlay);
                loadingOverlay = null;
            }
            isLoading = false;
            if (targetView) {
                changeView(targetView);
                targetView = null;
            }
        }, 1000);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGluZ19zY3JlZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wdWJsaWMvc3Jjcy9nYW1lL2dhbWVwbGF5L3ZpZXdzL2xvYWRpbmdfc2NyZWVuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFekMsSUFBSSxjQUFjLENBQUM7QUFDbkIsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3RCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztBQUV0QixNQUFNLFVBQVUsb0JBQW9CO0lBRW5DLGNBQWMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9DLGNBQWMsQ0FBQyxFQUFFLEdBQUcsZ0JBQWdCLENBQUM7SUFDckMsY0FBYyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7O0VBUzFCLENBQUM7SUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFDMUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDM0MsQ0FBQztBQUVELE1BQU0sVUFBVSxvQkFBb0I7SUFFbkMsSUFBSSxjQUFjLEVBQ2xCLENBQUM7UUFDQSxjQUFjLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDbkMsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUVmLElBQUksY0FBYyxJQUFJLGNBQWMsQ0FBQyxVQUFVLEVBQy9DLENBQUM7Z0JBQ0EsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQzFDLGNBQWMsR0FBRyxJQUFJLENBQUM7WUFDdkIsQ0FBQztZQUNELFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDbEIsSUFBSSxVQUFVLEVBQ2QsQ0FBQztnQkFDQSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3ZCLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDbkIsQ0FBQztRQUNGLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNWLENBQUM7QUFDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hhbmdlVmlldyB9IGZyb20gJy4vY2FtZXJhLmpzJztcblxubGV0IGxvYWRpbmdPdmVybGF5O1xubGV0IGlzTG9hZGluZyA9IGZhbHNlO1xubGV0IHRhcmdldFZpZXcgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTG9hZGluZ092ZXJsYXkoKVxue1xuXHRsb2FkaW5nT3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRsb2FkaW5nT3ZlcmxheS5pZCA9ICdsb2FkaW5nT3ZlcmxheSc7XG5cdGxvYWRpbmdPdmVybGF5LmlubmVySFRNTCA9IGBcblx0XHQ8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIi4vc3RhdGljL2pzL2Nzcy90ZXN0LmNzc1wiPlxuXHRcdDxsaW5rIGhyZWY9XCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUJsYWNrK09wcytPbmUmZGlzcGxheT1zd2FwXCIgcmVsPVwic3R5bGVzaGVldFwiPlxuXHRcdDxoMT5UUkFOU0NFTkRFTkNFPC9oMT5cblx0XHQ8ZGl2IGNsYXNzPVwibG9hZGluZy1jb250YWluZXJcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jb250YWluZXJcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiPjwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+XG5cdGA7XG5cdGNvbnNvbGUubG9nKFwiQ3JlYXRpb24gb2YgdGhlIG92ZXJsYXkuLi5cIik7XG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobG9hZGluZ092ZXJsYXkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlTG9hZGluZ092ZXJsYXkoKVxue1xuXHRpZiAobG9hZGluZ092ZXJsYXkpXG5cdHtcblx0XHRsb2FkaW5nT3ZlcmxheS5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuXHRcdHNldFRpbWVvdXQoKCkgPT5cblx0XHR7XG5cdFx0XHRpZiAobG9hZGluZ092ZXJsYXkgJiYgbG9hZGluZ092ZXJsYXkucGFyZW50Tm9kZSlcblx0XHRcdHtcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsb2FkaW5nT3ZlcmxheSk7XG5cdFx0XHRcdGxvYWRpbmdPdmVybGF5ID0gbnVsbDtcblx0XHRcdH1cblx0XHRcdGlzTG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0aWYgKHRhcmdldFZpZXcpXG5cdFx0XHR7XG5cdFx0XHRcdGNoYW5nZVZpZXcodGFyZ2V0Vmlldyk7XG5cdFx0XHRcdHRhcmdldFZpZXcgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH0sIDEwMDApO1xuXHR9XG59XG4iXX0=