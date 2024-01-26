"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
const language_routes_1 = require("./language.routes");
class InitLanguage {
    constructor(myApp) {
        this.myApp = myApp;
        this.router();
    }
    router() {
        i18next_1.default
            .use(i18next_fs_backend_1.default)
            .use(i18next_http_middleware_1.default.LanguageDetector)
            .init({
            fallbackLng: "en",
            backend: {
                loadPath: `./locales/{{lng}}/translation.json`,
            },
            detection: {
                order: ["cookie", "querystring", "header"],
                lookupCookie: "lng",
                lookupQuerystring: "lng",
                caches: ["cookie"],
            },
        });
        this.myApp.use(i18next_http_middleware_1.default.handle(i18next_1.default));
        this.myApp.use("/language", new language_routes_1.LanguageRoutes().Router);
    }
}
exports.default = InitLanguage;
