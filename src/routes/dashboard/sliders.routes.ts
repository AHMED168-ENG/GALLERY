import { Router } from "express";
import { FilesOperations } from "../../helpers/helper";
import { IsAuthonticate } from "../../middelwares/dashboard/isAuthonticate";
import { AddSliderValidation } from "../../validations/dashboard/sliders/addValidation";
import { UpdateSliderValidation } from "../../validations/dashboard/sliders/editValidation";
import { SlidersController } from "../../controllers/dashboard/sliders.controllers";

export class SlidersRoutes {
  public Router: Router;
  private filesOperations: FilesOperations;
  private addSliderValidation: AddSliderValidation;
  private updateSliderValidation: UpdateSliderValidation;
  private slidersController: SlidersController;
  private isAuthonticate: IsAuthonticate;
  constructor() {
    this.filesOperations = new FilesOperations();
    this.addSliderValidation = new AddSliderValidation();
    this.updateSliderValidation = new UpdateSliderValidation();
    this.slidersController = new SlidersController();
    this.isAuthonticate = new IsAuthonticate();
    this.Router = Router();
    this.routes();
  }
  routes(): void {
    this.Router.get(
      "/",
      this.isAuthonticate.isAuthonticate,
      this.slidersController.findAll
    );

    this.Router.get(
      "/create",
      this.isAuthonticate.isAuthonticate,
      this.slidersController.create
    );
    this.Router.post(
      "/create",
      this.isAuthonticate.isAuthonticate,
      this.filesOperations.uploade_img("assets/dashboard/Sliders", "image"),
      this.addSliderValidation.validation(),
      this.slidersController.crearePost
    );
    this.Router.get(
      "/update/:id",
      this.isAuthonticate.isAuthonticate,
      this.slidersController.update
    );
    this.Router.post(
      "/update/:id",
      this.isAuthonticate.isAuthonticate,
      this.filesOperations.uploade_img("assets/dashboard/Sliders", "image"),
      this.updateSliderValidation.validation(),
      this.slidersController.updatePost
    );

    this.Router.post(
      "/activation",
      this.isAuthonticate.isAuthonticate,
      this.slidersController.activation
    );
    this.Router.post(
      "/delete",
      this.isAuthonticate.isAuthonticate,
      this.slidersController.deleteSlider
    );
  }
}
