import { NextFunction, Request, Response } from "express";
import { FilesOperations, ValidationMessage } from "../../../helpers/helper";
import tbl_users from "../../../models/users";
import { Roles } from "../../../enums/roles";
const { validationResult } = require("express-validator");
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import crypto from "crypto";
import tbl_app_settings from "../../../models/appSeting";
import { SendMails } from "../../../mails/sendEmails";
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
        title: "SignUp",
        validationError: req.flash("validationError")[0] || {},
        notification: req.flash("notification"),
        bodyData: req.flash("bodyData")[0] || {},
        metaDescription: null,
        metaKeywords: null,
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
      const sendMails: SendMails = new SendMails();
      let Errors = validationResult(req);
      const validationMessage: ValidationMessage = new ValidationMessage();
      const fileOperations: FilesOperations = new FilesOperations();
      if (!Errors.isEmpty()) {
        validationMessage.handel_validation_errors(
          req,
          res,
          Errors.errors,
          "signUp"
        );
        fileOperations.removeImg(req, "Users");
        return;
      }
      let image = fileOperations.Rename_uploade_img(req);
      let user_data = req.body;
      bcrypt.hash(
        user_data.password,
        +process.env.saltRounds,
        (error: Error, hash: string) => {
          user_data.password = hash;
          user_data.roles = Roles.User;
          user_data.image = image;
          user_data.active = user_data.active ? true : false;
          tbl_users.create(user_data).then((result: any) => {
            sendMails.send(
              user_data.email,
              user_data.fName,
              user_data.lName,
              "تم اضافه حساب خاص بك كمستخدم قم بالتفعيل من هنا",
              "activeUserPage"
            );
            validationMessage.returnWithMessage(
              req,
              res,
              "signUp",
              " تم تسجيلك كمستخدم جديد للتفاعل في الموقع تم ارسال رساله تاكيد في الموقع علي ايميل التسجيل",
              "success"
            );
          });
        }
      );
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
        title: "SignIn",
        validationError: req.flash("validationError")[0] || {},
        notification: req.flash("notification"),
        bodyData: req.flash("bodyData")[0],
        metaDescription: null,
        metaKeywords: null,
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
      if (!Errors.isEmpty()) {
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

      console.log(user);
      var expire = !userData.rememberMe ? { maxAge: 86400000 } : {};

      res.cookie("User", user, expire);
      res.redirect("/home");
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

  /*----------------------------------- start signOut user controller ------------------------------*/
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

  /*----------------------------------- reset password page ------------------------------*/
  public async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.render("website/auth/resetPassword", {
        title: "resetPassword",
        validationError: req.flash("validationError")[0] || {},
        notification: req.flash("notification"),
        bodyData: req.flash("bodyData")[0] || {},
        metaDescription: null,
        metaKeywords: null,
      });
    } catch (error) {
      next(error);
    }
  }
  /*----------------------------------- reset password page ------------------------------*/

  /*----------------------------------- reset reset Password Post page ------------------------------*/
  public async resetPasswordPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      const lng = req.cookies.lng;
      const validationMessage: ValidationMessage = new ValidationMessage();
      const sendMails: SendMails = new SendMails();
      const Errors = validationResult(req);
      if (!Errors.isEmpty()) {
        validationMessage.handel_validation_errors(
          req,
          res,
          Errors.errors,
          "/reset-password"
        );
        return;
      }
      crypto.randomBytes(32, async (error, buf) => {
        const token = buf.toString("hex");
        if (error) {
          next(error);
        } else {
          //============ get user data //============
          const user: any = await tbl_users.findOne({
            where: {
              email: body.email,
            },
          });
          //============ get sit data //============
          const appName: any = await tbl_app_settings.findOne({
            attributes: ["sitName_en"],
          });
          //============ update user tocken to reset password //============
          tbl_users.update(
            {
              resetToken: token,
              resetTokenExpiration:
                Date.now() +
                +process.env.TIME_OF_ResetPassword * 60 * 60 * 1000,
            },
            {
              where: {
                email: body.email,
              },
            }
          );
          //============ send email to user //============

          sendMails.send(
            user.email,
            user.fName,
            user.lName,
            `reset your password in ${appName.sitName_en}`,
            process.env.SIT_LINK + "update-password/" + token
          );
          let message =
            lng != "ar"
              ? "We have sent you an email to complete the process"
              : "لقد قمنا بارسال رساله لك علي الجميل لتكمله العملي";
          validationMessage.returnWithMessage(
            req,
            res,
            "/reset-password",
            message,
            "success"
          );
        }
      });
    } catch (error) {
      next(error);
    }
  }
  /*----------------------------------- reset reset Password Post page ------------------------------*/

  /*----------------------------------- reset update Password page ------------------------------*/
  public async updatePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.params.token;
      const user: any = await tbl_users.findOne({
        where: {
          resetToken: token,
          resetTokenExpiration: { [Op.gt]: Date.now() },
        },
      });

      if (!user) {
        res.redirect("/reset-password");
      } else {
        res.render("website/auth/updatePassword", {
          title: "updatePassword",
          validationError: req.flash("validationError")[0] || {},
          notification: req.flash("notification"),
          bodyData: req.flash("bodyData")[0] || {},
          metaDescription: null,
          metaKeywords: null,
          userId: user.id,
          token: token,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  /*----------------------------------- reset update Password page ------------------------------*/

  /*----------------------------------- update Password Post page ------------------------------*/
  public async updatePasswordPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body;
      const lng = req.cookies.lng;
      const validationMessage: ValidationMessage = new ValidationMessage();
      const sendMails: SendMails = new SendMails();
      //============ get user data //============
      const user: any = await tbl_users.findOne({
        where: {
          resetToken: body.token,
          id: body.userId,
          resetTokenExpiration: { [Op.gt]: Date.now() },
        },
      });
      if (!user) {
        return res.redirect("/reset-password");
      } else {
        const Errors = validationResult(req);
        if (!Errors.isEmpty()) {
          validationMessage.handel_validation_errors(
            req,
            res,
            Errors.errors,
            "/update-password/" + body.token
          );
          return;
        }

        //============ get sit data //============
        const appName: any = await tbl_app_settings.findOne({
          attributes: ["sitName_en"],
        });
        //============ hash password password //============
        const hashPassword = bcrypt.hashSync(
          body.password,
          +process.env.saltRounds
        );
        //============ update user tocken to reset password //============
        tbl_users.update(
          {
            password: hashPassword,
            resetToken: null,
            resetTokenExpiration: 0,
          },
          {
            where: {
              id: body.userId,
              resetToken: body.token,
            },
          }
        );
        //============ send email to user //============

        sendMails.send(
          user.email,
          user.fName,
          user.lName,
          `your password updated successful in ${appName.sitName_en} account`
        );
        let message =
          lng != "ar"
            ? "Your account password has been modified successfully"
            : "تم تعديل الرقم السري الخاص بحسابك بنجاح";
        validationMessage.returnWithMessage(
          req,
          res,
          "/signIn",
          message,
          "success"
        );
      }
    } catch (error) {
      next(error);
    }
  }
  /*----------------------------------- update Password Post page ------------------------------*/
}
