"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../../controllers/website/auth/auth_controller");
const userAuthonticate_1 = require("../../../middelwares/websit/userAuthonticate");
const signInUserValidation_1 = require("../../../validations/website/auth/signInUserValidation");
const signUpUserValidation_1 = require("../../../validations/website/auth/signUpUserValidation");
const helper_1 = require("../../../helpers/helper");
const userNotAuthonticat_1 = require("../../../middelwares/websit/userNotAuthonticat");
const resetPassword_validation_1 = require("../../../validations/website/auth/resetPassword.validation");
const updatePasswordPassword_validation_1 = require("../../../validations/website/auth/updatePasswordPassword.validation");
class AuthUserRoutes {
    constructor() {
        this.authUserController = new auth_controller_1.AuthUserController();
        this.userAuthonticat = new userAuthonticate_1.UserAuthonticat();
        this.userNotAuthonticat = new userNotAuthonticat_1.UserNotAuthonticat();
        this.resetPasswordValidation = new resetPassword_validation_1.ResetPasswordValidation();
        this.updatePasswordValidation = new updatePasswordPassword_validation_1.UpdatePasswordValidation();
        this.signInUserValidation = new signInUserValidation_1.SignInUserValidation();
        this.signUpUserValidation = new signUpUserValidation_1.SignUpUserValidation();
        this.filesOperations = new helper_1.FilesOperations();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("/signIn", this.userNotAuthonticat.isNotAuthonticate, this.authUserController.signIn);
        this.Router.post("/signIn", this.userNotAuthonticat.isNotAuthonticate, this.signInUserValidation.validation(), this.authUserController.signInPost);
        this.Router.get("/signUp", this.userNotAuthonticat.isNotAuthonticate, this.authUserController.signUp);
        this.Router.post("/signUp", this.userNotAuthonticat.isNotAuthonticate, this.filesOperations.uploade_img("assets/dashboard/Users", "image"), this.signUpUserValidation.validation(), this.authUserController.signUpPost);
        this.Router.post("/signOut", this.userAuthonticat.isAuthonticate, this.authUserController.signOut);
        this.Router.get("/reset-password", this.userNotAuthonticat.isNotAuthonticate, this.authUserController.resetPassword);
        this.Router.post("/reset-password", this.userNotAuthonticat.isNotAuthonticate, this.resetPasswordValidation.validation(), this.authUserController.resetPasswordPost);
        this.Router.get("/update-password/:token", this.userNotAuthonticat.isNotAuthonticate, this.authUserController.updatePassword);
        this.Router.post("/update-password/:token", this.userNotAuthonticat.isNotAuthonticate, this.updatePasswordValidation.validation(), this.authUserController.updatePasswordPost);
    }
}
exports.default = AuthUserRoutes;
