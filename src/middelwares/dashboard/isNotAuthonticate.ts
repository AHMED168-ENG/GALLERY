/*--------------------------- start check if user is admin or not ---------------------*/

import { NextFunction, Request, Response } from "express";

export class IsNotAuthonticate {
  public async isNotAuthonticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    var Admin = req.cookies.Admin;
    if (Admin) {
      res.redirect("/dashboard");
    } else {
      next();
    }
  }
}

/*--------------------------- end check if user is admin or not ---------------------*/
