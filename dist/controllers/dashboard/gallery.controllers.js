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
exports.GalleryController = void 0;
const gallery_1 = __importDefault(require("../../models/gallery"));
const express_validator_1 = require("express-validator");
const helper_1 = require("../../helpers/helper");
const products_1 = __importDefault(require("../../models/products"));
class GalleryController {
    constructor() { }
    findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPage;
                gallery_1.default
                    .findAndCountAll({
                    order: [["createdAt", "desc"]],
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: +PAGE_ITEMS,
                    include: [
                        {
                            model: products_1.default,
                            as: "galleryProduct",
                            attributes: ["id", "productName_en"],
                        },
                    ],
                })
                    .then((result) => {
                    res.render("dashboard/gallery/all", {
                        title: "Dashboard | All images",
                        notification: req.flash("notification"),
                        images: result.rows,
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
                products_1.default
                    .scope("active")
                    .findAll()
                    .then((result) => {
                    res.render("dashboard/gallery/create", {
                        title: "Dashboard | Create gallery Image",
                        notification: req.flash("notification"),
                        validationError: req.flash("validationError")[0] || {},
                        bodyData: req.flash("bodyData")[0] || {},
                        products: result,
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
                if (!error.isEmpty()) {
                    filesOperations.removeImg(req, "Gallery");
                    validationMessage.handel_validation_errors(req, res, error.errors, "/dashboard/gallery/create");
                    return;
                }
                const file = filesOperations.Rename_uploade_img(req);
                body.image = file;
                body.active = body.active ? true : false;
                gallery_1.default
                    .create(body)
                    .then((result) => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/gallery/", "gallery added successful", "success");
                })
                    .catch((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                products_1.default
                    .scope("active")
                    .findAll()
                    .then((products) => {
                    gallery_1.default
                        .findOne({
                        where: {
                            id: req.params.id,
                        },
                        include: [
                            {
                                model: products_1.default,
                                as: "galleryProduct",
                                attributes: ["id", "productName_en"],
                            },
                        ],
                    })
                        .then((gallery) => {
                        res.render("dashboard/gallery/update", {
                            title: "Dashboard | Update gallery Image",
                            notification: req.flash("notification"),
                            validationError: req.flash("validationError")[0] || {},
                            gallery,
                            products,
                            bodyData: req.flash("bodyData")[0],
                        });
                    })
                        .catch((error) => error);
                });
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
                    filesOperations.removeImg(req, "Gallery");
                    validationMessage.handel_validation_errors(req, res, error.errors, "/dashboard/gallery/update/" + req.params.id);
                    return;
                }
                const file = filesOperations.Rename_uploade_img(req);
                if (file) {
                    console.log(file);
                    filesOperations.removeImg(req, "Gallery", body.oldImage);
                    body.image = file;
                }
                else {
                    body.image = body.oldImage;
                }
                body.active = body.active ? true : false;
                gallery_1.default
                    .update(body, {
                    where: {
                        id: req.params.id,
                    },
                })
                    .then((result) => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/gallery/update/" + req.params.id, "image gallery updated successful", "success");
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
                gallery_1.default
                    .update({
                    active: body.status == "true" ? false : true,
                }, {
                    where: {
                        id: body.id,
                    },
                })
                    .then(() => {
                    let message = body.status == "true"
                        ? "The gallery has been deactivated successfully"
                        : "The gallery has been activated successfully";
                    validationMessage.returnWithMessage(req, res, "/dashboard/gallery/", message, "success");
                })
                    .catch((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const filesOperations = new helper_1.FilesOperations();
                const validationMessage = new helper_1.ValidationMessage();
                filesOperations.removeImg(req, "Gallery", body.oldImage);
                gallery_1.default
                    .destroy({
                    where: {
                        id: body.id,
                    },
                })
                    .then(() => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/gallery/", "The gallery image has been deleted successfully", "success");
                })
                    .then((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.GalleryController = GalleryController;
