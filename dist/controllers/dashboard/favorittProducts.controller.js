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
exports.favoritProductsController = void 0;
const helper_1 = require("../../helpers/helper");
const favorits_1 = __importDefault(require("../../models/favorits"));
class favoritProductsController {
    constructor() { }
    addFavoritProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otherFun = new helper_1.Outhers();
                const body = req.body;
                const favoritProduct = yield favorits_1.default.findOne({
                    where: {
                        userId: body.userId,
                        productId: body.productId,
                    },
                });
                let isCreat = false;
                if (favoritProduct) {
                    yield favorits_1.default.update(body, {
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
                        message: "this product added to favorit cart successful",
                    });
                }
                else {
                    res.send({
                        status: true,
                        message: "your rate update successful",
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
exports.favoritProductsController = favoritProductsController;
