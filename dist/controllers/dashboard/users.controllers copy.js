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
exports.UserController = void 0;
const users_1 = __importDefault(require("../../models/users"));
const express_validator_1 = require("express-validator");
const helper_1 = require("../../helpers/helper");
const roles_1 = require("../../enums/roles");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
class UserController {
    constructor() { }
    findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPage;
                users_1.default
                    .findAndCountAll({
                    order: [["createdAt", "desc"]],
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: +PAGE_ITEMS,
                    where: {
                        roles: {
                            [sequelize_1.Op.eq]: roles_1.Roles.User,
                        },
                    },
                })
                    .then((result) => {
                    res.render("dashboard/users/all", {
                        title: "Dashboard | All Users",
                        notification: req.flash("notification"),
                        users: result.rows,
                        hasPrevious: page > 1,
                        hasNext: PAGE_ITEMS * page < result.count,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        curantPage: +page,
                        allElementCount: result.count,
                        elements: +PAGE_ITEMS,
                        lastPage: Math.ceil(result.count / PAGE_ITEMS),
                    });
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    findAllAdmins(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPage;
                users_1.default
                    .findAndCountAll({
                    order: [["createdAt", "desc"]],
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: +PAGE_ITEMS,
                    where: {
                        roles: {
                            [sequelize_1.Op.eq]: roles_1.Roles.Admin,
                        },
                    },
                })
                    .then((result) => {
                    res.render("dashboard/users/all", {
                        title: "Dashboard | All Users",
                        notification: req.flash("notification"),
                        users: result.rows,
                        hasPrevious: page > 1,
                        hasNext: PAGE_ITEMS * page < result.count,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        curantPage: +page,
                        allElementCount: result.count,
                        elements: +PAGE_ITEMS,
                        lastPage: Math.ceil(result.count / PAGE_ITEMS),
                    });
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.render("dashboard/users/create", {
                    title: "Dashboard | Create User",
                    notification: req.flash("notification"),
                    validationError: req.flash("validationError")[0] || {},
                    bodyData: req.flash("bodyData")[0] || {},
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    crearePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const error = (0, express_validator_1.validationResult)(req);
                const body = req.body;
                const filesOperations = new helper_1.FilesOperations();
                const validationMessage = new helper_1.ValidationMessage();
                if (!error.isEmpty()) {
                    filesOperations.removeImg(req, "Users");
                    validationMessage.handel_validation_errors(req, res, error.errors, "/dashboard/users/create");
                    return;
                }
                const file = filesOperations.Rename_uploade_img(req);
                bcrypt_1.default
                    .hash(body.password, +process.env.saltRounds)
                    .then((hashPassword) => {
                    body.active = body.active ? true : false;
                    body.roles = body.isAdmin ? roles_1.Roles.Admin : roles_1.Roles.User;
                    body.image = file;
                    body.password = hashPassword;
                    users_1.default
                        .create(body)
                        .then((result) => {
                        validationMessage.returnWithMessage(req, res, "/dashboard/users/", "user added successful", "success");
                    })
                        .catch((error) => error);
                })
                    .catch((error) => next(error));
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                users_1.default
                    .findOne({
                    where: {
                        id: req.params.id,
                    },
                })
                    .then((result) => {
                    res.render("dashboard/users/update", {
                        title: "Dashboard | Update User",
                        notification: req.flash("notification"),
                        validationError: req.flash("validationError")[0] || {},
                        userData: result,
                        bodyData: req.flash("bodyData")[0],
                    });
                })
                    .catch((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updatePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const error = (0, express_validator_1.validationResult)(req);
                const body = req.body;
                const filesOperations = new helper_1.FilesOperations();
                const validationMessage = new helper_1.ValidationMessage();
                if (!error.isEmpty()) {
                    filesOperations.removeImg(req, "Users");
                    validationMessage.handel_validation_errors(req, res, error.errors, "/dashboard/users/update/" + req.params.id);
                    return;
                }
                const file = filesOperations.Rename_uploade_img(req);
                if (file) {
                    filesOperations.removeImg(req, "Users", body.oldImage);
                    body.image = file;
                }
                else {
                    body.image = body.oldImage;
                }
                if (body.password) {
                    body.password = bcrypt_1.default.hashSync(body.password, +process.env.saltRounds);
                }
                else {
                    body.password = body.oldPassword;
                }
                body.active = body.active ? true : false;
                body.roles = body.isAdmin ? roles_1.Roles.Admin : roles_1.Roles.User;
                users_1.default
                    .update(body, {
                    where: {
                        id: req.params.id,
                    },
                })
                    .then((result) => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/users/update/" + req.params.id, "user updated successful", "success");
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updatePersonalData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                users_1.default
                    .findOne({
                    where: {
                        id: req.cookies.Admin.id,
                    },
                })
                    .then((result) => {
                    res.render("dashboard/users/updatePersonalInformation", {
                        title: "Dashboard | Update User",
                        notification: req.flash("notification"),
                        validationError: req.flash("validationError")[0] || {},
                        userData: result,
                        bodyData: req.flash("bodyData")[0],
                    });
                })
                    .catch((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updatePersonalDataPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.cookies.Admin;
                const error = (0, express_validator_1.validationResult)(req);
                const body = req.body;
                const filesOperations = new helper_1.FilesOperations();
                const validationMessage = new helper_1.ValidationMessage();
                if (!error.isEmpty()) {
                    filesOperations.removeImg(req, "Users");
                    validationMessage.handel_validation_errors(req, res, error.errors, "/dashboard/users/update-personal-data");
                    return;
                }
                const file = filesOperations.Rename_uploade_img(req);
                if (file) {
                    filesOperations.removeImg(req, "Users", body.oldImage);
                    body.image = file;
                }
                else {
                    body.image = body.oldImage;
                }
                if (body.password) {
                    body.password = bcrypt_1.default.hashSync(body.password, +process.env.saltRounds);
                }
                else {
                    body.password = body.oldPassword;
                }
                users_1.default
                    .update(body, {
                    where: {
                        id: id,
                    },
                })
                    .then((result) => {
                    res.clearCookie("Admin");
                    validationMessage.returnWithMessage(req, res, "/dashboard/login", "your data updated successful login again", "success");
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    activation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const validationMessage = new helper_1.ValidationMessage();
                users_1.default
                    .update({
                    active: body.status == "true" ? false : true,
                }, {
                    where: {
                        id: body.id,
                    },
                })
                    .then(() => {
                    let message = body.status == "true"
                        ? "The user has been deactivated successfully"
                        : "The user has been activated successfully";
                    validationMessage.returnWithMessage(req, res, "/dashboard/users/", message, "success");
                })
                    .catch((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const filesOperations = new helper_1.FilesOperations();
                const validationMessage = new helper_1.ValidationMessage();
                filesOperations.removeImg(req, "Users", body.image);
                users_1.default
                    .destroy({
                    where: {
                        id: body.id,
                    },
                })
                    .then(() => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/users/", "The user has been deleted successfully", "success");
                })
                    .then((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
