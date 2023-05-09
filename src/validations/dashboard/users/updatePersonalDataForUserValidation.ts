import { check } from "express-validator";
import tbl_users from "../../../models/users";
import { Op } from "sequelize";
import { imageExtention } from "../../../config/config";

export class UpdatePersonalDataForUserValidation {
  validation() {
    return [
      check("fName")
        .notEmpty()
        .withMessage("enter first name")
        .isString()
        .withMessage("this field accept string")
        .isLength({ max: 10, min: 2 })
        .withMessage("the first name should be more than 2 and less than 10")
        .trim()
        .escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("lName")
        .notEmpty()
        .withMessage("enter last name")
        .isString()
        .withMessage("this field accept string")
        .isLength({ max: 10, min: 2 })
        .withMessage("the last name should be more than 2 and less than 10")
        .trim()
        .escape(), ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("age").notEmpty().withMessage("enter age").trim().escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("address")
        .notEmpty()
        .withMessage("enter your address")
        .trim()
        .escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("mobile")
        .notEmpty()
        .withMessage("enter your mobile")
        .trim()
        .escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("email")
        .notEmpty()
        .withMessage("enter email")
        .isEmail()
        .withMessage("enter valid email")
        .trim()
        .escape()
        .toLowerCase()
        .custom(async (value, { req }) => {
          var user = await tbl_users.findOne({
            where: {
              email: value,
              id: {
                [Op.ne]: req.cookies.User.id,
              },
            },
          });
          if (user) {
            throw new Error();
          }
        })
        .withMessage("this email already registed"),

      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("image")
        .custom(async (value, { req }) => {
          if (!req.files.length) return true;
          req.files.forEach((element) => {
            var arrayExtention = imageExtention;
            var originalname = element.originalname.split(".");
            var imgExtension =
              originalname[originalname.length - 1].toLowerCase();
            if (!arrayExtention.includes(imgExtension)) {
              throw new Error("");
            }
          });
        })
        .withMessage(`image extention should be between  ${imageExtention}`)
        .custom(async (value, { req }) => {
          if (!req.files.length) return true;
          req.files.forEach((element) => {
            if (element.size > 2000000) {
              throw new Error("");
            }
          });
        })
        .withMessage("image should not be more than 2000000 kb"),

      ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ];
  }
}
