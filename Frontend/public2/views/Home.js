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
// import { handleViewTransitions } from "../../../srcs/game/gameplay/views/camera.js";
// import Game_menu from "./Game_menu.js";
var Home = /** @class */ (function (_super) {
    __extends(Home, _super);
    function Home() {
        var _this = _super.call(this) || this;
        _this.setTitle("Home");
        var accessToken = sessionStorage.getItem("accessToken");
        if (accessToken) {
            history.pushState({}, '', '/Game_menu');
            Promise.resolve().then(function () { return require('./Game_menu.js'); }).then(function (module) {
                var GameMenu = module.default;
                var gameMenuInstance = new GameMenu();
                gameMenuInstance.getHtml().then(function (html) {
                    document.getElementById('app').innerHTML = html;
                    if (gameMenuInstance.game_menu) {
                        gameMenuInstance.game_menu();
                    }
                });
            });
            // handleViewTransitions("vue1", "vue2");
        }
        return _this;
    }
    Home.prototype.getHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, /*html*/ "\n    \t<link rel=\"stylesheet\" href=\"./static/js/css/home.css\">\n\t\t\t<link href=\"https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap\" rel=\"stylesheet\">\n\t\t\t<div class=\"container\">\n\t\t\t\t<div class=\"title\">\n\t\t\t\t\t<h1> TRANSCENDENCE </h1>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"login-form\" id=\"loginform_id\">\n\t\t\t\t\t<h1>LOGIN</h1>\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<form id=\"loginForm\" onsubmit=\"login(event)\">\n\t\t\t\t\t\t<div class=\"input-container\">\n\t\t\t\t\t\t\t<label for=\"email\">Email :</label>\n\t\t\t\t\t\t\t\t<input type=\"email\" id=\"login-email\" name=\"email\" placeholder=\"Your email\" required>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div class=\"input-container\">\n\t\t\t\t\t\t\t<label for=\"password\">Password :</label>\n\t\t\t\t\t\t\t<input type=\"password\" id=\"login-password\" name=\"password\" placeholder=\"Your password\" required>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button type=\"submit\" class=\"connexion\">Login</button>\n\t\t\t\t\t\t</form>\n\t\t\t\t\t\t<button class=\"creer-compte\" id=\"create-Account\">Create an account</button>\n\t\t\t\t\t\t<p id=\"login-resultMessage\" style=\"color:white\"></p>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"register-form\" id=\"create_account_id\">\n\t\t\t\t\t<h1>SIGN IN</h1>\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<form id=\"addForm\" onsubmit=\"register(event)\">\n\t\t\t\t\t\t<div class=\"input-container\">\n\t\t\t\t\t\t\t<label for=\"username\">Username :</label>\n\t\t\t\t\t\t\t<input type=\"text\" id=\"add-username\" name=\"username\" placeholder=\"Your username\" required>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div class=\"input-container\">\n\t\t\t\t\t\t\t<label for=\"email\">Email :</label>\n\t\t\t\t\t\t\t<input type=\"email\" id=\"add-email\" name=\"email\" placeholder=\"Your email\" required>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div class=\"input-container\">\n\t\t\t\t\t\t\t<label for=\"password\">Password :</label>\n\t\t\t\t\t\t\t<input type=\"password\" id=\"add-password\" name=\"password\" placeholder=\"Your password\" required>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div class=\"input-container\">\n\t\t\t\t\t\t\t<label for=\"confirm-password\">Confirm password :</label>\n\t\t\t\t\t\t\t<input type=\"password\" id=\"add-confirm-password\" name=\"password\" placeholder=\"Confirm your password\" required>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button type=\"submit\" class=\"connexion\">Sign In</button>\n\t\t\t\t\t</form>\n\t\t\t\t\t\t<button class=\"connexion\" id=\"alreadyHaveAccountButton_id\">Already have an account ?</button>\n\t\t\t\t\t\t<p id=\"add-resultMessage\" style=\"color:white\"></p>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n    "];
            });
        });
    };
    Home.prototype.createAccount = function () {
        console.log("createAccount");
        var loginForm = document.getElementById("loginform_id");
        var createAccountForm = document.getElementById("create_account_id");
        var createAccountButton = document.getElementById("create-Account");
        var alreadyHaveAccountButton = document.getElementById("alreadyHaveAccountButton_id");
        createAccountButton.addEventListener("click", function () {
            console.log("createAccountForm");
            loginForm.classList.add("active");
            createAccountForm.classList.add("active");
            document.getElementById("login-email").value = "";
            document.getElementById("login-password").value = "";
            document.getElementById("login-resultMessage").textContent = "";
        });
        alreadyHaveAccountButton.addEventListener("click", function () {
            console.log("loginForm");
            createAccountForm.classList.remove("active");
            loginForm.classList.remove("active");
            document.getElementById("add-username").value = "";
            document.getElementById("add-email").value = "";
            document.getElementById("add-password").value = "";
            document.getElementById("add-confirm-password").value = "";
            document.getElementById("add-resultMessage").textContent = "";
        });
    };
    return Home;
}(AbstractView_js_1.default));
exports.default = Home;
