"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractView = /** @class */ (function () {
    function AbstractView(title) {
        if (title === void 0) { title = ""; }
        this.title = title;
    }
    AbstractView.prototype.setTitle = function (title) {
        this.title = title;
        document.title = title;
    };
    return AbstractView;
}());
exports.default = AbstractView;
