"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const users_controllers_1 = require("../../controllers/dashboard/users.controllers");
const helper_1 = require("../../helpers/helper");
const addValidation_1 = require("../../validations/dashboard/users/addValidation");
const editValidation_1 = require("../../validations/dashboard/users/editValidation");
const updatePersonalDataValidation_1 = require("../../validations/dashboard/users/updatePersonalDataValidation");
const isAuthonticate_1 = require("../../middelwares/dashboard/isAuthonticate");
class UserRoutes {
    constructor() {
        this.filesOperations = new helper_1.FilesOperations();
        this.addUserValidation = new addValidation_1.AddUserValidation();
        this.updateUserValidation = new editValidation_1.UpdateUserValidation();
        this.updatePersonalDataValidation = new updatePersonalDataValidation_1.UpdatePersonalDataValidation();
        this.userController = new users_controllers_1.UserController();
        this.isAuthonticate = new isAuthonticate_1.IsAuthonticate();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("/", this.isAuthonticate.isAuthonticate, this.userController.findAll);
        this.Router.get("/admins", this.isAuthonticate.isAuthonticate, this.userController.findAllAdmins);
        this.Router.get("/create", this.isAuthonticate.isAuthonticate, this.userController.create);
        this.Router.post("/create", this.isAuthonticate.isAuthonticate, this.filesOperations.uploade_img("assets/dashboard/Users", "image"), this.addUserValidation.validation(), this.userController.crearePost);
        this.Router.get("/update/:id", this.isAuthonticate.isAuthonticate, this.userController.update);
        this.Router.post("/update/:id", this.isAuthonticate.isAuthonticate, this.filesOperations.uploade_img("assets/dashboard/Users", "image"), this.updateUserValidation.validation(), this.userController.updatePost);
        this.Router.get("/update-personal-data", this.isAuthonticate.isAuthonticate, this.userController.updatePersonalData);
        this.Router.post("/update-personal-data", this.isAuthonticate.isAuthonticate, this.filesOperations.uploade_img("assets/dashboard/Users", "image"), this.updatePersonalDataValidation.validation(), this.userController.updatePersonalDataPost);
        this.Router.post("/activation", this.isAuthonticate.isAuthonticate, this.userController.activation);
        this.Router.post("/delete", this.isAuthonticate.isAuthonticate, this.userController.deleteUser);
    }
}
exports.UserRoutes = UserRoutes;
