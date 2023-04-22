import express, { NextFunction, Request, Response } from "express";
import DashboardRoutes from "./dashboard.routes";
import DashboardController from "../../controllers/dashboard/dashboard.controller";
import { UserRoutes } from "./user.routes";
import AuthAdminRoutes from "./auth/authAdmin.routes";
import { CategoryRoutes } from "./mainCategory.routes";
import { SupCategoryRoutes } from "./supCategory.routes";
import { ProductRoutes } from "./products.routes";
import { SlidersRoutes } from "./sliders.routes";
import { AppSettingRoutes } from "./appSetting.routes";
import { FaqsRoutes } from "./faqs.routes";
import { StartActions } from "../../helpers/helper";
import CommentsRoutes from "./comments.routes";
import { TestmonialRoutes } from "./testmonials.routes";
import { OrdersRoutes } from "./orders.routes";
import { MessagesRoutes } from "./messages.routes";
import { GalleryRoutes } from "./gallery.routes";
import { SectionsRoutes } from "./sections.routes";
class AllDashboardRoutes {
  private startFunction: StartActions = new StartActions();
  constructor(private myApp: express.Application) {
    this.router();
  }
  router(): void {
    this.myApp.use(
      "/dashboard",
      async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.url);
        await this.startFunction.startFunctionForDashboard(
          req,
          res,
          req.url,
          req.csrfToken()
        );
        next();
      }
    );
    this.myApp.use("/dashboard", new AuthAdminRoutes().Router);
    this.myApp.use("/dashboard/users", new UserRoutes().Router);
    this.myApp.use("/dashboard/main-categorys", new CategoryRoutes().Router);
    this.myApp.use("/dashboard/sup-categorys", new SupCategoryRoutes().Router);
    this.myApp.use("/dashboard/products", new ProductRoutes().Router);
    this.myApp.use("/dashboard/sliders", new SlidersRoutes().Router);
    this.myApp.use("/dashboard/app-setting", new AppSettingRoutes().Router);
    this.myApp.use("/dashboard/questions", new FaqsRoutes().Router);
    this.myApp.use("/dashboard/comments", new CommentsRoutes().Router);
    this.myApp.use("/dashboard/testmonials", new TestmonialRoutes().Router);
    this.myApp.use("/dashboard/orders", new OrdersRoutes().Router);
    this.myApp.use("/dashboard/messages", new MessagesRoutes().Router);
    this.myApp.use("/dashboard/gallery", new GalleryRoutes().Router);
    this.myApp.use("/dashboard/front-sections", new SectionsRoutes().Router);
    this.myApp.use(
      "/dashboard",
      new DashboardRoutes(new DashboardController()).Router
    );
  }
}

export default AllDashboardRoutes;
