"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersRoutes = void 0;
const express_1 = require("express");
const isAuthonticate_1 = require("../../middelwares/dashboard/isAuthonticate");
const orders_controller_1 = require("../../controllers/dashboard/orders.controller");
class OrdersRoutes {
    constructor() {
        this.orders = new orders_controller_1.Orders();
        this.isAuthonticate = new isAuthonticate_1.IsAuthonticate();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("/", this.isAuthonticate.isAuthonticate, this.orders.allOrders);
        this.Router.get("/not-seen/", this.isAuthonticate.isAuthonticate, this.orders.allOrdersNotSeen);
        this.Router.get("/not-finished/", this.isAuthonticate.isAuthonticate, this.orders.allOrdersNotFinished);
        this.Router.get("/finished/", this.isAuthonticate.isAuthonticate, this.orders.allOrdersFinished);
        this.Router.post("/finishOrder", this.isAuthonticate.isAuthonticate, this.orders.finishOrder);
        this.Router.post("/delete", this.isAuthonticate.isAuthonticate, this.orders.deleteOrder);
        this.Router.get("/:id", this.isAuthonticate.isAuthonticate, this.orders.showOrder);
        this.Router.get("/download-order-pdf/:id", this.isAuthonticate.isAuthonticate, this.orders.downloadOrderPdf);
    }
}
exports.OrdersRoutes = OrdersRoutes;
