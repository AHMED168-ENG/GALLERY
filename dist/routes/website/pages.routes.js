"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pages_1 = __importDefault(require("../../controllers/website/pages"));
const userAuthonticate_1 = require("../../middelwares/websit/userAuthonticate");
const favoritProducts_controller_1 = require("../../controllers/dashboard/favoritProducts.controller");
const shopingCart_controller_1 = require("../../controllers/dashboard/shopingCart.controller");
const orders_controller_1 = require("../../controllers/dashboard/orders.controller");
const products_controllers_1 = require("../../controllers/dashboard/products.controllers");
const userSearch_controller_1 = require("../../controllers/dashboard/userSearch.controller");
const testmonials_controllers_1 = require("../../controllers/dashboard/testmonials.controllers");
class SitePageRoutes {
    constructor() {
        this.sitePagesController = new pages_1.default();
        this.favoritProductsController = new favoritProducts_controller_1.FavoritProductsController();
        this.shopingCartController = new shopingCart_controller_1.ShopingCartController();
        this.productController = new products_controllers_1.ProductController();
        this.userSearch = new userSearch_controller_1.UserSearch();
        this.orders = new orders_controller_1.Orders();
        this.testmonialsController = new testmonials_controllers_1.TestmonialsController();
        this.userAuthonticat = new userAuthonticate_1.UserAuthonticat();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("/home", this.sitePagesController.home);
        this.Router.get("/all-categorys", this.sitePagesController.allCategorys);
        this.Router.get("/all-products", this.sitePagesController.allProducts);
        this.Router.get("/contact-us", this.sitePagesController.contactUs);
        this.Router.get("/faqs", this.sitePagesController.faqs);
        this.Router.get("/search-product", this.productController.findAllProductFromSearch);
        this.Router.post("/add-user-search", this.userAuthonticat.isAuthonticate, this.userSearch.addUserSearch);
        this.Router.get("/product-Details/:slug", this.sitePagesController.productDetails);
        this.Router.get("/all-comments/:slug", this.sitePagesController.allComments);
        this.Router.post("/add-to-favorit-cart", this.userAuthonticat.isAuthonticate, this.favoritProductsController.addFavoritProduct);
        this.Router.get("/favorit-cart", this.userAuthonticat.isAuthonticate, this.favoritProductsController.showFavoritCart);
        this.Router.post("/add-to-shoping-cart", this.userAuthonticat.isAuthonticate, this.shopingCartController.addShopingCart);
        this.Router.get("/shoping-cart", this.userAuthonticat.isAuthonticate, this.shopingCartController.showShopingCart);
        this.Router.post("/shoping-cart-count", this.userAuthonticat.isAuthonticate, this.shopingCartController.changeCountInShopCart);
        this.Router.get("/mack-order", this.userAuthonticat.isAuthonticate, this.orders.showOrderPage);
        this.Router.post("/mack-order", this.userAuthonticat.isAuthonticate, this.orders.addOrderPost);
        this.Router.get("/testmonials", this.sitePagesController.showTestmonials);
        this.Router.post("/add-testmonials", this.userAuthonticat.isAuthonticate, this.testmonialsController.crearePost);
    }
}
exports.default = SitePageRoutes;
