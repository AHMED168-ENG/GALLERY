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
exports.Outhers = exports.StartActions = exports.FilesOperations = exports.ValidationMessage = void 0;
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const users_1 = __importDefault(require("../models/users"));
const categorys_1 = __importDefault(require("../models/categorys"));
const products_1 = __importDefault(require("../models/products"));
const sliders_1 = __importDefault(require("../models/sliders"));
const faqs_1 = __importDefault(require("../models/faqs"));
const moment_1 = __importDefault(require("moment"));
const favorits_1 = __importDefault(require("../models/favorits"));
const shopingCart_1 = __importDefault(require("../models/shopingCart"));
const testmonials_1 = __importDefault(require("../models/testmonials"));
const orders_1 = __importDefault(require("../models/orders"));
class ValidationMessage {
    constructor() { }
    returnWithMessage(req, res, url, message, type) {
        message = message ? message : "هناك خطا ما ويرجي التحقق من الكود";
        type = type ? type : "danger";
        req.flash("notification", [type, message]);
        res.redirect(url);
    }
    handel_validation_errors(req, res, errors, path) {
        var param = [];
        var newError = {};
        errors.forEach((element) => {
            if (!param.includes(element.param)) {
                param.push(element.param);
                newError[element.param] = [element];
            }
            else {
                newError[element.param].push(element);
            }
        });
        req.flash("validationError", newError);
        req.flash("bodyData", req.body);
        res.redirect(path);
    }
}
exports.ValidationMessage = ValidationMessage;
class FilesOperations {
    uploade_img(path, image) {
        return (0, multer_1.default)({ dest: path }).array(image);
    }
    uploade_img_multi_fild(array, dest) {
        return (0, multer_1.default)({ dest: dest }).fields(array);
    }
    removeImg(req, folder, imgname) {
        if (!imgname) {
            req.files.forEach((element) => {
                fs_1.default.unlinkSync(element.path);
            });
        }
        else {
            let ImgName = imgname.split("--");
            for (var i = 0; i < ImgName.length - 1; i++) {
                fs_1.default.unlink(path_1.default.join("assets/dashboard/" + folder + "/" + ImgName[i]), () => { });
            }
        }
    }
    removeImgFiled(fields) {
        fields.forEach((element) => {
            if (element) {
                element.forEach((element, i) => {
                    fs_1.default.unlinkSync(element.path);
                });
            }
        });
    }
    Rename_uploade_img_multiFild(fields) {
        var fileds_img = {};
        var image = "";
        fields.forEach((element) => {
            if (element) {
                element.forEach((element, i) => {
                    var randomNumber = Date.now();
                    var newPath = element.destination + "/" + randomNumber + element.originalname;
                    fs_1.default.renameSync(element.path, newPath);
                    image += randomNumber + element.originalname + "--";
                });
                fileds_img[element[0].fieldname] = image;
                image = "";
            }
        });
        return fileds_img;
    }
    Rename_uploade_img(req) {
        var image = "";
        req.files.forEach((element) => {
            var randomNumber = Date.now();
            var newPath = element.destination + "/" + randomNumber + element.originalname;
            fs_1.default.renameSync(element.path, newPath);
            image += randomNumber + element.originalname + "--";
        });
        return image;
    }
}
exports.FilesOperations = FilesOperations;
class StartActions {
    startFunctionForDashboard(req, res, url, csrfToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield users_1.default.findAndCountAll();
            const usersNotActive = yield users_1.default.scope("notActive").findAndCountAll();
            const mainCategorys = yield categorys_1.default
                .scope("mainCategorys")
                .findAndCountAll();
            const mainCategorysNotActive = yield categorys_1.default
                .scope("mainCategorys")
                .scope("notActive")
                .findAndCountAll();
            const supCategorys = yield categorys_1.default
                .scope("supCategorys")
                .findAndCountAll();
            const supCategorysNotActive = yield categorys_1.default
                .scope("supCategorys")
                .scope("notActive")
                .findAndCountAll();
            const products = yield products_1.default.findAndCountAll();
            const productsNotActive = yield products_1.default
                .scope("notActive")
                .findAndCountAll();
            const sliders = yield sliders_1.default.findAndCountAll();
            const slidersNotActive = yield sliders_1.default
                .scope("notActive")
                .findAndCountAll();
            const faqs = yield faqs_1.default.findAndCountAll();
            const faqsNotActive = yield faqs_1.default.scope("notActive").findAndCountAll();
            const testmonial = yield testmonials_1.default.findAndCountAll();
            const testmonialNotActive = yield testmonials_1.default
                .scope("notActive")
                .findAndCountAll();
            const order = yield orders_1.default.findAndCountAll();
            const orderNotSeen = yield orders_1.default.scope("NotSeen").findAndCountAll();
            const FeaturesNumber = {
                users: users.count,
                usersNotActive: usersNotActive.count,
                mainCategorys: mainCategorys.count,
                mainCategorysNotActive: mainCategorysNotActive.count,
                supCategorys: supCategorys.count,
                supCategorysNotActive: supCategorysNotActive.count,
                products: products.count,
                productsNotActive: productsNotActive.count,
                sliders: sliders.count,
                slidersNotActive: slidersNotActive.count,
                faqsCount: faqs.count,
                faqsNotActive: faqsNotActive.count,
                testmonias: testmonial.count,
                testmonialNotActive: testmonialNotActive.count,
                orderCount: order.count,
                orderNotActive: orderNotSeen.count,
            };
            res.locals.URL = url;
            res.locals.adminData = req.cookies.Admin;
            res.locals.FeaturesNumber = FeaturesNumber;
            res.locals.csrf = csrfToken;
        });
    }
    startFunctionForSite(req, res, url, csrfToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = req.cookies.User;
            const lang = req.cookies.lang ? req.cookies.lang : "en";
            let allUserFavorit = [];
            let cartAllProduct = [];
            if (userData) {
                allUserFavorit = yield favorits_1.default.findAndCountAll({
                    where: {
                        userId: userData.id,
                    },
                });
                cartAllProduct = yield shopingCart_1.default.findAndCountAll({
                    where: {
                        userId: userData.id,
                    },
                });
                cartAllProduct.rows.forEach((ele) => {
                    if (Date.now() >= ele.finishingTime) {
                        shopingCart_1.default.destroy({
                            where: {
                                id: ele.id,
                            },
                        });
                    }
                });
            }
            let allCatigoryForNave = yield categorys_1.default
                .scope("mainCategorys")
                .scope("active")
                .findAll({
                order: [["createdAt", "desc"]],
                limit: 10,
                attributes: [
                    "category_en",
                    "category_ar",
                    "id",
                    "createdAt",
                    "slug_ar",
                    "slug_en",
                ],
                include: [
                    {
                        model: categorys_1.default,
                        as: "allSupCategorys",
                        attributes: [
                            "category_en",
                            "category_ar",
                            "id",
                            "createdAt",
                            "slug_ar",
                            "slug_en",
                        ],
                    },
                ],
            });
            res.locals.URL = url;
            res.locals.userData = userData;
            res.locals.allUserFavorit = allUserFavorit.count || 0;
            res.locals.cartAllProduct = cartAllProduct.count || 0;
            res.locals.lang = lang;
            res.locals.allCatigoryForNave = allCatigoryForNave;
            res.locals.csrf = csrfToken;
        });
    }
}
exports.StartActions = StartActions;
class Outhers {
    getCatgoryFromArray(categorys) {
        return categorys.length > 1
            ? categorys[categorys.length - 1] != ""
                ? categorys[categorys.length - 1]
                : categorys[categorys.length - 2]
            : categorys[0];
    }
    getSumeOfArray(array) {
        let totalRate = 0;
        array.forEach((ele) => {
            totalRate += ele.rate;
        });
        return totalRate;
    }
    formateDate(date, type = "date") {
        if (type == "date") {
            return (0, moment_1.default)(date).format("YYYY-MM-DD");
        }
        else {
            return (0, moment_1.default)(date).format("hh-mm-ss");
        }
    }
    finalPrice(product) {
        const totalOfAll = {
            price: 0,
            structure: 0,
            shipping: 0,
            afterDescount: 0,
            beforeDescount: 0,
            totalPrice: 0,
        };
        let totalPriceWithCount = 0;
        product.forEach((element) => {
            totalOfAll.price += element.count * element.cartProduct.price;
            totalPriceWithCount = element.count * element.cartProduct.price;
            totalOfAll.afterDescount +=
                totalPriceWithCount -
                    (element.cartProduct.descount * totalPriceWithCount) / 100;
            totalOfAll.structure += element.count * element.cartProduct.structure;
            totalOfAll.shipping += element.cartProduct.shipping;
        });
        totalOfAll.totalPrice +=
            totalOfAll.afterDescount + totalOfAll.structure + totalOfAll.shipping;
        return totalOfAll;
    }
    finalPriceForAdmin(product, order) {
        const totalOfAll = {
            price: 0,
            structure: 0,
            shipping: 0,
            afterDescount: 0,
            beforeDescount: 0,
            totalPrice: 0,
        };
        let totalPriceWithCount = 0;
        let count = 0;
        product.forEach((element) => {
            count = 0;
            count = this.getCountOfEachProduct(order.productsId, order.productsCount, element.id);
            totalOfAll.price += count * element.price;
            totalPriceWithCount = count * element.price;
            totalOfAll.afterDescount +=
                totalPriceWithCount - (element.descount * totalPriceWithCount) / 100;
            totalOfAll.structure += count * element.structure;
            totalOfAll.shipping += element.shipping;
        });
        totalOfAll.totalPrice +=
            totalOfAll.afterDescount + totalOfAll.structure + totalOfAll.shipping;
        return totalOfAll;
    }
    priceForOneProduct(product, order) {
        const totalPrice = {
            price: 0,
            structure: 0,
            shipping: 0,
            afterDescount: 0,
            beforeDescount: 0,
            totalPrice: 0,
            count: 0,
        };
        let count = new Outhers().getCountOfEachProduct(order.productsId, order.productsCount, product.id);
        totalPrice.count = count;
        totalPrice.price += count * product.price;
        totalPrice.afterDescount +=
            totalPrice.price - (product.descount * totalPrice.price) / 100;
        totalPrice.structure += count * product.structure;
        totalPrice.shipping += product.shipping;
        totalPrice.totalPrice +=
            totalPrice.afterDescount + totalPrice.structure + totalPrice.shipping;
        return totalPrice;
    }
    getCountOfEachProduct(productsId, productCount, productId) {
        let count = 0;
        productsId = productsId.split(",");
        productCount = productCount.split(",");
        count = productCount[productsId.indexOf(productId + "")];
        return count;
    }
}
exports.Outhers = Outhers;
