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
exports.MainCategoryController = void 0;
const express_validator_1 = require("express-validator");
const helper_1 = require("../../helpers/helper");
const sequelize_1 = require("sequelize");
const slugify_1 = __importDefault(require("slugify"));
const charmap_1 = __importDefault(require("../../charmap"));
slugify_1.default.extend(charmap_1.default);
const categorys_1 = __importDefault(require("../../models/categorys"));
class MainCategoryController {
    constructor() { }
    findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPage;
                categorys_1.default
                    .findAndCountAll({
                    order: [["createdAt", "desc"]],
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: +PAGE_ITEMS,
                    where: {
                        mainCatigory: { [sequelize_1.Op.eq]: null },
                    },
                })
                    .then((result) => {
                    res.render("dashboard/mainCategorys/all", {
                        title: "Dashboard | All main Categorys",
                        notification: req.flash("notification"),
                        mainCategorys: result.rows,
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
                res.render("dashboard/mainCategorys/create", {
                    title: "Dashboard | Create Main Categorys",
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
                    filesOperations.removeImg(req, "Categorys");
                    validationMessage.handel_validation_errors(req, res, error.errors, "/dashboard/main-categorys/create");
                    return;
                }
                const file = filesOperations.Rename_uploade_img(req);
                body.slug_ar = (0, slugify_1.default)(body.category_ar, {
                    remove: /[$*_+~.()'"!\-:@]+/g,
                });
                body.slug_en = (0, slugify_1.default)(body.category_en, {
                    remove: /[$*_+~.()'"!\-:@]+/g,
                });
                const elementWithArSlug = yield categorys_1.default.findOne({
                    where: { slug_ar: body.slug_ar },
                });
                const elementWithenSlug = yield categorys_1.default.findOne({
                    where: { slug_en: body.slug_en },
                });
                if (elementWithArSlug) {
                    body.slug_ar = body.slug_ar + "-" + Date.now();
                }
                if (elementWithenSlug) {
                    body.slug_en = body.slug_en + "-" + Date.now();
                }
                console.log(body);
                body.active = body.active ? true : false;
                body.mainCatigory = null;
                body.image = file;
                categorys_1.default
                    .create(body)
                    .then((result) => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/main-categorys/", "category added successful", "success");
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
                categorys_1.default
                    .findOne({
                    where: {
                        id: req.params.id,
                    },
                })
                    .then((result) => {
                    res.render("dashboard/mainCategorys/update", {
                        title: "Dashboard | Update Main Category",
                        notification: req.flash("notification"),
                        validationError: req.flash("validationError")[0] || {},
                        mainCategory: result,
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
                    filesOperations.removeImg(req, "Categorys");
                    validationMessage.handel_validation_errors(req, res, error.errors, "/dashboard/main-categorys/update/" + req.params.id);
                    return;
                }
                const file = filesOperations.Rename_uploade_img(req);
                if (file) {
                    filesOperations.removeImg(req, "Categorys", body.oldImage);
                    body.image = file;
                }
                else {
                    body.image = body.oldImage;
                }
                body.slug_ar = (0, slugify_1.default)(body.category_ar, {
                    remove: /[$*_+~.()'"!\-:@]+/g,
                });
                body.slug_en = (0, slugify_1.default)(body.category_en, {
                    remove: /[$*_+~.()'"!\-:@]+/g,
                });
                const elementWithArSlug = yield categorys_1.default.findOne({
                    where: { slug_ar: body.slug_ar, id: { [sequelize_1.Op.ne]: req.params.id } },
                });
                const elementWithenSlug = yield categorys_1.default.findOne({
                    where: { slug_en: body.slug_en, id: { [sequelize_1.Op.ne]: req.params.id } },
                });
                if (elementWithArSlug) {
                    body.slug_ar = body.slug_ar + "-" + Date.now();
                }
                if (elementWithenSlug) {
                    body.slug_en = body.slug_en + "-" + Date.now();
                }
                body.active = body.active ? true : false;
                categorys_1.default
                    .update(body, {
                    where: {
                        id: req.params.id,
                    },
                })
                    .then((result) => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/main-categorys/update/" + req.params.id, "category updated successful", "success");
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
                categorys_1.default
                    .update({
                    active: body.status == "true" ? false : true,
                }, {
                    where: {
                        id: body.id,
                    },
                })
                    .then(() => {
                    let message = body.status == "true"
                        ? "The category has been deactivated successfully"
                        : "The category has been activated successfully";
                    validationMessage.returnWithMessage(req, res, "/dashboard/main-categorys/", message, "success");
                })
                    .catch((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const filesOperations = new helper_1.FilesOperations();
                const validationMessage = new helper_1.ValidationMessage();
                filesOperations.removeImg(req, "Categorys", body.image);
                categorys_1.default
                    .destroy({
                    where: {
                        id: body.id,
                    },
                })
                    .then(() => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/main-categorys/", "The category has been deleted successfully", "success");
                })
                    .then((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.MainCategoryController = MainCategoryController;
