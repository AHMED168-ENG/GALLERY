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
exports.FavoritProductsController = void 0;
const favorits_1 = __importDefault(require("../../models/favorits"));
const products_1 = __importDefault(require("../../models/products"));
const shopingCart_1 = __importDefault(require("../../models/shopingCart"));
class FavoritProductsController {
    constructor() { }
    addFavoritProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const favoritProduct = yield favorits_1.default.findOne({
                    where: {
                        userId: body.userId,
                        productId: body.productId,
                    },
                });
                let isCreat = false;
                if (favoritProduct) {
                    yield favorits_1.default.destroy({
                        where: {
                            userId: body.userId,
                            productId: body.productId,
                        },
                    });
                }
                else {
                    isCreat = true;
                    yield favorits_1.default.create(body);
                }
                if (isCreat) {
                    res.send({
                        status: true,
                        message: req.t("addFavorit"),
                    });
                }
                else {
                    res.send({
                        status: true,
                        message: req.t("removeFavorit"),
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
    showFavoritCart(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPageSite;
                const userData = req.cookies.User;
                let shopingCart = [];
                const myArrCart = yield shopingCart_1.default.findAll({
                    where: {
                        userId: userData.id,
                    },
                    attributes: ["productId"],
                });
                myArrCart.forEach((ele) => {
                    shopingCart.push(ele.productId);
                });
                favorits_1.default
                    .findAndCountAll({
                    distinct: true,
                    include: [
                        {
                            model: products_1.default,
                            as: "favoritProduct",
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
                                "productImage",
                            ],
                        },
                    ],
                    order: [["createdAt", "desc"]],
                    offset: +((page - 1) * PAGE_ITEMS),
                    where: {
                        userId: userData.id,
                    },
                    limit: +PAGE_ITEMS,
                })
                    .then((result) => {
                    res.render("website/userpages/favoritCart", {
                        title: " All Favorit Product",
                        notification: req.flash("notification"),
                        allFavoritProducts: result.rows,
                        hasPrevious: page > 1,
                        hasNext: PAGE_ITEMS * page < result.count,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        curantPage: +page,
                        allElementCount: result.count,
                        elements: +PAGE_ITEMS,
                        lastPage: Math.ceil(result.count / PAGE_ITEMS),
                        shopingCart,
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
}
exports.FavoritProductsController = FavoritProductsController;
