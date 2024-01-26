"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuthonticate_1 = require("../../middelwares/dashboard/isAuthonticate");
class DashboardRoutes {
    constructor(dashboardController) {
        this.dashboardController = dashboardController;
        this.dashboardController = dashboardController;
        this.isAuthonticate = new isAuthonticate_1.IsAuthonticate();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("", this.isAuthonticate.isAuthonticate, this.dashboardController.dashboard);
    }
}
exports.default = DashboardRoutes;
