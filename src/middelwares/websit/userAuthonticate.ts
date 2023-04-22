/*--------------------------- start check if user is authonticate or not ---------------------*/

import { NextFunction, Request, Response } from "express";

export class UserAuthonticat {
  public async isAuthonticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    var Admin = req.cookies.User;
    if (!Admin) {
      res.redirect("/signIn");
    } else {
      next();
    }
  }
}

/*--------------------------- end check if user is authonticate or not ---------------------*/

module.exports = {
  UserAuthonticat,
};
