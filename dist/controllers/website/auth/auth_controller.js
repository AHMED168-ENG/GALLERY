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
exports.AuthUserController = void 0;
const helper_1 = require("../../../helpers/helper");
const users_1 = __importDefault(require("../../../models/users"));
const roles_1 = require("../../../enums/roles");
const { validationResult } = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
class AuthUserController {
    constructor() { }
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.render("website/auth/signUp", {
                    title: "sign up",
                    validationError: req.flash("validationError")[0] || {},
                    notification: req.flash("notification")[0],
                    bodyData: req.flash("bodyData")[0],
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    signUpPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let errors = validationResult(req);
                const validationMessage = new helper_1.ValidationMessage();
                const fileOperations = new helper_1.FilesOperations();
                if (!errors.isEmpty()) {
                    validationMessage.handel_validation_errors(req, res, errors, "signUp");
                    fileOperations.removeImg(req, "Users");
                    return;
                }
                let image = fileOperations.Rename_uploade_img(req);
                let user_data = req.body;
                bcrypt_1.default.hash(user_data.password, 10, (error, hash) => {
                    user_data.password = hash;
                    user_data.roles = roles_1.Roles.User;
                    user_data.image = image;
                    user_data.active = user_data.active ? true : false;
                    users_1.default.create(user_data).then((result) => {
                        console.log(result);
                        validationMessage.returnWithMessage(req, res, "signUp", " تم تسجيلك كمستخدم جديد للتفاعل في الموقع تم ارسال رساله تاكيد في الموقع علي ايميل التسجيل", "success");
                    });
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.render("website/auth/signIn", {
                    title: "sign up",
                    validationError: req.flash("validationError")[0] || {},
                    notification: req.flash("notification"),
                    bodyData: req.flash("bodyData")[0],
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    signInPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationMessage = new helper_1.ValidationMessage();
                var Errors = validationResult(req);
                var userData = req.body;
                if (!Errors.isEmpty) {
                    validationMessage.handel_validation_errors(req, res, Errors.errors, "signIn");
                    return;
                }
                var user = yield users_1.default.findOne({
                    where: {
                        email: {
                            [sequelize_1.Op.eq]: userData.email,
                        },
                    },
                });
                var expire = !userData.rememberMe ? { maxAge: 86400000 } : {};
                var message = userData.rememberMe
                    ? "تم تسجيل دخولك بنجاح"
                    : "تم تسجيل دخولك بنجاح " +
                        "سوف يتم تسجيل الخروج تلقاءي بعد يوم من تسجيلك";
                res.cookie("User", user, expire);
                validationMessage.returnWithMessage(req, res, "/home", message, "success");
            }
            catch (error) {
                next(error);
            }
        });
    }
    activeUserPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationMessage = new helper_1.ValidationMessage();
                yield users_1.default.update({
                    active: true,
                }, {
                    where: {
                        id: req.params.id,
                    },
                });
                validationMessage.returnWithMessage(req, res, "/signIn", "تم تفعيلك كمستخدم قم بالتسجيل الان", "success");
            }
            catch (error) {
                next(error);
            }
        });
    }
    signOut(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("User");
                res.redirect("/signIn");
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthUserController = AuthUserController;
