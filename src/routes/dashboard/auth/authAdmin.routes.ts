import { Router } from "express";
import { AuthAdminController } from "../../../controllers/dashboard/auth/authAdmin.controller";
import { IsNotAuthonticate } from "../../../middelwares/dashboard/isNotAuthonticate";
import { AuthAdminValidation } from "../../../validations/dashboard/auth/authAdminValidation";
import { IsAuthonticate } from "../../../middelwares/dashboard/isAuthonticate";
class AuthAdminRoutes {
  public Router: Router;
  private authAdminController: AuthAdminController;
  private isAuthonticate: IsAuthonticate;
  private isNotAuthonticate: IsNotAuthonticate;
  constructor() {
    this.authAdminController = new AuthAdminController();
    this.isAuthonticate = new IsAuthonticate();
    this.isNotAuthonticate = new IsNotAuthonticate();
    this.Router = Router();
    this.routes();
  }
  routes() {
    this.Router.get(
      "/login",
      this.isNotAuthonticate.isNotAuthonticate,
      this.authAdminController.login
    );
    this.Router.post(
      "/login",
      this.isNotAuthonticate.isNotAuthonticate,
      new AuthAdminValidation().validation(),
      this.authAdminController.loginPost
    );
    this.Router.post(
      "/logOut",
      this.isAuthonticate.isAuthonticate,
      this.authAdminController.logOut
    );
  }
}

export default AuthAdminRoutes;
