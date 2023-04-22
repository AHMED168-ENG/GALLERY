"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuthonticate_1 = require("../../middelwares/dashboard/isAuthonticate");
const comments_controller_1 = require("../../controllers/dashboard/comments.controller");
class CommentsRoutes {
    constructor() {
        this.commentsController = new comments_controller_1.CommentsController();
        this.isAuthonticate = new isAuthonticate_1.IsAuthonticate();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.post("/create", this.commentsController.create);
        this.Router.post("/addRate", this.commentsController.addRate);
        this.Router.get("/all-comments", this.isAuthonticate.isAuthonticate, this.commentsController.findAllForAdmin);
        this.Router.get("/all-comments", this.isAuthonticate.isAuthonticate, this.commentsController.findAllForUser);
    }
}
exports.default = CommentsRoutes;
