import { check } from "express-validator";
import { Model, Op } from "sequelize";
import tbl_users from "../../../models/users";
import bcrypt from "bcrypt";
export class ResetPasswordValidation {
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
        }),
    ];
  }
}
