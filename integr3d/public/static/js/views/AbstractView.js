export default class {
	constructor() {
		this.title = '';
	}

	setTitle(title) {
		this.title = title;
		document.title = title;
	}

	async getHtml() {
		return '';
	}
}