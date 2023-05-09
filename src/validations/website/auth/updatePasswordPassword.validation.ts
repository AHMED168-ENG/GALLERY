import { check } from "express-validator";
import { Model, Op } from "sequelize";
import tbl_users from "../../../models/users";
import bcrypt from "bcrypt";
export class UpdatePasswordValidation {
  validation() {
    return [
      check("password")
        .notEmpty()
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "ادخل الرقم السري";
          } else {
            return "enter password";
          }
        })
        .custom(async (value, { req }) => {
          if (!req.body.password) return true;
          var count = 0;
          for (var i = 0; i < value.length; i++) {
            if (isNaN(value[i])) {
              count++;
            }
          }
          if (count < 4) {
            throw new Error();
          }
        })
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "الرقم السري يجب ان يحتوي علي الاقل علي 4 احرف";
          } else {
            return "your password should be contain at lest 4 letters";
          }
        }),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("confirmPassword")
        .trim()
        .escape()
        .custom(async (value, { req }) => {
          if (value !== req.body.password && req.body.password) {
            throw new Error();
          }
        })
        .withMessage((value, { req }) => {
          if (req.cookies.lng == "ar") {
            return "الرقم السري غير متتطابق";
          } else {
            return "your password not match";
          }
        }),
    ];
  }
}
