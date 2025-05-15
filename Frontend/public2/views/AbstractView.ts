export default abstract class AbstractView {
	protected title: string;

	constructor(title: string = "") {
		this.title = title;
	}

	setTitle(title: string): void {
		this.title = title;
		document.title = title;
	}

	abstract getHtml(): Promise<string>;
}
