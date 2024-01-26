"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = require("express");
const products_controllers_1 = require("../../controllers/dashboard/products.controllers");
const helper_1 = require("../../helpers/helper");
const isAuthonticate_1 = require("../../middelwares/dashboard/isAuthonticate");
const addValidation_1 = require("../../validations/dashboard/products/addValidation");
const editValidation_1 = require("../../validations/dashboard/products/editValidation");
class ProductRoutes {
    constructor() {
        this.filesOperations = new helper_1.FilesOperations();
        this.addProductValidation = new addValidation_1.AddProductValidation();
        this.updateProductValidation = new editValidation_1.UpdateProductValidation();
        this.productController = new products_controllers_1.ProductController();
        this.isAuthonticate = new isAuthonticate_1.IsAuthonticate();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("/", this.isAuthonticate.isAuthonticate, this.productController.findAll);
        this.Router.get("/create", this.isAuthonticate.isAuthonticate, this.productController.create);
        this.Router.post("/create", this.isAuthonticate.isAuthonticate, this.filesOperations.uploade_img_multi_fild([
            {
                name: "productImage",
            },
            {
                name: "descriptionImage",
            },
        ], "assets/dashboard/Products"), this.addProductValidation.validation(), this.productController.crearePost);
        this.Router.get("/update/:id", this.isAuthonticate.isAuthonticate, this.productController.update);
        this.Router.post("/update/:id", this.isAuthonticate.isAuthonticate, this.filesOperations.uploade_img_multi_fild([
            {
                name: "productImage",
            },
            {
                name: "descriptionImage",
            },
        ], "assets/dashboard/Products"), this.updateProductValidation.validation(), this.productController.updatePost);
        this.Router.post("/activation", this.isAuthonticate.isAuthonticate, this.productController.activation);
        this.Router.post("/delete", this.isAuthonticate.isAuthonticate, this.productController.deleteproduct);
    }
}
exports.ProductRoutes = ProductRoutes;
