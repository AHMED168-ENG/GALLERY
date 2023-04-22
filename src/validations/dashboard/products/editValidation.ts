import { check } from "express-validator";
import tbl_users from "../../../models/users";
import { Op } from "sequelize";
import { imageExtention } from "../../../config/config";
import tbl_products from "../../../models/products";

export class UpdateProductValidation {
  validation() {
    return [
      check("productName_ar")
        .notEmpty()
        .withMessage("enter product name in arabic")
        .trim()
        .escape(),
      check("productName_en")
        .notEmpty()
        .withMessage("enter product name in english")
        .trim()
        .escape(),
      check("productOverview_ar")
        .notEmpty()
        .withMessage("you should enter product overview in arabic")
        .trim()
        .escape(),
      check("productOverview_en")
        .notEmpty()
        .withMessage("you should enter product overview in english")
        .trim()
        .escape(),

      check("fullDescription_ar")
        .notEmpty()
        .withMessage("you should enter full description in arabic")
        .trim(),
      check("fullDescription_en")
        .notEmpty()
        .withMessage("you should enter full description in english")
        .trim(),
      check("keyWord")
        .notEmpty()
        .withMessage(
          "Enter the keywords through which the product is searched."
        )
        .trim()
        .escape(),
      check("price")
        .isNumeric()
        .withMessage("this field accept number only")
        .isLength({ min: 1 })
        .withMessage("يجب ادخال سعر المنتج")
        .trim()
        .escape(),
      check("productImage")
        .custom(async (value, { req }) => {
          if (!req.files.productImage) return true;
          req.files.productImage.forEach((element) => {
            var arrayExtention = imageExtention;
            var originalname = element.originalname.split(".");
            var imgExtension =
              originalname[originalname.length - 1].toLowerCase();
            if (!arrayExtention.includes(imgExtension)) {
              throw new Error("");
            }
          });
        })
        .withMessage(`The image extension must be ${imageExtention}`)
        .custom(async (value, { req }) => {
          if (!req.files.productImage) return true;
          if (req.files.productImage.length > 3) {
            throw new Error("");
          }
        })
        .withMessage("The photos should not exceed 3 photos.")
        .custom(async (value, { req }) => {
          if (!req.files.productImage) return true;
          req.files.productImage.forEach((element) => {
            if (element.size > 2000000) {
              throw new Error("");
            }
          });
        })
        .withMessage("The image should not be more than 2000000 kb"),
      check("descriptionImage")
        .custom(async (value, { req }) => {
          if (!req.files.descriptionImage) return true;
          req.files.descriptionImage.forEach((element) => {
            var arrayExtention = imageExtention;
            var originalname = element.originalname.split(".");
            var imgExtension =
              originalname[originalname.length - 1].toLowerCase();
            if (!arrayExtention.includes(imgExtension)) {
              throw new Error("");
            }
          });
        })
        .withMessage(`The image extension must be ${imageExtention}`)
        .custom(async (value, { req }) => {
          if (!req.files.descriptionImage) return true;
          if (req.files.descriptionImage.length > 3) {
            throw new Error("");
          }
        })
        .withMessage("The photos must not be more than 3 photos.")
        .custom(async (value, { req }) => {
          if (!req.files.descriptionImage) return true;
          if (req.files.descriptionImage.length > 3) {
            throw new Error("");
          }
        })
        .withMessage("The photos should not exceed 3 photos")
        .custom(async (value, { req }) => {
          if (!req.files.descriptionImage) return true;
          req.files.descriptionImage.forEach((element) => {
            if (element.size > 2000000) {
              throw new Error("");
            }
          });
        })
        .withMessage("The image should not be more than 2000000 kb"),
    ];
  }
}
