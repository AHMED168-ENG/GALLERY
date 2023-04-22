import { Router } from "express";
import { IsAuthonticate } from "../../middelwares/dashboard/isAuthonticate";
import { FaqsController } from "../../controllers/dashboard/faqs.controllers";
import { AddFaqsValidation } from "../../validations/dashboard/faqs/addValidation";
import { UpdateFaqsValidation } from "../../validations/dashboard/faqs/editValidation";

export class FaqsRoutes {
  public Router: Router;
  private addFaqsValidation: AddFaqsValidation;
  private updateFaqsValidation: UpdateFaqsValidation;
  private faqsController: FaqsController;
  private isAuthonticate: IsAuthonticate;
  constructor() {
    this.addFaqsValidation = new AddFaqsValidation();
    this.updateFaqsValidation = new UpdateFaqsValidation();
    this.faqsController = new FaqsController();
    this.isAuthonticate = new IsAuthonticate();
    this.Router = Router();
    this.routes();
  }
  routes(): void {
    this.Router.get(
      "/",
      this.isAuthonticate.isAuthonticate,
      this.faqsController.findAll
    );

    this.Router.get(
      "/create",
      this.isAuthonticate.isAuthonticate,
      this.faqsController.create
    );
    this.Router.post(
      "/create",
      this.isAuthonticate.isAuthonticate,
      this.addFaqsValidation.validation(),
      this.faqsController.crearePost
    );
    this.Router.get(
      "/update/:id",
      this.isAuthonticate.isAuthonticate,
      this.faqsController.update
    );
    this.Router.post(
      "/update/:id",
      this.isAuthonticate.isAuthonticate,
      this.updateFaqsValidation.validation(),
      this.faqsController.updatePost
    );

    this.Router.post(
      "/activation",
      this.isAuthonticate.isAuthonticate,
      this.faqsController.activation
    );
    this.Router.post(
      "/delete",
      this.isAuthonticate.isAuthonticate,
      this.faqsController.deleteFaqs
    );
  }
}
