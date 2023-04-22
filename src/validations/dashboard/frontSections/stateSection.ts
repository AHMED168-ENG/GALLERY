import { check } from "express-validator";
import { imageExtention } from "../../../config/config";

export class StatsSectionsValidation {
  validation() {
    return [
      check("text_one_ar")
        .notEmpty()
        .withMessage("you should enter text one with arabic")
        .isLength({ max: 16 })
        .withMessage("text should be less than or equall 16 letter")
        .trim()
        .escape()
        .toLowerCase(),
      check("text_one_en")
        .notEmpty()
        .withMessage("you should enter text one with english")
        .isLength({ max: 16 })
        .withMessage("text should be less than or equall 16 letter")
        .trim()
        .escape()
        .toLowerCase(),
      check("icon_one")
        .notEmpty()
        .withMessage("you should enter icon one")
        .trim()
        .escape()
        .toLowerCase(),
      check("text_tow_ar")
        .notEmpty()
        .withMessage("you should enter text tow with arabic")
        .isLength({ max: 16 })
        .withMessage("text should be less than or equall 16 letter")
        .trim()
        .escape()
        .toLowerCase(),
      check("text_tow_en")
        .notEmpty()
        .withMessage("you should enter text tow with english")
        .isLength({ max: 16 })
        .withMessage("text should be less than or equall 16 letter")
        .trim()
        .escape()
        .toLowerCase(),
      check("icon_tow")
        .notEmpty()
        .withMessage("you should enter icon tow")
        .trim()
        .escape()
        .toLowerCase(),
      check("text_three_ar")
        .notEmpty()
        .withMessage("you should enter text three with arabic")
        .isLength({ max: 16 })
        .withMessage("text should be less than or equall 16 letter")
        .trim()
        .escape()
        .toLowerCase(),
      check("text_three_en")
        .notEmpty()
        .withMessage("you should enter text three with english")
        .isLength({ max: 16 })
        .withMessage("text should be less than or equall 16 letter")
        .trim()
        .escape()
        .toLowerCase(),
      check("icon_three")
        .notEmpty()
        .withMessage("you should enter icon three ")
        .trim()
        .escape()
        .toLowerCase(),
      check("text_four_ar")
        .notEmpty()
        .withMessage("you should enter text four with arabic")
        .isLength({ max: 16 })
        .withMessage("text should be less than or equall 16 letter")
        .trim()
        .escape()
        .toLowerCase(),
      check("text_four_en")
        .notEmpty()
        .withMessage("you should enter text four with english")
        .isLength({ max: 16 })
        .withMessage("text should be less than or equall 16 letter")
        .trim()
        .escape()
        .toLowerCase(),
      check("icon_four")
        .notEmpty()
        .withMessage("you should enter icon four")
        .trim()
        .escape()
        .toLowerCase(),
    ];
  }
}
