import { Request, Response, NextFunction } from "express";

class DashboardController {
  constructor() {}

  // start show dashboard page
  public async dashboard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.render("dashboard/dashboard", {
        title: "Dashboard",
        notification: req.flash("notification"),
        webSeting: {},
      });
    } catch (error) {
      next(error);
    }
  }
}
// end show dashboard page

export default DashboardController;
