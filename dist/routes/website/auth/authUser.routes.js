"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../../controllers/website/auth/auth_controller");
const userAuthonticate_1 = require("../../../middelwares/websit/userAuthonticate");
const signInUserValidation_1 = require("../../../validations/website/auth/signInUserValidation");
const signUpUserValidation_1 = require("../../../validations/website/auth/signUpUserValidation");
const helper_1 = require("../../../helpers/helper");
const userNotAuthonticat_1 = require("../../../middelwares/websit/userNotAuthonticat");
class AuthUserRoutes {
    constructor() {
        this.authUserController = new auth_controller_1.AuthUserController();
        this.userAuthonticat = new userAuthonticate_1.UserAuthonticat();
        this.userNotAuthonticat = new userNotAuthonticat_1.UserNotAuthonticat();
        this.signInUserValidation = new signInUserValidation_1.SignInUserValidation();
        this.signUpUserValidation = new signUpUserValidation_1.SignUpUserValidation();
        this.filesOperations = new helper_1.FilesOperations();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("/signIn", this.userNotAuthonticat.isNotAuthonticate, this.authUserController.signIn);
        this.Router.post("/signIn", this.signInUserValidation.validation(), this.userNotAuthonticat.isNotAuthonticate, this.authUserController.signInPost);
        this.Router.get("/signUp", this.userNotAuthonticat.isNotAuthonticate, this.authUserController.signUp);
        this.Router.post("/signUp", this.signUpUserValidation.validation(), this.filesOperations.uploade_img("assets/dashboard/User", "image"), this.userNotAuthonticat.isNotAuthonticate, this.authUserController.signUpPost);
        this.Router.post("/signOut", this.userAuthonticat.isAuthonticate, this.authUserController.signOut);
    }
}
exports.default = AuthUserRoutes;
