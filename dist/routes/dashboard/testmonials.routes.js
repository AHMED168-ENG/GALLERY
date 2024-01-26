"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestmonialRoutes = void 0;
const express_1 = require("express");
const helper_1 = require("../../helpers/helper");
const isAuthonticate_1 = require("../../middelwares/dashboard/isAuthonticate");
const testmonials_controllers_1 = require("../../controllers/dashboard/testmonials.controllers");
class TestmonialRoutes {
    constructor() {
        this.filesOperations = new helper_1.FilesOperations();
        this.isAuthonticate = new isAuthonticate_1.IsAuthonticate();
        this.testmonialsController = new testmonials_controllers_1.TestmonialsController();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("/", this.isAuthonticate.isAuthonticate, this.testmonialsController.findAll);
        this.Router.get("/show/:id", this.isAuthonticate.isAuthonticate, this.testmonialsController.showTestmonial);
        this.Router.post("/show/:id", this.isAuthonticate.isAuthonticate, this.testmonialsController.showTestmonialPost);
        this.Router.post("/activation", this.isAuthonticate.isAuthonticate, this.testmonialsController.activation);
        this.Router.post("/delete", this.isAuthonticate.isAuthonticate, this.testmonialsController.deleteTestmonial);
    }
}
exports.TestmonialRoutes = TestmonialRoutes;
