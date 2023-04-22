import { Router } from "express";
import { FilesOperations } from "../../helpers/helper";
import { IsAuthonticate } from "../../middelwares/dashboard/isAuthonticate";
import { TestmonialsController } from "../../controllers/dashboard/testmonials.controllers";

export class TestmonialRoutes {
  public Router: Router;
  private filesOperations: FilesOperations;
  private isAuthonticate: IsAuthonticate;
  private testmonialsController: TestmonialsController;
  constructor() {
    this.filesOperations = new FilesOperations();
    this.isAuthonticate = new IsAuthonticate();
    this.testmonialsController = new TestmonialsController();
    this.Router = Router();
    this.routes();
  }
  routes(): void {
    this.Router.get(
      "/",
      this.isAuthonticate.isAuthonticate,
      this.testmonialsController.findAll
    );
    this.Router.get(
      "/show/:id",
      this.isAuthonticate.isAuthonticate,
      this.testmonialsController.showTestmonial
    );
    this.Router.post(
      "/show/:id",
      this.isAuthonticate.isAuthonticate,
      this.testmonialsController.showTestmonialPost
    );

    this.Router.post(
      "/activation",
      this.isAuthonticate.isAuthonticate,
      this.testmonialsController.activation
    );
    this.Router.post(
      "/delete",
      this.isAuthonticate.isAuthonticate,
      this.testmonialsController.deleteTestmonial
    );
  }
}
