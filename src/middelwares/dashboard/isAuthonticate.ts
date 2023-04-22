/*--------------------------- start check if user is admin or not ---------------------*/

import { NextFunction, Request, Response } from "express";

export class IsAuthonticate {
  public async isAuthonticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    var Admin = req.cookies.Admin;
    if (!Admin) {
      res.redirect("/dashboard/login");
    } else {
      next();
    }
  }
}

/*--------------------------- end check if user is admin or not ---------------------*/
