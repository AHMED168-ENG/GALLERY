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
const crypto_1 = __importDefault(require("crypto"));
const appSeting_1 = __importDefault(require("../../../models/appSeting"));
const sendEmails_1 = require("../../../mails/sendEmails");
class AuthUserController {
    constructor() { }
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.render("website/auth/signUp", {
                    title: "SignUp",
                    validationError: req.flash("validationError")[0] || {},
                    notification: req.flash("notification"),
                    bodyData: req.flash("bodyData")[0] || {},
                    metaDescription: null,
                    metaKeywords: null,
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
                const sendMails = new sendEmails_1.SendMails();
                let Errors = validationResult(req);
                const validationMessage = new helper_1.ValidationMessage();
                const fileOperations = new helper_1.FilesOperations();
                if (!Errors.isEmpty()) {
                    validationMessage.handel_validation_errors(req, res, Errors.errors, "signUp");
                    fileOperations.removeImg(req, "Users");
                    return;
                }
                let image = fileOperations.Rename_uploade_img(req);
                let user_data = req.body;
                bcrypt_1.default.hash(user_data.password, +process.env.saltRounds, (error, hash) => {
                    user_data.password = hash;
                    user_data.roles = roles_1.Roles.User;
                    user_data.image = image;
                    user_data.active = user_data.active ? true : false;
                    users_1.default.create(user_data).then((result) => {
                        sendMails.send(user_data.email, user_data.fName, user_data.lName, "تم اضافه حساب خاص بك كمستخدم قم بالتفعيل من هنا", "activeUserPage");
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
                    title: "SignIn",
                    validationError: req.flash("validationError")[0] || {},
                    notification: req.flash("notification"),
                    bodyData: req.flash("bodyData")[0],
                    metaDescription: null,
                    metaKeywords: null,
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
                if (!Errors.isEmpty()) {
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
                console.log(user);
                var expire = !userData.rememberMe ? { maxAge: 86400000 } : {};
                res.cookie("User", user, expire);
                res.redirect("/home");
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
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.render("website/auth/resetPassword", {
                    title: "resetPassword",
                    validationError: req.flash("validationError")[0] || {},
                    notification: req.flash("notification"),
                    bodyData: req.flash("bodyData")[0] || {},
                    metaDescription: null,
                    metaKeywords: null,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    resetPasswordPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const lng = req.cookies.lng;
                const validationMessage = new helper_1.ValidationMessage();
                const sendMails = new sendEmails_1.SendMails();
                const Errors = validationResult(req);
                if (!Errors.isEmpty()) {
                    validationMessage.handel_validation_errors(req, res, Errors.errors, "/reset-password");
                    return;
                }
                crypto_1.default.randomBytes(32, (error, buf) => __awaiter(this, void 0, void 0, function* () {
                    const token = buf.toString("hex");
                    if (error) {
                        next(error);
                    }
                    else {
                        const user = yield users_1.default.findOne({
                            where: {
                                email: body.email,
                            },
                        });
                        const appName = yield appSeting_1.default.findOne({
                            attributes: ["sitName_en"],
                        });
                        users_1.default.update({
                            resetToken: token,
                            resetTokenExpiration: Date.now() +
                                +process.env.TIME_OF_ResetPassword * 60 * 60 * 1000,
                        }, {
                            where: {
                                email: body.email,
                            },
                        });
                        sendMails.send(user.email, user.fName, user.lName, `reset your password in ${appName.sitName_en}`, process.env.SIT_LINK + "update-password/" + token);
                        let message = lng != "ar"
                            ? "We have sent you an email to complete the process"
                            : "لقد قمنا بارسال رساله لك علي الجميل لتكمله العملي";
                        validationMessage.returnWithMessage(req, res, "/reset-password", message, "success");
                    }
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    updatePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.params.token;
                const user = yield users_1.default.findOne({
                    where: {
                        resetToken: token,
                        resetTokenExpiration: { [sequelize_1.Op.gt]: Date.now() },
                    },
                });
                if (!user) {
                    res.redirect("/reset-password");
                }
                else {
                    res.render("website/auth/updatePassword", {
                        title: "updatePassword",
                        validationError: req.flash("validationError")[0] || {},
                        notification: req.flash("notification"),
                        bodyData: req.flash("bodyData")[0] || {},
                        metaDescription: null,
                        metaKeywords: null,
                        userId: user.id,
                        token: token,
                    });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    updatePasswordPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const lng = req.cookies.lng;
                const validationMessage = new helper_1.ValidationMessage();
                const sendMails = new sendEmails_1.SendMails();
                const user = yield users_1.default.findOne({
                    where: {
                        resetToken: body.token,
                        id: body.userId,
                        resetTokenExpiration: { [sequelize_1.Op.gt]: Date.now() },
                    },
                });
                if (!user) {
                    return res.redirect("/reset-password");
                }
                else {
                    const Errors = validationResult(req);
                    if (!Errors.isEmpty()) {
                        validationMessage.handel_validation_errors(req, res, Errors.errors, "/update-password/" + body.token);
                        return;
                    }
                    const appName = yield appSeting_1.default.findOne({
                        attributes: ["sitName_en"],
                    });
                    const hashPassword = bcrypt_1.default.hashSync(body.password, +process.env.saltRounds);
                    users_1.default.update({
                        password: hashPassword,
                        resetToken: null,
                        resetTokenExpiration: 0,
                    }, {
                        where: {
                            id: body.userId,
                            resetToken: body.token,
                        },
                    });
                    sendMails.send(user.email, user.fName, user.lName, `your password updated successful in ${appName.sitName_en} account`);
                    let message = lng != "ar"
                        ? "Your account password has been modified successfully"
                        : "تم تعديل الرقم السري الخاص بحسابك بنجاح";
                    validationMessage.returnWithMessage(req, res, "/signIn", message, "success");
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthUserController = AuthUserController;
