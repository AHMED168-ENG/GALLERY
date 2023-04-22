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
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const dashboard_controller_1 = __importDefault(require("../../controllers/dashboard/dashboard.controller"));
const user_routes_1 = require("./user.routes");
const authAdmin_routes_1 = __importDefault(require("./auth/authAdmin.routes"));
const mainCategory_routes_1 = require("./mainCategory.routes");
const supCategory_routes_1 = require("./supCategory.routes");
const products_routes_1 = require("./products.routes");
const sliders_routes_1 = require("./sliders.routes");
const appSetting_routes_1 = require("./appSetting.routes");
const faqs_routes_1 = require("./faqs.routes");
const helper_1 = require("../../helpers/helper");
const comments_routes_1 = __importDefault(require("./comments.routes"));
const testmonials_routes_1 = require("./testmonials.routes");
const orders_routes_1 = require("./orders.routes");
const messages_routes_1 = require("./messages.routes");
const gallery_routes_1 = require("./gallery.routes");
const sections_routes_1 = require("./sections.routes");
class AllDashboardRoutes {
    constructor(myApp) {
        this.myApp = myApp;
        this.startFunction = new helper_1.StartActions();
        this.router();
    }
    router() {
        this.myApp.use("/dashboard", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.url);
            yield this.startFunction.startFunctionForDashboard(req, res, req.url, req.csrfToken());
            next();
        }));
        this.myApp.use("/dashboard", new authAdmin_routes_1.default().Router);
        this.myApp.use("/dashboard/users", new user_routes_1.UserRoutes().Router);
        this.myApp.use("/dashboard/main-categorys", new mainCategory_routes_1.CategoryRoutes().Router);
        this.myApp.use("/dashboard/sup-categorys", new supCategory_routes_1.SupCategoryRoutes().Router);
        this.myApp.use("/dashboard/products", new products_routes_1.ProductRoutes().Router);
        this.myApp.use("/dashboard/sliders", new sliders_routes_1.SlidersRoutes().Router);
        this.myApp.use("/dashboard/app-setting", new appSetting_routes_1.AppSettingRoutes().Router);
        this.myApp.use("/dashboard/questions", new faqs_routes_1.FaqsRoutes().Router);
        this.myApp.use("/dashboard/comments", new comments_routes_1.default().Router);
        this.myApp.use("/dashboard/testmonials", new testmonials_routes_1.TestmonialRoutes().Router);
        this.myApp.use("/dashboard/orders", new orders_routes_1.OrdersRoutes().Router);
        this.myApp.use("/dashboard/messages", new messages_routes_1.MessagesRoutes().Router);
        this.myApp.use("/dashboard/gallery", new gallery_routes_1.GalleryRoutes().Router);
        this.myApp.use("/dashboard/front-sections", new sections_routes_1.SectionsRoutes().Router);
        this.myApp.use("/dashboard", new dashboard_routes_1.default(new dashboard_controller_1.default()).Router);
    }
}
exports.default = AllDashboardRoutes;
