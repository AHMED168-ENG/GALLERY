"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pages_routes_1 = __importDefault(require("./pages.routes"));
const authUser_routes_1 = __importDefault(require("./auth/authUser.routes"));
const helper_1 = require("../../helpers/helper");
class AllSiteRoutes {
    constructor(myApp) {
        this.myApp = myApp;
        this.startFunction = new helper_1.StartActions();
        this.router();
    }
    router() {
        this.myApp.use("/", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield this.startFunction.startFunctionForSite(req, res, req.url, req.csrfToken());
            next();
        }));
        this.myApp.use("/", new pages_routes_1.default().Router);
        this.myApp.use("/", new authUser_routes_1.default().Router);
    }
}
exports.default = AllSiteRoutes;
