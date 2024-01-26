"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqsRoutes = void 0;
const express_1 = require("express");
const isAuthonticate_1 = require("../../middelwares/dashboard/isAuthonticate");
const faqs_controllers_1 = require("../../controllers/dashboard/faqs.controllers");
const addValidation_1 = require("../../validations/dashboard/faqs/addValidation");
const editValidation_1 = require("../../validations/dashboard/faqs/editValidation");
class FaqsRoutes {
    constructor() {
        this.addFaqsValidation = new addValidation_1.AddFaqsValidation();
        this.updateFaqsValidation = new editValidation_1.UpdateFaqsValidation();
        this.faqsController = new faqs_controllers_1.FaqsController();
        this.isAuthonticate = new isAuthonticate_1.IsAuthonticate();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("/", this.isAuthonticate.isAuthonticate, this.faqsController.findAll);
        this.Router.get("/create", this.isAuthonticate.isAuthonticate, this.faqsController.create);
        this.Router.post("/create", this.isAuthonticate.isAuthonticate, this.addFaqsValidation.validation(), this.faqsController.crearePost);
        this.Router.get("/update/:id", this.isAuthonticate.isAuthonticate, this.faqsController.update);
        this.Router.post("/update/:id", this.isAuthonticate.isAuthonticate, this.updateFaqsValidation.validation(), this.faqsController.updatePost);
        this.Router.post("/activation", this.isAuthonticate.isAuthonticate, this.faqsController.activation);
        this.Router.post("/delete", this.isAuthonticate.isAuthonticate, this.faqsController.deleteFaqs);
    }
}
exports.FaqsRoutes = FaqsRoutes;
