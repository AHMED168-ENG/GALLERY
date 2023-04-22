import { NextFunction, Request, Response } from "express";
import { FilesOperations, ValidationMessage } from "../../../helpers/helper";
import tbl_users from "../../../models/users";
import { Roles } from "../../../enums/roles";

const { validationResult } = require("express-validator");
import bcrypt from "bcrypt";
import { Op } from "sequelize";

export class AuthUserController {
  constructor() {}

  /*----------------------------------- start signUp controller -----------------------------*/
  public async signUp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.render("website/auth/signUp", {
        title: "sign up",
        validationError: req.flash("validationError")[0] || {},
        notification: req.flash("notification")[0],
        bodyData: req.flash("bodyData")[0],
      });
    } catch (error) {
      next(error);
    }
  }
  /*----------------------------------- start signUp post controller -----------------------------*/
  public async signUpPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let errors = validationResult(req);
      const validationMessage: ValidationMessage = new ValidationMessage();
      const fileOperations: FilesOperations = new FilesOperations();
      if (!errors.isEmpty()) {
        validationMessage.handel_validation_errors(req, res, errors, "signUp");
        fileOperations.removeImg(req, "Users");
        return;
      }
      let image = fileOperations.Rename_uploade_img(req);
      let user_data = req.body;
      bcrypt.hash(user_data.password, 10, (error: Error, hash: string) => {
        user_data.password = hash;
        user_data.roles = Roles.User;
        user_data.image = image;
        user_data.active = user_data.active ? true : false;
        tbl_users.create(user_data).then((result) => {
          console.log(result);
          //   sendEmail(
          //     user_data.email,
          //     result.id,
          //     user_data.fName,
          //     user_data.lName,
          //     "تم اضافه حساب خاص بك كمستخدم قم بالتفعيل من هنا",
          //     "activeUserPage"
          //   );
          validationMessage.returnWithMessage(
            req,
            res,
            "signUp",
            " تم تسجيلك كمستخدم جديد للتفاعل في الموقع تم ارسال رساله تاكيد في الموقع علي ايميل التسجيل",
            "success"
          );
        });
      });
    } catch (error) {
      next(error);
    }
  }
  /*----------------------------------- end signUp post controller -----------------------------*/
  /*----------------------------------- start signIn controller ------------------------------*/
  public async signIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.render("website/auth/signIn", {
        title: "sign up",
        validationError: req.flash("validationError")[0] || {},
        notification: req.flash("notification"),
        bodyData: req.flash("bodyData")[0],
      });
    } catch (error) {
      next(error);
    }
  }
  /*----------------------------------- end signIn controller ------------------------------*/

  /*----------------------------------- end signIn post controller ------------------------------*/
  public async signInPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validationMessage: ValidationMessage = new ValidationMessage();
      var Errors = validationResult(req);
      var userData = req.body;
      if (!Errors.isEmpty) {
        validationMessage.handel_validation_errors(
          req,
          res,
          Errors.errors,
          "signIn"
        );
        return;
      }
      var user: any = await tbl_users.findOne({
        where: {
          email: {
            [Op.eq]: userData.email,
          },
        },
      });
      var expire = !userData.rememberMe ? { maxAge: 86400000 } : {};
      var message = userData.rememberMe
        ? "تم تسجيل دخولك بنجاح"
        : "تم تسجيل دخولك بنجاح " +
          "سوف يتم تسجيل الخروج تلقاءي بعد يوم من تسجيلك";
      res.cookie("User", user, expire);
      validationMessage.returnWithMessage(
        req,
        res,
        "/home",
        message,
        "success"
      );
    } catch (error) {
      next(error);
    }
  }
  /*----------------------------------- end signIn post controller ------------------------------*/

  /*----------------------------------- start active user controller ------------------------------*/
  public async activeUserPage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validationMessage: ValidationMessage = new ValidationMessage();
      await tbl_users.update(
        {
          active: true,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      validationMessage.returnWithMessage(
        req,
        res,
        "/signIn",
        "تم تفعيلك كمستخدم قم بالتسجيل الان",
        "success"
      );
    } catch (error) {
      next(error);
    }
  }
  /*----------------------------------- end active user controller ------------------------------*/

  /*----------------------------------- end signOut user controller ------------------------------*/
  public async signOut(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.clearCookie("User");
      res.redirect("/signIn");
    } catch (error) {
      next(error);
    }
  }
  /*----------------------------------- end signOut user controller ------------------------------*/
}
