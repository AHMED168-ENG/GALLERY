import { Router } from "express";

import { AuthUserController } from "../../../controllers/website/auth/auth_controller";
import { UserAuthonticat } from "../../../middelwares/websit/userAuthonticate";
import { SignInUserValidation } from "../../../validations/website/auth/signInUserValidation";
import { SignUpUserValidation } from "../../../validations/website/auth/signUpUserValidation";
import { FilesOperations } from "../../../helpers/helper";
import { UserNotAuthonticat } from "../../../middelwares/websit/userNotAuthonticat";
import { ResetPasswordValidation } from "../../../validations/website/auth/resetPassword.validation";
import { UpdatePasswordValidation } from "../../../validations/website/auth/updatePasswordPassword.validation";
class AuthUserRoutes {
  public Router: Router;
  private authUserController: AuthUserController;
  private userNotAuthonticat: UserNotAuthonticat;
  private userAuthonticat: UserAuthonticat;
  private signInUserValidation: SignInUserValidation;
  private resetPasswordValidation: ResetPasswordValidation;
  private updatePasswordValidation: UpdatePasswordValidation;
  private signUpUserValidation: SignUpUserValidation;
  private filesOperations: FilesOperations;
  constructor() {
    this.authUserController = new AuthUserController();
    this.userAuthonticat = new UserAuthonticat();
    this.userNotAuthonticat = new UserNotAuthonticat();
    this.resetPasswordValidation = new ResetPasswordValidation();
    this.updatePasswordValidation = new UpdatePasswordValidation();
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
      this.userNotAuthonticat.isNotAuthonticate,
      this.signInUserValidation.validation(),
      this.authUserController.signInPost
    );
    this.Router.get(
      "/signUp",
      this.userNotAuthonticat.isNotAuthonticate,
      this.authUserController.signUp
    );
    this.Router.post(
      "/signUp",
      this.userNotAuthonticat.isNotAuthonticate,
      this.filesOperations.uploade_img("assets/dashboard/Users", "image"),
      this.signUpUserValidation.validation(),
      this.authUserController.signUpPost
    );
    this.Router.post(
      "/signOut",
      this.userAuthonticat.isAuthonticate,
      this.authUserController.signOut
    );
    this.Router.get(
      "/reset-password",
      this.userNotAuthonticat.isNotAuthonticate,
      this.authUserController.resetPassword
    );
    this.Router.post(
      "/reset-password",
      this.userNotAuthonticat.isNotAuthonticate,
      this.resetPasswordValidation.validation(),
      this.authUserController.resetPasswordPost
    );
    this.Router.get(
      "/update-password/:token",
      this.userNotAuthonticat.isNotAuthonticate,
      this.authUserController.updatePassword
    );
    this.Router.post(
      "/update-password/:token",
      this.userNotAuthonticat.isNotAuthonticate,
      this.updatePasswordValidation.validation(),
      this.authUserController.updatePasswordPost
    );
  }
}

export default AuthUserRoutes;
