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
const categorys_1 = __importDefault(require("../../models/categorys"));
const products_1 = __importDefault(require("../../models/products"));
const userSearch_1 = __importDefault(require("../../models/userSearch"));
const sequelize_1 = require("sequelize");
const sliders_1 = __importDefault(require("../../models/sliders"));
const helper_1 = require("../../helpers/helper");
const comments_1 = __importDefault(require("../../models/comments"));
const users_1 = __importDefault(require("../../models/users"));
const userRate_1 = __importDefault(require("../../models/userRate"));
const favorits_1 = __importDefault(require("../../models/favorits"));
const shopingCart_1 = __importDefault(require("../../models/shopingCart"));
const testmonials_1 = __importDefault(require("../../models/testmonials"));
const faqs_1 = __importDefault(require("../../models/faqs"));
const statsSection_1 = __importDefault(require("../../models/statsSection"));
const gallery_1 = __importDefault(require("../../models/gallery"));
class SitePagesController {
    constructor() { }
    home(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.cookies.User;
                let allCatigory = yield categorys_1.default
                    .scope("mainCategorys")
                    .scope("active")
                    .findAll({
                    order: [["createdAt", "desc"]],
                    limit: 12,
                    attributes: [
                        "image",
                        "id",
                        "category_ar",
                        "category_en",
                        "createdAt",
                        "slug_ar",
                        "slug_en",
                    ],
                    include: [
                        { model: products_1.default, as: "products", attributes: ["id"] },
                    ],
                });
                let productWithHigeRate = yield products_1.default.scope("active").findAll({
                    order: [["sumRate", "desc"]],
                });
                let latestProduct = yield products_1.default.scope("active").findAll({
                    limit: 8,
                    order: [["createdAt", "desc"]],
                    include: [{ model: userRate_1.default, as: "allRate" }],
                });
                let categoryWithHighDescount = yield products_1.default
                    .scope("active")
                    .findAll({
                    limit: 8,
                    order: [["descount", "desc"]],
                    attributes: ["descount", "id", "category"],
                    include: [{ model: categorys_1.default, as: "ProductCategory" }],
                });
                let productWithHighDescount = yield products_1.default.scope("active").findAll({
                    limit: 8,
                    order: [["descount", "desc"]],
                    include: [{ model: userRate_1.default, as: "allRate" }],
                    attributes: [
                        "descount",
                        "sumRate",
                        "id",
                        "category",
                        "productImage",
                        "price",
                        "productName_ar",
                        "productName_en",
                        "slug_ar",
                        "slug_en",
                    ],
                });
                let productWithHighRate = yield products_1.default.scope("active").findAll({
                    limit: 8,
                    order: [["sumRate", "desc"]],
                    include: [{ model: userRate_1.default, as: "allRate" }],
                    attributes: [
                        "descount",
                        "id",
                        "category",
                        "productImage",
                        "price",
                        "productName_ar",
                        "productName_en",
                        "slug_ar",
                        "slug_en",
                        "sumRate",
                    ],
                });
                let favoritProducts = [];
                let shopingCart = [];
                if (userData) {
                    const myArrFavorit = yield favorits_1.default.findAll({
                        where: {
                            userId: userData.id,
                        },
                        attributes: ["productId"],
                    });
                    const myArrCart = yield shopingCart_1.default.findAll({
                        where: {
                            userId: userData.id,
                        },
                        attributes: ["productId"],
                    });
                    myArrFavorit.forEach((ele) => {
                        favoritProducts.push(ele.productId);
                    });
                    myArrCart.forEach((ele) => {
                        shopingCart.push(ele.productId);
                    });
                    let userSearch = yield userSearch_1.default.findOne({
                        where: {
                            userId: userData.id,
                        },
                    });
                }
                let carosalsTop = yield sliders_1.default.scope("active").findAll({
                    where: {
                        position: "HOME_TOP",
                    },
                });
                let someTestmonials = yield testmonials_1.default.scope("active").findAll({
                    limit: 6,
                    order: [["rate", "desc"]],
                    include: [{ model: users_1.default, as: "testmonialsUser" }],
                });
                let statsSection = yield statsSection_1.default.findOne({});
                res.render("website/userpages/home", {
                    title: "home",
                    notification: req.flash("notification"),
                    allCatigory: allCatigory,
                    latestProduct: latestProduct,
                    productWithHigeRate: productWithHigeRate,
                    productWithHighDescount: productWithHighDescount,
                    categoryWithHighDescount: categoryWithHighDescount,
                    productWithHighRate: productWithHighRate,
                    carosalsTop: carosalsTop,
                    catigorysRelatedWithSearch: [],
                    productRelatedWithSearch: [],
                    spechialVendoer: [],
                    favoritProducts,
                    shopingCart,
                    someTestmonials,
                    statsSection,
                    metaKeywords: null,
                    metaDescription: null,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    allCategorys(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPageSite;
                let allCatigory = yield categorys_1.default.scope("active").findAll({
                    order: [["createdAt", "desc"]],
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: PAGE_ITEMS,
                    attributes: [
                        "image",
                        "id",
                        "category_ar",
                        "category_en",
                        "createdAt",
                        "slug_ar",
                        "slug_en",
                    ],
                    include: [
                        {
                            model: products_1.default,
                            as: "products",
                            attributes: ["id"],
                        },
                    ],
                });
                const allCatigoryCount = yield categorys_1.default
                    .scope("active")
                    .findAndCountAll({});
                res.render("website/userpages/allCategorys", {
                    title: "ALLCATEGORIES",
                    notification: req.flash("notification"),
                    allCatigory: allCatigory,
                    hasPrevious: page > 1,
                    hasNext: PAGE_ITEMS * page < allCatigoryCount.count,
                    nextPage: page + 1,
                    previousPage: page - 1,
                    curantPage: +page,
                    allElementCount: allCatigoryCount.count,
                    elements: +PAGE_ITEMS,
                    lastPage: Math.ceil(allCatigoryCount.count / PAGE_ITEMS),
                    metaDescription: null,
                    metaKeywords: null,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    allProducts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.cookies.User;
                const Query = req.query;
                const page = Query.page || 1;
                let sorting = Query["sort"];
                if (sorting) {
                    sorting = sorting.split(",");
                }
                const PAGE_ITEMS = +process.env.elementPerPageSite;
                const condition = {
                    [sequelize_1.Op.or]: [
                        {
                            productName_ar: { [sequelize_1.Op.like]: `%${Query.products || ""}%` },
                        },
                        {
                            productName_en: { [sequelize_1.Op.like]: `%${Query.products || ""}%` },
                        },
                        {
                            keyWord: { [sequelize_1.Op.like]: `%${Query.products || ""}%` },
                        },
                        {
                            fullDescription_ar: { [sequelize_1.Op.like]: `%${Query.products || ""}%` },
                        },
                        {
                            fullDescription_en: { [sequelize_1.Op.like]: `%${Query.products || ""}%` },
                        },
                        {
                            statmentDescription_ar: { [sequelize_1.Op.like]: `%${Query.products || ""}%` },
                        },
                        {
                            statmentDescription_en: { [sequelize_1.Op.like]: `%${Query.products || ""}%` },
                        },
                    ],
                    price: Query.priceMin && Query.priceMax
                        ? {
                            [sequelize_1.Op.and]: [
                                {
                                    [sequelize_1.Op.gte]: Query.priceMin,
                                },
                                {
                                    [sequelize_1.Op.lte]: Query.priceMax,
                                },
                            ],
                        }
                        : Query.priceMin && !Query.priceMax
                            ? {
                                [sequelize_1.Op.gte]: Query.priceMin,
                            }
                            : !Query.priceMin && Query.priceMax
                                ? { [sequelize_1.Op.lte]: Query.priceMax }
                                : { [sequelize_1.Op.gt]: 0 },
                    sumRate: Query.rate ? { [sequelize_1.Op.lte]: Query.rate } : { [sequelize_1.Op.gte]: 0 },
                    descount: Query.descount
                        ? Query.descount == "false"
                            ? { [sequelize_1.Op.eq]: 0 }
                            : { [sequelize_1.Op.gt]: 0 }
                        : { [sequelize_1.Op.gte]: 0 },
                    shipping: Query.shipping
                        ? Query.shipping == "false"
                            ? { [sequelize_1.Op.eq]: 0 }
                            : { [sequelize_1.Op.gt]: 0 }
                        : { [sequelize_1.Op.gte]: 0 },
                };
                let allProducts = yield products_1.default.scope("active").findAndCountAll({
                    where: condition,
                    order: sorting ? [sorting] : [],
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: PAGE_ITEMS,
                    distinct: true,
                    include: [
                        {
                            model: categorys_1.default,
                            as: "ProductCategory",
                            required: true,
                            where: Query.category
                                ? {
                                    [sequelize_1.Op.or]: [
                                        {
                                            slug_ar: Query.category,
                                        },
                                        {
                                            slug_en: Query.category,
                                        },
                                    ],
                                }
                                : {},
                        },
                        { model: userRate_1.default, as: "allRate" },
                    ],
                });
                let favoritProducts = [];
                let shopingCart = [];
                if (userData) {
                    const myArrFavorit = yield favorits_1.default.findAll({
                        where: {
                            userId: userData.id,
                        },
                        attributes: ["productId"],
                    });
                    const myArrCart = yield shopingCart_1.default.findAll({
                        where: {
                            userId: userData.id,
                        },
                        attributes: ["productId"],
                    });
                    myArrFavorit.forEach((ele) => {
                        favoritProducts.push(ele.productId);
                    });
                    myArrCart.forEach((ele) => {
                        shopingCart.push(ele.productId);
                    });
                }
                let allCategorys = yield categorys_1.default.scope("active").findAll({});
                res.render("website/userpages/allProducts", {
                    title: "ALLPRODUCTS",
                    notification: req.flash("notification"),
                    allProducts: allProducts.rows,
                    hasPrevious: page > 1,
                    hasNext: PAGE_ITEMS * page < allProducts.count,
                    nextPage: page + 1,
                    previousPage: page - 1,
                    curantPage: +page,
                    allElementCount: allProducts.count,
                    elements: +PAGE_ITEMS,
                    lastPage: Math.ceil(allProducts.count / PAGE_ITEMS),
                    allCategorys: allCategorys,
                    favoritProducts: favoritProducts,
                    shopingCart: shopingCart,
                    Query: Query,
                    metaDescription: null,
                    metaKeywords: null,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    allComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Query = req.query;
                const page = Query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPageSite;
                const othersFn = new helper_1.Outhers();
                const product = yield products_1.default.scope("active").findOne({
                    where: {
                        [sequelize_1.Op.or]: [{ slug_ar: req.params.slug }, { slug_en: req.params.slug }],
                    },
                });
                let order = Query.filter
                    ? [[Query.filter, Query.type]]
                    : [["createdAt", "desc"]];
                const allComments = yield comments_1.default.scope("active").findAndCountAll({
                    where: {
                        productId: product.id,
                        comment: {
                            [sequelize_1.Op.like]: Query.search ? "%" + Query.search + "%" : "%",
                        },
                    },
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: PAGE_ITEMS,
                    distinct: true,
                    order: order,
                    include: [
                        {
                            model: users_1.default,
                            as: "commentUser",
                        },
                    ],
                });
                res.render("website/userpages/allCommentsProduct", {
                    title: "allComments",
                    notification: req.flash("notification"),
                    allComments: allComments.rows,
                    hasPrevious: page > 1,
                    hasNext: PAGE_ITEMS * page < allComments.count,
                    nextPage: page + 1,
                    previousPage: page - 1,
                    curantPage: +page,
                    allElementCount: allComments.count,
                    elements: +PAGE_ITEMS,
                    lastPage: Math.ceil(allComments.count / PAGE_ITEMS),
                    query: Query,
                    formateDate: othersFn.formateDate,
                    product,
                    metaDescription: null,
                    metaKeywords: null,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    productDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationMessage = new helper_1.ValidationMessage();
                const othersFn = new helper_1.Outhers();
                const userData = req.cookies.User;
                const lng = req.cookies.lng;
                let product = yield products_1.default.scope("active").findOne({
                    where: {
                        [sequelize_1.Op.or]: [
                            {
                                slug_ar: req.params.slug,
                            },
                            {
                                slug_en: req.params.slug,
                            },
                        ],
                    },
                    include: [
                        {
                            model: comments_1.default,
                            as: "allComments",
                            where: { active: true },
                            limit: 2,
                            order: [["createdAt", "desc"]],
                            include: [
                                {
                                    model: users_1.default,
                                    as: "commentUser",
                                    attributes: ["fName", "lName", "image", "id", "createdAt"],
                                },
                            ],
                        },
                        {
                            model: userRate_1.default,
                            as: "allRate",
                        },
                        {
                            model: categorys_1.default,
                            as: "ProductCategory",
                        },
                    ],
                });
                if (!product) {
                    validationMessage.returnWithMessage(req, res, "/all-products", "this product not registed", "danger");
                    return;
                }
                let allComments = yield comments_1.default.scope("active").findAndCountAll({
                    where: {
                        productId: product.id,
                    },
                });
                let allProductRate = yield userRate_1.default.findAll({
                    where: {
                        productId: product.id,
                    },
                    include: [{ model: users_1.default, as: "rateUser", attributes: ["id"] }],
                });
                let favoritProducts = [];
                let userRate = null;
                let shopingCart = [];
                if (userData) {
                    userRate = allProductRate.find((element) => element.userId == userData.id);
                    const myArrFavorit = yield favorits_1.default.findAll({
                        where: {
                            userId: userData.id,
                        },
                        attributes: ["productId"],
                    });
                    const myArrCart = yield shopingCart_1.default.findAll({
                        where: {
                            userId: userData.id,
                        },
                        attributes: ["productId"],
                    });
                    myArrFavorit.forEach((ele) => {
                        favoritProducts.push(ele.productId);
                    });
                    myArrCart.forEach((ele) => {
                        shopingCart.push(ele.productId);
                    });
                }
                const productRelated = yield products_1.default.scope("active").findAll({
                    where: {
                        id: { [sequelize_1.Op.ne]: product.id },
                        category: product.category,
                    },
                    limit: 8,
                    order: [["createdAt", "desc"]],
                    include: [{ model: userRate_1.default, as: "allRate" }],
                });
                res.render("website/userpages/productDetails", {
                    title: product["slug_" + lng],
                    notification: req.flash("notification"),
                    product: product,
                    allComments: allComments,
                    allProductRate: allProductRate,
                    userRate: userRate,
                    productRelated: productRelated,
                    sumOfRate: othersFn.getSumeOfArray,
                    secretKey: process.env.recaptcherSecretKey,
                    favoritProducts,
                    shopingCart,
                    metaDescription: product["metaDescription_" + lng],
                    metaKeywords: product["metaKeywords_" + lng],
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    contactUs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.render("website/userpages/contactUs", {
                    title: "contactUs",
                    notification: req.flash("notification"),
                    secretKey: process.env.recaptcherSecretKey,
                    metaDescription: null,
                    metaKeywords: null,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    showTestmonials(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Query = req.query;
                const page = Query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPageSite;
                testmonials_1.default
                    .scope("active")
                    .findAndCountAll({
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: PAGE_ITEMS,
                    distinct: true,
                    include: [
                        {
                            model: users_1.default,
                            as: "testmonialsUser",
                        },
                    ],
                })
                    .then((result) => __awaiter(this, void 0, void 0, function* () {
                    res.render("website/userpages/testmonialsPage", {
                        title: "allTestmonials",
                        notification: req.flash("notification"),
                        allTestmonials: result.rows,
                        hasPrevious: page > 1,
                        hasNext: PAGE_ITEMS * page < result.count,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        curantPage: +page,
                        allElementCount: result.count,
                        elements: +PAGE_ITEMS,
                        lastPage: Math.ceil(result.count / PAGE_ITEMS),
                        query: Query,
                        numberOfLetters: +process.env.NUMBER_OF_LETTERS_OF_TESTMONIAL,
                        secretKey: process.env.recaptcherSecretKey,
                        metaDescription: null,
                        metaKeywords: null,
                    });
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    faqs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Query = req.query;
                const page = Query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPageSite;
                faqs_1.default
                    .scope("active")
                    .findAndCountAll({
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: PAGE_ITEMS,
                    order: [["createdAt", "desc"]],
                })
                    .then((result) => __awaiter(this, void 0, void 0, function* () {
                    res.render("website/userpages/faqs", {
                        title: "allFaqs",
                        notification: req.flash("notification"),
                        allfaqs: result.rows,
                        hasPrevious: page > 1,
                        hasNext: PAGE_ITEMS * page < result.count,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        curantPage: +page,
                        allElementCount: result.count,
                        elements: +PAGE_ITEMS,
                        lastPage: Math.ceil(result.count / PAGE_ITEMS),
                        query: Query,
                        metaDescription: null,
                        metaKeywords: null,
                    });
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    gallery(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Query = req.query;
                const page = Query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPageSite;
                gallery_1.default
                    .scope("active")
                    .findAndCountAll({
                    offset: +((page - 1) * PAGE_ITEMS),
                    limit: PAGE_ITEMS,
                    order: [["createdAt", "desc"]],
                    include: [
                        {
                            model: products_1.default,
                            as: "galleryProduct",
                            attributes: ["slug_ar", "slug_en"],
                        },
                    ],
                })
                    .then((result) => __awaiter(this, void 0, void 0, function* () {
                    res.render("website/userpages/gallery", {
                        title: "ProductsGallery",
                        notification: req.flash("notification"),
                        gallerys: result.rows,
                        hasPrevious: page > 1,
                        hasNext: PAGE_ITEMS * page < result.count,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        curantPage: +page,
                        allElementCount: result.count,
                        elements: +PAGE_ITEMS,
                        lastPage: Math.ceil(result.count / PAGE_ITEMS),
                        query: Query,
                        metaDescription: null,
                        metaKeywords: null,
                    });
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    personalInformation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                users_1.default
                    .scope("active")
                    .findOne({
                    where: {
                        id: req.cookies.User.id,
                    },
                })
                    .then((result) => __awaiter(this, void 0, void 0, function* () {
                    res.render("website/userpages/personalInformation", {
                        title: "editPersonalInformation",
                        notification: req.flash("notification"),
                        validationError: req.flash("validationError")[0] || {},
                        user: result,
                        bodyData: req.flash("bodyData")[0],
                        metaDescription: null,
                        metaKeywords: null,
                    });
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = SitePagesController;
