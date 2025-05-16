export default class AbstractView {
    constructor(title = "") {
        this.title = title;
    }
    setTitle(title) {
        this.title = title;
        document.title = title;
    }
}