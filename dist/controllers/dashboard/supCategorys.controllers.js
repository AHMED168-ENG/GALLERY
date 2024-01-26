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
exports.SupCategoryController = void 0;
const express_validator_1 = require("express-validator");
const helper_1 = require("../../helpers/helper");
const sequelize_1 = require("sequelize");
const slugify = require("slugify");
const charmap_1 = __importDefault(require("../../charmap"));
slugify.extend(charmap_1.default);
const categorys_1 = __importDefault(require("../../models/categorys"));
class SupCategoryController {
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
                        mainCatigory: { [sequelize_1.Op.ne]: 0 },
                    },
                })
                    .then((result) => {
                    res.render("dashboard/supCategorys/all", {
                        title: "Dashboard | All Categorys",
                        notification: req.flash("notification"),
                        supCategorys: result.rows,
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
                categorys_1.default
                    .findAll({
                    where: {
                        mainCatigory: { [sequelize_1.Op.eq]: 0 },
                    },
                })
                    .then((result) => {
                    res.render("dashboard/supCategorys/create", {
                        title: "Dashboard | Create Categorys",
                        notification: req.flash("notification"),
                        validationError: req.flash("validationError")[0] || {},
                        bodyData: req.flash("bodyData")[0] || {},
                        mainCatigorys: result,
                    });
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
                const outhers = new helper_1.Outhers();
                if (!error.isEmpty()) {
                    filesOperations.removeImg(req, "Categorys");
                    validationMessage.handel_validation_errors(req, res, error.errors, "/dashboard/sup-categorys/create");
                    return;
                }
                const file = filesOperations.Rename_uploade_img(req);
                body.slug_ar = slugify(body.category_ar, {
                    remove: /[$*_+~.()'"!\-:@]+/g,
                });
                body.slug_en = slugify(body.category_en, {
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
                body.active = body.active ? true : false;
                body.mainCatigory = outhers.getCatgoryFromArray(body.mainCatigory);
                body.image = file;
                categorys_1.default
                    .create(body)
                    .then((result) => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/sup-categorys/", "category added successful", "success");
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
                const allMainCategorys = yield categorys_1.default
                    .scope("active")
                    .scope("mainCategorys")
                    .findAll();
                categorys_1.default
                    .findOne({
                    where: {
                        id: req.params.id,
                    },
                    include: [
                        {
                            model: categorys_1.default,
                            as: "mainCatigorys",
                            attributes: ["category_en", "id"],
                        },
                    ],
                })
                    .then((result) => {
                    res.render("dashboard/supCategorys/update", {
                        title: "Dashboard | Update Sup Category",
                        notification: req.flash("notification"),
                        validationError: req.flash("validationError")[0] || {},
                        categoryData: result,
                        bodyData: req.flash("bodyData")[0],
                        mainCatigorys: allMainCategorys,
                    });
                })
                    .catch((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getMainCatigoryAjax(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const mainCategorys = yield categorys_1.default.scope("active").findAll({
                where: {
                    mainCatigory: req.params.id,
                    id: {
                        [sequelize_1.Op.ne]: req.body.categoryId,
                    },
                },
            });
            res.send({ catigorys: mainCategorys });
            try {
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
                const outhers = new helper_1.Outhers();
                if (!error.isEmpty()) {
                    filesOperations.removeImg(req, "Categorys");
                    validationMessage.handel_validation_errors(req, res, error.errors, "/dashboard/sup-categorys/update/" + req.params.id);
                    return;
                }
                const file = filesOperations.Rename_uploade_img(req);
                if (file) {
                    new helper_1.FilesOperations().removeImg(req, "Categorys", body.oldImage);
                    body.image = file;
                }
                else {
                    body.image = body.oldImage;
                }
                body.slug_ar = slugify(body.category_ar, {
                    remove: /[$*_+~.()'"!\-:@]+/g,
                });
                body.slug_en = slugify(body.category_en, {
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
                body.mainCatigory =
                    body.mainCatigory.length == 1 && !body.mainCatigory[0]
                        ? body.oldMainCategory
                        : outhers.getCatgoryFromArray(body.mainCatigory);
                body.active = body.active ? true : false;
                categorys_1.default
                    .update(body, {
                    where: {
                        id: req.params.id,
                    },
                })
                    .then((result) => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/sup-categorys/update/" + req.params.id, "sup category updated successful", "success");
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
                        ? "The sup category has been deactivated successfully"
                        : "The sup category has been activated successfully";
                    validationMessage.returnWithMessage(req, res, "/dashboard/sup-categorys/", message, "success");
                })
                    .catch((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteSupCategory(req, res, next) {
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
                    validationMessage.returnWithMessage(req, res, "/dashboard/sup-categorys/", "The sup category has been deleted successfully", "success");
                })
                    .then((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.SupCategoryController = SupCategoryController;
