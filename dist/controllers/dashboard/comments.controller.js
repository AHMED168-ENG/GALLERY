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
exports.CommentsController = void 0;
const comments_1 = __importDefault(require("../../models/comments"));
const users_1 = __importDefault(require("../../models/users"));
const helper_1 = require("../../helpers/helper");
const userRate_1 = __importDefault(require("../../models/userRate"));
const products_1 = __importDefault(require("../../models/products"));
const axios_1 = __importDefault(require("axios"));
class CommentsController {
    constructor() { }
    findAllForAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPage;
                comments_1.default
                    .scope("active")
                    .findAndCountAll({
                    include: [{ model: users_1.default, as: "commentUset" }],
                    where: {
                        productId: req.params.id,
                    },
                    order: [["createdAt", "desc"]],
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: +PAGE_ITEMS,
                })
                    .then((result) => {
                    res.render("/allComments", {
                        title: "All Comments",
                        allComments: result,
                        notification: req.flash("notification"),
                        hasPrevious: page > 1,
                        hasNext: PAGE_ITEMS * page < result.count,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        curantPage: +page,
                        allElementCount: result.count,
                        elements: +PAGE_ITEMS,
                        lastPage: Math.ceil(result.count / PAGE_ITEMS),
                    });
                })
                    .catch((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
    findAllForUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPage;
                comments_1.default
                    .scope("active")
                    .findAndCountAll({
                    include: [{ model: users_1.default, as: "commentUset" }],
                    where: {
                        productId: req.params.id,
                    },
                    order: [["createdAt", "desc"]],
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: +PAGE_ITEMS,
                })
                    .then((result) => {
                    res.render("/allComments", {
                        title: "All Comments",
                        allComments: result,
                        notification: req.flash("notification"),
                        hasPrevious: page > 1,
                        hasNext: PAGE_ITEMS * page < result.count,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        curantPage: +page,
                        allElementCount: result.count,
                        elements: +PAGE_ITEMS,
                        lastPage: Math.ceil(result.count / PAGE_ITEMS),
                    });
                })
                    .catch((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                if (!body.captcha) {
                    res.send({ status: false, message: req.t("selectCapetch") });
                    return;
                }
                let secretKey = process.env.recaptcherSitKey;
                const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;
                axios_1.default.get(verifyURL).then((data) => {
                    if (data.data.success != true) {
                        return res.json({
                            status: false,
                            message: req.t("FailedCaptcha"),
                        });
                    }
                    else {
                        return comments_1.default
                            .create(body)
                            .then(() => {
                            res.send({
                                status: true,
                                message: req.t("commentAdded"),
                                userData: req.cookies.User,
                            });
                        })
                            .catch((error) => error);
                    }
                });
            }
            catch (error) {
                res.send({ status: false, message: error.message });
            }
        });
    }
    showComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                comments_1.default
                    .findOne({
                    where: {
                        id: req.params.id,
                    },
                    include: [{ model: users_1.default, as: "commentUset" }],
                })
                    .then((result) => {
                    res.send(result);
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
                const validationMessage = new helper_1.ValidationMessage();
                const body = req.body;
                const commentState = body.state;
                comments_1.default
                    .update({
                    active: commentState == "true" ? false : true,
                }, {
                    where: {
                        id: req.params.id,
                    },
                })
                    .then(() => {
                    validationMessage.returnWithMessage(req, res, "", commentState == "true"
                        ? req.t("commentDeActive")
                        : req.t("commentActive"), "success");
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteCommentFromAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const validationMessage = new helper_1.ValidationMessage();
                comments_1.default
                    .destroy({
                    where: {
                        id: req.params.id,
                    },
                })
                    .then(() => {
                    validationMessage.returnWithMessage(req, res, "", "deleted successful", "danger");
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteCommentFromUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                comments_1.default
                    .destroy({
                    where: {
                        id: req.params.id,
                    },
                })
                    .then(() => {
                    res.send({
                        status: true,
                        message: "deleted successful",
                    });
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    addRate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otherFun = new helper_1.Outhers();
                const body = req.body;
                const userRate = yield userRate_1.default.findOne({
                    where: {
                        userId: body.userId,
                        productId: body.productId,
                    },
                });
                let isCreat = false;
                if (userRate) {
                    yield userRate_1.default.update(body, {
                        where: {
                            userId: body.userId,
                            productId: body.productId,
                        },
                    });
                }
                else {
                    isCreat = true;
                    yield userRate_1.default.create(body);
                }
                const allRateForProduct = yield userRate_1.default.findAll({
                    where: {
                        productId: body.productId,
                    },
                    attributes: ["rate"],
                });
                let sumRate = otherFun.getSumeOfArray(allRateForProduct);
                sumRate = (sumRate * 100) / (allRateForProduct.length * 5) / 20;
                products_1.default.update({
                    sumRate: sumRate,
                }, {
                    where: {
                        id: body.productId,
                    },
                });
                if (isCreat) {
                    res.send({
                        status: true,
                        message: req.t("rateAdd"),
                    });
                }
                else {
                    res.send({
                        status: true,
                        message: req.t("rateUpdate"),
                    });
                }
            }
            catch (error) {
                res.send({
                    status: false,
                    message: error.message,
                });
            }
        });
    }
}
exports.CommentsController = CommentsController;
