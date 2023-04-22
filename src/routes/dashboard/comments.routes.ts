import { Router } from "express";
import DashboardController from "../../controllers/dashboard/dashboard.controller";
import { IsAuthonticate } from "../../middelwares/dashboard/isAuthonticate";
import { CommentsController } from "../../controllers/dashboard/comments.controller";
class CommentsRoutes {
  public Router: Router;
  public isAuthonticate: IsAuthonticate;
  public commentsController: CommentsController;
  constructor() {
    this.commentsController = new CommentsController();
    this.isAuthonticate = new IsAuthonticate();
    this.Router = Router();
    this.routes();
  }
  routes() {
    this.Router.post("/create", this.commentsController.create);
    this.Router.post("/addRate", this.commentsController.addRate);
    this.Router.get(
      "/all-comments",
      this.isAuthonticate.isAuthonticate,
      this.commentsController.findAllForAdmin
    );
    this.Router.get(
      "/all-comments",
      this.isAuthonticate.isAuthonticate,
      this.commentsController.findAllForUser
    );
  }
}

export default CommentsRoutes;
