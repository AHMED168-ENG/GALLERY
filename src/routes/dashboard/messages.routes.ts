import { Router } from "express";
import { IsAuthonticate } from "../../middelwares/dashboard/isAuthonticate";
import { MessageController } from "../../controllers/dashboard/messages.controllers";

export class MessagesRoutes {
  public Router: Router;
  private messagesController: MessageController;
  private isAuthonticate: IsAuthonticate;
  constructor() {
    this.messagesController = new MessageController();
    this.isAuthonticate = new IsAuthonticate();
    this.Router = Router();
    this.routes();
  }
  routes(): void {
    this.Router.get(
      "/",
      this.isAuthonticate.isAuthonticate,
      this.messagesController.findAll
    );
    this.Router.post(
      "/create",
      this.isAuthonticate.isAuthonticate,
      this.messagesController.crearePost
    );
    this.Router.get(
      "/not-seen",
      this.isAuthonticate.isAuthonticate,
      this.messagesController.findAllNotSeen
    );
    this.Router.get(
      "/:id",
      this.isAuthonticate.isAuthonticate,
      this.messagesController.findMessage
    );

    this.Router.post(
      "/delete",
      this.isAuthonticate.isAuthonticate,
      this.messagesController.deleteMessage
    );
  }
}
