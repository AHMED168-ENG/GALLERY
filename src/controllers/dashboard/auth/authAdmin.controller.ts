import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ValidationMessage } from "../../../helpers/helper";
import tbl_users from "../../../models/users";
import { ValidationError } from "sequelize";
import bcrypt from "bcrypt";

export class AuthAdminController {
  // start login
  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    res.render("dashboard/auth/signIn", {
      title: "Dashboard | Sign In",
      notification: req.flash("notification"),
      validationError: req.flash("validationError")[0] || {},
      bodyData: req.flash("bodyData")[0] || {},
    });
    try {
    } catch (error) {
      next(error);
    }
  }
  // end login

  // start login post
  public async loginPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validationMessage: ValidationMessage = new ValidationMessage();
      const Errors = validationResult(req);
      if (!Errors.isEmpty()) {
        validationMessage.handel_validation_errors(
          req,
          res,
          Errors.errors,
          "/dashboard/login"
        );
        return;
      }
      tbl_users
        .findOne({
          where: {
            email: req.body.email,
          },
        })
        .then((result: any) => {
          if (!result.active) {
            validationMessage.returnWithMessage(
              req,
              res,
              "/dashboard/login",
              "You have been deactivated from the super admin",
              "danger"
            );
          } else {
            bcrypt.compare(
              req.body.password,
              result.password,
              (error, compering) => {
                if (!compering) {
                  validationMessage.returnWithMessage(
                    req,
                    res,
                    "/dashboard/login",
                    "your password not True",
                    "danger"
                  );
                } else {
                  var expire = !req.body.rememberMe ? { maxAge: 86400000 } : {};
                  var message = req.body.rememberMe
                    ? "Logged in successfully"
                    : "You have successfully logged in. You will be logged out of the site within 24 hours of your login.";
                  res.cookie(
                    "Admin",
                    {
                      id: result.id,
                      email: result.email,
                      roles: result.roles,
                      fName: result.fName,
                      lName: result.lName,
                      image: result.image,
                    },
                    expire
                  );
                  validationMessage.returnWithMessage(
                    req,
                    res,
                    "/dashboard/",
                    message,
                    "success"
                  );
                }
              }
            );
          }
        });
    } catch (error) {
      next(error);
    }
  }
  // end login post

  public async logOut(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.clearCookie("Admin");
      res.redirect("/dashboard/login");
    } catch (error) {
      next(error);
    }
  }
}
