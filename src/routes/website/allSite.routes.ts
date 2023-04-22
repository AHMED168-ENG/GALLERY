import express, { NextFunction, Request, Response } from "express";

import SitePageRoutes from "./pages.routes";
import AuthUserRoutes from "./auth/authUser.routes";
import { StartActions } from "../../helpers/helper";
class AllSiteRoutes {
  private startFunction: StartActions = new StartActions();
  constructor(private myApp: express.Application) {
    this.router();
  }
  router(): void {
    this.myApp.use(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        await this.startFunction.startFunctionForSite(
          req,
          res,
          req.url,
          req.csrfToken()
        );
        next();
      }
    );
    this.myApp.use("/", new SitePageRoutes().Router);
    this.myApp.use("/", new AuthUserRoutes().Router);
  }
}

export default AllSiteRoutes;
