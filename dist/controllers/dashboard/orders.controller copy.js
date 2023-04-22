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
exports.Orders = void 0;
const helper_1 = require("../../helpers/helper");
const products_1 = __importDefault(require("../../models/products"));
const shopingCart_1 = __importDefault(require("../../models/shopingCart"));
const orders_1 = __importDefault(require("../../models/orders"));
class Orders {
    constructor() { }
    showOrderPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const others = new helper_1.Outhers();
                const userData = req.cookies.User;
                shopingCart_1.default
                    .findAll({
                    where: {
                        userId: userData.id,
                    },
                    include: [
                        {
                            model: products_1.default,
                            as: "cartProduct",
                            attributes: [
                                "id",
                                "slug_ar",
                                "slug_en",
                                "price",
                                "productName_ar",
                                "productName_en",
                                "shipping",
                                "descount",
                                "structure",
                            ],
                        },
                    ],
                })
                    .then((result) => {
                    if (result.length == 0) {
                        res.redirect("/home");
                        return;
                    }
                    const totalOfAll = others.finalPrice(result);
                    res.render("website/userpages/mackOrder", {
                        title: " Mack Order",
                        notification: req.flash("notification"),
                        allFavoritProducts: result,
                        totalOfAll,
                        allProductCart: result,
                    });
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    addOrderPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationMessage = new helper_1.ValidationMessage();
                const userData = req.cookies.User;
                const lang = req.cookies.lang;
                shopingCart_1.default
                    .findAll({
                    include: [
                        {
                            model: products_1.default,
                            as: "cartProduct",
                            attributes: [
                                "id",
                                "slug_ar",
                                "slug_en",
                                "price",
                                "productName_ar",
                                "productName_en",
                                "shipping",
                                "descount",
                                "structure",
                            ],
                        },
                    ],
                    where: {
                        userId: userData.id,
                    },
                })
                    .then((result) => {
                    let productId = "";
                    let productCount = "";
                    result.forEach((ele) => {
                        productId += ele.cartProduct.id + ",";
                        productCount += ele.count + ",";
                    });
                    orders_1.default
                        .create({
                        userId: userData.id,
                        productsId: productId,
                        productsCount: productCount,
                    })
                        .then(() => __awaiter(this, void 0, void 0, function* () {
                        yield shopingCart_1.default.destroy({
                            where: {
                                userId: userData.id,
                            },
                        });
                        const message = lang != "en"
                            ? "your order is creating now and the admin will contact you in 48 houre and we empty your cart"
                            : "الطلب الخاص بك تم انشاءه انتظر حتي يتم الاتصال بك ومتابعه التفاصيل وتم تفريغ الكارت الخاص بيك";
                        validationMessage.returnWithMessage(req, res, "/shoping-cart", message, "success");
                    }));
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.Orders = Orders;
