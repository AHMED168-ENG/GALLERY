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
exports.FaqsController = void 0;
const faqs_1 = __importDefault(require("../../models/faqs"));
const express_validator_1 = require("express-validator");
const helper_1 = require("../../helpers/helper");
class FaqsController {
    constructor() { }
    findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPage;
                faqs_1.default
                    .findAndCountAll({
                    order: [["createdAt", "desc"]],
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: +PAGE_ITEMS,
                })
                    .then((result) => {
                    res.render("dashboard/faqs/all", {
                        title: "Dashboard | All Questions",
                        notification: req.flash("notification"),
                        questions: result.rows,
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
                res.render("dashboard/faqs/create", {
                    title: "Dashboard | Create Question",
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
                const validationMessage = new helper_1.ValidationMessage();
                if (!error.isEmpty()) {
                    validationMessage.handel_validation_errors(req, res, error.errors, "/dashboard/questions/create");
                    return;
                }
                body.active = body.active ? true : false;
                faqs_1.default
                    .create(body)
                    .then((result) => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/questions/", "faqs added successful", "success");
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
                faqs_1.default
                    .findOne({
                    where: {
                        id: req.params.id,
                    },
                })
                    .then((result) => {
                    res.render("dashboard/faqs/update", {
                        title: "Dashboard | Update faqs",
                        notification: req.flash("notification"),
                        validationError: req.flash("validationError")[0] || {},
                        faqsData: result,
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
                const validationMessage = new helper_1.ValidationMessage();
                if (!error.isEmpty()) {
                    validationMessage.handel_validation_errors(req, res, error.errors, "/dashboard/questions/update/" + req.params.id);
                    return;
                }
                body.active = body.active ? true : false;
                faqs_1.default
                    .update(body, {
                    where: {
                        id: req.params.id,
                    },
                })
                    .then((result) => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/questions/update/" + req.params.id, "question updated successful", "success");
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
                faqs_1.default
                    .update({
                    active: body.status == "true" ? false : true,
                }, {
                    where: {
                        id: body.id,
                    },
                })
                    .then(() => {
                    let message = body.status == "true"
                        ? "The faqs has been deactivated successfully"
                        : "The faqs has been activated successfully";
                    validationMessage.returnWithMessage(req, res, "/dashboard/questions/", message, "success");
                })
                    .catch((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteFaqs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const validationMessage = new helper_1.ValidationMessage();
                faqs_1.default
                    .destroy({
                    where: {
                        id: body.id,
                    },
                })
                    .then(() => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/questions/", "The testmonial has been deleted successfully", "success");
                })
                    .then((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.FaqsController = FaqsController;
