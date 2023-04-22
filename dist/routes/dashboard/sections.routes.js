"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionsRoutes = void 0;
const express_1 = require("express");
const isAuthonticate_1 = require("../../middelwares/dashboard/isAuthonticate");
const frontSections_controller_1 = require("../../controllers/dashboard/frontSections.controller");
const stateSection_1 = require("../../validations/dashboard/frontSections/stateSection");
class SectionsRoutes {
    constructor() {
        this.isAuthonticate = new isAuthonticate_1.IsAuthonticate();
        this.frontSectionController = new frontSections_controller_1.FrontSectionController();
        this.statsSectionsValidation = new stateSection_1.StatsSectionsValidation();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("/stats-section", this.isAuthonticate.isAuthonticate, this.frontSectionController.stateSection);
        this.Router.post("/stats-section", this.isAuthonticate.isAuthonticate, this.statsSectionsValidation.validation(), this.frontSectionController.stateSectionPost);
    }
}
exports.SectionsRoutes = SectionsRoutes;
