import { check } from "express-validator";
import tbl_users from "../../../models/users";
import { Op } from "sequelize";
import { imageExtention } from "../../../config/config";

export class AddSliderValidation {
  validation() {
    return [
      check("header_ar")
        .notEmpty()
        .withMessage("enter slider header in arabic")
        .trim(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("header_en")
        .notEmpty()
        .withMessage("enter slider header in english")
        .trim(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("description_ar")
        .notEmpty()
        .withMessage("enter slider description in arabic")
        .trim(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("description_en")
        .notEmpty()
        .withMessage("enter slider description in english")
        .trim(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("link").notEmpty().withMessage("enter slider link").trim(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      check("position").notEmpty().withMessage("enter slider position").trim(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("image")
        .custom((value, { req }) => {
          if (req.files.length == 0) {
            throw new Error("");
          }
          return true;
        })
        .withMessage("enter slider image")
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
    ];
  }
}
