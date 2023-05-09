import { check } from "express-validator";
import { Model, Op } from "sequelize";
import tbl_users from "../../../models/users";
import bcrypt from "bcrypt";
export class SignInUserValidation {
  validation() {
    return [
      check("email")
        .notEmpty()
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "يجب ادخال الايميل";
          } else {
            return "you should enter email";
          }
        })
        .isEmail()
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "هذا الحقل يستقبل ايميل";
          } else {
            return "this feild accept email";
          }
        })
        .trim()
        .escape()
        .toLowerCase()
        .custom((value, { req }) => {
          return tbl_users
            .findOne({
              where: {
                email: value,
              },
            })
            .then((result) => {
              if (!result) {
                throw new Error("");
              } else {
                return true;
              }
            });
        })
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "الايميل غير مسجل";
          } else {
            return "your email not registed";
          }
        })
        .custom(async (value, { req }) => {
          const user: any = await tbl_users.findOne({
            where: {
              email: value,
            },
          });

          if (!user.active) {
            throw new Error("");
          }
          return true;
        })
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "حسابك ليس نشطًا ، اتصل بالمسؤول أو تحقق من gmail الخاص بك للحصول على إعادة تشغيل";
          } else {
            return "your account not active call the admin or check the your gmail for resone";
          }
        }),

      check("password")
        .notEmpty()
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "ادخل الرقم السري";
          } else {
            return "you shold enter password";
          }
        })
        .custom(async (value, { req }) => {
          const user: any = await tbl_users.findOne({
            where: {
              email: req.body.email,
            },
          });
          if (user && user.active) {
            const compairing = bcrypt.compareSync(value, user.password);
            if (!compairing) {
              throw new Error("");
            }
          }
          return true;
        })
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "الرقم السري غير صحيح";
          } else {
            return "your password not correct";
          }
        })
        .trim()
        .escape(),
    ];
  }
}
