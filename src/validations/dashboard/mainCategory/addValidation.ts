import { check } from "express-validator";
import tbl_users from "../../../models/users";
import { Op } from "sequelize";
import { imageExtention } from "../../../config/config";
import tbl_categorys from "../../../models/categorys";

export class AddMainCategoryValidation {
  validation() {
    return [
      check("category_en")
        .notEmpty()
        .withMessage("enter category name in english")
        .isString()
        .withMessage("this field accept string")
        .trim()
        .escape()
        .custom(async (value: string) => {
          const category = await tbl_categorys.scope("mainCategorys").findOne({
            where: {
              category_en: value,
            },
          });
          if (category) {
            throw new Error("");
          }
          return true;
        })
        .withMessage("this category already registed"),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("category_ar")
        .notEmpty()
        .withMessage("enter category name in arabic")
        .isString()
        .withMessage("this field accept string")
        .trim()
        .escape()
        .custom(async (value: string) => {
          const category = await tbl_categorys.scope("mainCategorys").findOne({
            where: {
              category_ar: value,
            },
          });
          if (category) {
            throw new Error("");
          }
          return true;
        })
        .withMessage("this category already registed"),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("description_en")
        .notEmpty()
        .withMessage("enter category description in english")
        .isString()
        .withMessage("this field accept string")
        .trim()
        .escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("description_ar")
        .notEmpty()
        .withMessage("enter category description in arabic")
        .isString()
        .withMessage("this field accept string")
        .trim()
        .escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("metaDescription_en")
        .notEmpty()
        .withMessage("enter meta description in english")
        .isString()
        .withMessage("this field accept string")
        .trim()
        .escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("metaDescription_ar")
        .notEmpty()
        .withMessage("enter meta description in arabic")
        .isString()
        .withMessage("this field accept string")
        .trim()
        .escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("metaKeywords_en")
        .notEmpty()
        .withMessage("enter meta meta Keywords in english separeted with ',' ")
        .isString()
        .withMessage("this field accept string")
        .trim()
        .escape(),
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      check("metaKeywords_ar")
        .notEmpty()
        .withMessage("enter meta meta Keywords in arabic separeted with ',' ")
        .isString()
        .withMessage("this field accept string")
        .trim()
        .escape(),

      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      
      check("image")
        .custom((value, { req }) => {
          if (req.files.length == 0) {
            throw new Error("");
          }
          return true;
        })
        .withMessage("enter course image")
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
