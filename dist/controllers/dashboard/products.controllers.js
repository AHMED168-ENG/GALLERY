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
exports.ProductController = void 0;
const express_validator_1 = require("express-validator");
const helper_1 = require("../../helpers/helper");
const sequelize_1 = require("sequelize");
const slugify_1 = __importDefault(require("slugify"));
const charmap_1 = __importDefault(require("../../charmap"));
slugify_1.default.extend(charmap_1.default);
const products_1 = __importDefault(require("../../models/products"));
const categorys_1 = __importDefault(require("../../models/categorys"));
class ProductController {
    constructor() { }
    findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPage;
                products_1.default
                    .findAndCountAll({
                    order: [["createdAt", "desc"]],
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: +PAGE_ITEMS,
                    include: [{ model: categorys_1.default, as: "ProductCategory" }],
                })
                    .then((result) => {
                    res.render("dashboard/products/all", {
                        title: "Dashboard | All Products",
                        notification: req.flash("notification"),
                        allProducts: result.rows,
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
    findAllProductFromSearch(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                products_1.default
                    .findAll({
                    order: [["createdAt", "desc"]],
                    limit: 8,
                    attributes: [
                        "productName_ar",
                        "productName_en",
                        "id",
                        "slug_ar",
                        "slug_en",
                        "productImage",
                    ],
                    where: {
                        [sequelize_1.Op.or]: [
                            {
                                productName_ar: { [sequelize_1.Op.like]: `%${query.search}%` },
                            },
                            {
                                productName_en: { [sequelize_1.Op.like]: `%${query.search}%` },
                            },
                            {
                                keyWord: { [sequelize_1.Op.like]: `%${query.search}%` },
                            },
                            {
                                fullDescription_ar: { [sequelize_1.Op.like]: `%${query.search}%` },
                            },
                            {
                                fullDescription_en: { [sequelize_1.Op.like]: `%${query.search}%` },
                            },
                            {
                                statmentDescription_ar: { [sequelize_1.Op.like]: `%${query.search}%` },
                            },
                            {
                                statmentDescription_en: { [sequelize_1.Op.like]: `%${query.search}%` },
                            },
                        ],
                    },
                    include: [{ model: categorys_1.default, as: "ProductCategory" }],
                })
                    .then((result) => {
                    res.send({
                        status: true,
                        data: result,
                    });
                });
            }
            catch (error) {
                res.send({
                    status: false,
                    error: error.message,
                });
            }
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                categorys_1.default
                    .scope("active")
                    .scope("mainCategorys")
                    .findAll()
                    .then((result) => {
                    res.render("dashboard/products/create", {
                        title: "Dashboard | Create Product",
                        notification: req.flash("notification"),
                        validationError: req.flash("validationError")[0] || {},
                        bodyData: req.flash("bodyData")[0] || {},
                        catigorys: result,
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
                    filesOperations.removeImgFiled([
                        req.files["productImage"],
                        req.files["descriptionImage"],
                    ]);
                    validationMessage.handel_validation_errors(req, res, error.errors, "/dashboard/products/create");
                    return;
                }
                const files = filesOperations.Rename_uploade_img_multiFild([
                    req.files["productImage"],
                    req.files["descriptionImage"],
                ]);
                body.slug_ar = (0, slugify_1.default)(body.productName_ar, {
                    remove: /[$*_+~.()'"!\-:@]+/g,
                });
                body.slug_en = (0, slugify_1.default)(body.productName_en, {
                    remove: /[$*_+~.()'"!\-:@]+/g,
                });
                const elementWithArSlug = yield products_1.default.findOne({
                    where: { slug_ar: body.slug_ar },
                });
                const elementWithEnSlug = yield products_1.default.findOne({
                    where: { slug_en: body.slug_en },
                });
                if (elementWithArSlug) {
                    body.slug_ar = body.slug_ar + "-" + (Date.now() - 10000);
                }
                if (elementWithEnSlug) {
                    body.slug_en = body.slug_en + "-" + (Date.now() - 10000);
                }
                body.active = body.active ? true : false;
                body.productImage = files["productImage"];
                body.descriptionImage = files["descriptionImage"];
                body.category = outhers.getCatgoryFromArray(body.category);
                products_1.default
                    .create(body)
                    .then((result) => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/products/", "product added successful", "success");
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
                const categorys = yield categorys_1.default
                    .scope("active")
                    .scope("mainCategorys")
                    .findAll();
                products_1.default
                    .findOne({
                    include: [{ model: categorys_1.default, as: "ProductCategory" }],
                    where: {
                        id: req.params.id,
                    },
                })
                    .then((result) => {
                    res.render("dashboard/products/update", {
                        title: "Dashboard | Update Product",
                        notification: req.flash("notification"),
                        validationError: req.flash("validationError")[0] || {},
                        productData: result,
                        bodyData: req.flash("bodyData")[0],
                        catigorys: categorys,
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
                const outhers = new helper_1.Outhers();
                if (!error.isEmpty()) {
                    filesOperations.removeImgFiled([
                        req.files["productImage"],
                        req.files["descriptionImage"],
                    ]);
                    validationMessage.handel_validation_errors(req, res, error.errors, "/dashboard/products/update/" + req.params.id);
                    return;
                }
                const files = filesOperations.Rename_uploade_img_multiFild([
                    req.files["productImage"],
                    req.files["descriptionImage"],
                ]);
                if (files["productImage"]) {
                    filesOperations.removeImg(req, "Products", body.oldProductImage);
                    body.productImage = files["productImage"];
                }
                else {
                    body.productImage = body.oldProductImage;
                }
                if (files["descriptionImage"]) {
                    filesOperations.removeImg(req, "Products", body.oldDescriptionImage);
                    body.descriptionImage = files["descriptionImage"];
                }
                else {
                    body.descriptionImage = body.oldDescriptionImage;
                }
                body.slug_ar = (0, slugify_1.default)(body.productName_ar, {
                    remove: /[$*_+~.()'"!\-:@]+/g,
                });
                body.slug_en = (0, slugify_1.default)(body.productName_en, {
                    remove: /[$*_+~.()'"!\-:@]+/g,
                });
                const elementWithArSlug = yield products_1.default.findOne({
                    where: { slug_ar: body.slug_ar, id: { [sequelize_1.Op.ne]: req.params.id } },
                });
                const elementWithEnSlug = yield products_1.default.findOne({
                    where: { slug_en: body.slug_en, id: { [sequelize_1.Op.ne]: req.params.id } },
                });
                if (elementWithArSlug) {
                    body.slug_ar = body.slug_ar + "-" + (Date.now() - 10000);
                }
                if (elementWithEnSlug) {
                    body.slug_en = body.slug_en + "-" + (Date.now() - 10000);
                }
                body.category =
                    body.category[0] != ""
                        ? outhers.getCatgoryFromArray(body.category)
                        : body.oldCategory;
                body.active = body.active ? true : false;
                products_1.default
                    .update(body, {
                    where: {
                        id: req.params.id,
                    },
                })
                    .then((result) => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/products/update/" + req.params.id, "product updated successful", "success");
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
                products_1.default
                    .update({
                    active: body.status == "true" ? false : true,
                }, {
                    where: {
                        id: body.id,
                    },
                })
                    .then(() => {
                    let message = body.status == "true"
                        ? "The product has been deactivated successfully"
                        : "The product has been activated successfully";
                    validationMessage.returnWithMessage(req, res, "/dashboard/products/", message, "success");
                })
                    .catch((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteproduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const filesOperations = new helper_1.FilesOperations();
                const validationMessage = new helper_1.ValidationMessage();
                filesOperations.removeImg(req, "Products", req.body.oldDescriptionImage);
                filesOperations.removeImg(req, "Products", req.body.oldProductImage);
                products_1.default
                    .destroy({
                    where: {
                        id: body.id,
                    },
                })
                    .then(() => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/products/", "The product has been deleted successfully", "success");
                })
                    .then((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ProductController = ProductController;
