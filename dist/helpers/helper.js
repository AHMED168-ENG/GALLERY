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
exports.OrdersPdf = exports.Outhers = exports.StartActions = exports.FilesOperations = exports.ValidationMessage = void 0;
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
const appSeting_1 = __importDefault(require("../models/appSeting"));
const pdfkit_table_1 = __importDefault(require("pdfkit-table"));
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
            let sitSetting = yield appSeting_1.default.findOne({});
            res.locals.URL = url;
            res.locals.sitSetting = sitSetting;
            res.locals.adminData = req.cookies.Admin;
            res.locals.FeaturesNumber = FeaturesNumber;
            res.locals.csrf = csrfToken;
        });
    }
    startFunctionForSite(req, res, url, csrfToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = req.cookies.User;
            const lang = req.cookies.lng || "en";
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
            let sitSetting = yield appSeting_1.default.findOne({});
            res.locals.URL = url;
            res.locals.userData = userData;
            res.locals.allUserFavorit = allUserFavorit.count || 0;
            res.locals.cartAllProduct = cartAllProduct.count || 0;
            res.locals.lang = lang;
            res.locals.trans = req.t;
            res.locals.sitSetting = sitSetting;
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
        else if ("houre") {
            return (0, moment_1.default)(date).format("hh-mm-ss");
        }
    }
    finalPrice(product) {
        const totalOfAll = {
            price: 0,
            structure: 0,
            shipping: 0,
            afterDescount: 0,
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
    finalPriceForAdmin(products) {
        const totalOfAll = {
            price: 0,
            structure: 0,
            shipping: 0,
            afterDescount: 0,
            totalPrice: 0,
        };
        let totalPriceWithCount = 0;
        let count = 0;
        products.forEach((element) => {
            count = element.productCount;
            totalOfAll.price += count * element.productTable.price;
            totalPriceWithCount = count * element.productTable.price;
            totalOfAll.afterDescount +=
                totalPriceWithCount -
                    (element.productTable.descount * totalPriceWithCount) / 100;
            totalOfAll.structure += count * element.productTable.structure;
            totalOfAll.shipping += element.productTable.shipping;
        });
        totalOfAll.totalPrice +=
            totalOfAll.afterDescount + totalOfAll.structure + totalOfAll.shipping;
        console.log(totalOfAll);
        return totalOfAll;
    }
    priceForOneProduct(order) {
        const totalPrice = {
            price: 0,
            structure: 0,
            shipping: 0,
            afterDescount: 0,
            totalPrice: 0,
            count: 0,
        };
        let count = order.productCount;
        let product = order.productTable;
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
}
exports.Outhers = Outhers;
class OrdersPdf {
    createPdf(res, app_setting, order, trans, lng, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const pdfName = `${app_setting.sitName_en}_order_${order.id}.pdf`;
            const pdfDirPath = path_1.default.join(__dirname, "../ordersPdf/");
            const pdfPath = path_1.default.join(__dirname, "../ordersPdf/" + pdfName);
            const pdfDoc = new pdfkit_table_1.default();
            if (!fs_1.default.existsSync(pdfDirPath)) {
                fs_1.default.mkdirSync(pdfDirPath);
            }
            const writeStream = fs_1.default.createWriteStream(pdfPath, {
                encoding: "utf8",
            });
            pdfDoc.pipe(writeStream);
            pdfDoc
                .text(`Hello Mr ( ${userData.fName + " " + userData.lName} )`, {
                align: "center",
            })
                .moveDown();
            let productsData = [];
            order.productOrderTable.forEach((ele) => {
                productsData.push([
                    ele.productTable["productName_" + lng],
                    ele.productCount.toString(),
                    ele.productTable.price + trans("Eg"),
                ]);
            });
            const table = {
                title: trans("Bill") + ("#" + order.id),
                subtitle: trans("ProductsData"),
                headers: [trans("products"), trans("count"), trans("RealPrice")],
                rows: productsData,
            };
            pdfDoc.table(table);
            pdfDoc.moveDown();
            const getFinalPrice = new Outhers().finalPriceForAdmin(order.productOrderTable);
            const finalPriceTable = {
                title: "",
                subtitle: trans("finalPriceData"),
                headers: [
                    trans("Structure"),
                    trans("Shipping"),
                    trans("totalPriceBeforeDescount"),
                    trans("TotalAfterDescount"),
                    trans("TotalAfterDescountWith"),
                ],
                rows: [
                    [
                        getFinalPrice.structure + " " + trans("Eg"),
                        getFinalPrice.shipping + " " + trans("Eg"),
                        getFinalPrice.price + " " + trans("Eg"),
                        getFinalPrice.afterDescount + " " + trans("Eg"),
                        getFinalPrice.totalPrice + " " + trans("Eg"),
                    ],
                ],
            };
            pdfDoc.table(finalPriceTable);
            pdfDoc.end();
        });
    }
    downloadPdf(res, app_setting, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pdfName = `${app_setting.sitName_en}_order_${orderId}.pdf`;
            const pdfPath = path_1.default.join(__dirname, "../ordersPdf/" + pdfName);
            if (!fs_1.default.existsSync(pdfPath))
                return res.redirect("/your-orders");
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment;filename="${pdfName}"`);
            const readStream = fs_1.default.createReadStream(path_1.default.join(pdfPath));
            readStream.pipe(res);
        });
    }
}
exports.OrdersPdf = OrdersPdf;
