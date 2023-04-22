"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryRoutes = void 0;
const express_1 = require("express");
const isAuthonticate_1 = require("../../middelwares/dashboard/isAuthonticate");
const gallery_controllers_1 = require("../../controllers/dashboard/gallery.controllers");
const editValidation_1 = require("../../validations/dashboard/gallery/editValidation");
const addValidation_1 = require("../../validations/dashboard/gallery/addValidation");
class GalleryRoutes {
    constructor() {
        this.updateGalleryValidation = new editValidation_1.UpdateGalleryValidation();
        this.addGalleryValidation = new addValidation_1.AddGalleryValidation();
        this.galleryController = new gallery_controllers_1.GalleryController();
        this.isAuthonticate = new isAuthonticate_1.IsAuthonticate();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("/", this.isAuthonticate.isAuthonticate, this.galleryController.findAll);
        this.Router.get("/create", this.isAuthonticate.isAuthonticate, this.galleryController.create);
        this.Router.post("/create", this.isAuthonticate.isAuthonticate, this.addGalleryValidation.validation(), this.galleryController.crearePost);
        this.Router.get("/update/:id", this.isAuthonticate.isAuthonticate, this.galleryController.update);
        this.Router.post("/update/:id", this.isAuthonticate.isAuthonticate, this.updateGalleryValidation.validation(), this.galleryController.updatePost);
        this.Router.post("/activation", this.isAuthonticate.isAuthonticate, this.galleryController.activation);
        this.Router.post("/delete", this.isAuthonticate.isAuthonticate, this.galleryController.deleteImage);
    }
}
exports.GalleryRoutes = GalleryRoutes;
