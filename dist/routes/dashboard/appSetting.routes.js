"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSettingRoutes = void 0;
const express_1 = require("express");
const helper_1 = require("../../helpers/helper");
const isAuthonticate_1 = require("../../middelwares/dashboard/isAuthonticate");
const appSeting_controller_1 = require("../../controllers/dashboard/appSeting.controller");
class AppSettingRoutes {
    constructor() {
        this.filesOperations = new helper_1.FilesOperations();
        this.appSettingController = new appSeting_controller_1.AppSettingController();
        this.isAuthonticate = new isAuthonticate_1.IsAuthonticate();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("/", this.isAuthonticate.isAuthonticate, this.appSettingController.find);
        this.Router.post("/", this.isAuthonticate.isAuthonticate, this.filesOperations.uploade_img("assets/dashboard/AppSetting", "logo"), this.appSettingController.updatePost);
    }
}
exports.AppSettingRoutes = AppSettingRoutes;
