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
exports.MessageController = void 0;
const messages_1 = __importDefault(require("../../models/messages"));
const helper_1 = require("../../helpers/helper");
const users_1 = __importDefault(require("../../models/users"));
const axios_1 = __importDefault(require("axios"));
class MessageController {
    constructor() { }
    findMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                messages_1.default
                    .update({ isSeen: true }, {
                    where: {
                        id: req.params.id,
                    },
                })
                    .then(() => {
                    messages_1.default
                        .findOne({
                        include: [{ model: users_1.default, as: "messageUser" }],
                        where: {
                            id: req.params.id,
                        },
                    })
                        .then((result) => {
                        res.render("dashboard/messages/showMessage", {
                            title: "Dashboard | show messages",
                            notification: req.flash("notification"),
                            message: result,
                        });
                    });
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPage;
                messages_1.default
                    .findAndCountAll({
                    order: [["createdAt", "desc"]],
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: +PAGE_ITEMS,
                })
                    .then((result) => {
                    res.render("dashboard/messages/allMessages", {
                        title: "Dashboard | All messages",
                        notification: req.flash("notification"),
                        messages: result.rows,
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
    findAllNotSeen(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPage;
                messages_1.default
                    .findAndCountAll({
                    order: [["createdAt", "desc"]],
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: +PAGE_ITEMS,
                    where: {
                        isSeen: false,
                    },
                })
                    .then((result) => {
                    res.render("dashboard/messages/allMessagesNotSeen", {
                        title: "Dashboard | All messages",
                        notification: req.flash("notification"),
                        messagesNotSeen: result.rows,
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
    crearePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lang = req.cookies.lang;
                const body = req.body;
                if (!body.captcha) {
                    res.send({ status: false, message: req.t("selectCapetch") });
                    return;
                }
                let secretKey = process.env.recaptcherSitKey;
                const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;
                axios_1.default
                    .get(verifyURL)
                    .then((data) => {
                    if (data.data.success != true) {
                        return res.json({
                            status: false,
                            message: req.t("FailedCaptcha"),
                        });
                    }
                    else {
                        messages_1.default
                            .create(body)
                            .then((result) => {
                            res.send({
                                status: true,
                                message: req.t("messageSent"),
                            });
                        })
                            .catch((error) => error);
                    }
                })
                    .catch((error) => {
                    return error;
                });
            }
            catch (error) {
                res.send({
                    status: false,
                    message: error.message,
                });
            }
        });
    }
    deleteMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const validationMessage = new helper_1.ValidationMessage();
                messages_1.default
                    .destroy({
                    where: {
                        id: body.id,
                    },
                })
                    .then(() => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/messages/", "The message has been deleted successfully", "success");
                })
                    .then((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.MessageController = MessageController;
