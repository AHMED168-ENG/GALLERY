import { Router } from "express";
import { IsAuthonticate } from "../../middelwares/dashboard/isAuthonticate";
import { GalleryController } from "../../controllers/dashboard/gallery.controllers";
import { UpdateGalleryValidation } from "../../validations/dashboard/gallery/editValidation";
import { AddGalleryValidation } from "../../validations/dashboard/gallery/addValidation";
import { FilesOperations } from "../../helpers/helper";
export class GalleryRoutes {
  public Router: Router;
  private updateGalleryValidation: UpdateGalleryValidation;
  private addGalleryValidation: AddGalleryValidation;
  private galleryController: GalleryController;
  private isAuthonticate: IsAuthonticate;
  private filesOperations: FilesOperations;
  constructor() {
    this.updateGalleryValidation = new UpdateGalleryValidation();
    this.addGalleryValidation = new AddGalleryValidation();
    this.galleryController = new GalleryController();
    this.isAuthonticate = new IsAuthonticate();
    this.filesOperations = new FilesOperations();
    this.Router = Router();
    this.routes();
  }
  routes(): void {
    this.Router.get(
      "/",
      this.isAuthonticate.isAuthonticate,
      this.galleryController.findAll
    );

    this.Router.get(
      "/create",
      this.isAuthonticate.isAuthonticate,
      this.galleryController.create
    );
    this.Router.post(
      "/create",
      this.isAuthonticate.isAuthonticate,
      this.filesOperations.uploade_img("assets/dashboard/Gallery", "image"),
      this.addGalleryValidation.validation(),
      this.galleryController.crearePost
    );
    this.Router.get(
      "/update/:id",
      this.isAuthonticate.isAuthonticate,
      this.galleryController.update
    );
    this.Router.post(
      "/update/:id",
      this.isAuthonticate.isAuthonticate,
      this.filesOperations.uploade_img("assets/dashboard/Gallery", "image"),
      this.updateGalleryValidation.validation(),
      this.galleryController.updatePost
    );

    this.Router.post(
      "/activation",
      this.isAuthonticate.isAuthonticate,
      this.galleryController.activation
    );
    this.Router.post(
      "/delete",
      this.isAuthonticate.isAuthonticate,
      this.galleryController.deleteImage
    );
  }
}
