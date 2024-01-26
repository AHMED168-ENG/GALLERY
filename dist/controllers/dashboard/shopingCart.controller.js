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
exports.ShopingCartController = void 0;
const shopingCart_1 = __importDefault(require("../../models/shopingCart"));
const helper_1 = require("../../helpers/helper");
const products_1 = __importDefault(require("../../models/products"));
class ShopingCartController {
    constructor() { }
    addShopingCart(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const userCart = yield shopingCart_1.default.findOne({
                    where: {
                        userId: body.userId,
                        productId: body.productId,
                    },
                });
                let isCreat = false;
                if (userCart) {
                    yield shopingCart_1.default.destroy({
                        where: {
                            userId: body.userId,
                            productId: body.productId,
                        },
                    });
                }
                else {
                    isCreat = true;
                    const TIME_OF_PRODUCT_IN_CART = +process.env.TIME_OF_PRODUCT_IN_CART;
                    body.finishingTime =
                        Date.now() + TIME_OF_PRODUCT_IN_CART * 60 * 60 * 1000;
                    yield shopingCart_1.default.create(body);
                }
                if (isCreat) {
                    res.send({
                        status: true,
                        message: req.t("productAddToShopingCart"),
                    });
                }
                else {
                    res.send({
                        status: true,
                        message: req.t("productRemoveToShopingCart"),
                    });
                }
            }
            catch (error) {
                console.log(error);
                res.send({
                    status: false,
                    message: error.message,
                });
            }
        });
    }
    showShopingCart(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.cookies.User;
                const others = new helper_1.Outhers();
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPage;
                shopingCart_1.default
                    .findAndCountAll({
                    distinct: true,
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
                                "productImage",
                                "structure",
                            ],
                        },
                    ],
                    order: [["createdAt", "desc"]],
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: +PAGE_ITEMS,
                    where: {
                        userId: userData.id,
                    },
                })
                    .then((result) => {
                    const totalOfAll = others.finalPrice(result.rows);
                    res.render("website/userpages/shopingCart", {
                        title: "shopingCart",
                        notification: req.flash("notification"),
                        allShopingProducts: result.rows,
                        hasPrevious: page > 1,
                        hasNext: PAGE_ITEMS * page < result.count,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        curantPage: +page,
                        allElementCount: result.count,
                        elements: +PAGE_ITEMS,
                        lastPage: Math.ceil(result.count / PAGE_ITEMS),
                        totalOfAll,
                        TIME_OF_PRODUCT_IN_CART: +process.env.TIME_OF_PRODUCT_IN_CART,
                        metaKeywords: null,
                        metaDescription: null,
                    });
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    changeCountInShopCart(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const lng = req.cookies.lng;
                const TIME_OF_PRODUCT_IN_CART = +process.env.TIME_OF_PRODUCT_IN_CART;
                body.finishingTime =
                    Date.now() + TIME_OF_PRODUCT_IN_CART * 60 * 60 * 1000;
                shopingCart_1.default
                    .findOne({
                    where: {
                        userId: body.userId,
                        productId: body.productId,
                    },
                })
                    .then((result) => {
                    if (result) {
                        shopingCart_1.default
                            .update({
                            count: body.count,
                            finishingTime: body.finishingTime,
                        }, {
                            where: {
                                userId: body.userId,
                                productId: body.productId,
                            },
                        })
                            .then((result) => {
                            let message = req.t("productCount");
                            res.send({ status: true, message: message, isCreate: false });
                        });
                    }
                    else {
                        shopingCart_1.default.create(body).then((result) => {
                            let message = req.t("addToCart");
                            res.send({ status: true, message: message, isCreate: true });
                        });
                    }
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
}
exports.ShopingCartController = ShopingCartController;
