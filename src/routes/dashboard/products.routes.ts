import { Router } from "express";
import { ProductController } from "../../controllers/dashboard/products.controllers";
import { FilesOperations } from "../../helpers/helper";
import { IsAuthonticate } from "../../middelwares/dashboard/isAuthonticate";
import { MainCategoryController } from "../../controllers/dashboard/mainCategorys.controllers";
import { AddProductValidation } from "../../validations/dashboard/products/addValidation";
import { UpdateProductValidation } from "../../validations/dashboard/products/editValidation";

export class ProductRoutes {
  public Router: Router;
  private filesOperations: FilesOperations;
  private addProductValidation: AddProductValidation;
  private updateProductValidation: UpdateProductValidation;
  private productController: ProductController;
  private isAuthonticate: IsAuthonticate;
  constructor() {
    this.filesOperations = new FilesOperations();
    this.addProductValidation = new AddProductValidation();
    this.updateProductValidation = new UpdateProductValidation();
    this.productController = new ProductController();
    this.isAuthonticate = new IsAuthonticate();
    this.Router = Router();
    this.routes();
  }
  routes(): void {
    this.Router.get(
      "/",
      this.isAuthonticate.isAuthonticate,
      this.productController.findAll
    );

    this.Router.get(
      "/create",
      this.isAuthonticate.isAuthonticate,
      this.productController.create
    );
    this.Router.post(
      "/create",
      this.isAuthonticate.isAuthonticate,
      this.filesOperations.uploade_img_multi_fild(
        [
          {
            name: "productImage",
          },
          {
            name: "descriptionImage",
          },
        ],
        "assets/dashboard/Products"
      ),
      this.addProductValidation.validation(),
      this.productController.crearePost
    );
    this.Router.get(
      "/update/:id",
      this.isAuthonticate.isAuthonticate,
      this.productController.update
    );
    this.Router.post(
      "/update/:id",
      this.isAuthonticate.isAuthonticate,
      this.filesOperations.uploade_img_multi_fild(
        [
          {
            name: "productImage",
          },
          {
            name: "descriptionImage",
          },
        ],
        "assets/dashboard/Products"
      ),
      this.updateProductValidation.validation(),
      this.productController.updatePost
    );

    this.Router.post(
      "/activation",
      this.isAuthonticate.isAuthonticate,
      this.productController.activation
    );
    this.Router.post(
      "/delete",
      this.isAuthonticate.isAuthonticate,
      this.productController.deleteproduct
    );
  }
}
