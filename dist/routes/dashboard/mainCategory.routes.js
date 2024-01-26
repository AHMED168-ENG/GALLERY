"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = require("express");
const mainCategorys_controllers_1 = require("../../controllers/dashboard/mainCategorys.controllers");
const helper_1 = require("../../helpers/helper");
const isAuthonticate_1 = require("../../middelwares/dashboard/isAuthonticate");
const editValidation_1 = require("../../validations/dashboard/mainCategory/editValidation");
const addValidation_1 = require("../../validations/dashboard/mainCategory/addValidation");
class CategoryRoutes {
    constructor() {
        this.filesOperations = new helper_1.FilesOperations();
        this.addMainCategoryValidation = new addValidation_1.AddMainCategoryValidation();
        this.updateMainCategoryValidation = new editValidation_1.UpdateMainCategoryValidation();
        this.mainCategoryController = new mainCategorys_controllers_1.MainCategoryController();
        this.isAuthonticate = new isAuthonticate_1.IsAuthonticate();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("/", this.isAuthonticate.isAuthonticate, this.mainCategoryController.findAll);
        this.Router.get("/create", this.isAuthonticate.isAuthonticate, this.mainCategoryController.create);
        this.Router.post("/create", this.isAuthonticate.isAuthonticate, this.filesOperations.uploade_img("assets/dashboard/Categorys", "image"), this.addMainCategoryValidation.validation(), this.mainCategoryController.crearePost);
        this.Router.get("/update/:id", this.isAuthonticate.isAuthonticate, this.mainCategoryController.update);
        this.Router.post("/update/:id", this.isAuthonticate.isAuthonticate, this.filesOperations.uploade_img("assets/dashboard/Categorys", "image"), this.updateMainCategoryValidation.validation(), this.mainCategoryController.updatePost);
        this.Router.post("/activation", this.isAuthonticate.isAuthonticate, this.mainCategoryController.activation);
        this.Router.post("/delete", this.isAuthonticate.isAuthonticate, this.mainCategoryController.deleteCategory);
    }
}
exports.CategoryRoutes = CategoryRoutes;
