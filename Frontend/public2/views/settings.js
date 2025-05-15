"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractView_js_1 = require("./AbstractView.js");
var default_1 = /** @class */ (function (_super) {
    __extends(default_1, _super);
    function default_1() {
        var _this = _super.call(this) || this;
        _this.setTitle("Settings");
        return _this;
    }
    default_1.prototype.getHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, /*html*/ "\n\t\t\t<style>\n\t\t\t.container {\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: 0%;\n\t\t\t\tleft: 0;\n\t\t\t\twidth: 35%;\n\t\t\t\theight: 60vh;\n\t\t\t\tdisplay: flex;\n\t\t\t\tflex-direction: column;\n\t\t\t\talign-items: flex-start;\n\t\t\t\tpadding-left: 15%;\n\t\t\t\tz-index: 1;\n\t\t\t\tpointer-events: auto;\n\t\t\t}\n\t\t\t\n\t\t\th1 {\n\t\t\t\tmargin-left: 30%;\n\t\t\t\tmargin-top: 10%;\n\t\t\t\tcolor: rgba(255, 255, 255, 1);\n\t\t\t\tfont-size: 5em;\n\t\t\t\tmargin-bottom: 1em;\n\t\t\t}\n\t\t\t\n\t\t\t.button-container {\n\t\t\t\tdisplay: flex;\n\t\t\t\t// width: %;\n\t\t\t\tjustify-content: space-between;\n\t\t\t\tpading-right: 10%;\n\t\t\t}\n\t\t\t\n\t\t\t.btn {\n\t\t\t\twidth: 100%;\n\t\t\t\tpadding: 0.75rem;\n\t\t\t\tbackground-color: rgba(255, 255, 255, 0.1);\n\t\t\t\tcolor: white;\n\t\t\t\tborder: none;\n\t\t\t\tborder-radius: 4px;\n\t\t\t\tcursor: pointer;\n\t\t\t\tfont-size: 2.5em;\n\t\t\t\ttext-align: center;\n\t\t\t\ttransition: background-color 0.3s ease;\n\t\t\t}\n\t\t\t\n\t\t\t.btn:hover {\n\t\t\t\tbackground-color: rgba(255, 255, 255, 0.2);\n\t\t\t}\n\n\t\t\t</style>\n\n\t\t\t<div class=\"container\">\n\t\t\t<h1>menu</h1>\n\t\t\t<div class=\"button-container\">\n\t\t\t\t<div class=\"jouer\">\n\t\t\t\t\t<button class=\"btn\" data-link=\"/game\">Jouer</button>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"settings\">\n\t\t\t\t\t// <button class=\"btn\" class=\"nav--link\" data-link>Param\u00E8tres</button>\n\t\t\t\t\t<button href=\"/settings\" class=\"nav--link\" data-link>Param\u00E8tres</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t"];
            });
        });
    };
    return default_1;
}(AbstractView_js_1.default));
exports.default = default_1;
