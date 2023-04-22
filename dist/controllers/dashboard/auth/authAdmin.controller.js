"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAdminController = void 0;
const express_validator_1 = require("express-validator");
const helper_1 = require("../../../helpers/helper");
const users_1 = __importDefault(require("../../../models/users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthAdminController {
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.render("dashboard/auth/signIn", {
                title: "Dashboard | Sign In",
                notification: req.flash("notification"),
                validationError: req.flash("validationError")[0] || {},
                bodyData: req.flash("bodyData")[0] || {},
            });
            try {
            }
            catch (error) {
                next(error);
            }
        });
    }
    loginPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationMessage = new helper_1.ValidationMessage();
                const Errors = (0, express_validator_1.validationResult)(req);
                if (!Errors.isEmpty()) {
                    validationMessage.handel_validation_errors(req, res, Errors.errors, "/dashboard/login");
                    return;
                }
                users_1.default
                    .findOne({
                    where: {
                        email: req.body.email,
                    },
                })
                    .then((result) => {
                    if (!result.active) {
                        validationMessage.returnWithMessage(req, res, "/dashboard/login", "You have been deactivated from the super admin", "danger");
                    }
                    else {
                        bcrypt_1.default.compare(req.body.password, result.password, (error, compering) => {
                            if (!compering) {
                                validationMessage.returnWithMessage(req, res, "/dashboard/login", "your password not True", "danger");
                            }
                            else {
                                var expire = !req.body.rememberMe ? { maxAge: 86400000 } : {};
                                var message = req.body.rememberMe
                                    ? "Logged in successfully"
                                    : "You have successfully logged in. You will be logged out of the site within 24 hours of your login.";
                                res.cookie("Admin", {
                                    id: result.id,
                                    email: result.email,
                                    roles: result.roles,
                                    fName: result.fName,
                                    lName: result.lName,
                                    image: result.image,
                                }, expire);
                                validationMessage.returnWithMessage(req, res, "/dashboard/", message, "success");
                            }
                        });
                    }
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    logOut(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("Admin");
                res.redirect("/dashboard/login");
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthAdminController = AuthAdminController;
