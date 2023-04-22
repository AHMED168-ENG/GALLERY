import { check } from "express-validator";
import { imageExtention } from "../../../config/config";

export class AddGalleryValidation {
  validation() {
    return [
      check("title_ar")
        .notEmpty()
        .withMessage("you should enter image title with arabic")
        .trim()
        .escape()
        .toLowerCase(),
      check("title_en")
        .notEmpty()
        .withMessage("you should enter image title with english")
        .trim()
        .escape()
        .toLowerCase(),
      check("productId")
        .notEmpty()
        .withMessage("you should enter product id")
        .trim()
        .toLowerCase(),

      check("image")
        .custom((value, { req }) => {
          if (req.files.length == 0) {
            throw new Error("");
          }
          return true;
        })
        .withMessage("enter gallary image")
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
