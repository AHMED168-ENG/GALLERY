import { check } from "express-validator";
import { Op } from "sequelize";
import tbl_users from "../../../models/users";

export class AuthAdminValidation {
  validation() {
    return [
      check("email")
        .notEmpty()
        .withMessage("you should enter email")
        .isEmail()
        .withMessage("this feild accept email")
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
        .withMessage("your email not registed"),

      check("password")
        .notEmpty()
        .withMessage("you shold enter password")
        .trim()
        .escape(),
    ];
  }
}
