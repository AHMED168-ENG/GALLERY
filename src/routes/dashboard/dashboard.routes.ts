import { Router } from "express";
import DashboardController from "../../controllers/dashboard/dashboard.controller";
import { IsAuthonticate } from "../../middelwares/dashboard/isAuthonticate";
class DashboardRoutes {
  public Router: Router;
  public isAuthonticate: IsAuthonticate;
  constructor(private dashboardController: DashboardController) {
    this.dashboardController = dashboardController;
    this.isAuthonticate = new IsAuthonticate();
    this.Router = Router();
    this.routes();
  }
  routes() {
    this.Router.get(
      "",
      this.isAuthonticate.isAuthonticate,
      this.dashboardController.dashboard
    );
  }
}

export default DashboardRoutes;
