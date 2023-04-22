import { Router } from "express";
import { FilesOperations } from "../../helpers/helper";
import { IsAuthonticate } from "../../middelwares/dashboard/isAuthonticate";
import { AppSettingController } from "../../controllers/dashboard/appSeting.controller";

export class AppSettingRoutes {
  public Router: Router;
  private filesOperations: FilesOperations;
  private appSettingController: AppSettingController;
  private isAuthonticate: IsAuthonticate;
  constructor() {
    this.filesOperations = new FilesOperations();
    this.appSettingController = new AppSettingController();
    this.isAuthonticate = new IsAuthonticate();
    this.Router = Router();
    this.routes();
  }
  routes(): void {
    this.Router.get(
      "/",
      this.isAuthonticate.isAuthonticate,
      this.appSettingController.find
    );

    this.Router.post(
      "/",
      this.isAuthonticate.isAuthonticate,
      this.filesOperations.uploade_img("assets/dashboard/AppSetting", "logo"),
      this.appSettingController.updatePost
    );
  }
}
