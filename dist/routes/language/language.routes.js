"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageRoutes = void 0;
const express_1 = require("express");
const language_1 = require("../../controllers/language/language");
class LanguageRoutes {
    constructor() {
        this.languageController = new language_1.LanguageController();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.post("/set", this.languageController.setLanguage);
    }
}
exports.LanguageRoutes = LanguageRoutes;
