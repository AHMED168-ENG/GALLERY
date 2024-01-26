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
const users_1 = __importDefault(require("../../models/users"));
const productsOrders_1 = __importDefault(require("../../models/productsOrders"));
const appSeting_1 = __importDefault(require("../../models/appSeting"));
class Orders {
    constructor() { }
    allOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPage;
                orders_1.default
                    .findAndCountAll({
                    order: [["createdAt", "desc"]],
                    include: [
                        {
                            model: users_1.default,
                            as: "orderUser",
                        },
                    ],
                })
                    .then((result) => {
                    res.render("dashboard/orders/allOrders", {
                        title: " all Orders",
                        notification: req.flash("notification"),
                        allOrders: result.rows,
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
    showOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const others = new helper_1.Outhers();
                const validationMessage = new helper_1.ValidationMessage();
                orders_1.default.update({ isSeen: true }, {
                    where: {
                        id: req.params.id,
                    },
                });
                orders_1.default
                    .findOne({
                    order: [["createdAt", "desc"]],
                    where: {
                        id: req.params.id,
                    },
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
                    .then((result) => __awaiter(this, void 0, void 0, function* () {
                    if (!result) {
                        return validationMessage.returnWithMessage(req, res, "/dashboard/orders/", "this order not registed hir", "danger");
                    }
                    const totalOfAll = others.finalPriceForAdmin(result.productOrderTable);
                    res.render("dashboard/orders/showOrder", {
                        title: " Dashboard | Show Order",
                        notification: req.flash("notification"),
                        order: result,
                        totalOfAll,
                        getTotalPriceForOneProduct: others.priceForOneProduct,
                    });
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    allOrdersFinished(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPage;
                orders_1.default
                    .findAndCountAll({
                    order: [["createdAt", "desc"]],
                    where: {
                        isFinished: true,
                    },
                    include: [
                        {
                            model: users_1.default,
                            as: "orderUser",
                        },
                    ],
                })
                    .then((result) => {
                    res.render("dashboard/orders/allOrdersFinished", {
                        title: " all Orders",
                        notification: req.flash("notification"),
                        allOrders: result.rows,
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
    allOrdersNotFinished(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPage;
                orders_1.default
                    .findAndCountAll({
                    order: [["createdAt", "desc"]],
                    where: {
                        isFinished: false,
                    },
                    include: [
                        {
                            model: users_1.default,
                            as: "orderUser",
                        },
                    ],
                })
                    .then((result) => {
                    res.render("dashboard/orders/allOrdersNotFinished", {
                        title: " all Orders",
                        notification: req.flash("notification"),
                        allOrders: result.rows,
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
    allOrdersNotSeen(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPage;
                orders_1.default
                    .findAndCountAll({
                    order: [["createdAt", "desc"]],
                    where: {
                        isSeen: false,
                    },
                    include: [
                        {
                            model: users_1.default,
                            as: "orderUser",
                        },
                    ],
                })
                    .then((result) => {
                    res.render("dashboard/orders/allOrdersNotSeen", {
                        title: " all Orders",
                        notification: req.flash("notification"),
                        allOrders: result.rows,
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
    finishOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isFinished = req.body.isFinished;
                const validationMessage = new helper_1.ValidationMessage();
                orders_1.default
                    .update({ isFinished: isFinished == "true" ? false : true }, {
                    where: {
                        id: req.body.id,
                    },
                })
                    .then((result) => {
                    const message = isFinished == "false"
                        ? "the order has finished successful"
                        : "the order has become unfit successful";
                    validationMessage.returnWithMessage(req, res, "/dashboard/orders/", message, "success");
                })
                    .catch((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validationMessage = new helper_1.ValidationMessage();
                orders_1.default
                    .destroy({
                    where: {
                        id: req.body.id,
                    },
                })
                    .then((result) => {
                    const message = "the order has deleted successful";
                    validationMessage.returnWithMessage(req, res, "/dashboard/orders/", message, "success");
                })
                    .catch((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
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
                        title: "mackOrder",
                        notification: req.flash("notification"),
                        totalOfAll,
                        allProductCart: result,
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
    addOrderPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ordersPdf = new helper_1.OrdersPdf();
                const userData = req.cookies.User;
                const lng = req.cookies.lng;
                shopingCart_1.default
                    .findAll({
                    where: {
                        userId: userData.id,
                    },
                })
                    .then((result) => {
                    orders_1.default
                        .create({
                        userId: userData.id,
                    })
                        .then((order) => __awaiter(this, void 0, void 0, function* () {
                        for (var x = 0; x < result.length; x++) {
                            yield productsOrders_1.default.create({
                                orderId: order.id,
                                productId: result[x].productId,
                                productCount: result[x].count,
                            });
                        }
                        const orderData = yield orders_1.default.findOne({
                            where: {
                                id: order.id,
                            },
                            include: [
                                {
                                    model: productsOrders_1.default,
                                    as: "productOrderTable",
                                    include: [{ model: products_1.default, as: "productTable" }],
                                },
                            ],
                        });
                        console.log(orderData.productOrderTable);
                        const app_setting = yield appSeting_1.default.findOne({
                            attributes: ["sitName_en"],
                        });
                        ordersPdf.createPdf(res, app_setting, orderData, req.t, lng, req.cookies.User);
                        res.send({
                            status: true,
                            message: req.t("orderCreate"),
                        });
                    }))
                        .catch((error) => error);
                })
                    .catch((error) => error);
            }
            catch (error) {
                res.send({
                    status: false,
                    message: error.message,
                });
            }
        });
    }
    userOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const othersFn = new helper_1.Outhers();
                const page = req.query.page || 1;
                const PAGE_ITEMS = +process.env.elementPerPageSite;
                orders_1.default
                    .findAndCountAll({
                    distinct: true,
                    order: [["createdAt", "desc"]],
                })
                    .then((result) => {
                    res.render("website/userpages/userOrders", {
                        title: "yourOrders",
                        notification: req.flash("notification"),
                        allOrders: result.rows,
                        hasPrevious: page > 1,
                        hasNext: PAGE_ITEMS * page < result.count,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        curantPage: +page,
                        allElementCount: result.count,
                        elements: +PAGE_ITEMS,
                        lastPage: Math.ceil(result.count / PAGE_ITEMS),
                        metaKeywords: null,
                        metaDescription: null,
                        formateDate: othersFn.formateDate,
                    });
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    showOrderDetailsForUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const others = new helper_1.Outhers();
                const userData = req.cookies.User;
                orders_1.default
                    .findOne({
                    order: [["createdAt", "desc"]],
                    where: {
                        id: req.params.id,
                        userId: userData.id,
                    },
                    include: [
                        {
                            model: productsOrders_1.default,
                            as: "productOrderTable",
                            include: [{ model: products_1.default, as: "productTable" }],
                        },
                    ],
                })
                    .then((result) => __awaiter(this, void 0, void 0, function* () {
                    if (!result) {
                        return res.redirect("/your-orders");
                    }
                    const totalOfAll = others.finalPriceForAdmin(result.productOrderTable);
                    res.render("website/userpages/showOrderDetails", {
                        title: " Dashboard | Show Order",
                        notification: req.flash("notification"),
                        order: result,
                        totalOfAll,
                        getTotalPriceForOneProduct: others.priceForOneProduct,
                        metaKeywords: null,
                        metaDescription: null,
                    });
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    downloadOrderPdf(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ordersPdf = new helper_1.OrdersPdf();
                const params = req.params;
                const userData = req.cookies.User;
                orders_1.default
                    .findOne({
                    where: {
                        id: params.id,
                        userId: userData.id,
                    },
                })
                    .then((result) => __awaiter(this, void 0, void 0, function* () {
                    const app_setting = yield appSeting_1.default.findOne({
                        attributes: ["sitName_en"],
                    });
                    ordersPdf.downloadPdf(res, app_setting, params.id);
                }))
                    .catch((error) => error);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.Orders = Orders;
