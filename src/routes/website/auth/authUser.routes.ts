import { Router } from "express";

import { AuthUserController } from "../../../controllers/website/auth/auth_controller";
import { UserAuthonticat } from "../../../middelwares/websit/userAuthonticate";
import { SignInUserValidation } from "../../../validations/website/auth/signInUserValidation";
import { SignUpUserValidation } from "../../../validations/website/auth/signUpUserValidation";
import { FilesOperations } from "../../../helpers/helper";
import { UserNotAuthonticat } from "../../../middelwares/websit/userNotAuthonticat";
class AuthUserRoutes {
  public Router: Router;
  private authUserController: AuthUserController;
  private userNotAuthonticat: UserNotAuthonticat;
  private userAuthonticat: UserAuthonticat;
  private signInUserValidation: SignInUserValidation;
  private signUpUserValidation: SignUpUserValidation;
  private filesOperations: FilesOperations;
  constructor() {
    this.authUserController = new AuthUserController();
    this.userAuthonticat = new UserAuthonticat();
    this.userNotAuthonticat = new UserNotAuthonticat();
    this.signInUserValidation = new SignInUserValidation();
    this.signUpUserValidation = new SignUpUserValidation();
    this.filesOperations = new FilesOperations();
    this.Router = Router();
    this.routes();
  }
  routes() {
    this.Router.get(
      "/signIn",
      this.userNotAuthonticat.isNotAuthonticate,
      this.authUserController.signIn
    );
    this.Router.post(
      "/signIn",
      this.signInUserValidation.validation(),
      this.userNotAuthonticat.isNotAuthonticate,
      this.authUserController.signInPost
    );
    this.Router.get(
      "/signUp",
      this.userNotAuthonticat.isNotAuthonticate,
      this.authUserController.signUp
    );
    this.Router.post(
      "/signUp",
      this.signUpUserValidation.validation(),
      this.filesOperations.uploade_img("assets/dashboard/User", "image"),
      this.userNotAuthonticat.isNotAuthonticate,
      this.authUserController.signUpPost
    );
    this.Router.post(
      "/signOut",
      this.userAuthonticat.isAuthonticate,
      this.authUserController.signOut
    );
  }
}

export default AuthUserRoutes;
