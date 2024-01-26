"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authAdmin_controller_1 = require("../../../controllers/dashboard/auth/authAdmin.controller");
const isNotAuthonticate_1 = require("../../../middelwares/dashboard/isNotAuthonticate");
const authAdminValidation_1 = require("../../../validations/dashboard/auth/authAdminValidation");
const isAuthonticate_1 = require("../../../middelwares/dashboard/isAuthonticate");
class AuthAdminRoutes {
    constructor() {
        this.authAdminController = new authAdmin_controller_1.AuthAdminController();
        this.isAuthonticate = new isAuthonticate_1.IsAuthonticate();
        this.isNotAuthonticate = new isNotAuthonticate_1.IsNotAuthonticate();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("/login", this.isNotAuthonticate.isNotAuthonticate, this.authAdminController.login);
        this.Router.post("/login", this.isNotAuthonticate.isNotAuthonticate, new authAdminValidation_1.AuthAdminValidation().validation(), this.authAdminController.loginPost);
        this.Router.post("/logOut", this.isAuthonticate.isAuthonticate, this.authAdminController.logOut);
    }
}
exports.default = AuthAdminRoutes;
