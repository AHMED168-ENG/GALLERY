import { Router } from "express";
import { SupCategoryController } from "../../controllers/dashboard/supCategorys.controllers";
import { FilesOperations } from "../../helpers/helper";
import { IsAuthonticate } from "../../middelwares/dashboard/isAuthonticate";
import { AddSupCategoryValidation } from "../../validations/dashboard/supCategory/addValidation";
import { UpdateSupCategoryValidation } from "../../validations/dashboard/supCategory/editValidation";

export class SupCategoryRoutes {
  public Router: Router;
  private filesOperations: FilesOperations;
  private addSupCategoryValidation: AddSupCategoryValidation;
  private updateSupCategoryValidation: UpdateSupCategoryValidation;
  private supCategoryController: SupCategoryController;
  private isAuthonticate: IsAuthonticate;
  constructor() {
    this.filesOperations = new FilesOperations();
    this.addSupCategoryValidation = new AddSupCategoryValidation();
    this.updateSupCategoryValidation = new UpdateSupCategoryValidation();
    this.supCategoryController = new SupCategoryController();
    this.isAuthonticate = new IsAuthonticate();
    this.Router = Router();
    this.routes();
  }
  routes(): void {
    this.Router.get(
      "/",
      this.isAuthonticate.isAuthonticate,
      this.supCategoryController.findAll
    );
    this.Router.post(
      "/getMainCatigoryAjax/:id",
      this.isAuthonticate.isAuthonticate,
      this.supCategoryController.getMainCatigoryAjax
    );

    this.Router.get(
      "/create",
      this.isAuthonticate.isAuthonticate,
      this.supCategoryController.create
    );
    this.Router.post(
      "/create",
      this.isAuthonticate.isAuthonticate,
      this.filesOperations.uploade_img("assets/dashboard/Categorys", "image"),
      this.addSupCategoryValidation.validation(),
      this.supCategoryController.crearePost
    );
    this.Router.get(
      "/update/:id",
      this.isAuthonticate.isAuthonticate,
      this.supCategoryController.update
    );
    this.Router.post(
      "/update/:id",
      this.isAuthonticate.isAuthonticate,
      this.filesOperations.uploade_img("assets/dashboard/Categorys", "image"),
      this.updateSupCategoryValidation.validation(),
      this.supCategoryController.updatePost
    );

    this.Router.post(
      "/activation",
      this.isAuthonticate.isAuthonticate,
      this.supCategoryController.activation
    );
    this.Router.post(
      "/delete",
      this.isAuthonticate.isAuthonticate,
      this.supCategoryController.deleteSupCategory
    );
  }
}
