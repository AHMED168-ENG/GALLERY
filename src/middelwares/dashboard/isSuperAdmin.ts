import { NextFunction, Request, Response } from "express";
import { ValidationMessage } from "../../helpers/helper";

export class IsSuperAdmin {
  public async isSuperAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    var Admin = req.cookies.Admin;
    if (Admin.role != "1") {
      new ValidationMessage().returnWithMessage(
        req,
        res,
        "/dashboard/",
        "this part of dashboard belong to super admin",
        "danger"
      );
    } else {
      next();
    }
  }
}
