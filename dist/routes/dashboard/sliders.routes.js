"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlidersRoutes = void 0;
const express_1 = require("express");
const helper_1 = require("../../helpers/helper");
const isAuthonticate_1 = require("../../middelwares/dashboard/isAuthonticate");
const addValidation_1 = require("../../validations/dashboard/sliders/addValidation");
const editValidation_1 = require("../../validations/dashboard/sliders/editValidation");
const sliders_controllers_1 = require("../../controllers/dashboard/sliders.controllers");
class SlidersRoutes {
    constructor() {
        this.filesOperations = new helper_1.FilesOperations();
        this.addSliderValidation = new addValidation_1.AddSliderValidation();
        this.updateSliderValidation = new editValidation_1.UpdateSliderValidation();
        this.slidersController = new sliders_controllers_1.SlidersController();
        this.isAuthonticate = new isAuthonticate_1.IsAuthonticate();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("/", this.isAuthonticate.isAuthonticate, this.slidersController.findAll);
        this.Router.get("/create", this.isAuthonticate.isAuthonticate, this.slidersController.create);
        this.Router.post("/create", this.isAuthonticate.isAuthonticate, this.filesOperations.uploade_img("assets/dashboard/Sliders", "image"), this.addSliderValidation.validation(), this.slidersController.crearePost);
        this.Router.get("/update/:id", this.isAuthonticate.isAuthonticate, this.slidersController.update);
        this.Router.post("/update/:id", this.isAuthonticate.isAuthonticate, this.filesOperations.uploade_img("assets/dashboard/Sliders", "image"), this.updateSliderValidation.validation(), this.slidersController.updatePost);
        this.Router.post("/activation", this.isAuthonticate.isAuthonticate, this.slidersController.activation);
        this.Router.post("/delete", this.isAuthonticate.isAuthonticate, this.slidersController.deleteSlider);
    }
}
exports.SlidersRoutes = SlidersRoutes;
