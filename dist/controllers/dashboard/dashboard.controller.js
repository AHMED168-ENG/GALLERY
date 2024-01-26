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
const orders_1 = __importDefault(require("../../models/orders"));
const users_1 = __importDefault(require("../../models/users"));
const productsOrders_1 = __importDefault(require("../../models/productsOrders"));
const products_1 = __importDefault(require("../../models/products"));
const helper_1 = require("../../helpers/helper");
const messages_1 = __importDefault(require("../../models/messages"));
class DashboardController {
    constructor() { }
    dashboard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const others = new helper_1.Outhers();
                orders_1.default
                    .findAll({
                    order: [["createdAt", "desc"]],
                    limit: 10,
                    include: [
                        {
                            model: users_1.default,
                            as: "orderUser",
                        },
                        {
                            model: productsOrders_1.default,
                            as: "productOrderTable",
                            include: [{ model: products_1.default, as: "productTable" }],
                        },
                    ],
                })
                    .then((orders) => __awaiter(this, void 0, void 0, function* () {
                    const lastMessages = yield messages_1.default.findAll({
                        limit: 10,
                        include: [{ model: users_1.default, as: "messageUser" }],
                    });
                    res.render("dashboard/dashboard", {
                        title: "Dashboard",
                        notification: req.flash("notification"),
                        webSeting: {},
                        orders: orders,
                        finalPriceForAdmin: others.finalPriceForAdmin,
                        formateDate: others.formateDate,
                        lastMessages,
                    });
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = DashboardController;
