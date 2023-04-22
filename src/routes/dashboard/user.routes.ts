import { Router } from "express";
import { UserController } from "../../controllers/dashboard/users.controllers";
import { FilesOperations } from "../../helpers/helper";
import { AddUserValidation } from "../../validations/dashboard/users/addValidation";
import { UpdateUserValidation } from "../../validations/dashboard/users/editValidation";
import { UpdatePersonalDataValidation } from "../../validations/dashboard/users/updatePersonalDataValidation";
import { IsAuthonticate } from "../../middelwares/dashboard/isAuthonticate";

export class UserRoutes {
  public Router: Router;
  private filesOperations: FilesOperations;
  private addUserValidation: AddUserValidation;
  private userController: UserController;
  private updateUserValidation: UpdateUserValidation;
  private updatePersonalDataValidation: UpdatePersonalDataValidation;
  private isAuthonticate: IsAuthonticate;
  constructor() {
    this.filesOperations = new FilesOperations();
    this.addUserValidation = new AddUserValidation();
    this.updateUserValidation = new UpdateUserValidation();
    this.updatePersonalDataValidation = new UpdatePersonalDataValidation();
    this.userController = new UserController();
    this.isAuthonticate = new IsAuthonticate();
    this.Router = Router();
    this.routes();
  }
  routes(): void {
    this.Router.get(
      "/",
      this.isAuthonticate.isAuthonticate,
      this.userController.findAll
    );
    this.Router.get(
      "/admins",
      this.isAuthonticate.isAuthonticate,
      this.userController.findAllAdmins
    );
    this.Router.get(
      "/create",
      this.isAuthonticate.isAuthonticate,
      this.userController.create
    );
    this.Router.post(
      "/create",
      this.isAuthonticate.isAuthonticate,
      this.filesOperations.uploade_img("assets/dashboard/Users", "image"),
      this.addUserValidation.validation(),
      this.userController.crearePost
    );
    this.Router.get(
      "/update/:id",
      this.isAuthonticate.isAuthonticate,
      this.userController.update
    );
    this.Router.post(
      "/update/:id",
      this.isAuthonticate.isAuthonticate,
      this.filesOperations.uploade_img("assets/dashboard/Users", "image"),
      this.updateUserValidation.validation(),
      this.userController.updatePost
    );
    this.Router.get(
      "/update-personal-data",
      this.isAuthonticate.isAuthonticate,
      this.userController.updatePersonalData
    );
    this.Router.post(
      "/update-personal-data",
      this.isAuthonticate.isAuthonticate,
      this.filesOperations.uploade_img("assets/dashboard/Users", "image"),
      this.updatePersonalDataValidation.validation(),
      this.userController.updatePersonalDataPost
    );
    this.Router.post(
      "/activation",
      this.isAuthonticate.isAuthonticate,
      this.userController.activation
    );
    this.Router.post(
      "/delete",
      this.isAuthonticate.isAuthonticate,
      this.userController.deleteUser
    );
  }
}
