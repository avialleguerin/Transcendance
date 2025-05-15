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
var jouer = /** @class */ (function (_super) {
    __extends(jouer, _super);
    function jouer() {
        var _this = _super.call(this) || this;
        _this.setTitle("Jouer");
        return _this;
    }
    jouer.prototype.getHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, /*html*/ "\n\t\t<style>\n\t\t.container {\n\t\t\tposition: absolute;\n\t\t\ttop: 0%;\n\t\t\tleft: 0;\n\t\t\twidth: 35%;\n\t\t\theight: 60vh;\n\t\t\tdisplay: flex;\n\t\t\tflex-direction: column;\n\t\t\talign-items: flex-start;\n\t\t\tpadding-left: 15%;\n\t\t\tz-index: 1;\n\t\t\tpointer-events: auto;\n\t\t}\n\t\n\t\th1 {\n\t\t\t// margin-left: 30%;\n\t\t\tmargin-top: 10%;\n\t\t\tjustify-content: left;\n\t\t\tcolor: rgba(255, 255, 255, 1);\n\t\t\tfont-size: 2.5vw;\n\t\t\tmargin-bottom: 1em;\n\t\t\ttransform: translate(-50%, 0%);\n\t\t}\n\t\n\t\t.button-container {\n\t\t\tdisplay: flex;\n\t\t\tjustify-content: space-between;\n\t\t\tgap: 20%;\n\t\t\twidth: 60%;\n\t\t}\n\t\n\t\t.jouer, .settings {\n\t\t\tposition: relative;\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\twidth: 100%;\n\t\t}\n\t\n\t\t/* Image sous le bouton */\n\t\t// .jouer .btn-bg, .settings .btn-bg {\n\t\t// \tposition: absolute;\n\t\t// \ttop: 0;\n\t\t// \tleft: 0;\n\t\t// \twidth: 150%;\n\t\t// \theight: 150%;\n\t\t// \tbackground-size: cover;\n\t\t// \tbackground-repeat: no-repeat;\n\t\t// \tbackground-position: center;\n\t\t// \tz-index: -1; /* Derri\u00E8re le bouton */\n\t\t// }\n\t\n\t\t// .jouer .btn-bg {\n\t\t// \tbackground-image: url('/image/boutton.svg');\n\t\t// }\n\t\n\t\t// .settings .btn-bg {\n\t\t// \tbackground-image: url('/image/boutton2.svg');\n\t\t// }\n\t\n\t\t/* Bouton principal */\n\t\t.btn {\n\t\t\tposition: relative;\n\t\t\tmargin-top: 50%;\n\t\t\tz-index: 1;\n\t\t\tfont-size: 1vw;\n\t\t\tcolor: gray; /* Couleur par d\u00E9faut : gris */\n\t\t\tborder: none;\n\t\t\tcursor: pointer;\n\t\t\tbackground-color: transparent;\n\t\t\ttransition: color 0.3s ease; /* Transition douce pour le changement de couleur */\n\t\t}\n\t\t\n\t\t.btn:hover {\n\t\t\tcolor: white; /* Devient blanc au survol */\n\t\t}\n\t\n\t\t/* Image au-dessus du bouton */\n\t\t.jouer .btn-top, .settings .btn-top {\n\t\t\tposition: absolute;\n\t\t\ttop: 50%;\n\t\t\tleft: 50%;\n\t\t\ttransform: translate(-50%, 0%);\n\t\t\twidth: 100%; /* Taille de l'image */\n\t\t\theight: auto;\n\t\t\tz-index: 2;\n\t\t\tpointer-events: none;\n\t\t}\n\t</style>\n\t\n\t<div class=\"container\">\n\t\t<h1>Transcendence</h1>\n\t\t<div class=\"button-container\">\n\t\t\t<!-- Bouton Jouer -->\n\t\t\t<div class=\"jouer\">\n\t\t\t\t<div class=\"btn-bg\"></div> <!-- Image arri\u00E8re-plan -->\n\t\t\t\t<button class=\"btn\" data-link=\"/game\">Jouer</button>\n\t\t\t\t<img class=\"btn-top\" src=\"/image/boutton.svg\" alt=\"Ic\u00F4ne Jouer\"> <!-- Image au-dessus -->\n\t\t\t</div>\n\t\t\t<!-- Bouton Param\u00E8tres -->\n\t\t\t<div class=\"settings\">\n\t\t\t\t<div class=\"btn-bg\"></div> <!-- Image arri\u00E8re-plan -->\n\t\t\t\t<button class=\"btn\" data-link>Param\u00E8tres</button>\n\t\t\t\t<img class=\"btn-top\" src=\"/image/boutton.svg\" alt=\"Ic\u00F4ne Param\u00E8tres\"> <!-- Image au-dessus -->\n\t\t\t</div>\n\t\t</div>\n\t</div>"];
            });
        });
    };
    return jouer;
}(AbstractView_js_1.default));
exports.default = jouer;
