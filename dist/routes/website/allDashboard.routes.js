"use strict";
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
class AllDashboardRoutes {
    constructor(myApp) {
        this.myApp = myApp;
        this.router();
    }
    router() {
        this.myApp.use("/dashboard", new authAdmin_routes_1.default().Router);
        this.myApp.use("/dashboard/users", new user_routes_1.UserRoutes().Router);
        this.myApp.use("/dashboard/main-categorys", new mainCategory_routes_1.CategoryRoutes().Router);
        this.myApp.use("/dashboard/sup-categorys", new supCategory_routes_1.SupCategoryRoutes().Router);
        this.myApp.use("/dashboard/products", new products_routes_1.ProductRoutes().Router);
        this.myApp.use("/dashboard", new dashboard_routes_1.default(new dashboard_controller_1.default()).Router);
    }
}
exports.default = AllDashboardRoutes;
