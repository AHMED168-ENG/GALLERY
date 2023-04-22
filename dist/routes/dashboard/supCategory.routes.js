"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupCategoryRoutes = void 0;
const express_1 = require("express");
const supCategorys_controllers_1 = require("../../controllers/dashboard/supCategorys.controllers");
const helper_1 = require("../../helpers/helper");
const isAuthonticate_1 = require("../../middelwares/dashboard/isAuthonticate");
const addValidation_1 = require("../../validations/dashboard/supCategory/addValidation");
const editValidation_1 = require("../../validations/dashboard/supCategory/editValidation");
class SupCategoryRoutes {
    constructor() {
        this.filesOperations = new helper_1.FilesOperations();
        this.addSupCategoryValidation = new addValidation_1.AddSupCategoryValidation();
        this.updateSupCategoryValidation = new editValidation_1.UpdateSupCategoryValidation();
        this.supCategoryController = new supCategorys_controllers_1.SupCategoryController();
        this.isAuthonticate = new isAuthonticate_1.IsAuthonticate();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("/", this.isAuthonticate.isAuthonticate, this.supCategoryController.findAll);
        this.Router.post("/getMainCatigoryAjax/:id", this.isAuthonticate.isAuthonticate, this.supCategoryController.getMainCatigoryAjax);
        this.Router.get("/create", this.isAuthonticate.isAuthonticate, this.supCategoryController.create);
        this.Router.post("/create", this.isAuthonticate.isAuthonticate, this.filesOperations.uploade_img("assets/dashboard/Categorys", "image"), this.addSupCategoryValidation.validation(), this.supCategoryController.crearePost);
        this.Router.get("/update/:id", this.isAuthonticate.isAuthonticate, this.supCategoryController.update);
        this.Router.post("/update/:id", this.isAuthonticate.isAuthonticate, this.filesOperations.uploade_img("assets/dashboard/Categorys", "image"), this.updateSupCategoryValidation.validation(), this.supCategoryController.updatePost);
        this.Router.post("/activation", this.isAuthonticate.isAuthonticate, this.supCategoryController.activation);
        this.Router.post("/delete", this.isAuthonticate.isAuthonticate, this.supCategoryController.deleteSupCategory);
    }
}
exports.SupCategoryRoutes = SupCategoryRoutes;
