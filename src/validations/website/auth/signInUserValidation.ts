import { check } from "express-validator";
import { Model, Op } from "sequelize";
import tbl_users from "../../../models/users";
import bcrypt from "bcrypt";
export class SignInUserValidation {
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
        .withMessage("your email not registed")
        .custom((value, { req }) => {
          if (!value.active) {
            throw new Error("");
          }
          return true;
        })
        .withMessage(
          "your account not active call the admin or check the your gmail for resone"
        ),

      check("password")
        .notEmpty()
        .withMessage("you shold enter password")
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
        .withMessage("your password not correct")
        .trim()
        .escape(),
    ];
  }
}
