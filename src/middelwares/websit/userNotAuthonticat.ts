/*--------------------------- start check if user is not authonticate or not ---------------------*/

import { NextFunction, Request, Response } from "express";

export class UserNotAuthonticat {
  public async isNotAuthonticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    var Admin = req.cookies.User;
    if (Admin) {
      res.redirect("/home");
    } else {
      next();
    }
  }
}

/*--------------------------- end check if user is not authonticate or not ---------------------*/

module.exports = {
  UserNotAuthonticat,
};
