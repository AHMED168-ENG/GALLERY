import { Router } from "express";
import { MainCategoryController } from "../../controllers/dashboard/mainCategorys.controllers";
import { FilesOperations } from "../../helpers/helper";
import { IsAuthonticate } from "../../middelwares/dashboard/isAuthonticate";
import { UpdateMainCategoryValidation } from "../../validations/dashboard/mainCategory/editValidation";
import { AddMainCategoryValidation } from "../../validations/dashboard/mainCategory/addValidation";

export class CategoryRoutes {
  public Router: Router;
  private filesOperations: FilesOperations;
  private addMainCategoryValidation: AddMainCategoryValidation;
  private updateMainCategoryValidation: UpdateMainCategoryValidation;
  private mainCategoryController: MainCategoryController;
  private isAuthonticate: IsAuthonticate;
  constructor() {
    this.filesOperations = new FilesOperations();
    this.addMainCategoryValidation = new AddMainCategoryValidation();
    this.updateMainCategoryValidation = new UpdateMainCategoryValidation();
    this.mainCategoryController = new MainCategoryController();
    this.isAuthonticate = new IsAuthonticate();
    this.Router = Router();
    this.routes();
  }
  routes(): void {
    this.Router.get(
      "/",
      this.isAuthonticate.isAuthonticate,
      this.mainCategoryController.findAll
    );

    this.Router.get(
      "/create",
      this.isAuthonticate.isAuthonticate,
      this.mainCategoryController.create
    );
    this.Router.post(
      "/create",
      this.isAuthonticate.isAuthonticate,
      this.filesOperations.uploade_img("assets/dashboard/Categorys", "image"),
      this.addMainCategoryValidation.validation(),
      this.mainCategoryController.crearePost
    );
    this.Router.get(
      "/update/:id",
      this.isAuthonticate.isAuthonticate,
      this.mainCategoryController.update
    );
    this.Router.post(
      "/update/:id",
      this.isAuthonticate.isAuthonticate,
      this.filesOperations.uploade_img("assets/dashboard/Categorys", "image"),
      this.updateMainCategoryValidation.validation(),
      this.mainCategoryController.updatePost
    );

    this.Router.post(
      "/activation",
      this.isAuthonticate.isAuthonticate,
      this.mainCategoryController.activation
    );
    this.Router.post(
      "/delete",
      this.isAuthonticate.isAuthonticate,
      this.mainCategoryController.deleteCategory
    );
  }
}
