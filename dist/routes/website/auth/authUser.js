"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pages_routes_1 = __importDefault(require("./pages.routes"));
class AuthUserRoutes {
    constructor(myApp) {
        this.myApp = myApp;
        this.router();
    }
    router() {
        this.myApp.use("/", new pages_routes_1.default().Router);
    }
}
exports.default = AllSiteRoutes;
