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
exports.TestmonialsController = void 0;
const helper_1 = require("../../helpers/helper");
const testmonials_1 = __importDefault(require("../../models/testmonials"));
const users_1 = __importDefault(require("../../models/users"));
class TestmonialsController {
    constructor() { }
    findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPage;
                testmonials_1.default
                    .findAndCountAll({
                    order: [["createdAt", "desc"]],
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: +PAGE_ITEMS,
                    include: [
                        {
                            model: users_1.default,
                            as: "testmonialsUser",
                        },
                    ],
                })
                    .then((result) => {
                    res.render("dashboard/testmonials/all", {
                        title: "Dashboard | All testmonials",
                        notification: req.flash("notification"),
                        testmonials: result.rows,
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
    showTestmonial(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                testmonials_1.default
                    .findOne({
                    where: {
                        id: req.params.id,
                    },
                    include: [
                        {
                            model: users_1.default,
                            as: "testmonialsUser",
                        },
                    ],
                })
                    .then((result) => {
                    res.render("dashboard/testmonials/showTestmonial", {
                        title: "Dashboard | show testmonial",
                        notification: req.flash("notification"),
                        testmonial: result,
                    });
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    showTestmonialPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationMessage = new helper_1.ValidationMessage();
                const body = req.body;
                const lang = req.cookies.lang;
                body.active = body.active ? true : false;
                testmonials_1.default
                    .update(body, {
                    where: {
                        id: req.params.id,
                    },
                })
                    .then((result) => {
                    const message = lang != "en" ? "update successful" : "تم التعديل بنجاح";
                    validationMessage.returnWithMessage(req, res, "/dashboard/testmonials/show/" + req.params.id, message, "success");
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
                const body = req.body;
                const lang = req.cookies.lang;
                testmonials_1.default
                    .create(body)
                    .then((result) => {
                    console.log("result");
                    console.log(result);
                    const message = lang != "en"
                        ? "your testmonial created successful but not view in sit before admin active"
                        : "تم تسجيل رايك عن الموقع بنجاح ولاكن لن يظهر حتي يتم تفعيله من الادمن";
                    res.send({
                        status: true,
                        message: message,
                    });
                })
                    .catch((error) => error);
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
                testmonials_1.default
                    .update({
                    active: body.status == "true" ? false : true,
                }, {
                    where: {
                        id: body.id,
                    },
                })
                    .then(() => {
                    let message = body.status == "true"
                        ? "The testmonial has been deactivated successfully"
                        : "The testmonial has been activated successfully";
                    validationMessage.returnWithMessage(req, res, "/dashboard/testmonials/", message, "success");
                })
                    .catch((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteTestmonial(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const validationMessage = new helper_1.ValidationMessage();
                testmonials_1.default
                    .destroy({
                    where: {
                        id: body.id,
                    },
                })
                    .then(() => {
                    validationMessage.returnWithMessage(req, res, "/dashboard/testmonials/", "The testmonial has been deleted successfully", "success");
                })
                    .then((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.TestmonialsController = TestmonialsController;
