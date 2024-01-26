"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesRoutes = void 0;
const express_1 = require("express");
const isAuthonticate_1 = require("../../middelwares/dashboard/isAuthonticate");
const messages_controllers_1 = require("../../controllers/dashboard/messages.controllers");
class MessagesRoutes {
    constructor() {
        this.messagesController = new messages_controllers_1.MessageController();
        this.isAuthonticate = new isAuthonticate_1.IsAuthonticate();
        this.Router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.Router.get("/", this.isAuthonticate.isAuthonticate, this.messagesController.findAll);
        this.Router.post("/create", this.messagesController.crearePost);
        this.Router.get("/not-seen", this.isAuthonticate.isAuthonticate, this.messagesController.findAllNotSeen);
        this.Router.get("/:id", this.isAuthonticate.isAuthonticate, this.messagesController.findMessage);
        this.Router.post("/delete", this.isAuthonticate.isAuthonticate, this.messagesController.deleteMessage);
    }
}
exports.MessagesRoutes = MessagesRoutes;
